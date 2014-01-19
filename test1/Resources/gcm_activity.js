
(function (activity, gcm) {

	var intent = activity.intent;

	// HERE we catch the intent extras of our notifications
	if (intent.hasExtra('ntfId')) {
		// and then we'll use 'data' property to pass info to the app (see pendingData lines of the 1st snippet)
		gcm.data = {
			ntfIdd: intent.getIntExtra('ntfId', 0),
			msg:intent.getStringExtra('msgdata', '')
			
		};

	}
	
	
	// 'isLauncherActivity' is a module property which tell us if the app is not running
	if (gcm.isLauncherActivity) {
		// if the app is not running, we need to start our app launcher activity
		// (launcher activity shows the splash screen and setup your app environment, so we need this)
		var mainActivityIntent = Ti.Android.createIntent({
			// 'mainActivityClassName' is another module property with name of our app launcher activity
			className: gcm.mainActivityClassName,
			packageName: Ti.App.id,
			flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
		});	
		mainActivityIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
		activity.startActivity(mainActivityIntent);
	}
	else {
		// if the app is running (is being resumed), just finish this activity!
		activity.finish();
	}

})(Ti.Android.currentActivity, require('net.iamyellow.gcmjs'));
