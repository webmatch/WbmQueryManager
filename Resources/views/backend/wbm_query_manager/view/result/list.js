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

Ext.define('Shopware.apps.WbmQueryManager.view.result.List', {
    extend:'Ext.grid.Panel',
    border: false,
    alias:'widget.query-manager-result-list',
    cls:'query-manager-results',
    region:'center',
    autoScroll:true,
    initComponent:function () {
        var me = this;
        me.store = Ext.create(Ext.data.ArrayStore, {
            fields: me.jsonData.recordFields,
            idIndex: 0,
            autoLoad: false,
            autoDestroy: true
        });
        me.store.loadData(me.jsonData.records);
        me.columns = me.jsonData.columns;
        me.callParent(arguments);
    }
});
