//chat room  Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");




function groupPeopleWindow(gid) {
	//load component dependencies
	
    var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	var currentdate = new Date(); 
	
	var reqData = {
		'gid':gid,
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
	
	var groupPeopleTitleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: L('groupsmember'),
		color:'#ffffff'
	});
	
	titleView.add(backImg);
	titleView.add(groupPeopleTitleText);

	
	//////////////   middle   table view  //////////////////////
	var itemsList = [];
    
	var itemTableView = Ti.UI.createTableView({
	    
	    data:[]
	});

		
	backgroundView.add(itemTableView);
	
    function parseitemMsg(result, itemData, nexttime){
    	Ti.API.info(' itemData  : ' + JSON.stringify(itemData));
    	forwardView.visible = false;
    	dataLoading = false;
    	if(result == false){
    		return;
    	}
    	try{
    		itemTableView.deleteRow(LoadingRow);
    	}	
    	catch(e){}
    	if(result == false){
    		
     		
    	}
    	for(var i = 0 ; i < itemData.length ; i++){
    		var itemRow = Ti.UI.createTableViewRow({
		        backgroundSelectedColor:'#3f9ddd',
		        backgroundColor:'#ffffff',

		    });
			var itemView = Titanium.UI.createView({
				backgroundColor:'transparent',
				width:Ti.UI.SIZE ,height: Ti.UI.SIZE,left:'10dp',top:'0dp'
			});
			var headPhotoImg = Titanium.UI.createImageView({
		        borderRadius:5,height: '70dp', width: '70dp',top:'10dp',bottom:'10dp',backgroundImage:'headphoto.png'
			});
			
			headPhotoImg.image = getHeadImg(itemData[i]['id']);
            
		
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
				font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
				text: itemData[i]['name'],
				color:'#333333',left:'0dp'
			});
			topView.add(nameText);
			contentView.add(topView);

			////////////////// gender /////////////////////
			if(itemData[i]['sex'] != '' || itemData[i]['birthday'] != ''){
				var genderView = Titanium.UI.createView({
					left:'10dp',backgroundColor:'transparent',
					height: Ti.UI.SIZE,width: Ti.UI.SIZE,top:'5dp',
					layout: 'horizontal',borderRadius:3
				});
				
				if(itemData[i]['sex'] != undefined){
					var gerder =  itemData[i]['sex'];
					var genderImg = Titanium.UI.createImageView({
				        height: '15dp', width: '15dp',left:'10dp'
					});
					if(itemData[i]['sex'] == 1){
						genderImg.image = 'man.png';
						genderView.backgroundColor = '#3498db';
					}
					else if(itemData[i]['sex'] == 2){
						genderImg.image = 'girl.png';
						genderView.backgroundColor = '#FF80EE';
					}
					else{
						genderView.backgroundColor = '#bdc3c7';
					}
					genderView.add(genderImg);
				}
				
				if(itemData[i]['birthday'] != undefined && itemData[i]['birthday'] != ""){
					var yearString = ' ';

					if(itemData[i]['birthday'] != undefined){
						
						var currenttime =  new Date() ;
						yearString =  new Date().getFullYear() - new Date(itemData[i]['birthday']*1000).getFullYear();
						
					}
					var yearText = Ti.UI.createLabel({
						font:{fontSize:'10sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
						text: yearString,
						color:'#ffffff',left:'10dp',right:'10dp'
					});
					genderView.add(yearText);
				}	
				contentView.add(genderView);
			}
 
            if(itemData[i]['des'] != undefined && itemData[i]['des'] != ''){
            	var desText = Ti.UI.createLabel({
					font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
					text: getStringlimit(itemData[i]['des'],50,100),
					color:'#333333',left:'10dp',top:'5dp'
				});	
				contentView.add(desText);	
            }
            	

			itemRow.add(itemView);
			itemRow.add(contentView);
		   
		    itemRow.ownerid = itemData[i]['id'];
		    Ti.API.info('oinMsgRow.ownerid : ' + itemRow.ownerid);
		    

		    itemTableView.appendRow(itemRow);
		    starttime = nexttime;

    	};
    	
    	//itemTableView.data = nearbyItems;
	}	
	
	itemTableView.addEventListener('click', function(e){
		openPeopleInfoWin(e.row.ownerid);
		
    });
   
    var LoadingRow = {};
    
	
	

    var dataLoading = false;
    itemTableView.addEventListener('scroll', function(e)
	{
		Ti.API.info(' source ' + e.firstVisibleItem+ ', ' + e.visibleItemCount + ', ' + itemTableView.data[0].rowCount);
		
		if((e.firstVisibleItem + e.visibleItemCount) == itemTableView.data[0].rowCount){
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
				itemTableView.appendRow(LoadingRow);
				reqData.nextstarttime = starttime;
				var datastring = JSON.stringify(reqData);
				queryGroupPpl(datastring, parseitemMsg);
					
			}    
		}

		
	});
	
	itemTableView.addEventListener('click', function(e){
	    
	    // the example above would print your name
	});
	    
    var starttime = 0;
	function requestGroupPplList(){
		forwardView.visible = true;
		itemTableView.data = [];
		//nearbyItems = [];
		var currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		reqData.nextstarttime = starttime;
		var datastring = JSON.stringify(reqData);
		queryGroupPpl(datastring, parseitemMsg);
	}
	
	
	requestGroupPplList();

	
	return self;
}

//make constructor function the public component interface
module.exports = groupPeopleWindow;