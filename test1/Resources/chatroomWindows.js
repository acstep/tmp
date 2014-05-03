//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function chatroomWindow() {
	//load component dependencies
	var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
	
    var chatroomLock = true;
	
    var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
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
		font:{fontSize:'20sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L('chatroom'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(chatroomTitleText);

	
	//////////////   middle   table view  //////////////////////
	//var chatroomDataItems = [];
	var savedChatroomData = [];
	var chatroomTableView = Ti.UI.createTableView({
	    
	    data:[]
	});
		
	backgroundView.add(chatroomTableView);
	
    function parseChatroom(result, chatroomData){
    	Ti.API.info(' chatroom data : ' + JSON.stringify(chatroomData));
    	forwardView.visible = false;
    	chatroomLoading = false;
    	try{
    		chatroomTableView.deleteRow(chatroomLoadingRow);
    	}	
    	catch(e){}
    	if(result == false){
    		
    		if(chatroomTableView.data[0].rowCount != undefined){
    			return;
    		}
    		
    		Ti.API.info('result false. savedChatroomData : ' + JSON.stringify(savedChatroomData));
    		if(savedChatroomData.length == 0){
    			// if savedChatroomData is empty, it means we enter chatroom at first time
    			chatroomData = JSON.parse(Ti.App.Properties.getString('savedChatroomData','[]'));
    			Ti.API.info('roomdata load from file :  ' + JSON.stringify(chatroomData));
     		}
     		savedChatroomData = [];
     		
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
		        borderRadius:5,height: '60dp', width: '60dp',top:'10dp',bottom:'10dp',backgroundImage:'headphoto.png'
			});
			
			var toidIndex = 0;
			var idData = {};
			if(chatroomData[i]['memberid'].length > 2){
				toidIndex = 2;
				headPhotoImg.image = 'group.png';
				
			}
			else{
				var userid = Ti.App.Properties.getString('userid','');
				
				if(chatroomData[i]['memdata'][0]['id'] == userid){
					toidIndex = 1;
					idData = chatroomData[i]['memdata'][1];
					
					headPhotoImg.image = getHeadImg(idData['id']);

				}
				else{
					toidIndex = 0;
					idData = chatroomData[i]['memdata'][0];
	
					headPhotoImg.image = getHeadImg(idData['id']);

				}
			}
			
			
			itemView.add(headPhotoImg);
			
			var contentView = Titanium.UI.createView({
				left:'80dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
				layout: 'vertical'
			});
			
			var leftstr = '';
			if(chatroomData[i]['memberid'].length == 1){
				leftstr = L('hasleft');
			}
			var nameText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: idData['name'] + leftstr,
				color:'#888888',left:'10dp',right:'10dp'
			});
			contentView.add(nameText);
			
			var lastmsg = '';
			if(chatroomData[i]['lastmsg']['type'] == 'string'){
				lastmsg = chatroomData[i]['lastmsg']['string'];
			}
			var contentText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
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
			var eventtime = new Date(chatroomData[i]['lasttime']);
			var currenttime =  new Date().getTime()/1000;
			var difftime = currenttime - eventtime;
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
				borderRadius:3,top:'20dp',right:'20dp',visible:false
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
		    //chatroomDataItems.push(chatroomRow);
		    chatroomTableView.appendRow(chatroomRow);
		    starttime = chatroomData[i]['lasttime'];
		    savedChatroomData.push(chatroomData[i]);
    	};
    	Ti.API.info('roomdata save:  ' + JSON.stringify(savedChatroomData));
    	Ti.App.Properties.setString('savedChatroomData',JSON.stringify(savedChatroomData));
    	//chatroomTableView.data = chatroomDataItems;
	    chatroomLock = false;
    	
		
	}	
	
	var chatroomDialog = Titanium.UI.createOptionDialog({
	    //options
	    options: [L('enterchatroom'),L('deletechatroom'), L('cancel')],
	    //index of cancel button
	});
	
	function quitroomCB(result,data){
		if(result == true){
			requestChatroom();
		}
		else{
			showAlert('Error !', data); 
		}
		
	}
	
	chatroomDialog.addEventListener('click', function(e) {
		Ti.API.info('postView click.');
		switch(e.index){
			case 0:
			    var talkWindow = require('talkWindows');
	    		new talkWindow(Ti.App.Properties.getString('userid',''), '', chatroomDialog.roomdata).open(); 	 
				break;
			case 1:
			    Ti.API.info(' delete room :  ' + chatroomDialog.roomdata['roomid']);
			    quitchatroom(chatroomDialog.roomdata['roomid'],quitroomCB);
				break;	
			default:
		}
        
	});
	
    chatroomTableView.addEventListener('click', function(e){

		e.row.newMsgView.visible = false;
		e.row.newMsgText.text = 0;
		var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
		if(typeof(roominfo[e.row.roomid]) != 'undefined'){
		    delete roominfo[e.row.roomid] ;
			Ti.App.Properties.setString('roominfo',JSON.stringify(roominfo));
			Ti.API.info(' roominfo delete result ' + JSON.stringify(roominfo));
		}
		var talkWindow = require('talkWindows');
	    new talkWindow(Ti.App.Properties.getString('userid',''), '', e.row.roomdata).open(); 

    });
    
    chatroomTableView.addEventListener('longclick', function(e){

		e.row.newMsgView.visible = false;
		e.row.newMsgText.text = 0;
		var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
		if(typeof(roominfo[e.row.roomid]) != 'undefined'){
		    delete roominfo[e.row.roomid] ;
			Ti.App.Properties.setString('roominfo',JSON.stringify(roominfo));
			Ti.API.info(' roominfo delete result ' + JSON.stringify(roominfo));
		}
        chatroomDialog.roomdata = e.row.roomdata;
        chatroomDialog.show(); 
	    	
	
    });
    
    
    var chatroomLoadingRow = {};

    var chatroomLoading = false;
    chatroomTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount );
		
		if((e.firstVisibleItem + e.visibleItemCount) == chatroomTableView.data[0].rowCount){
			if(chatroomLoading == false){
				chatroomLoading =  true;
			    
                chatroomLoadingRow = Ti.UI.createTableViewRow({
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

				chatroomTableView.appendRow(chatroomLoadingRow);
				querychatroom( starttime, 10, false, parseChatroom);
					
			}    
		}
			
		// use rowNum property on object to get row number
		
	});
	    
    var starttime = 0;
	function requestChatroom(){
		forwardView.visible = true;
		//chatroomDataItems = [];
		chatroomTableView.data = [];
		savedChatroomData = [];
		var currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		querychatroom( starttime, 10, false,parseChatroom);
		
	}
	

	///////////////  receive message  /////////////
	
	var getupdatechatroom = function(e) {
		var talkingRoomID = Ti.App.Properties.getString('TalkRoomID','');
	
		if(talkingRoomID == e.roomid){
			return;
		}

		if(chatroomLock == false){
			var getRoom = false;
			var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
			//Ti.API.info(' chatroomDataItems.length :' + chatroomDataItems.length);
			Ti.API.info(' e.roomid :' + e.roomid);
			
			for(var i=0 ; i<chatroomTableView.data[0].rowCount ; i++){
				
				if(e.roomid == chatroomTableView.data[0].rows[i].roomid){
					getRoom = true;
					//Ti.API.info(' chatroomDataItems[i].roomid :'+ i+ ' : ' + chatroomDataItems[i].roomid);
					chatroomTableView.data[0].rows[i].newMsgView.visible = true;
					chatroomTableView.data[0].rows[i].newMsgText.text = roominfo[e.roomid]['number'];
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

	
	requestChatroom();

	
	return self;
}

//make constructor function the public component interface
module.exports = chatroomWindow;