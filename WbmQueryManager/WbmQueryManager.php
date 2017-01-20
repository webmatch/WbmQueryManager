<?php
namespace WbmQueryManager;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Shopware\Components\Plugin\Context\ActivateContext;
use Shopware\Components\Plugin\Context\InstallContext;
use Shopware\Components\Plugin\Context\UpdateContext;

/**
 * Class WbmQueryManager
 * @package WbmQueryManager
 */
class WbmQueryManager extends \Shopware\Components\Plugin
{
    /**
     * @param ContainerBuilder $container
     */
    public function build(ContainerBuilder $container)
    {
        $container->setParameter('wbm_query_manager.plugin_dir', $this->getPath());

        parent::build($container);
    }

    /**
     * @param InstallContext $context
     */
    public function install(InstallContext $context)
    {
        $sql = file_get_contents($this->getPath() . '/Resources/sql/install.sql');

        $this->container->get('shopware.db')->query($sql);
    }

    /**
     * @param ActivateContext $context
     */
    public function activate(ActivateContext $context)
    {
        $context->scheduleClearCache(InstallContext::CACHE_LIST_ALL);
    }

    /**
     * @param UpdateContext $context
     */
    public function update(UpdateContext $context)
    {
        parent::update($context);
    }
}