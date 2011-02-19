Ext.ns('Septnuts');

Septnuts.RoutesPanel = Ext.extend(Ext.Panel, {

	layout: 'fit'
	
	,initComponent: function() {
	
	
		// create routes store
		this.routesStore = new Ext.data.Store({
			model: 'Route'
			,autoLoad: true
			,pageSize: false
			,remoteSort: true
		});
	
	
		// configure layout items
		this.dockedItems = [{
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
		}];
		
		this.items = [{
			xtype: 'list'
			,store: this.routesStore
			,scroll: 'vertical'
			//,grouped: true
			,itemTpl: '{RouteShortName}: {RouteLongName}'
			
			,listeners: {
				scope: this
				,itemtap: function(list,index,item,e) {
				
					this.fireEvent('routeSelected', list.store.getAt(index));
				
			  	}
			}
		}];
		

	
		Septnuts.RoutesPanel.superclass.initComponent.apply(this, arguments);
	}


});