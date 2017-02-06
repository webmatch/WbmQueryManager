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

/**
 * Interface QueryManagerDbInterface
 * @package WbmQueryManager\Services
 */
interface QueryManagerDbInterface {

    /**
     * @param $query
     */
    public function query($query);

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     */
    public function getRowCount($query);

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     */
    public function getColumnCount($query);

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     */
    public function fetchAll($query);

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     */
    public function nextResult($query);

    /**
     * @param \mysqli|\Zend_Db_Statement_Pdo $query
     */
    public function close($query);

}