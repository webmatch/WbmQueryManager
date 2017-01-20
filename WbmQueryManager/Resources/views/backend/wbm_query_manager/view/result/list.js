Ext.define('Shopware.apps.WbmQueryManager.view.result.List', {
    extend:'Ext.grid.Panel',
    border: false,
    alias:'widget.query-manager-result-list',
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
        me.registerEvents();
        me.columns = me.jsonData.columns;
        me.callParent(arguments);
    },
    registerEvents:function () {
        this.addEvents(
            );
        return true;
    }
});
