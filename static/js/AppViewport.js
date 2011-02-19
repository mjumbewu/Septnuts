Ext.ns('SEPTA');

SEPTA.AppViewport = Ext.extend(Ext.Panel, {

	layout: 'card'
	,activeItem: 0
	
	,initComponent: function() {
	
	
		// register data model
		Ext.regModel('Route', {
			fields: [{
				name: 'RouteID'
			},{
				name: 'RouteShortName'
			}, 'RouteLongName', 'RouteType', 'RouteURL']
			
			,proxy: {
				type: 'ajax'
				,url: '/routes/json'
				,reader: {
					type: 'json'
					,root: 'data'
					,idProperty: 'RouteID'
				}
			}
		});
	
		// create routes store
		this.routesStore = new Ext.data.Store({
			model: 'Route'
			,autoLoad: true
			,pageSize: false
			,remoteSort: true
			,listeners: {
/*
				load: function() {
					this.sort('RouteShortName');				
				}
*/
			}
/*
			,getGroupString: function(record) {
				var title = record.get('RouteLongName').toUpperCase();
					
				return title.substr(0,1);
			}
*/
		});
		
		
		// create marker images
		this.markerImgs = {
			bus_yellow: new google.maps.MarkerImage(
				'/img/bus_yellow.png'
				, new google.maps.Size(30, 24)
				, new google.maps.Point(0, 0)
				, new google.maps.Point(15, 12)
			)
			,bus_blue: new google.maps.MarkerImage(
				'/img/bus_blue.png'
				, new google.maps.Size(30, 24)
				, new google.maps.Point(0, 0)
				, new google.maps.Point(15, 12)
			)
			,bus_red: new google.maps.MarkerImage(
				'/img/bus_red.png'
				, new google.maps.Size(30, 24)
				, new google.maps.Point(0, 0)
				, new google.maps.Point(15, 12)
			)
		};
		
		
		// create routes list
		this.routesPanel = new Ext.Panel({
			layout: 'fit'
			,dockedItems: [{
				dock: 'top'
				,xtype: 'toolbar'
				,title: 'Select Route'
				,items: [{
					xtype: 'spacer'
				},{
					iconMask: true
					,iconCls: 'refresh'
					,handler: function() {
						window.location.reload();
					}
				}]
			}]
			,items: [{
				xtype: 'list'
				,store: this.routesStore
				,scroll: 'vertical'
				//,grouped: true
				,itemTpl: '{RouteShortName}: {RouteLongName}'
				
				,listeners: {
					scope: this
					,itemtap: function(list,index,item,e) {
					
						this.currentRoute = list.store.getAt(index);
						var routeShortName = this.currentRoute.get('RouteShortName');
							
				  		//console.info("route tapped: %o", routeShortName);
				  		
				  		// set toolbar title
				  		this.mapPanel.getDockedComponent('mapToolbar').setTitle('Route '+routeShortName);
				  		
				  		// load kml
				  		if(this.routeLayer)
				  		{
				  			this.routeLayer.setMap(null);
				  		}
				  		
						this.routeLayer = new google.maps.KmlLayer('http://www3.septa.org/transitview/kml/' + routeShortName +'.kml');
						
						if(this.gMap)
						{
							this.routeLayer.setMap(this.gMap);
						}
						
						this.loadRouteBuses();
												
				  		this.setActiveItem(1);
				  	}
				}
			}]
		});
		
		
		// create map view
		this.mapPanel = new Ext.Panel({
			layout: 'fit'
			,dockedItems: [{
				dock: 'top'
				,itemId: 'mapToolbar'
				,xtype: 'toolbar'
				,title: 'Routes Map'
				,items: [{
					xtype: 'button'
					,ui: 'back'
					,text: 'Back'
					,scope: this
					,handler: function() {
						this.setActiveItem(0);
					}
				},{
					xtype: 'spacer'
				},{
					text: 'Update'
					,iconMask: true
					,iconCls: 'refresh'
					,scope: this
					,handler: function() {
						this.loadRouteBuses();
					}
				}]
			}]
			,items: {
				xtype: 'map'
				,useCurrentLocation: true
				,listeners: {
					scope: this
					,maprender: function(comp, map) {
						
						this.gMap = map;
						
						if(this.routeLayer)
							this.routeLayer.setMap(this.gMap);
					}
				}

			}
		});
	
		
		
		this.items = [
			this.routesPanel
			,this.mapPanel
		]
	
		SEPTA.AppViewport.superclass.initComponent.apply(this, arguments);
	}



	,loadRouteBuses: function(routeShortName) {
	
		var routeShortName = this.currentRoute.get('RouteShortName');
		
		this.getEl().mask('Loading buses...', 'x-mask-loading');
		
		//console.info("loading route buses: %o", routeShortName);
	
		Ext.util.JSONP.request({
			url: 'http://transitviewproxy.appspot.com'
		   	,callbackKey: 'callback'
			,params: {
				route: routeShortName						   
			}
			,scope: this
			,callback: this.onBusesLoaded
		});
		
	}
	
	
	,onBusesLoaded: function(data) {
	
		//console.info("got buses: %o", data);
		this.getEl().unmask();
	
		if(data.bus.length == 0)
			alert('No buses found on this route');
	
		// erase old markers
		if(this.busMarkers)
		{
			Ext.each(this.busMarkers, function(busMarker) {
				busMarker.setMap(null);
			});
		}
	
		this.busMarkers = [];
		
		Ext.each(data.bus, function(busData) {
	
			var icon = 'bus_yellow';
			switch(busData.Direction)
			{
				case 'WestBound':
				case 'SouthBound':
					icon = 'bus_red';
					break;
					
				case 'EastBound':
				case 'NorthBound':
					icon = 'bus_blue';
					break;
					
			}
			
			var busMarker = new google.maps.Marker({
				position: new google.maps.LatLng(busData.lat, busData.lng)
				,title: 'Some bus'
				,icon: this.markerImgs[icon]
			});
			
			busMarker.setMap(this.gMap);
			
			this.busMarkers.push(busMarker);
		
		}, this);
		
	}

});