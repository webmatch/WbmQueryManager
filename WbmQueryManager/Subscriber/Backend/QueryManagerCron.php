<?php
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
            try {
                /** @var \Zend_Db_Statement_Pdo $query */
                $query = $this->container->get('shopware.db')->query($cronJob['sqlString']);

                $data = $query->rowCount();
                /** @var \Enlight_Components_Snippet_Namespace $snippets */
                $snippets = $this->container->get('snippets')->getNamespace("backend/plugins/wbm/querymanager");

                if($data && $query->columnCount()){
                    $records = $query->fetchAll();
                    $recordFields = array_keys($records[0]);

                    $date = new \DateTime();

                    $file = preg_replace("/[^a-z0-9\.]/", "", strtolower($cronJob['name'])) . "_" . $date->format('Y_m_d_h_i_s') . ".csv";

                    $csvPath = $this->container->get('application')->DocPath() . 'var/log/' . $file;

                    $outputBuffer = fopen($csvPath, 'w');
                    foreach(array_merge(array(0 => $recordFields),$records) as $val) {
                        fputcsv($outputBuffer, $val, ';');
                    }
                    fclose($outputBuffer);

                    $mailRecipient = $this->container->get('config')->getByNamespace('WbmQueryManager', 'mail_address_receiver');
                    if(!empty($mailRecipient)){
                        $mail = clone $this->container->get('mail');
                        $mail->setFrom($this->container->get('config')->get('mail'));
                        $mail->addTo($mailRecipient);
                        $mail->setSubject($cronJob['name']);
                        $mail->setBodyText($data . ' ' . $snippets->get('rowsAffected', 'Reihen betroffen'));
                        $mail->createAttachment(
                            fopen($csvPath, 'r'),
                            'application/pdf',
                            \Zend_Mime::DISPOSITION_ATTACHMENT,
                            \Zend_Mime::ENCODING_BASE64,
                            $file
                        );
                        $mail->send();
                    }
                }

                $result = $data . ' ' . $snippets->get('rowsAffected', 'Reihen betroffen');
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