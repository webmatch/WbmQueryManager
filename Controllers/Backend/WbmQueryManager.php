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

use WbmQueryManager\Models\Query;

/**
 * Class Shopware_Controllers_Backend_WbmQueryManager
 */
class Shopware_Controllers_Backend_WbmQueryManager extends Shopware_Controllers_Backend_ExtJs {

    public function postDispatch()
    {
        if (
            $this->Request()->getActionName() === 'load' &&
            $this->container->get('config')->getByNamespace('WbmQueryManager', 'autocomplete')
        ) {
            $dbData = $this->container->getParameter('shopware.db');
            $sql = "SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ?";
            $tables = json_encode(
                $this->container->get('shopware.db')->fetchAll(
                    $sql,
                    array($dbData['dbname']), \Zend_Db::FETCH_GROUP|\Zend_Db::FETCH_COLUMN
                )
            );
            $this->View()->hintOptions = $tables;
            $this->View()->autocompleteActive = true;
        }
    }
    
    public function indexAction() 
    {
        $this->View()->loadTemplate("backend/wbm_query_manager/app.js");
    }
    
    public function listAction()
    {
        $id = $this->Request()->getParam('id', null);

        /** @var \Doctrine\ORM\QueryBuilder $qb */
        $qb = $this->container->get('models')->createQueryBuilder();
        $qb->select(
                array(
                    'query'
                )
            )
            ->from('WbmQueryManager\Models\Query', 'query');
        
        if(!empty($id)){
            $qb->where('query.id = :id')
                ->setParameter(':id', $id);
        } else {
            $qb->addOrderBy('query.name', 'ASC');
        }

        $data = $qb->getQuery()->getArrayResult();
        
        $this->View()->assign(
            array('success' => true, 'data' => $data)
        );
    }
    
    public function createAction() 
    {
        $params = $this->Request()->getPost();
        
        if($params['hasCronjob'] && empty($params['nextRun'])){
            $params['nextRun'] = new \DateTime();
        }
        
        $query = new Query();
        $query->fromArray($params);

        $this->container->get('models')->persist($query);
        $this->container->get('models')->flush();

        $this->View()->assign(
            array(
                'success' => true,
                'id' => $query->getId()
            )
        );
    }

    public function updateAction() 
    {
        $params = $this->Request()->getPost();
        $id = (int)$this->Request()->get('id');
        
        if($params['hasCronjob'] && empty($params['nextRun'])){
            $params['nextRun'] = new \DateTime();
        }

        /** @var Query $query */
        $query = $this->container->get('models')->getRepository('WbmQueryManager\Models\Query')->find($id);
        $query->fromArray($params);

        $this->container->get('models')->persist($query);
        $this->container->get('models')->flush();
        
        $this->View()->assign(
            array('success' => true)
        );
    }
    
    public function deleteAction() 
    {
        $id = (int)$this->Request()->get('id');

        /** @var Query $query */
        $query = $this->container->get('models')->getRepository('WbmQueryManager\Models\Query')->find($id);

        $this->container->get('models')->remove($query);
        $this->container->get('models')->flush();
        
        $this->View()->assign(
            array('success' => true)
        );
    }
    
    public function cloneAction() 
    {
        $id = (int)$this->Request()->get('id');

        /** @var Query $query */
        $query = $this->container->get('models')->getRepository('WbmQueryManager\Models\Query')->find($id);

        $query = clone $query;
        $query->setId(null);
        $query->setName('(Clone) ' . $query->getName());

        $this->container->get('models')->persist($query);
        $this->container->get('models')->flush();
        
        $this->View()->assign(
            array('success' => true)
        );
    }
    
    public function runAction() 
    {
        $sql = $this->Request()->get('query');
        $download = $this->Request()->get('download');
        $rowsetKey = $this->Request()->get('rowset');
        
        try {
            /** @var \mysqli|\Zend_Db_Statement_Pdo $query */
            $query = $this->container->get('wbm_query_manager.db')->query($sql);
            $data = array();
            $i = 0;

            do {
                $data[$i]['rowsetKey'] = $i;

                if($this->container->get('wbm_query_manager.db')->getColumnCount($query)){
                    $records = $this->container->get('wbm_query_manager.db')->fetchAll($query);
                    $data[$i]['rowCount'] = $this->container->get('wbm_query_manager.db')->getRowCount($query);

                    if($download && $rowsetKey != $i){
                        $i++;
                        continue;
                    }

                    $recordFields = array_keys($records[0]);
                    $columns = array();
                    foreach($recordFields as $recordField){
                        $columns[] = array(
                            'header' => $recordField,
                            'dataIndex' => $recordField,
                            'flex' => 1
                        );
                    }

                    $data[$i]['fetchData'] = array(
                        'records' => $records,
                        'recordFields' => $recordFields,
                        'columns' => $columns
                    );

                    if($download){
                        $this->container->get('plugins')->Controller()->ViewRenderer()->setNoRender();
                        $now = new \DateTime();
                        $file = "query_" . $now->format('Y_m_d_h_i_s') . ".csv";
                        header("Content-Type: text/csv");
                        header("Content-Disposition: attachment; filename=\"$file\"");

                        $outputBuffer = fopen("php://output", 'w');
                        foreach(array_merge(array(0 => $recordFields),$records) as $val) {
                            fputcsv($outputBuffer, $val, $this->container->get('config')->getByNamespace('WbmQueryManager', 'csv_field_separator'));
                        }
                        fclose($outputBuffer);

                        exit();
                    }
                } else {
                    $data[$i]['rowCount'] = $this->container->get('wbm_query_manager.db')->getRowCount($query);
                    $data[$i]['fetchData'] = null;
                }

                $i++;
            } while ($this->container->get('wbm_query_manager.db')->nextResult($query));

            $this->container->get('wbm_query_manager.db')->close($query);

            $this->View()->assign(
                array('success' => true, 'data' => array_reverse($data))
            );
        } catch (Exception $e) {
            $this->View()->assign(
                array('success' => false, 'data' => $e->getMessage())
            );
        }
    }
    
}

