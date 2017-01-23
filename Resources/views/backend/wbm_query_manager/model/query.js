Ext.define('Shopware.apps.WbmQueryManager.model.Query', {
    extend : 'Ext.data.Model', 
    fields : [ 
        {
            name: 'id', 
            type: 'integer'
        }, 
        {
            name: 'name', 
            type: 'string'
        }, 
        {
            name: 'sqlString',
            type: 'string'
        }, 
        {
            name: 'hasCronjob',
            type: 'boolean',
            defaultValue: 0
        }, 
        {
            name: 'intervalInt',
            type: 'integer'
        },
        {
            name: 'nextRun',
            type: 'date',
            useNull: true
        }, 
        {
            name: 'lastRun',
            type: 'date',
            useNull: true
        }, 
        {
            name: 'lastLog',
            type: 'string'
        }, 
        {
            name: 'clearCache',
            type: 'boolean',
            defaultValue: 0
        }    
    ],
    proxy: {
        type : 'ajax', 
        api:{
            read : '{url action=list}',
            create : '{url action="create"}',
            update : '{url action="update"}',
            destroy : '{url action="delete"}'
        },
        reader : {
            type : 'json',
            root : 'data',
            totalProperty: 'totalCount'
        }
    }
});
