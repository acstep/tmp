//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	
	
	
	
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		navBarHidden:true,
		layout:'vertical'
	});
	
	
	Ti.App.addEventListener('tokenchange',function(e) {
		Ti.API.info('receive event tokenchange ');
		self.close();
		var activity = Titanium.Android.currentActivity;
    	activity.finish();
        
	});
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
