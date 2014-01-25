//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function chatroomWindow() {
	//load component dependencies
	var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
	
    var chatroomLock = true;
	
	var self = Ti.UI.createWindow({
		backgroundColor:'#dddddd',
		navBarHidden:true,
       
 	});
 	

 	var backgroundView = Ti.UI.createView({
		width:'100%',
		layout:'vertical',
		top: 0,
		left: 0,
		backgroundColor:'#dddddd',
	});
	
	var forwardView = Ti.UI.createView({
		width:'100%',
		height:'100%',
		visible:false,
		backgroundColor:'#333333',
		opacity:0.5,
		top: 0,
		left: 0
	});
	
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:14, fontWeight:'bold'},
		  style:Titanium.UI.ActivityIndicatorStyle.BIG,
	
	});
	
	forwardView.add(loginIndicator);
	loginIndicator.show();
	
	////  title  //////
	
	var titleView = Ti.UI.createView({
		backgroundColor:'#3498db',
		width:'100%',
		height:'50dp',
		top:'0dp'

	});
	
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		Ti.App.removeEventListener('updatechatroom', getupdatechatroom);
	    Ti.API.info('remove listener');
	    Ti.App.fireEvent('closechatroom');
	    self.close();
	});	
	
	var chatroomTitleText = Ti.UI.createLabel({
		font:{fontSize:'24sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L('chatroom'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(chatroomTitleText);
	backgroundView.add(titleView);
	
	//////////////   middle   table view  //////////////////////
	var chatroomDataItems = [];
	
	var chatroomTableView = Ti.UI.createTableView({
	    
	    data:chatroomDataItems
	});
		
	backgroundView.add(chatroomTableView);
	
    function parseChatroom(result, chatroomData){
    	forwardView.visible = false;
    	chatroomLoading = false;
    	if(chatroomRowstatus == 'loading'){
    		chatroomTableView.deleteRow(chatroomLoadingRow);
    		chatroomRowstatus = 'none';
    	}	
    	for(var i = 0 ; i < chatroomData.length ; i++){
    		var chatroomRow = Ti.UI.createTableViewRow({
		        backgroundSelectedColor:'#3f9ddd',
		        backgroundColor:'#ffffff'
		        
		    });
			var itemView = Titanium.UI.createView({
				backgroundColor:'transparent',
				width:Ti.UI.SIZE ,height: Ti.UI.SIZE,left:'10dp',top:'0dp'
			});
			var headPhotoImg = Titanium.UI.createImageView({
		        borderRadius:15,height: '60dp', width: '60dp',top:'10dp',bottom:'10dp'
			});
			
			var toidIndex = 0;
			var idData = {'name':chatroomData[i]['memberid'][0]['name']+chatroomData[i]['memberid'][1]['name']+'...'};
			if(chatroomData[i]['memberid'].length > 2){
				toidIndex = 2;
				headPhotoImg.image = 'group.png';
				
			}
			else{
				userid = Ti.App.Properties.getString('userid','');
				
				if(chatroomData[i]['memberid'][0] == userid){
					toidIndex = 1;
					idData = chatroomData[i]['memdata'][1];
					if(typeof(idData['photo']) == 'undefined' || idData['photo'] == ''){
						headPhotoImg.image = 'headphoto.png';
					}
					else{
						headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + idData['photo'];
					}
				}
				else{
					toidIndex = 0;
					idData = chatroomData[i]['memdata'][0];
					if(typeof(idData['photo']) == 'undefined' || idData['photo'] == ''){
						headPhotoImg.image = 'headphoto.png';
					}
					else{
						headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + idData['photo'];
					}
				}
				
				
			}
			
			
			itemView.add(headPhotoImg);
			
			var contentView = Titanium.UI.createView({
				left:'80dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
				layout: 'vertical'
			});
			
			var nameText = Ti.UI.createLabel({
				font:{fontSize:'16sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: idData['name'],
				color:'#888888',left:'10dp',right:'10dp'
			});
			contentView.add(nameText);
			
			lastmsg = '';
			if(chatroomData[i]['lastmsg']['type'] == 'string'){
				lastmsg = chatroomData[i]['lastmsg']['string'];
			}
			var contentText = Ti.UI.createLabel({
				font:{fontSize:'16sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: getStringlimit(lastmsg ,20,50),
				color:'#333333',left:'10dp',right:'10dp'
			});
			contentView.add(contentText);
			
			var timeView = Titanium.UI.createView({
				left:'10dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,
				layout: 'horizontal'
			});
			var clockImg = Titanium.UI.createImageView({
		        height: '10dp', width: '10dp',image:'sorttime.png'
			});
			eventtime = new Date(chatroomData[i]['lasttime']);
			currenttime =  new Date().getTime()/1000;
			difftime = currenttime - eventtime;
			var timeString = '';
			if(difftime < 60){
				timeString = parseInt(difftime) + ' ' + L('beforesec');
			}
			else if(difftime >=60 &&  difftime < 3600){
				timeString = parseInt(difftime/60) + ' ' + L('beforemin');
			}
			else if(difftime >=3600 &&  difftime < 86400){
				timeString = parseInt(difftime/3600) + ' ' + L('beforehour');
			}
			else{
				timeString = parseInt(difftime/86400) + ' ' + L('beforeday');
			}
			var timeText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: timeString,
				color:'#aaaaaa',left:'10dp'
			});
			timeView.add(clockImg);
			timeView.add(timeText);
			contentView.add(timeView);
			
			var newMsgView = Titanium.UI.createView({
				backgroundColor:'#e74c3c',
				height: Ti.UI.SIZE,width: Ti.UI.SIZE,
				borderRadius:10,top:'20dp',right:'20dp',visible:false
			});
		    var newMsgText = Ti.UI.createLabel({
				font:{fontSize:'16sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: '0',
				color:'#ffffff',left:'5dp',top:'2dp',right:'5dp',bottom:'2dp',
				
			});
			newMsgView.add(newMsgText);
			var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
			Ti.API.info(' roominfo' + Ti.App.Properties.getString('roominfo','{}'));
			if(typeof(roominfo[chatroomData[i]['roomid']]) != 'undefined'){
				Ti.API.info(' roominfo exist' + JSON.stringify(roominfo[chatroomData[i]['roomid']] ));
				newMsgView.visible = true;
				newMsgText.text = roominfo[chatroomData[i]['roomid']]['number'];
			}
			
			chatroomRow.add(itemView);
			chatroomRow.add(contentView);
			chatroomRow.add(newMsgView);
		    
		    chatroomRow.roomid = chatroomData[i]['roomid'];
		    Ti.API.info(' chatroomRow.roomid ' +i + ':' + chatroomData[i]['roomid']);
		    chatroomRow.roomdata = chatroomData[i];
		    chatroomRow.newMsgView = newMsgView;
		    chatroomRow.newMsgText = newMsgText;
		    chatroomDataItems.push(chatroomRow);
		    starttime = chatroomData[i]['lasttime'];
    	};
    	chatroomTableView.data = chatroomDataItems;
	    chatroomLock = false;
    	
		//var alertCreateAccountDlg = Titanium.UI.createAlertDialog({
		//		title:'Error !',
		//		message:JSON.stringify(notifydData)
		//	});
		//	alertCreateAccountDlg.show();
	}	
	
    chatroomTableView.addEventListener('click', function(e){

		e.row.newMsgView.visible = false;
		e.row.newMsgText.text = 0;
		var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
		if(typeof(roominfo[e.row.roomid]) != 'undefined'){
		    delete roominfo[e.row.roomid] ;
			Ti.App.Properties.setString('roominfo',JSON.stringify(roominfo));
			Ti.API.info(' roominfo delete result ' + JSON.stringify(roominfo));
		}

	    talkWindow = require('talkWindows');
	    new talkWindow(Ti.App.Properties.getString('userid',''), '', e.row.roomdata).open(); 	
	
    });
    
    var chatroomLoadingRow = Ti.UI.createTableViewRow({
        backgroundSelectedColor:'#3f9ddd',
        backgroundColor:'#ffffff'
        
    });
    var itemView = Titanium.UI.createView({
		backgroundColor:'transparent',
		width:Ti.UI.SIZE ,height: Ti.UI.SIZE,width: Ti.UI.SIZE,top:'10dp',bottom:'10dp'
	});
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:18, fontWeight:'bold'},
		  style:Titanium.UI.ActivityIndicatorStyle.DARK,
		  message: L('loading')
	});

	itemView.add(loginIndicator);
	loginIndicator.show();
	chatroomLoadingRow.add(itemView);
	
	
    var chatroomRowstatus = 'none';
    var chatroomLoading = false;
    chatroomTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount );
		
		if((e.firstVisibleItem + e.visibleItemCount) == chatroomDataItems.length){
			if(chatroomLoading == false){
				chatroomLoading =  true;
			    
				chatroomRowstatus = 'loading';
				chatroomTableView.appendRow(chatroomLoadingRow);
				querychatroom( starttime, 10, false, parseChatroom);
					
			}    
		}
			
		// use rowNum property on object to get row number
		
	});
	    
    var starttime = 0;
	function requestChatroom(){
		forwardView.visible = true;
		chatroomDataItems = [];
		currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		querychatroom( starttime, 10, false,parseChatroom);
		
	}
	

	///////////////  receive message  /////////////
	
	var getupdatechatroom = function(e) {
		talkingRoomID = Ti.App.Properties.getString('TalkRoomID','');
	
		if(talkingRoomID == e.roomid){
			return;
		}

		if(chatroomLock == false){
			var getRoom = false;
			var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
			Ti.API.info(' chatroomDataItems.length :' + chatroomDataItems.length);
			Ti.API.info(' e.roomid :' + e.roomid);
			
			for(var i=0 ; i<chatroomDataItems.length ; i++){
				
				if(e.roomid == chatroomDataItems[i].roomid){
					getRoom = true;
					Ti.API.info(' chatroomDataItems[i].roomid :'+ i+ ' : ' + chatroomDataItems[i].roomid);
					chatroomDataItems[i].newMsgView.visible = true;
					chatroomDataItems[i].newMsgText.text = roominfo[e.roomid]['number'];
				}
			}
			if(getRoom == false){
				requestChatroom();
			}
		}
	};
	
	
	Ti.App.addEventListener('updatechatroom', getupdatechatroom);
	
	self.addEventListener('android:back', function(e) {
	    Ti.App.removeEventListener('updatechatroom', getupdatechatroom);
	    Ti.API.info('remove listener');
	    Ti.App.fireEvent('closechatroom');
	    self.close();
	});

	self.add(backgroundView);
	self.add(forwardView);
	
	requestChatroom();
	
	
	
	return self;
}

//make constructor function the public component interface
module.exports = chatroomWindow;