//{namespace name=backend/plugins/wbm/querymanager}
//
Ext.define('Shopware.apps.WbmQueryManager.view.main.Window', {
    extend: 'Enlight.app.Window',
    title: '{s name="pluginTitle"}Query Manager{/s}',
    alias: 'widget.query-manager-window',
    id: 'WbmQueryManagerWindow',
    border: false,
    autoShow: true,
    height: 620,
    width: 768,
    layout: 'fit',
 
    initComponent: function() {
        var me = this;
        me.items = [
            Ext.create('Ext.panel.Panel', {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                flex: 1,
                items: [
                    {
                        xtype: 'query-manager-list',
                        store: me.mainStore,
                        width: 200
                    },
                    {
                        xtype: 'query-manager-detail',
                        record: me.record,
                        flex: 1
                    }
                ]
            })
        ];
    
        me.callParent(arguments);
    }

});
 
