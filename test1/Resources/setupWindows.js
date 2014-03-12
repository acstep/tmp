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
 
		{ leftImage:'human.png', title:'personalinfo' },
		{ leftImage:'gps.png', title:'locationsrc' },
		{ leftImage:'sortpos.png', title:'jumpandpos' },
		{ leftImage:'passwd.png', title:'changepass'},
		{ leftImage:'info.png', title:'appinfo'},
	]; 
	
	var mainMenuListRow = [];
	for(var i = 0 ; i <= mainMenuList.length -1; i++) {
		var row = Titanium.UI.createTableViewRow({
            showVerticalScrollIndicator:false,
			width:'90%',
			height:'70dp',
	        left:'5%'
            
		});
		
		
		
		var rowImg = Titanium.UI.createImageView({
			image:mainMenuList[i].leftImage,
			backgroundColor:'transparent',left:'5dp',
			height: '30dp', width: '30dp'
		});
		
		var rowText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
			text: L(mainMenuList[i].title),
			backgroundColor:'transparent',
			color:'#777777',
			left:'60dp',
			
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		var arrowImg = Titanium.UI.createImageView({
			image:'next.png',
			backgroundColor:'transparent',right:'1dp',
			height: '20dp', width: '20dp'
		});
		
		row.add(rowImg);
		row.add(rowText);
		row.add(arrowImg);
		mainMenuListRow.push(row);
	}	
	
	var memuCommandTableView = Ti.UI.createTableView({  
	    data:mainMenuListRow,
	    width:'90%',
	    top: '10dp',
	    separatorColor:'#666666'
	});  
	
	memuCommandTableView.addEventListener('click',function(e) {
		switch(e.index){
			case 0:
			    AccountInfoWindow = require('accountinfoWindows');
				new AccountInfoWindow().open();
				break;		
			case 1:
			    locationsrcDialog.show();
			    break;	
			case 2:
			    JumpWindow = require('jumpWindows');
				new JumpWindow().open(); 
				break;
			default:
					
		}
		   

	});
	
	var locationsrc = Ti.App.Properties.getString('locationsrc','network');
	var defaultIndex = 0;
	if(locationsrc == 'gps'){
		defaultIndex = 0;
	}
	else{
		defaultIndex = 1;
	}
	var locationsrcDialog = Titanium.UI.createOptionDialog({
        selectedIndex: defaultIndex,
	    title: L('locationsrc'),
	    options: [L('fromgps'),L('fromnetwork'),L('cancel')],
	});
	
	locationsrcDialog.addEventListener('click', function(e) {
		if(e.index == 0){
			Ti.App.Properties.setString('locationsrc','gps');
            Ti.App.fireEvent('changelocationsrc');
		}
		else if(e.index == 1){
			Ti.App.Properties.setString('locationsrc','network');
            Ti.App.fireEvent('changelocationsrc');
		}
		else{
			
		}
	});	
	
    
    backgroundView.add(memuCommandTableView);
	return self;
}

//make constructor function the public component interface
module.exports = setupWindow;