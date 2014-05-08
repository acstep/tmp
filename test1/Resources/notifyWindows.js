//notifyWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");



function notifyWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
	
	tracker.trackScreen('notifyWindow' );
	
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		self.close();
	});	
	
	var notifyTitleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: L('notify'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(notifyTitleText);
	
	//////////////   middle   table view  //////////////////////
	//var notifyDataItems = [];
	var savedNotifyData = [];
	var notifyTableView = Ti.UI.createTableView({
	    
	    data:[]
	});
		
	backgroundView.add(notifyTableView);
	
    function parseNotify(result, notifyData){
    	
    	forwardView.visible = false;
    	notifyLoading = false;
    	
    	try{
    		notifyTableView.deleteRow(notifyLoadingRow);
    	}	
    	catch(e){}
    	
    	
    	
    	if(result == false){
    		if(notifyTableView.data[0].rowCount != undefined){
    			return;
    		}
    		
    		Ti.API.info('result false. savedNotifyData : ' + JSON.stringify(savedNotifyData));
    		if(savedNotifyData.length == 0){
    			// if savedChatroomData is empty, it means we enter chatroom at first time
    			notifyData = JSON.parse(Ti.App.Properties.getString('savedNotifyData','[]'));
    			Ti.API.info('NotifyData load from file :  ' + JSON.stringify(notifyData));
     		}
     		savedNotifyData = [];
     		
    	}
    	
    	var preEventId = '';
    	for(var i = 0 ; i <= notifyData.length -1; i++){
    		if(preEventId == notifyData[i]['eventid'] && notifyData[i].type == 'comment' && notifyTableView.sections[0].rows.length>7){
    			starttime = notifyData[i]['time'];
		    	continue;
		    }
    		var notifyRow = Ti.UI.createTableViewRow({
		        backgroundSelectedColor:'#3f9ddd',
		        backgroundColor:'#ffffff'
		        
		    });
		    
		    switch(notifyData[i].type){
				case 'comment':
				    
                    var itemView = Titanium.UI.createView({
						backgroundColor:'transparent',
						width:Ti.UI.SIZE ,height: Ti.UI.SIZE,left:'10dp',top:'0dp'
					});
					var headPhotoImg = Titanium.UI.createImageView({
				        borderRadius:5,height: '60dp', width: '60dp',top:'10dp',bottom:'10dp',backgroundImage:'headphoto.png'
					});
					
					
					headPhotoImg.image = getHeadImg(notifyData[i]['senderid']);
			
					itemView.add(headPhotoImg);
					
					var contentView = Titanium.UI.createView({
						left:'80dp',backgroundColor:'transparent',
						height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
						layout: 'vertical'
					});
					var mdgTitleText = Ti.UI.createLabel({
						font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: notifyData[i]['name'] + L('userreply'),
						color:'#888888',left:'10dp',right:'10dp'
					});
					contentView.add(mdgTitleText);
					
					var contentText = Ti.UI.createLabel({
						font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: getStringlimit(notifyData[i]['content'],20,50) ,
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
					var eventtime = new Date(notifyData[i]['time']);
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
						font:{fontSize:'12sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: timeString,
						color:'#aaaaaa',left:'10dp'
					});
					timeView.add(clockImg);
					timeView.add(timeText);
					contentView.add(timeView);
                    notifyRow.type = 'comment';
				  	break;
                case 'systemad':
                    var itemView = Titanium.UI.createView({
						backgroundColor:'transparent',
						width:Ti.UI.SIZE ,height: Ti.UI.SIZE,left:'10dp',top:'0dp'
					});
					var headPhotoImg = Titanium.UI.createImageView({
				        borderRadius:5,height: '60dp', width: '60dp',top:'10dp',bottom:'10dp',backgroundImage:'headphoto.png'
					});
					
					
					headPhotoImg.image = getHeadImg(notifyData[i]['senderid']);
			
					itemView.add(headPhotoImg);
					
					var contentView = Titanium.UI.createView({
						left:'80dp',backgroundColor:'transparent',
						height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
						layout: 'vertical'
					});
					var mdgTitleText = Ti.UI.createLabel({
						font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: notifyData[i]['title'] ,
						color:'#ff0000',left:'10dp',right:'10dp'
					});
					contentView.add(mdgTitleText);
					
					var contentText = Ti.UI.createLabel({
						font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: getStringlimit(notifyData[i]['content'],50,100) ,
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
					var eventtime = new Date(notifyData[i]['time']);
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
						font:{fontSize:'12sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: timeString,
						color:'#aaaaaa',left:'10dp'
					});
					timeView.add(clockImg);
					timeView.add(timeText);
					contentView.add(timeView);
					notifyRow.type = 'systemad';
					notifyRow.url = notifyData[i]['url'];
                    break;
			};
			notifyRow.add(itemView);
			notifyRow.add(contentView);
		    //notifyDataItems.push(notifyRow);
		    savedNotifyData.push(notifyData[i]);
		    notifyRow.eventid = notifyData[i]['eventid'];
		    preEventId = notifyData[i]['eventid'];
		    notifyTableView.appendRow(notifyRow);
		    starttime = notifyData[i]['time'];
    	};
    	
    	Ti.API.info('notify data save:  ' + JSON.stringify(savedNotifyData));
    	Ti.App.Properties.setString('savedNotifyData',JSON.stringify(savedNotifyData));
    	forwardView.visible = false;
    	//notifyTableView.data = notifyDataItems;

	}	
	
    notifyTableView.addEventListener('click', function(e){
    	switch(e.row.type){
				case 'comment':
				    var FeedContentWindow = require('feedContentWindows');
				    new FeedContentWindow(e.row.eventid, true).open(); 	
		            break;	
		        case 'systemad':  
		            var data = {'url':e.row.url};
		          	var SystemADWindow = require('systemADWindows');
				    new SystemADWindow(data).open(); 	
		            break;	
		}		
    });
    
    var notifyLoadingRow ={};
	

    var notifyLoading = false;
    notifyTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount );
		
		if((e.firstVisibleItem + e.visibleItemCount) == notifyTableView.data[0].rowCount){
			if(notifyLoading == false){
				notifyLoading =  true;
				
				notifyLoadingRow = Ti.UI.createTableViewRow({
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
				notifyLoadingRow.add(itemView);
				//notifyDataItems.push(notifyLoadingRow);
				notifyTableView.appendRow(notifyLoadingRow);
				//notifyTableView.data = notifyDataItems;
				querynotify( starttime, 10, parseNotify);
					
			}    
		}
			
		// use rowNum property on object to get row number
		
	});
	    
    var starttime = 0;
	function requestNotify(){
		forwardView.visible = true;
		var currentdate = new Date(); 
		notifyTableView.data = [];
		savedNotifyData = [];
		//notifyDataItems = [];
		starttime = parseInt(currentdate.getTime()/1000);
		querynotify( starttime, 10, parseNotify);
		
	}

	
	requestNotify();
	
	return self;
}

//make constructor function the public component interface
module.exports = notifyWindow;