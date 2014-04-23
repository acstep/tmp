//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function groupsWindow() {
	//load component dependencies
	
    var winobj = {};
	winobj.createNormalWin = createNormalWin;
	var self = winobj.createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	var currentdate = new Date(); 
	var groupType = 0;
	
	var reqNearGroupData = {
		'geo':[Ti.App.Properties.getDouble('longitude'),Ti.App.Properties.getDouble('latitude')],
		'distance': Ti.App.Properties.getInt('distance',10),
		'limitcount':parseInt(Ti.App.Properties.getInt('limitcount',10)),
		'nextstarttime':parseInt(currentdate.getTime()/1000)
	};
	
	var reqMyGroupData = {
		'limitcount':parseInt(Ti.App.Properties.getInt('limitcount',10)),
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
		font:{fontSize:'20sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L('neargroups'),
		color:'#ffffff'
	});
	
	var listButtonImg = Titanium.UI.createImageView({
		image:'list.png',
		top: '10dp', right:'15dp', height: '30dp', width: '30dp'
	});
	
	
	
	
	
	
	listButtonImg.addEventListener('click',function(e){
		var opts = {
		    selectedIndex: groupType,
	    	options: [L('neargroups'),L('mygroups'),L('myjoingroups')]
		};
		var groupTypeDialog = Titanium.UI.createOptionDialog(opts);
	    groupTypeDialog.addEventListener('click', function(e) {
			if(e.index == 0){
				if(groupType != 0){
					groupType = 0;
					windowTitleText.text = L('neargroups');
					requestNearbyList();
				}
			}
			else if(e.index == 1){
				if(groupType != 1){
					groupType = 1;
					windowTitleText.text = L('mygroups');
					requestNearbyList();
				}
			}
			else{
				
			}
		});	
		groupTypeDialog.show();
	});	
	
	titleView.add(backImg);
	titleView.add(windowTitleText);
    titleView.add(listButtonImg);
	
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
			
			var lat = getLat();
			var lon = getLon();
			var feeddistance = GetDistance(lat, lon, listData[i]['loc']['coordinates'][1], listData[i]['loc']['coordinates'][0], 'K');
			var feedDistanceStr = ''; 
			if(feeddistance < 1){
				feeddistance =  parseInt(feeddistance * 1000);
				feedDistanceStr = '   '+feeddistance+ ' '+L('m')+ '   ';
			}
			else{
				feeddistance =  parseInt(feeddistance);
				feedDistanceStr = '   '+feeddistance+ ' '+ L('km')+ '   ';
			} 
			
			
			var distanceText = Ti.UI.createLabel({
				font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
				text: feedDistanceStr,
				color:'#ffffff',
				right:'10dp',
				backgroundColor:'#f1c40f',
				borderRadius:10,
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
	        topView.add(distanceText);
	
			
			var likeView = Titanium.UI.createView({
				left:'10dp',backgroundColor:'transparent',
				height: Ti.UI.SIZE,width: Ti.UI.SIZE,
				layout: 'horizontal'
			});
			var likeImg = Titanium.UI.createImageView({
		        height: '16dp', width: '16dp',image:'groupname.png'
			});
			
			var likeText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
				text: listData[i]['like'],
				color:'#666666',left:'10dp',right:'10dp'
			});
			likeView.add(likeImg);
			likeView.add(likeText);
	
			contentView.add(topView);
			contentView.add(likeView);
			
			 
            if(listData[i]['des'] != undefined && listData[i]['des'] != ''){
            	var desText = Ti.UI.createLabel({
					font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
					text: getStringlimit(listData[i]['des'],50,100),
					color:'#333333',left:'10dp',top:'5dp',right:'10dp'
				});	
				contentView.add(desText);	
            }
            	

			listRow.add(itemView);
			listRow.add(contentView);
		   
		    listRow.gid = listData[i]['gid'];
		    Ti.API.info('gid : ' + listRow.gid);
		    
		    listItems.push(listRow);
		    tableListView.appendRow(listRow);
		    starttime = listData[i]['lastupdate'];

    	};
    	
    	//tableListView.data = listItems;
	}	
	
	tableListView.addEventListener('click', function(e){
		openGroupInfoWin(e.row.gid);
		
    });
   
    function deleteGroupCB(result, resultText){
		if(result == true){
			requestNearbyList();
        }
        else{
        	showAlert('Error !', resultText);
        } 
	}
   
    tableListView.addEventListener('longclick', function(e){
    	var tmpgid = e.row.gid;
	    if(groupType == 1){
	    	var groupDeletedialog = Titanium.UI.createOptionDialog({
		    //title of dialog
			    title: L('deletegroup') ,
			    //options
			    options: [L('done'), L('cancel')],
			    //index of cancel button
			    cancel:1
			});
			
			groupDeletedialog.addEventListener('click', function(e) {
			    //if first option was selected
			    if(e.index == 0){
			    	deleteGroup(tmpgid,deleteGroupCB);
			    	
			    }	
           });
           groupDeletedialog.show();
       }  
	    // the example above would print your name
	});
	
	

    var dataLoading = false;
    var LoadingRow;
    tableListView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount + ', ' + tableListView.data[0].rowCount);
		
		if((e.firstVisibleItem + e.visibleItemCount) == tableListView.data[0].rowCount){
			if(dataLoading == false){
				dataLoading =  true;
			    
			    LoadingRow = Ti.UI.createTableViewRow({
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
			    
                Ti.API.info('dataLoading =  true');
				tableListView.appendRow(LoadingRow);
				queryGroupType();
					
			}    
		}

		
	});
	

	    
    var starttime = 0;
	function requestNearbyList(){
		forwardView.visible = true;
		tableListView.data = [];
		//listItems = [];
		starttime = 0;
		var currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		queryGroupType();
	}
	
	
	function queryGroupType(){
		if(groupType == 0){
			reqNearGroupData.nextstarttime = starttime;
            var datastring = JSON.stringify(reqNearGroupData);
			querygroupnear(datastring, parseListMsg);
		}
		else if(groupType == 1){
			reqMyGroupData.nextstarttime = starttime;
            var datastring = JSON.stringify(reqMyGroupData);
			queryidgroup(datastring, parseListMsg);
		}
		else{
			
		}
	}
	
	requestNearbyList();

	
	return self;
}

//make constructor function the public component interface
module.exports = groupsWindow;