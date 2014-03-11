//Setup Windows Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");
Ti.include("activityview.js");

function setupWindow() {
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
		text:L('setup'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
	TitleText.addEventListener('click',function(e){
		self.close();
	});
	
	titleView.add(TitleText);
	
    //////////////  setup menu /////////////////////////////
    var mainMenuList = [
 
		{ leftImage:'setupm.png', title:'setup' },
		{ leftImage:'jumpm.png', title:'jump' },
		{ leftImage:'logoutm.png', title:'logout'},
	]; 
	
	var mainMenuListRow = [];
	for(var i = 0 ; i <= mainMenuList.length -1; i++) {
		var row = Titanium.UI.createTableViewRow({
            showVerticalScrollIndicator:false,
			backgroundColor:'transparent',
			width:'90%',
			height:'50dp',
	        left:'5%',
            layout: 'horizontal'
		});
		
		
		
		var groupImg = Titanium.UI.createImageView({
			image:mainMenuList[i].leftImage,
			backgroundColor:'transparent',left:'5dp',
			top: '10dp',  height: '30dp', width: '30dp'
		});
		
		var groupText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
			text: L(mainMenuList[i].title),
			backgroundColor:'transparent',
			color:'#777777',
			left:'20dp',
			top: '13dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		
		row.add(groupImg);
		row.add(groupText);
		mainMenuListRow.push(row);
	}	
	
	var memuCommandTableView = Ti.UI.createTableView({  
	    data:mainMenuListRow,
	    width:'90%',
	    top: '10dp'
	});  
	
	memuCommandTableView.addEventListener('click',function(e) {
		switch(e.index){
			case 0:
				SetupWindow = require('setupWindows');
				new SetupWindow().open(); 
				switchBackgroundView();
			break;		
			case 1:
			    // set location 
				JumpWindow = require('jumpWindows');
				new JumpWindow().open(); 
				switchBackgroundView();
			    break;	
			case 2:
			    //logout
			    Ti.App.Properties.setString('userid','');
				Ti.App.Properties.setString('token','');
				Ti.App.Properties.setString('useremail','');
				Ti.App.Properties.setString('locklocation','false');
				break;
			default:
					
		}
		   

	});


	return self;
}

//make constructor function the public component interface
module.exports = setupWindow;