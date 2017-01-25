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

namespace WbmQueryManager\Services;

use Shopware\Components\DependencyInjection\Container;

/**
 * Class QueryManagerDb
 * @package WbmQueryManager\Services
 */
class QueryManagerDb {

    /**
     * @var Container
     */
    private $container;

    /**
     * @var \Enlight_Components_Db_Adapter_Pdo_Mysql
     */
    private $db;

    /**
     * QueryManagerDb constructor.
     * @param Container $container
     * @param \Enlight_Components_Db_Adapter_Pdo_Mysql $db
     */
    public function __construct(Container $container, \Enlight_Components_Db_Adapter_Pdo_Mysql $db)
    {
        $this->container = $container;
        $this->db = $db;
    }

    /**
     * @return \Enlight_Components_Db_Adapter_Pdo_Mysql|\mysqli
     */
    private function getConnection()
    {
        if(function_exists('mysqli_connect') && class_exists('Zend_Db_Adapter_Mysqli')) {
            $config = $this->container->getParameter('shopware.db');
            $mysqli = new \Zend_Db_Adapter_Mysqli($config);
            return $mysqli->getConnection();
        } else {
            return $this->db;
        }
    }

    /**
     * @param $query
     * @return \mysqli|\Zend_Db_Statement_Pdo
     */
    public function query($query)
    {
        $connection = $this->getConnection();
        if(get_class($connection) == 'mysqli'){
            if($connection->multi_query($query)){
                return $connection;
            }
        }
        return $connection->query($query);
    }

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     * @return int
     */
    public function getRowCount($query)
    {
        if(get_class($query) == 'mysqli'){
            return $query->affected_rows;
        }
        return $query->rowCount();
    }

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     * @return int
     */
    public function getColumnCount($query)
    {
        if(get_class($query) == 'mysqli'){
            return $query->field_count;
        }
        return $query->columnCount();
    }

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     * @return array
     */
    public function fetchAll($query)
    {
        if(get_class($query) == 'mysqli'){
            $results = array();
            if ($result = $query->store_result()) {
                $results = $result->fetch_all(MYSQLI_ASSOC);
            }
            return $results;
        }
        return $query->fetchAll();
    }

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     * @return bool
     */
    public function nextResult($query)
    {
        if(get_class($query) == 'mysqli'){
            return $query->next_result();
        }
        return false;
    }

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     * @return bool
     */
    public function close($query)
    {
        if(get_class($query) == 'mysqli'){
            return $query->close();
        } else {
            $query->closeCursor();
        }
        return true;
    }

}