//usedAppWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function gFeedWindow(id) {
	

	
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
    backgroundView.backgroundColor = '#ffffff';
    
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
		text:'',
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
	titleView.add(TitleText);
	
	TitleText.addEventListener('click',function(e){
		self.close();
	});
	
	var addPostImg = Titanium.UI.createImageView({
		image:'addw.png',
		top: '10dp', right:'15dp', height: '30dp', width: '30dp'
	});
	
	addPostImg.addEventListener('click',function(e){
		showPostDialog(id);
	});	
	
	titleView.add(addPostImg);

    
    forwardView.visible = true;
    
    backgroundView.gid = id; 
    createNormalFeed(backgroundView, 'group');
    backgroundView.getNewFeed();


	return self;
}

//make constructor function the public component interface
module.exports = gFeedWindow;