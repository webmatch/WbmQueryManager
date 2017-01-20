<?php
namespace WbmQueryManager\Subscriber\Backend;

use Enlight\Event\SubscriberInterface;
use Shopware\Components\DependencyInjection\Container;

/**
 * Class QueryManagerController
 * @package WbmQueryManager\Subscriber\Backend
 */
class QueryManagerController implements SubscriberInterface
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
            'Enlight_Controller_Dispatcher_ControllerPath_Backend_WbmQueryManager' => 'onWbmQueryManagerController'
        ];
    }

    /**
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @return string
     */
    public function onWbmQueryManagerController()
    {
        $this->container->get('template')->addTemplateDir(
            $this->container->getParameter('wbm_query_manager.plugin_dir') . '/Resources/views/'
        );

        $this->container->get('snippets')->addConfigDir(
            $this->container->getParameter('wbm_query_manager.plugin_dir') . '/Resources/snippets/'
        );

        return $this->container->getParameter('wbm_query_manager.plugin_dir') . '/Controllers/Backend/WbmQueryManager.php';
    }
}