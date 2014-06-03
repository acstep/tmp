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

///////////  google Analytics //////////////////////

var GA = require('analytics.google');
GA.localDispatchPeriod = 10;
var tracker = GA.getTracker("UA-50815409-1");


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
	
	var distanceIndex = Ti.App.Properties.getInt('distance',0);
	if(distanceIndex == 0){
		Ti.App.Properties.setInt('distance',10);
	}
	
	var locationsrc = Ti.App.Properties.getString('locationsrc','');
	if(locationsrc == ''){
		Ti.App.Properties.setString('locationsrc','network');
	}
	
	var notification = Ti.App.Properties.getString('notify','');
	if(notification == ''){
		Ti.App.Properties.setString('notify','all');
	}
	
	Ti.App.Properties.setString('serveraddr','https://api.nexbbs.com/api/');
	var serveraddr = Ti.App.Properties.getString('serveraddr','');
	
	Ti.App.Properties.setString('imgserveraddr','https://upload.nexbbs.com/api/');
	var imgserveraddr = Ti.App.Properties.getString('imgserveraddr','');

	Ti.App.Properties.setString('feedimgaddr','http://cdnfeedimgsm.nexbbs.com/');
	var feedimgaddr = Ti.App.Properties.getString('feedimgaddr','');
	
	Ti.App.Properties.setString('feedimgladdr','http://cdnfeedimgsl.nexbbs.com/');
	var feedimgaddr = Ti.App.Properties.getString('feedimgladdr','');

	Ti.App.Properties.setString('headimgaddr','http://cdnhphotos.nexbbs.com/');
	var headimgaddr = Ti.App.Properties.getString('headimgaddr','');

	
	var category = Ti.App.Properties.getList('category','');
	if(category == ''){
		Ti.App.Properties.setList('category',[1000,1001,1002,1003,1004,1005,1006,1007]);
	}
	
	var gender = Ti.App.Properties.getInt('gender',0);
	if(gender == 0){
		Ti.App.Properties.setInt('gender',0);
	}
	var birthday = Ti.App.Properties.getInt('birthday',0);
	if(birthday == 0){
		Ti.App.Properties.setInt('birthday',946656000);
	}
	
	var LoginWindow;
	var feedWindow;
	
	
	
	var Window;

	//Window = require('ui/handheld/android/ApplicationWindow');

	//new Window().open();
	
	if(userid == ''){
		var LoginWindow = require('loginWindows');
		new LoginWindow().open();
		
	}else{

		if(usertoken == ''){
			var LoginWindow = require('loginWindows');
			new LoginWindow().open();
		}
		else{
			var feedWindow = require('feedWindows');
			new feedWindow().open();
		}
		
	};
	
	
})();
