//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function joinMsgWindow(eventid,stringData) {
	//load component dependencies

	

	
    var winobj = {};
	winobj.createNormalWin = createNormalWin;
	var self = winobj.createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
	    self.close();
	});	
	
	var joinMsgTitleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L(stringData.title),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(joinMsgTitleText);

	
	//////////////   middle   table view  //////////////////////
	var joinMsgDataItems = [];

	var joinMsgTableView = Ti.UI.createTableView({
	    
	    data:joinMsgDataItems
	});
		
	backgroundView.add(joinMsgTableView);
	
    function parseJoinMsg(result, joinMsgData){
    	Ti.API.info(' joinMsgData data : ' + JSON.stringify(joinMsgData));
    	forwardView.visible = false;
    	joinLoading = false;
    	try{
    		joinMsgTableView.deleteRow(LoadingRow);
    	}	
    	catch(e){}
    	if(result == false){
    		
     		
    	}
    	for(var i = 0 ; i < joinMsgData.length ; i++){
    		var joinMsgRow = Ti.UI.createTableViewRow({
		        backgroundSelectedColor:'#3f9ddd',
		        backgroundColor:'#ffffff',
		        ownerid:joinMsgData[i]['ownerid']
		    });
			var itemView = Titanium.UI.createView({
				backgroundColor:'transparent',
				width:Ti.UI.SIZE ,height: Ti.UI.SIZE,left:'10dp',top:'0dp'
			});
			var headPhotoImg = Titanium.UI.createImageView({
		        borderRadius:15,height: '60dp', width: '60dp',top:'10dp',bottom:'10dp',backgroundImage:'headphoto.png'
			});
			
			headPhotoImg.image = getHeadImg(joinMsgData[i]['ownerid']);
            
		
			itemView.add(headPhotoImg);
			
			var contentView = Titanium.UI.createView({
				left:'80dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
				layout: 'vertical'
			});
			

			var nameText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: joinMsgData[i]['name'],
				color:'#888888',left:'10dp',right:'10dp'
			});
			contentView.add(nameText);
			
			var timeView = Titanium.UI.createView({
				left:'10dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,
				layout: 'horizontal'
			});
			var clockImg = Titanium.UI.createImageView({
		        height: '10dp', width: '10dp',image:'sorttime.png'
			});
			var eventtime = new Date(joinMsgData[i]['time']);
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
				color:'#aaaaaa',left:'10dp',right:'10dp'
			});
			timeView.add(clockImg);
			timeView.add(timeText);
			contentView.add(timeView);
			
			var contentText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: joinMsgData[i]['content'],
				color:'#333333',left:'10dp',right:'10dp'
			});
			contentView.add(contentText);

			joinMsgRow.add(itemView);
			joinMsgRow.add(contentView);
		   
		    joinMsgRow.ownerid = joinMsgData[i]['ownerid'];
		    Ti.API.info('oinMsgRow.ownerid : ' + joinMsgRow.ownerid);
		    
		    joinMsgDataItems.push(joinMsgRow);
		    starttime = joinMsgData[i]['time'];

    	};
    	
    	
    	joinMsgTableView.data = joinMsgDataItems;

    	
		
	}	
	
   
    var LoadingRow = Ti.UI.createTableViewRow({
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
	LoadingRow.add(itemView);
	
	

    var joinLoading = false;
    joinMsgTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount );
		
		if((e.firstVisibleItem + e.visibleItemCount) == joinMsgDataItems.length){
			if(joinLoading == false){
				joinLoading =  true;
			    

				joinMsgTableView.appendRow(LoadingRow);
				queryjoinlist(eventid, starttime, parseJoinMsg);
					
			}    
		}

		
	});
	
	joinMsgTableView.addEventListener('click', function(e){
		openPeopleInfoWin(e.rowData.ownerid);
	    //var myid = Ti.App.Properties.getString('userid','');
	    //Ti.API.info('myid: ' + myid);
	    //Ti.API.info('e.rowData.ownerid : ' + e.rowData.ownerid);
		//if(myid == e.rowData.ownerid){
		//	return;
		//}
	    //Ti.API.info('postView click.');
        //TalkWindow = require('talkWindows');
        //tmpRoomData = {
        //    'roomid':'',
        //    'memberid':[],
        //    'lasttime':parseInt(new Date().getTime()/1000),
        //    'host':'',
        //    'lastmsg':'',
        //    'memdata':[]  
        //};
        //new TalkWindow(Ti.App.Properties.getString('userid',''), e.rowData.ownerid,tmpRoomData).open(); 
	    // the example above would print your name
	});
	    
    var starttime = 0;
	function requestJoinList(){
		forwardView.visible = true;
		joinMsgDataItems = [];
		currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		queryjoinlist(eventid, starttime, parseJoinMsg);
		
	}
	
	
	requestJoinList();

	
	return self;
}

//make constructor function the public component interface
module.exports = joinMsgWindow;