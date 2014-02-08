//selsAppWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");
Ti.include("salesview.js");

function selsAppWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
    createNormalFeed(backgroundView, 1003);
    
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
		text:L('sale'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
	titleView.add(TitleText);
	
	TitleText.addEventListener('click',function(e){
		self.close();
	});
	
    backgroundView.getNewFeed();
	return self;
}

//make constructor function the public component interface
module.exports = selsAppWindow;