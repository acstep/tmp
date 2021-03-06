//My feed Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function myFeedWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
    createNormalFeed(backgroundView, 'myfeed');
    
    if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
	
	}
	else{
		var GA = require('analytics.google');
		var tracker = GA.getTracker("UA-50815409-1");
		tracker.trackScreen('myFeedWindow' );
	}
    
    
    var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		self.close();
	});	
	
	titleView.add(backImg);
	
	var TitleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: Ti.App.Properties.getString('username'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	titleView.add(TitleText);
	
    backgroundView.getNewFeed();
	return self;
}

//make constructor function the public component interface
module.exports = myFeedWindow;