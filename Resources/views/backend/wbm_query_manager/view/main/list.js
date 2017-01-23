//{namespace name=backend/plugins/wbm/querymanager}
//
Ext.define('Shopware.apps.WbmQueryManager.view.main.List', {
    extend:'Ext.grid.Panel',
    border: false,
    alias:'widget.query-manager-list',
    region:'center',
    autoScroll:true,
    listeners: {
        itemclick: function(dv, record, item, rowIndex, e) {
            var me = this;
            me.fireEvent('openQueryDetail', me, rowIndex);                                     
        }
    },
    initComponent:function () {
        var me = this;
        me.registerEvents();
        me.columns = me.getColumns();
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                cls: 'shopware-toolbar',
                ui: 'shopware-ui',
                items: me.getButtons()
            }
        ];
        me.callParent(arguments);
    },
    registerEvents:function () {
        this.addEvents(
            );
        return true;
    },
    getColumns:function () {
        var me = this,
        columnsData = [
            {
                header: '{s name="nameColumnHeader"}Name{/s}',
                dataIndex:'name',
                flex:1
            },
            {
                xtype:'actioncolumn',
                width:50,
                items:me.getActionColumnItems()
            }
        ];
        return columnsData;
    },
    getButtons : function()
    {
        var me = this;
            return [
                {
                    text    : '{s name="add"}Hinzufügen{/s}',
                    scope   : me,
                    iconCls : 'sprite-plus-circle-frame',
                    action : 'addQuery'
                }
            ];
    },
    getActionColumnItems: function () {
        var me = this,
        actionColumnData = [
            {
                iconCls:'x-action-col-icon sprite-minus-circle-frame',
                cls:'duplicateColumn',
                tooltip:'{s name="delete"}Löschen{/s}',
                getClass: function(value, metadata, record) {
                    if (!record.get("id")) {
                        return 'x-hidden';
                    }
                },
                handler:function (view, rowIndex, colIndex, item) {
                    me.fireEvent('deleteQuery', view, rowIndex, colIndex, item);
                }
            },
            {
                iconCls:'x-action-col-icon sprite-blue-document-copy',
                cls:'duplicateColumn',
                tooltip:'{s name="duplicate"}Duplizieren{/s}',
                getClass: function(value, metadata, record) {
                    if (!record.get("id")) {
                        return 'x-hidden';
                    }
                },
                handler:function (view, rowIndex, colIndex, item) {
                    me.fireEvent('cloneQuery', view, rowIndex, colIndex, item);
                }
            }
        ];       
        return actionColumnData;
    }
});
