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
Ext.define('Shopware.apps.WbmQueryManager.view.main.Detail', {
    extend:'Ext.form.Panel',
    alias:'widget.query-manager-detail',
    cls:'query-manager-detail',
    collapsible : false,
    bodyPadding : 10,
    split       : false,
    region      : 'center',
    defaultType : 'textfield',
    autoScroll  : true,
    layout      : {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    items : [],
    initComponent: function() {
        var me = this;
        
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                cls: 'shopware-toolbar',
                ui: 'shopware-ui',
                items: me.getButtons()
            },{
                xtype: 'toolbar',
                dock: 'bottom',
                cls: 'shopware-toolbar',
                ui: 'shopware-ui',
                items: me.getActions()
            }
        ];
    
        me.editorField = Ext.create('Shopware.form.field.CodeMirror', {
            fieldLabel: '{s name="sqlFieldLabel"}SQL{/s}',
            xtype: 'codemirrorfield',
            mode: 'sql',
            labelAlign: 'top',
            anchor: '100%',
            name: 'sqlString',
            flex: 1,
            allowBlank: true
            //{if $autocompleteActive}
            //
            ,completers: [{
                getCompletions: function(editor, session, pos, prefix, callback) {
                    callback(null, Ext.decode('{$hintOptions}'));
                }
            }]
            //{/if}
            //
        });
        
        me.items = me.getItems();
        
        me.callParent(arguments);
        me.loadRecord(me.record);
    },  
    getItems:function () {
        var me = this;
        return [
            {
                fieldLabel: '{s name="nameFieldLabel"}Name{/s}',
                labelWidth: 50,
                anchor: '100%',
                name: 'name',
                allowBlank: false
            },
            me.editorField,
            {
                xtype: 'fieldset',
                title: '{s name="cronJobTitle"}Cron-Job{/s}',
                defaultType: 'textfield',
                layout: 'column',
                items :[
                    {
                        fieldLabel: '{s name="activeFieldLabel"}aktiv{/s}',
                        labelWidth: 30,
                        name: 'hasCronjob',
                        xtype: 'checkbox',
                        inputValue: 1,
                        uncheckedValue: 0,
                        columnWidth: .15
                    },{
                        fieldLabel: '{s name="clearCacheFieldLabel"}Cache leeren{/s}',
                        labelWidth: 75,
                        name: 'clearCache',
                        xtype: 'checkbox',
                        inputValue: 1,
                        uncheckedValue: 0,
                        columnWidth: .25
                    },{
                        xtype: 'combo',
                        fieldLabel: '{s name="intervalFieldLabel"}Intervall{/s}',
                        labelWidth: 50,
                        name: 'intervalInt',
                        displayField: 'description',
                        valueField: 'value',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'description'],
                            data : [
                                { value:0, description:"{s name='0secDesc'}Kein (0 Sek.){/s}" },
                                { value:120, description:"{s name='120secDesc'}2 Minuten (120 Sek.){/s}" },
                                { value:600, description:"{s name='600secDesc'}10 Minuten (600 Sek.){/s}" },
                                { value:900, description:"{s name='900secDesc'}15 Minuten (900 Sek.){/s}" },
                                { value:1800, description:"{s name='1800secDesc'}30 Minuten (1800 Sek.){/s}" },
                                { value:3600, description:"{s name='3600secDesc'}1 Stunde (3600 Sek.){/s}" },
                                { value:7200, description:"{s name='7200secDesc'}2 Stunden (7200 Sek.){/s}" },
                                { value:14400, description:"{s name='14400secDesc'}4 Stunden (14400 Sek.){/s}" },
                                { value:28800, description:"{s name='28800secDesc'}12 Stunden (28800 Sek.){/s}" },
                                { value:86400, description:"{s name='86400secDesc'}1 Tag (86400 Sek.){/s}" },
                                { value:172800, description:"{s name='172800secDesc'}2 Tage (172800 Sek.){/s}" },
                                { value:604800, description:"{s name='604800secDesc'}1 Woche (604800 Sek.){/s}" },
                                { value:2592000, description:"{s name='2592000secDesc'}1 Monat (2592000 Sek.){/s}" }
                            ]
                        }),
                        mode: 'local',
                        columnWidth: .40
                    },{
                        xtype: 'button',
                        text : '{s name="lastLogFieldLabel"}Letztes Log{/s}',
                        handler: function(btn) {
                            var me = this,
                            win = me.up('window'),
                            form = win.down('form');
                            Ext.MessageBox.alert('{s name="resultLastRun"}Ergebnis letzter Lauf{/s}', form.getForm().getRecord().get('lastLog'));
                        },
                        columnWidth: .20
                    },{
                        fieldLabel: '{s name="nextRunFieldLabel"}Nächster Lauf{/s}',
                        labelWidth: 80,
                        name: 'nextRun',
                        xtype: 'xdatetime',
                        columnWidth: .65
                    },{
                        fieldLabel: '{s name="lastRunFieldLabel"}Letzter Lauf{/s}',
                        labelWidth: 80,
                        name: 'lastRun',
                        xtype: 'displayfield',
                        columnWidth: .35,
                        renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
                    },{
                        fieldLabel: '{s name="mailRecipientFieldLabel"}Abweichende E-Mail-Adresse{/s}',
                        labelWidth: 180,
                        columnWidth: 1,
                        name: 'mailRecipient',
                    }
                ]
            }
        ];
    },
    getButtons : function()
    {
        var me = this;
        return [
            {
                text    : '{s name="reload"}Reload{/s}',
                scope   : me,
                cls: 'secondary',
                action  : 'reload'
            }, '->',
            {
                text    : '{s name="reset"}Reset{/s}',
                scope   : me,
                cls: 'secondary',
                action  : 'reset'
            },
            {
                text    : '{s name="save"}Save{/s}',
                action  : 'save',
                cls     : 'primary',
                formBind: true
            }
        ];
    },
    getActions : function()
    {
        var me = this;
        return [
            {
                xtype: 'button',
                text : '{s name="runQuery"}Query ausführen{/s}',
                cls  : 'primary',
                handler: function() {
                    var me = this,
                    win = me.up('window'),
                    form = win.down('form'),
                    query = form.getForm().findField('sqlString').getSubmitValue();
                    Ext.Ajax.request({
                        url: '{url controller="WbmQueryManager" action="run"}',
                        method: 'POST',          
                        params: {
                            query: query
                        },
                        success: function(response){
                            var result = Ext.JSON.decode(response.responseText);

                            if(result.success){
                                Ext.each(result.data, function(rowset) {
                                    if(rowset.fetchData){
                                        Ext.create('Ext.window.Window', {
                                            width: 500,
                                            height: 120,
                                            autoDestroy: true,
                                            title:'{s name="queryResult"}Query Resultat{/s}',
                                            layout: 'fit',
                                            buttonAlign: 'center',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    padding: 10,
                                                    html: '{s name="showOrDownload"}Resultat anzeigen oder als CSV downloaden?{/s}'
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: '{s name="show"}Anzeigen{/s}',
                                                    cls: 'primary',
                                                    listeners: {
                                                        click: {
                                                            fn: function (item, e) {
                                                                this.up('window').close();
                                                                Ext.create('Shopware.apps.WbmQueryManager.view.result.Window', {
                                                                    jsonData: rowset.fetchData
                                                                });
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    text: '{s name="download"}Downloaden{/s}',
                                                    cls: 'primary',
                                                    listeners: {
                                                        click: {
                                                            fn: function (item, e) {
                                                                this.up('window').close();
                                                                var form = Ext.create('Ext.form.Panel', {
                                                                    standardSubmit: true,
                                                                    url: '{url controller="WbmQueryManager" action="run" download=1}',
                                                                    method: 'POST'
                                                                });

                                                                form.submit({
                                                                    target: '_blank', // Avoids leaving the page.
                                                                    params: {
                                                                        query: query,
                                                                        rowset: rowset.rowsetKey
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    text: '{s name="cancel"}Abbrechen{/s}',
                                                    cls: 'secondary',
                                                    listeners: {
                                                        click: {
                                                            fn: function (item, e) {
                                                                this.up('window').close();
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }).show();
                                    } else {
                                        Ext.create('Ext.window.Window', {
                                            width: 300,
                                            height: 120,
                                            autoDestroy: true,
                                            title:'{s name="querySuccess"}Query erfolgreich{/s}',
                                            layout: 'fit',
                                            buttonAlign: 'center',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    padding: 10,
                                                    html: rowset.rowCount + ' {s name="rowsAffected"}Reihen betroffen{/s}'
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: '{s name="ok"}OK{/s}',
                                                    cls: 'primary',
                                                    listeners: {
                                                        click: {
                                                            fn: function (item, e) {
                                                                this.up('window').close();
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }).show();
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert('{s name="queryError"}Query fehlerhaft{/s}', result.data);
                            }
                        },
                        failure: function(){
                        }
                    });
                }
            }
        ];
    },
    resizeEditor : function(cmp, editorField, width, height) {
        var editor = editorField.editor;

        if(!editor || !editor.hasOwnProperty('display')) {
            return false;
        }

        editor.setSize(0, 0);

        width = editorField.getEl().down('tbody').getWidth();
        height = editorField.getEl().down('tbody').getHeight() - 20;

        editor.setSize(width, height);
    }
});