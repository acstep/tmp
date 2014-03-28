//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function nearPeopleWindow() {
	//load component dependencies
	
    var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	var currentdate = new Date(); 
	
	var reqData = {
		'geo':[Ti.App.Properties.getDouble('longitude'),Ti.App.Properties.getDouble('latitude')],
		'distance': Ti.App.Properties.getInt('distance',10),
		'limitcount':parseInt(Ti.App.Properties.getInt('limitcount',5)),
		'nextstarttime':parseInt(currentdate.getTime()/1000)
	};
	
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
	    self.close();
	});	
	
	var nearbyTitleText = Ti.UI.createLabel({
		font:{fontSize:'24sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L('nearppl'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(nearbyTitleText);

	
	//////////////   middle   table view  //////////////////////
	var nearbyItems = [];

	var nearbyTableView = Ti.UI.createTableView({
	    
	    data:nearbyItems
	});
		
	backgroundView.add(nearbyTableView);
	
    function parseNearbyMsg(result, nearbyData){
    	Ti.API.info(' nearbyData data : ' + JSON.stringify(nearbyData));
    	forwardView.visible = false;
    	dataLoading = false;
    	if(result == false){
    		return;
    	}
    	try{
    		nearbyTableView.deleteRow(LoadingRow);
    	}	
    	catch(e){}
    	if(result == false){
    		
     		
    	}
    	for(var i = 0 ; i < nearbyData.length ; i++){
    		var nearbyRow = Ti.UI.createTableViewRow({
		        backgroundSelectedColor:'#3f9ddd',
		        backgroundColor:'#ffffff',
		        //ownerid:MsgData[i]['ownerid']
		    });
			var itemView = Titanium.UI.createView({
				backgroundColor:'transparent',
				width:Ti.UI.SIZE ,height: Ti.UI.SIZE,left:'10dp',top:'0dp'
			});
			var headPhotoImg = Titanium.UI.createImageView({
		        borderRadius:15,height: '70dp', width: '70dp',top:'10dp',bottom:'10dp',backgroundImage:'headphoto.png'
			});
			
			headPhotoImg.image = getHeadImg(nearbyData[i]['ownerid']);
            
		
			itemView.add(headPhotoImg);
			
			var contentView = Titanium.UI.createView({
				left:'80dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
				layout: 'vertical'
			});
			
            var topView = Titanium.UI.createView({
				left:'10dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,
			});
			  
			var nameText = Ti.UI.createLabel({
				font:{fontSize:'16sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: nearbyData[i]['name'],
				color:'#333333',left:'0dp'
			});
			topView.add(nameText);
			
			///////////////distance ///////////////
			var distance = nearbyData[i]['distance'] ;
			var distanceStr = '';
			nearbyRow.distance = distance;
			if(distance < 1){
				distance =  parseInt(distance * 1000);
				distanceStr = '   '+distance+ ' '+L('m')+ '   ';
			}
			else{
				distance =  parseInt(distance);
				distanceStr = '   '+distance+ ' '+ L('km')+ '   ';
			} 
			var distanceText = Ti.UI.createLabel({
				font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
				text: distanceStr,
				color:'#ffffff',
				right:'10dp',
				backgroundColor:'#f1c40f',
				borderRadius:10,
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
	        topView.add(distanceText);
	
			
			var timeView = Titanium.UI.createView({
				left:'10dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,width: Ti.UI.SIZE,
				layout: 'horizontal'
			});
			var clockImg = Titanium.UI.createImageView({
		        height: '10dp', width: '10dp',image:'sorttime.png'
			});
			eventtime = new Date(nearbyData[i]['time']);
			currenttime =  new Date().getTime()/1000;
			difftime = currenttime - eventtime;
			nearbyRow.difftime = difftime;
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
				font:{fontSize:'10sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: timeString,
				color:'#aaaaaa',left:'10dp',right:'10dp'
			});
			timeView.add(clockImg);
			timeView.add(timeText);
	
			contentView.add(topView);
			contentView.add(timeView);
			
			////////////////// gender /////////////////////
			var genderView = Titanium.UI.createView({
				left:'10dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,width: Ti.UI.SIZE,top:'5dp',
				layout: 'horizontal',borderRadius:10
			});
			
			var gerder =  nearbyData[i]['sex'];
			var genderImg = Titanium.UI.createImageView({
		        height: '15dp', width: '15dp',left:'10dp'
			});
			if(nearbyData[i]['sex'] == 1){
				genderImg.image = 'man.png';
				genderView.backgroundColor = '#3498db';
			}
			if(nearbyData[i]['sex'] == 2){
				genderImg.image = 'girl.png';
				genderView.backgroundColor = '#FF80EE';
			}
			genderView.add(genderImg);
			
			var yearString = ' ';
			if(nearbyData[i]['birthday'] != undefined){
				
				currenttime =  new Date() ;
				yearString =  new Date().getFullYear() - new Date(nearbyData[i]['birthday']*1000).getFullYear();
				
			}
			var yearText = Ti.UI.createLabel({
				font:{fontSize:'10sp',fontFamily:'Marker Felt',fontWeight:'bold'},
				text: yearString,
				color:'#ffffff',left:'10dp',right:'10dp'
			});
			genderView.add(yearText);
			contentView.add(genderView);
 
            if(nearbyData[i]['des'] != undefined && nearbyData[i]['des'] != ''){
            	var desText = Ti.UI.createLabel({
					font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
					text: getStringlimit(nearbyData[i]['des'],50,100),
					color:'#333333',left:'10dp',top:'5dp'
				});	
				contentView.add(desText);	
            }
            	

			nearbyRow.add(itemView);
			nearbyRow.add(contentView);
		   
		    nearbyRow.ownerid = nearbyData[i]['ownerid'];
		    Ti.API.info('oinMsgRow.ownerid : ' + nearbyRow.ownerid);
		    
		    nearbyItems.push(nearbyRow);
		    starttime = nearbyData[i]['time'];

    	};
    	
    	nearbyTableView.data = nearbyItems;
	}	
	
	nearbyTableView.addEventListener('click', function(e){
		openPeopleInfoWin(e.row.ownerid);
		//var myid = Ti.App.Properties.getString('userid','');
		//Ti.API.info('e.source.ownerid : ' + e.row.ownerid);
		//Ti.API.info('myid : ' + myid);
		//if(myid == e.row.ownerid){
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
        //new TalkWindow(Ti.App.Properties.getString('userid',''), e.row.ownerid,tmpRoomData).open(); 	
    });
   
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
	
	

    var dataLoading = false;
    nearbyTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount );
		
		if((e.firstVisibleItem + e.visibleItemCount) == nearbyItems.length){
			if(dataLoading == false){
				dataLoading =  true;
			    

				nearbyTableView.appendRow(LoadingRow);
				reqData.nextstarttime = starttime;
				var datastring = JSON.stringify(reqData);
				querypplnear(datastring, parseNearbyMsg);
					
			}    
		}

		
	});
	
	nearbyTableView.addEventListener('click', function(e){
	    
	    // the example above would print your name
	});
	    
    var starttime = 0;
	function requestNearbyList(){
		forwardView.visible = true;
		nearbyItems = [];
		currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		reqData.nextstarttime = starttime;
		var datastring = JSON.stringify(reqData);
		querypplnear(datastring, parseNearbyMsg);
	}
	
	
	requestNearbyList();

	
	return self;
}

//make constructor function the public component interface
module.exports = nearPeopleWindow;