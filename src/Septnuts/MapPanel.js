Ext.ns('Septnuts');

Septnuts.MapPanel = Ext.extend(Ext.Panel, {

	layout: 'fit'
	
	,initComponent: function() {
	
	
		// configure marker images 
		this.markerImgs = {
			bus_yellow: new google.maps.MarkerImage(
				'img/bus_yellow.png'
				, new google.maps.Size(30, 24)
				, new google.maps.Point(0, 0)
				, new google.maps.Point(15, 12)
			)
			,bus_blue: new google.maps.MarkerImage(
				'img/bus_blue.png'
				, new google.maps.Size(30, 24)
				, new google.maps.Point(0, 0)
				, new google.maps.Point(15, 12)
			)
			,bus_red: new google.maps.MarkerImage(
				'img/bus_red.png'
				, new google.maps.Size(30, 24)
				, new google.maps.Point(0, 0)
				, new google.maps.Point(15, 12)
			)
		};
	
	
		// create map object
		this.map = new Ext.Map({
			useCurrentLocation: true
			,listeners: {
				scope: this
				,maprender: this.onMapRender
			}
		});


		// populate panel docks
		this.dockedItems = [{
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
					this.fireEvent('back');
				}
			},{
				xtype: 'spacer'
			},{
				text: 'Update'
				,iconMask: true
				,iconCls: 'refresh'
				,scope: this
				,handler: function() {
					this.loadBusData();
				}
			}]
		}];
		
		// populate panel items
		this.items = [this.map];
		

		// call parent initComponent
		Septnuts.MapPanel.superclass.initComponent.apply(this, arguments);
	}
	
	
	,loadRoute: function(route) {
	
		// store loaded route
		this.loadedRoute = route;
		
  		// set toolbar title
  		this.getDockedComponent('mapToolbar').setTitle('Route '+route.get('RouteShortName'));
  		
  		// unload previous layer
  		if(this.routeLayer)
  		{
  			this.routeLayer.setMap(null);
  		}
  		
  		// load layer for this route
		this.routeLayer = new google.maps.KmlLayer('http://www3.septa.org/transitview/kml/' + route.get('RouteShortName') +'.kml');
		this.routeLayer.setMap(this.map.map);
		
		// load bus data
		this.loadBusData();
	
	}
	
	,onMapRender: function(comp, map) {
	
		//console.info('map rendered');

	}
	
	
	,loadBusData: function() {
	
		// mask map during load
		this.getEl().mask('Locating buses&hellip;', 'x-mask-loading');
		
		// fire JSONP request
		Ext.util.JSONP.request({
			url: 'http://transitviewproxy.appspot.com'
		   	,callbackKey: 'callback'
			,params: {
				route: this.loadedRoute.get('RouteShortName')					   
			}
			,scope: this
			,callback: this.onBusData
		});
		
	}


	,onBusData: function(data) {
	
		// remove load mask
		this.getEl().unmask();
	
		// erase old markers
		if(this.busMarkers)
		{
			Ext.each(this.busMarkers, function(busMarker) {
				busMarker.setMap(null);
			});
		}
	
		// alert user if no buses found
		if(data.bus.length == 0)
		{
			Ext.Msg.alert('No buses found', 'No buses could be located on this route right now');
			return;
		}
		
		// create marker for each bus
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
			
			busMarker.setMap(this.map.map);
			
			this.busMarkers.push(busMarker);
		
		}, this);
		
	}

});