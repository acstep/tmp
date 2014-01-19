
(function (service) {

	var serviceIntent = service.getIntent(),
	statusBarMessage = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	message = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	msgdata = serviceIntent.hasExtra('message') ? JSON.parse(serviceIntent.getStringExtra('data')) : {},
	notificationId = (function () {
		// android notifications ids are int32
		// java int32 max value is 2.147.483.647, so we cannot use javascript millis timpestamp
		// let's make a valid timed based id:

		// - we're going to use hhmmssDYLX where (DYL=DaysYearLeft, and X=0-9 rounded millis)
		// - hh always from 00 to 11
		// - DYL * 2 when hour is pm
		// - after all, its max value is 1.159.597.289

		var str = '',
		now = new Date();

		var hours = now.getHours(),
		minutes = now.getMinutes(),
		seconds = now.getSeconds();
		str += (hours > 11 ? hours - 12 : hours) + '';
		str += minutes + '';
		str += seconds + '';

		var start = new Date(now.getFullYear(), 0, 0),
		diff = now - start,
		oneDay = 1000 * 60 * 60 * 24,
		day = Math.floor(diff / oneDay); // day has remaining days til end of the year
		str += day * (hours > 11 ? 2 : 1);

		var ml = (now.getMilliseconds() / 100) | 0;
		str += ml;

		return str | 0;
	})();
		
	// create launcher intent
	var ntfId = Ti.App.Properties.getInt('ntfId', 0),
	launcherIntent = Ti.Android.createIntent({
		className: 'net.iamyellow.gcmjs.GcmjsActivity',
		action: 'action' + ntfId, // we need an action identifier to be able to track click on notifications
		packageName: Ti.App.id,
		flags: Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	launcherIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
	launcherIntent.putExtra("ntfId", ntfId);
	launcherIntent.putExtra("message", message);
	launcherIntent.putExtra("msgdata", serviceIntent.getStringExtra('data'));

	// increase notification id
	ntfId += 1;
	Ti.App.Properties.setInt('ntfId', ntfId);

	// create notification
	var pintent = Ti.Android.createPendingIntent({intent: launcherIntent});
	titlestr = '';
	messagestr = '';
	if(msgdata.type != undefined){
		switch(msgdata.type)
		{
		case 'comment':
		  	titlestr = L('uhavecomment');
		  	messagestr = msgdata.name + L('userreply');
		    break;

		default:
		    titlestr = L('uhavecomment');
		    messagestr = msgdata.name + L('userreply');
		}
	}
	
	var notification = Ti.Android.createNotification({
		contentIntent: pintent,
		contentTitle: titlestr,
		contentText: messagestr,
		tickerText: messagestr,
		icon: Ti.App.Android.R.drawable.appicon,
		flags: Ti.Android.FLAG_AUTO_CANCEL | Ti.Android.FLAG_SHOW_LIGHTS
	});
	Ti.Android.NotificationManager.cancel(Ti.App.Properties.getString('notifyid', notificationId));
	Ti.Android.NotificationManager.notify(notificationId, notification);
    Ti.App.Properties.setString('notifyid', notificationId);
	service.stop();

})(Ti.Android.currentService);