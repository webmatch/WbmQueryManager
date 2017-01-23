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

Ext.define('Shopware.apps.WbmQueryManager', {
    extend:'Enlight.app.SubApplication',
    name:'Shopware.apps.WbmQueryManager', 
    bulkLoad: true,
    loadPath: '{url action=load}',
    controllers: ['Main'],
    models: [ 'Query' ],
    views: [ 'main.Window', 'main.List', 'main.Detail', 'main.DateTime', 'result.Window', 'result.List' ],
    stores: [ 'Query' ],
 
    /** Main Function
     * @private
     * @return [object] mainWindow - the main application window based on Enlight.app.Window
     */
    launch: function() {
        var me = this;
        var mainController = me.getController('Main');
 
        return mainController.mainWindow;
    }
});
