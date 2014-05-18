//Setup Windows Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function setupWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
    backgroundView.backgroundColor = '#ffffff';
    
    tracker.trackScreen('setupWindow' );
    
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
		{ leftImage:'notification.png', title:'notifytype'},
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
	
	////////////  setup location /////////////////
	var locationsrc = Ti.App.Properties.getString('locationsrc','network');
	var locDefaultIndex = 0;
	if(locationsrc == 'gps'){
		locDefaultIndex = 0;
	}
	else{
		locDefaultIndex = 1;
	}

	function createLocDlg(){
		var locationsrcDialog = Titanium.UI.createOptionDialog({
        selectedIndex: locDefaultIndex,
	    title: L('locationsrc'),
	    options: [L('fromgps'),L('fromnetwork'),L('cancel')]
		});
		
		locationsrcDialog.addEventListener('click', function(e) {
			if(e.index == 0){
				locDefaultIndex = 0;
				Ti.App.Properties.setString('locationsrc','gps');
	            Ti.App.fireEvent('changelocationsrc');
			}
			else if(e.index == 1){
				locDefaultIndex = 1;
				Ti.App.Properties.setString('locationsrc','network');
	            Ti.App.fireEvent('changelocationsrc');
			}
			else{
				
			}
		});
		return 	locationsrcDialog;
	}
	
	


	////////////  setup notify /////////////////
	var notifyType = Ti.App.Properties.getString('notify','all');
	var notyfiDefaultIndex = 0;
	switch(notifyType){
		case 'all':
			notyfiDefaultIndex = 0;
			break;
		case 'vibrate':
			notyfiDefaultIndex = 1;
			break;
		case 'sound':
			notyfiDefaultIndex = 2;
			break;
		case 'none':
			notyfiDefaultIndex = 3;
			break;
		default:
			notyfiDefaultIndex = 0;
			break;
 
	} 

	function createNotDlg(){
		var notifyDialog = Titanium.UI.createOptionDialog({
	        selectedIndex: notyfiDefaultIndex,
		    title: L('notifytype'),
		    options: [L('notifytypeall'),L('notifytypevibrate'),L('notifytypesound'),L('notifytypeno')]
		});
		
		notifyDialog.addEventListener('click', function(e) {
			switch(e.index){
				case 0:
					notyfiDefaultIndex = 0;
					Ti.App.Properties.setString('notify','all');
					break;
				case 1:
					notyfiDefaultIndex = 1;
					Ti.App.Properties.setString('notify','vibrate');
					break;	
				case 2:
					notyfiDefaultIndex = 2;
					Ti.App.Properties.setString('notify','sound');
					break;	
				case 3:
					notyfiDefaultIndex = 3;
					Ti.App.Properties.setString('notify','none');
					break;	
				default:
					notyfiDefaultIndex = 0;
					Ti.App.Properties.setString('notify','all');		
			}
		});	
		return notifyDialog;
	}	

	
	
	function queryselfCallback(result, data){
		if(result == true){
		
            try{
            	Ti.App.Properties.setString('userid',data['id']);
				Ti.App.Properties.setString('token',data['token']);
				Ti.App.Properties.setString('headfile',data['photo']);
	            Ti.App.Properties.setString('useremail',data['email']);
	            Ti.App.Properties.setString('username',data['name']);
	            Ti.App.Properties.setString('userdata',JSON.stringify(data));
	            Ti.App.Properties.setString('school',data['school']);
	            Ti.App.Properties.setString('intro',data['des']);
	            Ti.App.Properties.setString('work',data['job']);
	            Ti.App.Properties.setInt('birthday',data['birthday']);
				Ti.App.Properties.setInt('gender',data['sex']);
				if(data['photos'] != undefined){
					Ti.App.Properties.setList('photos',data['photos']);
				}

			}
			catch(err){
				
			}
            Ti.API.info('user data : '  + JSON.stringify(data));
			forwardView.visible = false;
			var AccountInfoWindow = require('accountInfoWindows');
			new AccountInfoWindow(data).open();
		}
		
	};
	
	memuCommandTableView.addEventListener('click',function(e) {
		switch(e.index){
			case 0:
			    forwardView.visible = true;
			    querymyself(queryselfCallback);
				break;		
			case 1:
				var locDlg = createLocDlg();
			    locDlg.show();
			    break;	
			case 2:
			    var JumpWindow = require('jumpWindows');
				new JumpWindow().open(); 
				break;
			case 3:
			    var notDlg = createNotDlg();
				notDlg.show();
				break;	
			case 4:
				var passWindow = require('changePassWindows');
				new passWindow().open(); 
				break;		
			case 5:
				var aboutWindow = require('aboutWindows');
				new aboutWindow().open(); 
				break;	
			    	
			default:
					
		}
		   

	});
	
	
	
	
    
    backgroundView.add(memuCommandTableView);
	return self;
}

//make constructor function the public component interface
module.exports = setupWindow;