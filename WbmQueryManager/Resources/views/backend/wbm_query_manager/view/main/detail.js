//{namespace name=backend/plugins/wbm/querymanager}
//
Ext.define('Shopware.apps.WbmQueryManager.view.main.Detail', {
    extend:'Ext.form.Panel',
    alias:'widget.query-manager-detail',
    collapsible : false,
    bodyPadding : 10,
    split       : false,
    region      : 'center',
    defaultType : 'textfield',
    autoScroll  : true,
    items : [],
    initComponent: function() {
        var me = this;
        
        me.dockedItems = [{
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
        }];
    
        me.editorField = Ext.create('Shopware.form.field.CodeMirror', {
            fieldLabel: '{s name="sqlFieldLabel"}SQL{/s}',
            xtype: 'codemirrorfield',
            mode: 'sql',
            labelAlign: 'top',
            anchor: '100%',
            name: 'sqlString',
            height: 328,
            allowBlank: true
        });
        
        me.editorField.on('editorready', function(editorField, editor) {
            editor.setOption("mode", 'text/x-mysql');
            //{if $autocompleteActive}
            //
            editor.setOption("extraKeys", { "Ctrl-Space": "autocomplete" });
            editor.setOption("hintOptions", {
                tables: Ext.decode('{$hintOptions}')
            });
            var hintDelay = null;
            editor.on("keyup", function (cm, event) {
                if ([13,32,37,38,39,40].indexOf(event.keyCode) === -1) {
                    clearTimeout(hintDelay);
                    if(cm.state.completionActive){
                        cm.state.completionActive.close();
                    }
                    hintDelay = setTimeout(function() {
                        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
                    }, 1500);
                } else {
                    clearTimeout(hintDelay);
                }
            });
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
                    items :[{
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
                                { value:604800, description:"{s name='604800secDesc'}1 Woche (604800 Sek.){/s}" }
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
                    }]
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
                                if(result.fetchData){
                                    Ext.MessageBox.show({
                                        title:'{s name="queryResult"}Query Resultat{/s}',
                                        msg: '{s name="showOrDownload"}Resultat anzeigen oder als CSV downloaden?{/s}',
                                        buttons: Ext.MessageBox.YESNO,
                                        buttonText: {
                                            yes: '{s name="show"}Anzeigen{/s}', no: '{s name="download"}Downloaden{/s}', cancel: '{s name="cancel"}Abbrechen{/s}'
                                        },
                                        fn: function(btn, text){
                                            if (btn == 'yes'){
                                                Ext.create('Shopware.apps.WbmQueryManager.view.result.Window', {
                                                   jsonData: result.fetchData
                                                });
                                            }
                                            if (btn == 'no'){   
                                                var form = Ext.create('Ext.form.Panel', {
                                                    standardSubmit: true,
                                                    url: '{url controller="WbmQueryManager" action="run" download=1}',
                                                    method: 'POST'
                                                });    
                                                
                                                form.submit({
                                                    target: '_blank', // Avoids leaving the page. 
                                                    params: {
                                                        query: query
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('{s name="querySuccess"}Query erfolgreich{/s}', result.data + ' {s name="rowsAffected"}Reihen betroffen{/s}');
                                }
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
    }
});