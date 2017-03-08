<?php

class QueryManagerTests extends Enlight_Components_Test_Controller_TestCase
{
    /**
     * @var array
     */
    private $pluginConfig;

    /**
     * @var \WbmQueryManager\Services\QueryManagerDb
     */
    private $connection;

    public function setUp()
    {
        parent::setUp();

        $this->pluginConfig = Shopware()->Container()->get('shopware.plugin.cached_config_reader')->getByPluginName('WbmQueryManager');
        $this->connection = Shopware()->Container()->get('wbm_query_manager.db');
        $this->dispatch('/');
    }

    public function testSingleQueryManagerDbService()
    {
        $singleQuery = $this->connection->query('SELECT 1 as a');
        $singleQueryResult = $this->connection->fetchAll($singleQuery);

        $this->assertTrue($singleQueryResult[0]['a'] === "1");
    }

    public function testMultiQueryManagerDbService()
    {
        $multiQuery = $this->connection->query('SELECT 1 as a; SELECT 2 as b');
        $multiQueryResult1 = $this->connection->fetchAll($multiQuery);

        $this->assertTrue($multiQueryResult1[0]['a'] === "1");

        $multiQuery->next_result();

        $multiQueryResult2 = $this->connection->fetchAll($multiQuery);

        $this->assertTrue($multiQueryResult2[0]['b'] === "2");
    }
}