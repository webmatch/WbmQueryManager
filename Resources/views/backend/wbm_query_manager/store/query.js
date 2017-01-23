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

Ext.define('Shopware.apps.WbmQueryManager.store.Query', {
    extend: 'Ext.data.Store',
    remoteFilter: true,
    autoLoad : false,
    model : 'Shopware.apps.WbmQueryManager.model.Query',
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: '{url controller="WbmQueryManager" action="list"}',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});
