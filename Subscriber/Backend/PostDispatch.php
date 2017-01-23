<?php
namespace WbmQueryManager\Subscriber\Backend;

use Enlight\Event\SubscriberInterface;
use Shopware\Components\DependencyInjection\Container;

/**
 * Class PostDispatch
 * @package WbmQueryManager\Subscriber\Backend
 */
class PostDispatch implements SubscriberInterface
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
            'Enlight_Controller_Action_PostDispatch_Backend' => 'onPostDispatch'
        ];
    }

    /**
     * PostDispatch constructor.
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * @param \Enlight_Event_EventArgs $args
     */
    public function onPostDispatch(\Enlight_Event_EventArgs $args)
    {
        $view = $args->getSubject()->View();

        $view->addTemplateDir(
            $this->container->getParameter('wbm_query_manager.plugin_dir') . '/Resources/views/backend/'
        );

        $view->queryManagerPath = str_replace(
            $this->container->get('application')->DocPath(),
            '',
            $this->container->getParameter('wbm_query_manager.plugin_dir')
        );

        $view->extendsTemplate('base/hint-scripts.tpl');
    }
}