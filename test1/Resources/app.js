/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with multiple windows in a stack
(function() {
	//render appropriate components based on the platform and form factor
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
		
	var userid = Ti.App.Properties.getString('userid','');
	var usertoken = Ti.App.Properties.getString('token','');
	var useremail = Ti.App.Properties.getString('useremail','');
	var defaultexpiretime = Ti.App.Properties.setInt('defaultexpiretime',604800);
	var sorttype = Ti.App.Properties.getString('sorttype','');
	if(sorttype == ''){
		Ti.App.Properties.setString('sorttype','time');
	}
	
	var distance = Ti.App.Properties.getInt('distance',0);
	if(distance == 0){
		Ti.App.Properties.setInt('distance',5);
	}
	var LoginWindow;
	var fewdWindow;
	
	
	var Window;

	Window = require('ui/handheld/android/ApplicationWindow');

	new Window().open();
	
	if(userid == ''){
		LoginWindow = require('loginWindows');
		new LoginWindow().open();
		
	}else{

		if(usertoken == ''){
			LoginWindow = require('loginWindows');
			new LoginWindow().open();
		}
		else{
			feedWindow = require('feedWindows');
			new feedWindow().open();
		}
		
	};
	
	
})();
