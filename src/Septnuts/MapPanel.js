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
		
		// create the bus info bubble
		this.busInfoWindow = new google.maps.InfoWindow();

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
		
		// set the vocabulary, dependent on the type of route
		switch (route.get('RouteType')) {
		    case 0:
		        this.vehicleName = 'Trolley';
		        this.vehiclesName = 'Trollies';
		        break;
		        
		    case 3:
		        this.vehicleName = 'Bus';
		        this.vehiclesName = 'Buses';
		        break;
		        
		    default:
		        this.vehicleName = 'Vehicle';
		        this.vehiclesName = 'Vehicles';
		        break;
		}
		
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
		this.getEl().mask('Locating ' + this.vehiclesName + '&hellip;', 'x-mask-loading');
		
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
			Ext.Msg.alert('No ' + this.vehiclesName + ' found', 'No ' + this.vehiclesName + ' could be located on this route right now');
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
				,title: 'Some ' + this.vehiclesName
				,icon: this.markerImgs[icon]
			});
			
			// attach the bus info bubble to the marker when clicked
			var busInfoWindow = this.busInfoWindow;
			google.maps.event.addListener(busMarker, 'click', function() {
			    destString = 'Toward ' + (busData.destination != '' ? busData.destination : 'unknown desitnation');
			    timeString = 'reported ' + (busData.Offset == '0' ? 'just now.' : busData.Offset + ' minutes ago.');
			    
			    busInfoWindow.close();
			    busInfoWindow.setContent(destString + ', ' + timeString);
			    busInfoWindow.open(this.map,busMarker);
			});
			
            busMarker.setMap(this.map.map);
			
			this.busMarkers.push(busMarker);
		
		}, this);
		
	}

});
