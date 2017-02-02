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

        $view->extendsTemplate('base/resources.tpl');
    }
}