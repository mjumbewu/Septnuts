var makeRouteDataRequest = function(route) {
    Ext.util.JSONP.request({
        url: 'http://transitviewproxy.appspot.com/',
        callbackKey: 'callback',
        params: {                    
            route: route
        },
        callback: showOnMap
    });
};
        
function shorOnMap(route_data) {
}
