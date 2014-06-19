//usedAppWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function aboutWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;

    if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
	
	}
	else{
		var GA = require('analytics.google');
		var tracker = GA.getTracker("UA-50815409-1");
		tracker.trackScreen('aboutWindow');
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
		text:L('swinfo'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
	titleView.add(TitleText);
	
	var infoText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue'},
		text:'Version : Beta   ' +  Titanium.App.version,
		color:'#333333',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		top:'100dp'
	});
	
	
	
	TitleText.addEventListener('click',function(e){
		self.close();
	});
	
    backgroundView.add(infoText);
	

	return self;
}

//make constructor function the public component interface
module.exports = aboutWindow;