<?php
/**
 * Query Manager
 * Copyright (c) Webmatch GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

namespace WbmQueryManager\Subscriber\Backend;

use Enlight\Event\SubscriberInterface;
use Shopware\Components\DependencyInjection\Container;
use WbmQueryManager\Models\Query;

/**
 * Class QueryManagerCron
 * @package WbmQueryManager\Subscriber\Backend
 */
class QueryManagerCron implements SubscriberInterface
{

    /**
     * @var Container
     */
    private $container;

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            'Shopware_CronJob_WbmQueryManagerCron' => 'runQueryManagerCron'
        ];
    }

    /**
     * QueryManagerCron constructor.
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @return array
     */
    public function runQueryManagerCron()
    {
        $now = date('Y-m-d H:i:s');

        /** @var \Doctrine\ORM\QueryBuilder $qb */
        $qb = $this->container->get('models')->createQueryBuilder();
        $qb->select(
                array(
                    'query'
                )
            )
            ->from('WbmQueryManager\Models\Query', 'query')
            ->where('query.hasCronjob = 1')
            ->andWhere('query.nextRun <= :nextRun')
            ->setParameter('nextRun', $now)
            ->orderBy('query.name', 'ASC');

        $cronJobs = $qb->getQuery()->getArrayResult();

        $data = array();
        $clearCacheAfter = false;

        foreach($cronJobs as $cronJob){
            $i = 0;
            $numRows = 0;
            try {
                /** @var \mysqli|\Zend_Db_Statement_Pdo $query */
                $query = $this->container->get('wbm_query_manager.db')->query($cronJob['sqlString']);
                if($query instanceof \Zend_Db_Statement_Pdo) {
                    $query->closeCursor();
                }

                /** @var \Enlight_Components_Snippet_Namespace $snippets */
                $snippets = $this->container->get('snippets')->getNamespace("backend/plugins/wbm/querymanager");

                do {
                    if($this->container->get('wbm_query_manager.db')->getColumnCount($query)){
                        $records = $this->container->get('wbm_query_manager.db')->fetchAll($query);
                        $rowCount = $this->container->get('wbm_query_manager.db')->getRowCount($query);
                        $recordFields = array_keys($records[0]);

                        $date = new \DateTime();

                        $file = preg_replace("/[^a-z0-9\.]/", "", strtolower($cronJob['name'])) . "_" . $date->format('Y_m_d_h_i_s') . '_' . $i++ . ".csv";

                        $csvPath = $this->container->get('application')->DocPath() . 'var/log/' . $file;

                        $outputBuffer = fopen($csvPath, 'w');
                        foreach(array_merge(array(0 => $recordFields),$records) as $val) {
                            fputcsv($outputBuffer, $val, $this->container->get('config')->getByNamespace('WbmQueryManager', 'csv_field_separator'));
                        }
                        fclose($outputBuffer);

                        $mailRecipient = $this->container->get('config')->getByNamespace('WbmQueryManager', 'mail_address_receiver');
                        if(!empty($cronJob['mailRecipient'])){
                            $mailRecipient = $cronJob['mailRecipient'];
                        }
                        if(!empty($mailRecipient)){
                            $mail = clone $this->container->get('mail');
                            $mail->setFrom($this->container->get('config')->get('mail'));
                            $mail->addTo(array_map('trim', explode(",", $mailRecipient)));
                            $mail->setSubject($cronJob['name']);
                            $mail->setBodyText($rowCount . ' ' . $snippets->get('rowsAffected', 'Reihen betroffen'));
                            $mail->createAttachment(
                                fopen($csvPath, 'r'),
                                'application/pdf',
                                \Zend_Mime::DISPOSITION_ATTACHMENT,
                                \Zend_Mime::ENCODING_BASE64,
                                $file
                            );
                            $mail->send();
                        }

                        if(!$this->container->get('config')->getByNamespace('WbmQueryManager', 'log_csv')){
                            unlink($csvPath);
                        }

                        $numRows += $rowCount;
                    } else {
                        $numRows += $this->container->get('wbm_query_manager.db')->getRowCount($query);
                    }
                } while ($this->container->get('wbm_query_manager.db')->nextResult($query));

                $this->container->get('wbm_query_manager.db')->close($query);

                $result = $numRows . ' ' . $snippets->get('rowsAffected', 'Reihen betroffen');
            } catch (\Exception $e) {
                $result = $e->getMessage();
            }
            /** @var Query $query */
            $query = $this->container->get('models')->getRepository('WbmQueryManager\Models\Query')->find($cronJob['id']);
            $query->setLastLog($result);
            /** @var \DateTime $lastRun */
            $lastRun = $query->getLastRun() ? : new \DateTime();
            $query->setLastRun($now);
            $query->setNextRun($lastRun->add(\DateInterval::createFromDateString($query->getIntervalInt() . ' seconds')));

            $this->container->get('models')->persist($query);
            $this->container->get('models')->flush();
            $this->container->get('models')->clear();

            if($cronJob['clear_cache']){
                $clearCacheAfter = true;
            }

            $data[$cronJob['name']] = $result;
        }

        if($clearCacheAfter){
            $cacheManager = $this->container->get('shopware.cache_manager');
            $cacheManager->clearHttpCache();
            $cacheManager->clearTemplateCache();
            $cacheManager->clearConfigCache();
            $cacheManager->clearSearchCache();
            $cacheManager->clearProxyCache();
        }

        return $data;
    }
}
