

function createNormalWin(title){
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		navBarHidden:true,

	});
	
	var backgroundView = Ti.UI.createView({
		width:'100%',
		height:'100%',
		layout:'vertical',
		top: 0,
		left: 0,
		zIndex:10,
		backgroundColor:'#dddddd',
	});
	
	var forwardView = Ti.UI.createView({
		width:'100%',
		height:'100%',
		visible:false,
		backgroundColor:'#333333',
		opacity:0.5,
		top: 0,
		left: 0,
		zIndex:15
	});
	
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:14, fontWeight:'bold'},
		  style:Titanium.UI.ActivityIndicatorStyle.BIG,
	
	});
	
	forwardView.add(loginIndicator);
	loginIndicator.show();
	
	////  title  //////
	if(title == true){
		var titleView = Ti.UI.createView({
			backgroundColor:'#3498db',
			width:'100%',
			height:'50dp',
			top:'0dp',
	
		});
		backgroundView.add(titleView);
		self.titleView = titleView;
	}

	self.add(backgroundView);
	self.add(forwardView);
	
	self.backgroundView = backgroundView;
	self.forwardView = forwardView;
	
	return self;
}


function createNormalFeed(viewobj,category){
	/////////  feed  ///////////////////
	
	lat = parseFloat(Ti.App.Properties.getDouble('latitude',0));
	lon = parseFloat(Ti.App.Properties.getDouble('longitude',0));
    var feedView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100%',
		height:'100%',
		top:'0dp',
		layout:'vertical'
	});
	
	
	Ti.API.info('category backup  ' + category + ' : ' + Ti.App.Properties.getString(category.toString(),{'data':[]}));
	/////////////   scroll feed  ////////////////////////////
	var feedtableItems = [];
	var feedTableView = Ti.UI.createTableView({
		showVerticalScrollIndicator:false,
        backgroundSelectedColor:'#dddddd',
        top:'0dp',
	    left:'0dp',bottom:'0dp',
	    layout: 'vertical',
	    backgroundColor:'#dddddd',
        separatorColor:'#dddddd',
		data:feedtableItems
    });
	
	
	var getNewFeedHintView = Ti.UI.createView({
		height:'0dp',
		top:'50dp',
	});


	feedView.add(feedTableView);
	
	viewobj.add(feedView);

	// get current position and render fee

	var lastposupdate = 0;
	currentdate = new Date(); 
	var nexttime = parseInt(currentdate.getTime()/1000);
	var firstFeed = true;
	//////////////////   Draw feeds  /////////////////////////
	var feeditem = [];
	var drawFunction = {	    
	    	'1000':drawNewsEvent,
	    	'1001':drawActivityEvent,
	    	'1002':drawHelpEvent,
	    	'1003':drawSalesEvent,
	    	'1004':drawUsedEvent,
	    	'1005':drawTeambuyEvent,
	    	'1006':drawSocialEvent,
	};
	
	
	function parseFeed(result, feedData){
		feedLoading = false;
		try{
			feedRowstatus = 'none';
			feedTableView.deleteRow(loadRow);
		}
		catch(err){
			
		}

		if(result == true){
			
			Ti.API.info(feedData);
			feedData = sortByKeyUp(feedData, 'lastupdate');

			if(feedData.length > 0){	
				if(firstFeed == true){
					feeditem.length = 0;
				}	
				for(var i = 0 ; i <= feedData.length -1; i++) {
					feeditem.push(feedData[i]);
					var feedRow = Ti.UI.createTableViewRow({
				        backgroundSelectedColor:'#dddddd',
				        backgroundColor:'#dddddd'
				        
				    });
				    //drawFunction[feedData[i].category.toString()](feedData[i]);
				    try{
				    	drawFunction[feedData[i]['category']](feedRow, feedData[i],lon,lat);
					    feedRow.eventid = feedData[i]['eventid']; 
					    feedtableItems.push(feedRow);
					    feedTableView.appendRow(feedRow);
				    }
				    catch(e){
				    	
				    }
				    
				}   
                
                if(category == 'myfeed'){
					Ti.App.Properties.setString('myfeed',JSON.stringify({'data':feeditem}));
				}
				else{
					Ti.App.Properties.setString(category.toString(),JSON.stringify({'data':feeditem}));
				}
				
				nexttime = feedData[(feedData.length -1)]['lastupdate'];
			}
			viewobj.forwardView.visible = false;
			
			firstFeed = false;	
		}
		else{
			viewobj.forwardView.visible = false;
			if(feedData == 'network error' && firstFeed == true){
				firstFeed = false;
				if(category != 'myfeed'){
					oldfeeditems = JSON.parse(Ti.App.Properties.getString(category.toString(),{'data':[]}));
					
				}
				else{
					oldfeeditems = JSON.parse(Ti.App.Properties.getString('myfeed',{'data':[]}));
				}
				
				for(var i = 0 ; i <= oldfeeditems.data.length -1; i++) {
					
					
				    //drawFunction[feedData[i].category.toString()](feedData[i]);
				    var feedRow = Ti.UI.createTableViewRow({
				        backgroundSelectedColor:'#dddddd',
				        backgroundColor:'#dddddd'
				        
				    });
				    try{
					    drawFunction[oldfeeditems.data[i]['category']](feedRow, oldfeeditems.data[i],lon,lat);
					    feedRow.eventid = oldfeeditems.data[i]['eventid'];
					    feedtableItems.push(feedRow);
					    feedTableView.appendRow(feedRow);
					}
				    catch(e){
				    	
				    }    
				}   

				nexttime = oldfeeditems.data[(oldfeeditems.data.length -1)]['lastupdate'];
			}
			viewobj.forwardView.visible = false;
			firstFeed = false;	
		}

	}
	
	feedTableView.addEventListener('click', function(e){
    	FeedContentWindow = require('feedContentWindows');
		new FeedContentWindow(e.row.eventid, true).open(); 
    });
    
    var loadRow = Ti.UI.createTableViewRow({
        backgroundSelectedColor:'#dddddd',
        backgroundColor:'#dddddd'
        
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
	loadRow.add(itemView);
	
	
	var refleshRow = Ti.UI.createTableViewRow({
        backgroundSelectedColor:'#dddddd',
        backgroundColor:'#dddddd',
        hieght:'1dp'
    });
	
	var feedRowstatus = 'none';
    var feedLoading = false;
    var reachTop = false;
    
    feedTableView.addEventListener('scroll', function(e)
	{

		if((e.firstVisibleItem + e.visibleItemCount) == feedtableItems.length){
			if(feedLoading == false){
				feedLoading =  true;
			    
				feedRowstatus = 'loading';
				feedTableView.appendRow(loadRow);
				getNextFeed();
					
			}    
		}
		if(e.firstVisibleItem == 0){

			reachTop = true;
		}
		else{

			startRec = false;
			reachTop = false;
		}
		
	});
	
	var startScrollY = 0;
    var startRec = false; 
	feedTableView.addEventListener('touchstart', function(e)
	{
		if(reachTop == true){
			startRec = true;
			startScrollY = e.y;
		}
	});
	
	feedTableView.addEventListener('touchend', function(e)
	{
		if(reachTop == true && startRec == true){
			if(e.y - startScrollY > 0){
				reachTop = false;
				startRec = false; 
				Ti.API.info('tableview getnewfeed');
				getNewFeed();
			}

		}
		Ti.API.info('tttt : ' + e.x + '  ' + e.y);
	});
	
	function getNewFeed(){
		Ti.API.info('getNewFeed ');
		feedtableItems = [];
		feedTableView.data = [];
		feedTableView.appendRow(refleshRow);
		viewobj.forwardView.visible = true;
		currentdate = new Date(); 
		nexttime = parseInt(currentdate.getTime()/1000);
		firstFeed = true;
        nexttime = parseInt(currentdate.getTime()/1000);

		limitcount = parseInt(Ti.App.Properties.getInt('limitcount',5));
		if(category == 'myfeed'){
			querymyevent(limitcount, nexttime, parseFeed);
		}
		else{
			latitude = parseFloat(Ti.App.Properties.getDouble('latitude',-1));
			longitude = parseFloat(Ti.App.Properties.getDouble('longitude',-1));
			distance = parseInt(Ti.App.Properties.getInt('distance',feedDistance));
			queryevent([longitude,latitude], distance, [category], limitcount, nexttime, parseFeed);
		}
		
   
	};

    function getNextFeed(){
    	Ti.API.info('getNextFeed ');
    	if(category == 'myfeed'){
			querymyevent(limitcount, nexttime, parseFeed);
		}
		else{
			latitude = parseFloat(Ti.App.Properties.getDouble('latitude',-1));
			longitude = parseFloat(Ti.App.Properties.getDouble('longitude',-1));
			distance = parseInt(Ti.App.Properties.getInt('distance',feedDistance));
			queryevent([longitude,latitude], distance, [category], limitcount, nexttime, parseFeed);
		}
    	
    };
    
    Ti.App.addEventListener('getnewfeed',function(e) {
    	Ti.API.info('receive event getNextFeed ');
        getNewFeed();
	});
	
	viewobj.getNewFeed = getNewFeed;
	viewobj.getNextFeed = getNextFeed;
}


function showAlert(title, message){
	var alertDlg = Titanium.UI.createAlertDialog({
		title:title,
		message:message
	});
	alertDlg.show();
}

function sortByKeyUp(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

function sortByKeyDown(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


function GetDistance(lat1, lon1, lat2, lon2, unit) {
	    var radlat1 = Math.PI * lat1/180;
	    var radlat2 = Math.PI * lat2/180;
	    var radlon1 = Math.PI * lon1/180;
	    var radlon2 = Math.PI * lon2/180;
	    var theta = lon1-lon2;
	    var radtheta = Math.PI * theta/180;
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    dist = Math.acos(dist);
	    dist = dist * 180/Math.PI;
	    dist = dist * 60 * 1.1515;
	    if (unit=="K") { dist = dist * 1.609344; };
	    if (unit=="N") { dist = dist * 0.8684; };
	    return dist;
};

function createHSepLine(width, top, bottom){
	if (top == '0dp'){
		var SepView = Ti.UI.createView({
		    backgroundColor: '#bbbbbb',
		    width:width, height: '1dp',
		    bottom:bottom
		});
	}
	else{
		var SepView = Ti.UI.createView({
		    backgroundColor: '#bbbbbb',
		    width:width, height: '1dp',
		    top:top
		});
	}
	
	return SepView;
	
}

function createVSepLine(height, top,bottom,left){
	var SepView = Ti.UI.createView({
	    backgroundColor: '#bbbbbb',
	    width:'1dp', height: height,
	    top:top,bottom:bottom,left:left
	});
	return SepView;
}

function getStringlimit(orgstring,start,end){
	if(orgstring.length < start){
		return orgstring;
	}
	stringindex = -1;
	desString = '';
    firstSpaceIndex = orgstring.indexOf(" ",start);
    firstlinebreakIndex = orgstring.indexOf("\n",start);
    firstdotIndex = orgstring.indexOf(".",start);
    firstcommaIndex = orgstring.indexOf(",",start);
    if(firstSpaceIndex > 0 && firstSpaceIndex < end){
    	stringindex = firstSpaceIndex;
    }
    else if(firstlinebreakIndex > 0 && firstlinebreakIndex < end){
    	stringindex = firstlinebreakIndex;
    }
    else if(firstdotIndex > 0 && firstdotIndex < end){
    	stringindex = firstdotIndex;
    }
    else if(firstcommaIndex > 0 && firstcommaIndex < end){
    	stringindex = firstcommaIndex;
    }
    
   
    
    if(stringindex != -1 && stringindex<end){
    	desString = orgstring.substring(0,stringindex);
    	desString = desString + '...';
    }
    else{
    	desString = orgstring.substring(0,start);
    	desString = desString + '...';
    }
    return desString;
}

function setPosString(latitude,longitude,tmpobj){
	
	Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
		if (evt.success) {
			var address = evt.places[0].address;

			if (address && address.length ) {
				tmpobj.text = address;
				streetstr = true;
			} 
	
			Ti.API.info("reverse geolocation result = "+JSON.stringify(evt));
		}
		
	});		
	
}

function createMapView(mapView,data){
	var addressText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: '',
		color:'#666666',
		left:'0dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	mapView.addressText = addressText;
	
	latitude = data['loc']['coordinates'][1];
	longitude = data['loc']['coordinates'][0];
	
	
	
	mapView.add(addressText);
	
	var mapParentView = Titanium.UI.createView({
		height: '200dp', width: '100%',backgroundColor:'#transparent',
		top:'10dp'
		
	});
	

    var Map = require('ti.map');    
	var posAnno = Map.createAnnotation({
	    latitude:latitude,
	    longitude:longitude,
	    pincolor:Map.ANNOTATION_RED,
	    myid:1 
	});
	
	var mapview = Map.createView({
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:latitude, longitude:longitude, latitudeDelta:0.005, longitudeDelta:0.005},
	    userLocation:false,
	    enableZoomControls:false,
	    annotations:[posAnno],
	    height: '100%', width: '100%', top:'0dp',left:'0dp'
	});
	
	var mapforgroundView = Titanium.UI.createImageView({
		height: '100%', width: '100%', top:'0dp',left:'0dp',backgroundColor:'transparent',
	});
	
	mapforgroundView.addEventListener('click',function(e)
	{
	     var intent = Ti.Android.createIntent({
            action : Ti.Android.ACTION_VIEW,
            data : 'geo:' + latitude +',' + longitude + '?q=' + latitude +',' + longitude
        });
        Ti.Android.currentActivity.startActivity(intent);	
	});	
	
	mapParentView.add(mapview);
	mapParentView.add(mapforgroundView);
	

	mapView.add(mapParentView);
}

function createCardBottom(feedView, data){
	var bottomView = Ti.UI.createView({
	    backgroundColor: '#f6f6f6',
	    layout: 'horizontal',
	    width:'100%', height: '40dp',
	    top:'10dp'
	});
	
	var bottomLikeView = Ti.UI.createView({
	    width:Ti.UI.SIZE, height: '40dp',left:'20dp',
	    top:'0dp',
	    name:'view'
	});
	
	var bottomLikecontentView = Ti.UI.createView({
        layout: 'horizontal',
	    name:'view',
	    width: Ti.UI.SIZE,height: Ti.UI.SIZE,
	    name:'view1',center:{x:'50%',y:'50%'}
	});
	

	bottomLikeView.eventid = data['eventid'];
	bottomLikecontentView.eventid = data['eventid'];
	
	var likeImg = Titanium.UI.createImageView({
		image:'like.png',
		height: '20dp', width: '20dp',
		name:'img'
	});
	likeImg.eventid = data['eventid'];
	
	var likeText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		text: data['like'] ,
		color:'#666666',
  		left:'15dp',right:'10dp',
  		name:'text'
	});
	likeText.eventid = data['eventid'];
	
	function likeCB(result, resultText, source){
		if(result == true){
			source.liketextlabel.color = "#3498db";
			source.liketextlabel.text = parseInt(source.liketextlabel.text)+1;
			source.likeimg.image = "likeb.png";
        } 
	}
	
	bottomLikeView.addEventListener('click',function(e) {
		e.cancelBubble = true;
        if(e.source.name == 'img' || e.source.name == 'text'){
        	likeevent(e.source.getParent().eventid , e.source.getParent().getParent(), likeCB);
        }
        else if(e.source.name == 'view1'){
        	likeevent(e.source.eventid , e.source.getParent(), likeCB);
        }
        else{
        	likeevent(e.source.eventid , e.source, likeCB);
        }
        
	});
	
	bottomLikeView.liketextlabel = likeText;
	bottomLikeView.likeimg = likeImg;
	bottomLikecontentView.add(likeImg);
	bottomLikecontentView.add(likeText);
    bottomLikeView.add(bottomLikecontentView);
	
	//var bottomSepView = Ti.UI.createView({
	//    backgroundColor: '#bbbbbb',
	//    width:'1dp', height: '30dp',
	//    top:'5dp'
	//});
	var bottomCommentView = Ti.UI.createView({

	    width:Ti.UI.SIZE, height: '40dp',
	    top:'0dp',
	    name:'commentview'
	});
	bottomCommentView.eventid = data['eventid'];
	
	
	var bottomCommentcontentView = Ti.UI.createView({
        layout: 'horizontal',
        width: Ti.UI.SIZE,height: Ti.UI.SIZE,
	    name:'view',left:'30dp'
	});
	
	
	bottomCommentcontentView.eventid = data['eventid'];
	
	var commentImg = Titanium.UI.createImageView({
		image:'comment.png',
		height: '20dp', width: '20dp'
	});
	commentImg.eventid = data['eventid'];
	if(data['comment'] == undefined){
		data['comment'] = 0;
	}
	var commentText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		text: data['comment'],
		color:'#666666',
  		left:'15dp',right:'10dp'
	});
	commentText.eventid = data['eventid'];
	
	bottomCommentView.addEventListener('click',function(e) {
		e.cancelBubble = true;
        if(e.source.name == 'img' || e.source.name == 'text'){
        	Ti.API.info('postView click.');
	        FeedContentWindow = require('feedContentWindows');
	  		new FeedContentWindow(e.source.getParent().eventid, false).open(); 
        	
        }
        else{
        	Ti.API.info('postView click.');
	        FeedContentWindow = require('feedContentWindows');
	  		new FeedContentWindow(e.source.eventid, false).open(); 
            
        }
        
	});
	
	bottomCommentcontentView.add(commentImg);
	bottomCommentcontentView.add(commentText);
	bottomCommentView.add(bottomCommentcontentView);
	
	bottomView.add(bottomLikeView);
	
	bottomView.add(bottomCommentView);
	feedView.add(bottomView);
}


function createFeedTop(feedView, data, lon, lat){
	var topView = Ti.UI.createView({
	    backgroundColor: '#ffffff',

	    width:'100%', height:  Ti.UI.SIZE,
	    top:'0dp'
	});
	
	
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,backgroundImage:'headphoto.png',
		height: '60dp', width: '60dp', top:'15dp', left:'10dp'
	});
	
	
	headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + data['ownerid']+'.jpg';

	
	var topinfoView = Ti.UI.createView({
	    
	    layout: 'vertical',
	    height:  Ti.UI.SIZE,
	    top:'0dp',left:'70dp',right:'70dp'
	});
	
	
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'14sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: data['name'],
		color:'#333333',
		top:'15dp',
		left:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	
	eventtime = new Date(data['lastupdate']);
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
		font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
		text: timeString,
		color:'#aaaaaa',
		top:'1dp',
		left:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	

	
	var feeddistance = GetDistance(lat, lon, data.loc['coordinates'][1], data['loc']['coordinates'][0], 'K');
	if(feeddistance < 1){
		feeddistance =  parseInt(feeddistance * 1000);
		feedDistanceStr = '   '+feeddistance+ ' '+L('m')+ '   ';
	}
	else{
		feeddistance =  parseInt(feeddistance);
		feedDistanceStr = '   '+feeddistance+ ' '+ L('km')+ '   ';
	} 
	
	var topCategoryDistanceView = Ti.UI.createView({
	    layout: 'horizontal',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'3dp'
	});
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
		color:'#ffffff',
		left:'10dp',
		borderRadius:10,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	var distanceText = Ti.UI.createLabel({
		font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
		text: feedDistanceStr,
		color:'#ffffff',

		left:'10dp',
		backgroundColor:'#3498db',
		borderRadius:10,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	topinfoView.add(nameText);
	topinfoView.add(timeText);
	
	topCategoryDistanceView.add(categoryText);
	topCategoryDistanceView.add(distanceText);
	
	topinfoView.add(topCategoryDistanceView);
	
	var categoryImg = Titanium.UI.createImageView({
		height: '30dp', width: '30dp', top:'20dp', right:'20dp'
	});
	
	
	topView.add(headPhotoImg);
	topView.add(topinfoView);
	topView.add(categoryImg);
	
	feedView.add(topView);
	feedView.categoryText = categoryText;
	feedView.categoryImg = categoryImg;
}

function createAddPhoto(contentScrollView,imageList){
	var imageScrollView = Ti.UI.createScrollView({
	    contentWidth: 'auto',
	    contentHeight:'160dp',
	    layout: 'horizontal',
	    backgroundColor:'#ffffff',
        height:'160dp'
	});
	
	//////   camera  /////////////
	
	
	var cameraViewImageView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100dp',
		height:'100dp',
		top:'30dp',
		left:'10dp',
		layout:'vertical',
		borderRadius:15,
		
	});
	
	var addImg = Titanium.UI.createImageView({
		image:'add.png',
		height: '30dp', width: '30dp', top:'20dp'
	});
	
	var addPhotoText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('addphoto'),
		color:'#666666',
		top:'15dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	
	/////////////   select image from camera or gallary ///////////////////
	
	
	var dialog = Titanium.UI.createOptionDialog({
    //title of dialog
	    title: L('chooseimage'),
	    //options
	    options: [L('camera'),L('photogallery'), L('cancel')],
	    //index of cancel button
	    cancel:2
	});
	 
	//add event listener
	dialog.addEventListener('click', function(e) {
	    //if first option was selected
	    if(e.index == 0)
	    {
	        //then we are getting image from camera
	        Titanium.Media.showCamera({
	            //we got something
	            success:function(event)
	            {
	                //getting media
	                var image = event.media;
	                 
	                //checking if it is photo
	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	                {
	                    //we may create image view with contents from image variable
	                    //or simply save path to image
	                    imageList.push(image);
	                    var addSelectImg = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:15
						});
						imageScrollView.contentWidth = ((imageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						imageScrollView.add(addSelectImg);
	                }
	            },
	            cancel:function()
	            {
	                //do somehting if user cancels operation
	            },
	            error:function(error)
	            {
	                //error happend, create alert
	            
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA)
	                {
	                	showAlert('Camera', 'Device does not have camera'); 
	                    
	                }
	                else
	                {
	                	showAlert('Camera', 'Unexpected error: ' + error.code);  

	                }

	            },
	            allowImageEditing:true,
	            saveToPhotoGallery:true
	        });
	    }
	    else if(e.index == 1)
	    {
	        //obtain an image from the gallery
	        Titanium.Media.openPhotoGallery({
	            success:function(event)
	            {
	                //getting media
	                var image = event.media;
	                // set image view
	                 
	                //checking if it is photo
	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	                {
	                    //we may create image view with contents from image variable
	                    //or simply save path to image
	                    imageList.push(image);
	                    var addSelectImg = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:15
						});
						imageScrollView.contentWidth = ((imageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						imageScrollView.add(addSelectImg);
	                }  
	            },
	            cancel:function()
	            {
	                //user cancelled the action fron within
	                //the photo gallery
	            }
	        });
	    }
	    else
	    {
	        //cancel was tapped
	        //user opted not to choose a photo
	    }
	});

    cameraViewImageView.addEventListener('click',function(e)
	{
		dialog.show();
	});	
	
	
	cameraViewImageView.add(addImg);
	cameraViewImageView.add(addPhotoText);
	
	imageScrollView.add(cameraViewImageView);
	imageScrollView.dialog = dialog;
	contentScrollView.add(imageScrollView);
	
}
