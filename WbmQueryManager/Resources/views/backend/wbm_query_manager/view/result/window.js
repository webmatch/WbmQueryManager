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
 
