//usedAppWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function baseAppWindow(data) {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
    createNormalFeed(backgroundView, data.category);
    
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
		text:L(data.title),
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
		switch(data.category){
			case 1001:
			   var tmpdata = {
			    	'title': 'club',
			    	'titlehinttext':'activitytitle',
			    	'grouphinttext':'groupname',
			    	'deshinttext':'addactivitycontent',
			    	'category':1001
			    };
			    var Template1PostWindow = require('template1PostWindows');
				new Template1PostWindow(tmpdata).open(); 
				break;
			case 1003:
			    var tmpdata = {
			    	'title':'sale',
			    	'hinttext':'addsalescontent',
			    	'category':1003
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(tmpdata).open(); 
				break;	
			case 1002:
			    var tmpdata = {
			    	'title':'needhelp',
			    	'hinttext':'addhelpcontent',
			    	'category':1002
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(tmpdata).open(); 
				break;	
			case 1006:
			    var tmpdata = {
			    	'title': 'dating',
			    	'titlehinttext':'purpose',
			    	'placehinttext':'preferredplace',
			    	'deshinttext':'addsocialcontent',
			    	'category':1006
			    };
			    var Template1PostWindow = require('template2PostWindows');
				new Template1PostWindow(tmpdata).open(); 
				break;		
			case 1000:
			    var tmpdata = {
			    	'title': 'news',
			    	'hinttext':'addnewscontent',
			    	'category':1000
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(tmpdata).open(); 
				break;	
			case 1004:
			    var tmpdata = {
			    	'title': 'used',
			    	'hinttext':'addusedcontent',
			    	'category':1004
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(tmpdata).open(); 
				break;
			case 1005:
			    var tmpdata = {
			    	'title': 'teambuying',
			    	'hinttext':'addteambuycontent',
			    	'category':1005
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(tmpdata).open(); 
				break;	
			case 1007:
			    var tmpdata = {
			    	'title': 'gossip',
			    	'hinttext':'addgossipcontent',
			    	'category':1007
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(tmpdata).open(); 
				break;								
			default:
				
		}
	});	
	
	titleView.add(addPostImg);
	
	
    backgroundView.getNewFeed();
	return self;
}

//make constructor function the public component interface
module.exports = baseAppWindow;