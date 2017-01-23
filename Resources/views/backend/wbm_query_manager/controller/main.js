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
Ext.define('Shopware.apps.WbmQueryManager.controller.Main', {
    /**
     * Extend from the standard ExtJS 4 controller
     * @string
     */
    extend: 'Ext.app.Controller',
    mainWindow: null,
    /** Contains all text messages for this controller */
    messages: {
        saveDialogSuccess :'{s name="querySaveSuccess"}Query wurde erfolgreich gespeichert{/s}',
        growlMessage: ''
    },
    /**
     * Creates the necessary event listener for this
     * specific controller and opens a new Ext.window.Window
     * to display the subapplication
     *
     * @return void
     */
    init: function() {
        var me = this;

        me.getStore('Query').load({
            scope: this,
            callback: function(records, operation, success) {
                me.mainWindow = me.getView('main.Window').create({
                    mainStore: me.getStore('Query'),
                    record: Ext.create('Shopware.apps.WbmQueryManager.model.Query')
                });
            }
        });        

        me.callParent(arguments);
        me.control({
            'query-manager-detail button[action=save]' : {
                'click' : function(btn) {
                    this.onSave(btn);
                }
            },
            'query-manager-detail button[action=reset]' : {
                'click' : function(btn) {
                    this.onReset(btn);
                }
            },
            'query-manager-detail button[action=reload]': {   
                'click' : function(btn) {
                    this.reloadQueryDetail(btn);
                }
            },
            'query-manager-list button[action=addQuery]' : {
                'click' : function (btn) {
                    this.addQuery(btn);
                }
            },
            'query-manager-list':{                
                openQueryDetail: me.openQueryDetail,
                deleteQuery: me.deleteQuery,
                cloneQuery: me.cloneQuery
            }
        });
    },
    onSave: function(btn) {
        var win     = btn.up('window'), 
        form    = win.down('form'), 
        formBasis = form.getForm(), 
        me      = this,             
        store   = me.getStore('Query'), 
        record  = form.getRecord();  
        if (!(record instanceof Ext.data.Model)){
            record = Ext.create('Shopware.apps.WbmQueryManager.model.Query');
        }
        
        formBasis.updateRecord(record);

        if (formBasis.isValid()) {
            record.save({
                params: {
                    id: record.get("id")
                },
                success: function(rec, op) {
                    var newId = op.request.scope.reader.jsonData["id"];
                    if(newId){
                        record.set("id", newId);
                    }
                    store.load();
                    Shopware.Msg.createGrowlMessage('','{s name="querySaveSuccess"}Query wurde erfolgreich gespeichert{/s}', '');                                
                },
                failure: function(rec, op) {
                    store.load();
                    Shopware.Msg.createGrowlMessage('','{s name="querySaveError"}Fehler beim Speichern des Query: {/s}'+op.request.scope.reader.jsonData["message"], '');
                    
                }
            });
        }
    },
    onReset: function(btn) {
        var win     = btn.up('window'), 
        form    = win.down('form'), 
        formBasis = form.getForm(), 
        me      = this,             
        store   = me.getStore('Query'), 
        record  = form.getRecord();  
        if (!(record instanceof Ext.data.Model)){
            record = Ext.create('Shopware.apps.WbmQueryManager.model.Query');
        }
        
        form.loadRecord(record);
    },
    openQueryDetail:function (view, rowIndex) {
        var me = this,
        record = me.getStore('Query').getAt(rowIndex);
        me.record = record;
        me.detailStore = new Ext.data.Store({
            extend:'Ext.data.Store',
            remoteFilter : true,
            model:'Shopware.apps.WbmQueryManager.model.Query'
        });
        me.detailStore.load({
            params : {
                id: record.get("id")
            },
            callback: function(records, operation) {
                if (operation.success !== true || !records.length) {
                    return;
                }
                me.detailRecord = records[0];
                var win = view.up('window'), 
                form = win.down('form');
                form.loadRecord(me.detailRecord);
            }
        });     
        
    },
    reloadQueryDetail:function (btn) {
        var me = this,
        win = btn.up('window'),
        form = win.down('form'),
        list = win.down('grid');
        me.loadMask = new Ext.LoadMask(form);
        me.record = form.getForm().getRecord();
        if(me.record.get('id')){
            me.loadMask.show();
            me.store = list.getStore();
            me.store.load({
                scope: this,
                callback: function(records, operation, success) {
                    var rowIndex = me.store.indexOfId(me.record.get('id'));
                    me.openQueryDetail(btn, rowIndex);
                    me.loadMask.hide();
                }
            });
        }
    },
    addQuery:function (btn) { 
        var me = this,
        win = btn.up('window'), 
        form = win.down('form');   
        me.detailRecord = Ext.create('Shopware.apps.WbmQueryManager.model.Query');
        form.loadRecord(me.detailRecord);
    },
    deleteQuery: function (view, rowIndex) {
        var me = this,
        store = me.getStore('Query'),        
        record = store.getAt(rowIndex);
        me.record = record;

        if (me.record instanceof Ext.data.Model && me.record.get('id') > 0) {
            Ext.MessageBox.confirm('Query löschen?', '{s name="queryDeleteAlert"}Sind Sie sicher, dass Sie das Query löschen wollen?{/s}' , function (response) {
                if ( response !== 'yes' ) {
                    return;
                }
                me.record.destroy({
                    callback: function(operation) {
                        Shopware.Msg.createGrowlMessage('','{s name="queryDeleted"}Query wurde erfolgreich gelöscht{/s}', 'QueryManager');
                        store.load();
                        var win = view.up('window'), 
                        form = win.down('form');   
                        me.detailRecord = Ext.create('Shopware.apps.WbmQueryManager.model.Query');
                        form.loadRecord(me.detailRecord);
                    }
                });
            });
        }
    },
    cloneQuery: function (view, rowIndex) {
        var me = this,
        store = me.getStore('Query'),        
        record = store.getAt(rowIndex);
        me.record = record;

        if (me.record instanceof Ext.data.Model && me.record.get('id') > 0) {
            Ext.Ajax.request({
                url: '{url controller="WbmQueryManager" action="clone"}',
                method: 'POST',          
                params: {
                    id: me.record.get('id')
                },
                success: function(){
                    store.load();
                },
                failure: function(){

                }
            });
        }
    }
});
 
