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

//{namespace name=backend/plugins/wbm/querymanager}
//
Ext.define('Shopware.apps.WbmQueryManager.view.result.Window', {
    extend: 'Enlight.app.Window',
    title: '{s name="queryResult"}Query Resultat{/s}',
    alias: 'widget.query-manager-result-window',
    border: false,
    autoShow: true,
    height: 420,
    width: 568,
    layout: 'fit',
    initComponent: function() {
        var me = this;
        me.items = [
            {
                xtype: 'query-manager-result-list',
                jsonData: me.jsonData
            }
        ];
        me.callParent(arguments);
    }

});
 
