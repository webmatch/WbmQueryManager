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
