Ext.define('Shopware.apps.WbmQueryManager', {
    extend:'Enlight.app.SubApplication',
    name:'Shopware.apps.WbmQueryManager', 
    bulkLoad: true,
    loadPath: '{url action=load}',
    controllers: ['Main'],
    models: [ 'Query' ],
    views: [ 'main.Window', 'main.List', 'main.Detail', 'main.DateTime', 'result.Window', 'result.List' ],
    stores: [ 'Query' ],
 
    /** Main Function
     * @private
     * @return [object] mainWindow - the main application window based on Enlight.app.Window
     */
    launch: function() {
        var me = this;
        var mainController = me.getController('Main');
 
        return mainController.mainWindow;
    }
});
