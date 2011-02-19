Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    
    onReady: function() {
        var tpl = Ext.XTemplate.from('weather');
        
        var makeAjaxRequest = function() {
            Ext.getBody().mask('Loading...', 'x-mask-loading', false);
            Ext.Ajax.request({
                url: 'test.json',
                success: function(response, opts) {
                    Ext.getCmp('content').update(response.responseText);
                    Ext.getCmp('status').setTitle('Static test.json file loaded');
                    Ext.getBody().unmask();
                }
            });
        };
        
        var makeRouteDataRequest = function(route) {
            Ext.util.JSONP.request({
                url: 'http://transitviewproxy.appspot.com/,
                callbackKey: 'callback',
                params: {                    
                    route: route
                },
                callback: function(data) {
                    alert(data.bus);
                }
            });
        };
        
        new Ext.Panel({
            fullscreen: true,
            id: 'content',
            scroll: 'vertical',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'JSONP',
                    handler: makeJSONPRequest
                },{xtype: 'spacer'},{
                    text: 'XMLHTTP',
                    handler: makeAjaxRequest
                }]
            },{
                id: 'status',
                xtype: 'toolbar',
                dock: 'bottom',
                title: "Tap a button above."
            }]
        });
    }
});
