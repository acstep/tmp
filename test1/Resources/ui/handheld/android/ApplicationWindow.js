//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	
	
	
	
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		navBarHidden:true,
		layout:'vertical'
	});
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
