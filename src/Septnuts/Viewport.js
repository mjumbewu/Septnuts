Ext.ns('Septnuts');

Septnuts.Viewport = Ext.extend(Ext.Panel, {

	layout: 'card'
	,activeItem: 'routesPanel'
	
	,initComponent: function() {
	
		// register route model
		Ext.regModel('Route', {
		
			fields: [{
				name: 'RouteID'
				,type: 'integer'
			},{
				name: 'RouteShortName'
			},{
				name: 'RouteLongName'
			},{
				name: 'RouteType'
				,type: 'integer'
			},{
				name: 'RouteURL'
				,useNull: true
			}]
			
			,proxy: {
				type: 'ajax'
				,url: 'data/routes.json'
				,reader: {
					type: 'json'
					,root: 'routes'
					,idProperty: 'RouteID'
				}
			}
		});
		
		
		// create routes list
		this.routesPanel = new Septnuts.RoutesPanel({
			itemId: 'routesPanel'
			,listeners: {
				scope: this
				,routeSelected: this.onRouteSelected
			}
		});
		
		
		// create map view
		this.mapPanel = new Septnuts.MapPanel({
			itemId: 'mapPanel'
			,listeners: {
				scope: this
				,back: this.onMapBack
			}
		});
		
		
		// populate items config property with child items
		this.items = [
			this.routesPanel
			,this.mapPanel
		]
	
		// call parent class's function
		Septnuts.Viewport.superclass.initComponent.apply(this, arguments);
	}
	
	
	
	,onRouteSelected: function(route) {
	
		this.setActiveItem('mapPanel');
		this.mapPanel.loadRoute(route);
		
	}
	
	,onMapBack: function() {
	
		this.setActiveItem('routesPanel');
	
	}
	
	
	
	
	

});