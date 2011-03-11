/*
	Patch for open sencha touch bug which prevents google map clicks from registering on mobile browsers

	Source: http://www.sencha.com/forum/showthread.php?117876-OPEN-642-map-on-1.0.1-not-responding-to-click-events-on-iPhone-Android&p=554943&viewfull=1#post554943
*/

Ext.gesture.Manager.onMouseEventOld = Ext.gesture.Manager.onMouseEvent;
Ext.gesture.Manager.onMouseEvent = function(e) {
	var target = e.target;

	while (target) {
		if (Ext.fly(target) && Ext.fly(target).hasCls('x-map')) {
			return;
		}

		target = target.parentNode;
	}

	this.onMouseEventOld.apply(this, arguments);
};