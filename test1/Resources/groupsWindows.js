//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function groupsWindow() {
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
	
	var windowTitleText = Ti.UI.createLabel({
		font:{fontSize:'24sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L('neargroups'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(windowTitleText);

	
	//////////////   middle   table view  //////////////////////
	var listItems = [];
    
	var tableListView = Ti.UI.createTableView({
	    
	    data:[]
	});

		
	backgroundView.add(tableListView);
	
    function parseListMsg(result, listData){
    	Ti.API.info(' listData data : ' + JSON.stringify(listData));
    	forwardView.visible = false;
    	dataLoading = false;
    	if(result == false){
    		return;
    	}
    	try{
    		tableListView.deleteRow(LoadingRow);
    	}	
    	catch(e){}
    	if(result == false){
    		
     		
    	}
    	for(var i = 0 ; i < listData.length ; i++){
    		var listRow = Ti.UI.createTableViewRow({
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
			
			headPhotoImg.image = getHeadImg(listData[i]['gid']);
            
		
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
				text: listData[i]['name'],
				color:'#333333',left:'0dp'
			});
			topView.add(nameText);
			
			///////////////distance ///////////////
			var distance = listData[i]['distance'] ;
			var distanceStr = '';
			listRow.distance = distance;
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
			var eventtime = new Date(listData[i]['lastupdate']);
			var currenttime =  new Date().getTime()/1000;
			var difftime = currenttime - eventtime;
			listRow.difftime = difftime;
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
			
			 
            if(listData[i]['des'] != undefined && listData[i]['des'] != ''){
            	var desText = Ti.UI.createLabel({
					font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
					text: getStringlimit(listData[i]['des'],50,100),
					color:'#333333',left:'10dp',top:'5dp',right:'10dp'
				});	
				contentView.add(desText);	
            }
            	

			listRow.add(itemView);
			listRow.add(contentView);
		   
		    listRow.ownerid = listData[i]['gid'];
		    Ti.API.info('gid : ' + listRow.gid);
		    
		    listItems.push(listRow);
		    tableListView.appendRow(listRow);
		    starttime = listData[i]['lastupdate'];

    	};
    	
    	//tableListView.data = listItems;
	}	
	
	tableListView.addEventListener('click', function(e){
		openPeopleInfoWin(e.row.ownerid);
		
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
    tableListView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount + ', ' + tableListView.data[0].rowCount);
		
		if((e.firstVisibleItem + e.visibleItemCount) == tableListView.data[0].rowCount){
			if(dataLoading == false){
				dataLoading =  true;
			    
                Ti.API.info('dataLoading =  true');
				tableListView.appendRow(LoadingRow);
				reqData.nextstarttime = starttime;
				var datastring = JSON.stringify(reqData);
				querypplnear(datastring, parseListMsg);
					
			}    
		}

		
	});
	
	tableListView.addEventListener('click', function(e){
	    
	    // the example above would print your name
	});
	    
    var starttime = 0;
	function requestNearbyList(){
		forwardView.visible = true;
		tableListView.data = [];
		//listItems = [];
		var currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		reqData.nextstarttime = starttime;
		var datastring = JSON.stringify(reqData);
		querygroupnear(datastring, parseListMsg);
	}
	
	
	requestNearbyList();

	
	return self;
}

//make constructor function the public component interface
module.exports = groupsWindow;