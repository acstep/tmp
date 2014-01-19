//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var navView = Ti.UI.createView({
		width:'100%',
		height:'30'
	});
	self.add(navView);
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
