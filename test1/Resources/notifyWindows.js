//notifyWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");



function notifyWindow() {
	//load component dependencies
	var self = createNormalWin(true);
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
	
	var notifyTitleText = Ti.UI.createLabel({
		font:{fontSize:'24sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: L('notify'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(notifyTitleText);
	
	//////////////   middle   table view  //////////////////////
	var notifyDataItems = [];
	
	var notifyTableView = Ti.UI.createTableView({
	    
	    data:notifyDataItems
	});
		
	backgroundView.add(notifyTableView);
	
    function parseNotify(result, notifyData){
    	
    	notifyLoading = false;
    	if(notifyRowstatus == 'loading'){
    		notifyDataItems.pop(notifyDataItems.length-1);
    		notifyRowstatus = 'none';
    	}	
    	for(var i = 0 ; i <= notifyData.length -1; i++){
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
				        borderRadius:15,height: '60dp', width: '60dp',top:'10dp',bottom:'10dp'
					});
					
					if(notifyData[i]['headphoto'] == undefined || notifyData[i]['headphoto'] == ''){
						headPhotoImg.image = 'headphoto.png';
					}
					else{
						headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + notifyData[i]['headphoto'];
					}
					itemView.add(headPhotoImg);
					
					var contentView = Titanium.UI.createView({
						left:'80dp',backgroundColor:'transparent',
						height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
						layout: 'vertical'
					});
					var mdgTitleText = Ti.UI.createLabel({
						font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: notifyData[i]['name'] + L('userreply'),
						color:'#888888',left:'10dp',right:'10dp'
					});
					contentView.add(mdgTitleText);
					
					var contentText = Ti.UI.createLabel({
						font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
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
					eventtime = new Date(notifyData[i]['time']);
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
						font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: timeString,
						color:'#aaaaaa',left:'10dp'
					});
					timeView.add(clockImg);
					timeView.add(timeText);
					contentView.add(timeView);

				  break;
  
			};
			notifyRow.add(itemView);
			notifyRow.add(contentView);
		    notifyDataItems.push(notifyRow);
		    notifyRow.type = 'comment';
		    notifyRow.eventid = notifyData[i]['eventid'];
		    starttime = notifyData[i]['time'];
    	};
    	forwardView.visible = false;
    	notifyTableView.data = notifyDataItems;

	}	
	
    notifyTableView.addEventListener('click', function(e){
    	switch(e.row.type){
				case 'comment':
				  FeedContentWindow = require('feedContentWindows');
				  new FeedContentWindow(e.row.eventid, true).open(); 	
		          break;		
		}		
    });
    
    var notifyRow = Ti.UI.createTableViewRow({
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
	notifyRow.add(itemView);
	
	
    var notifyRowstatus = 'none';
    var notifyLoading = false;
    notifyTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount );
		
		if((e.firstVisibleItem + e.visibleItemCount) == notifyDataItems.length){
			if(notifyLoading == false){
				notifyLoading =  true;
			    
				notifyRowstatus = 'loading';
				notifyDataItems.push(notifyRow);
				notifyTableView.data = notifyDataItems;
				querynotify( starttime, 10, parseNotify);
					
			}    
		}
			
		// use rowNum property on object to get row number
		
	});
	    
    var starttime = 0;
	function requestNotify(){
		forwardView.visible = true;
		currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		querynotify( starttime, 10, parseNotify);
		
	}

	
	requestNotify();
	
	return self;
}

//make constructor function the public component interface
module.exports = notifyWindow;