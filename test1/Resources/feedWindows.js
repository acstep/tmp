//Main Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");
Ti.include("newsview.js");

function feedWindow() {
	//load component dependencies
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
		top:'0dp',

	});
	
	var listappImg = Titanium.UI.createImageView({
		image:'list.png',
		top: '10dp', left:'10dp', height: '30dp', width: '30dp'
	});
	
	var feedPos = false;
	function switchBackgroundView()	{
		if(feedPos == true){ 
			feedPos = false;
			var animation = Titanium.UI.createAnimation();
			animation.left = '0%';
			animation.duration = 300;
	        backgroundView.animate(animation);
		}
		else{
			feedPos = true;
			var animation = Titanium.UI.createAnimation();
			animation.left = '80%';
			animation.duration = 300;
	        backgroundView.animate(animation);
		}
		
	};
	listappImg.addEventListener('click',function(e)
	{
		
		switchBackgroundView();
	    
	});	
	
	var setupImg = Titanium.UI.createImageView({
		image:'setup.png',
		top: '10dp', right:'10dp', height: '30dp', width: '30dp'
	});
	
	var titleCenterView = Ti.UI.createView({
		
		width:'50%',
		height:'50dp',
		top:'0dp',

		center:{x:'50%',y:'50%'}
	});
	
	var homeImg = Titanium.UI.createImageView({
		image:'home.png',
		top: '15dp', left:'10%', height: '20dp', width: '20dp'
	});
	
	homeImg.addEventListener('click',function(e)
	{
		getNewFeed();
 	});	
	
	var eventImg = Titanium.UI.createImageView({
		image:'event.png',
		cneter:{x:'50%',y:'50%'}, height: '20dp', width: '20dp'
	});
	
	var eventnumText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Marker Felt'},
		text: '0',
		color:'#ffffff',
		backgroundColor:'#e74c3c',
		borderRadius:20,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		visible:false
	});
	
	
	var talkImg = Titanium.UI.createImageView({
		image:'talk.png',
		top: '15dp', right:'10%', height: '20dp', width: '20dp'
	});
	
	titleCenterView.add(homeImg);
	titleCenterView.add(eventImg);
	titleCenterView.add(talkImg);
	
	//   notify number ///
	titleCenterView.add(eventnumText);
	
	titleView.add(listappImg);
	titleView.add(titleCenterView);
	titleView.add(setupImg);
    backgroundView.add(titleView);

    /////////  feed  ///////////////////
    var feedView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100%',
		height:'100%',
		top:'0dp'
	});
	
	/////////  feed  control  ///////////////////
	var feedControlView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'100%',
		height:'50dp',
		top:'0dp',
		zIndex: 1,
		layout: 'horizontal',
	});
	
	var sortView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'50%',
		height:'50dp',
		top:'0dp',
		zIndex: 1,
		layout: 'horizontal',
	});
	var sortImg = Titanium.UI.createImageView({
		image:'sort.png',
		top: '15dp', left:'15%', height: '20dp', width: '20dp'
	});
	var sortText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Marker Felt'},
		text: L('sortorder'),
		color:'#333333',
		top:'13dp',
  		left:'5%'
	});
	sortView.add(sortImg);
	sortView.add(sortText);
	
	var conSeperateView = Ti.UI.createView({
		backgroundColor:'#cccccc',
		width:'1dp',
		height:'30dp',
		top:'10dp',
	});
	
	var postView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'auto',
		height:'50dp',
		top:'0dp',
		zIndex: 1,
		layout: 'horizontal',
	});
	var postImg = Titanium.UI.createImageView({
		image:'post.png',
		top: '15dp', left:'15%', height: '20dp', width: '20dp'
	});
	var postText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Marker Felt'},
		text: L('postnew'),
		color:'#333333',
		top:'13dp',
  		left:'5%'
	});
	postView.add(postImg);
	
	postView.add(postText);
	
	feedControlView.add(sortView);
	feedControlView.add(conSeperateView);
	feedControlView.add(postView);
	
	/////////////   scroll feed  ////////////////////////////
    var feedScrollView = Ti.UI.createScrollView({
	    top:'0dp',
	    left:'0dp',
	    contentHeight: 'auto',
	    layout: 'vertical',
	    backgroundColor:'#dddddd',
	    zIndex: 0

	});
	
	var getNewFeedHintView = Ti.UI.createView({
		height:'0dp',
		top:'50dp',
	});
	
	var scrollHintText = Ti.UI.createLabel({
		font:{fontSize:'14sp',fontFamily:'Marker Felt'},
		text: L('pullreflash'),
		color:'#333333',
		top:'15dp',

  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	

	getNewFeedHintView.add(scrollHintText);
	
	var getNextFeedHintView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:Ti.UI.SIZE,
		height:'50dp',
		top:'50dp',
		layout: 'horizontal',
		visible: false

	});
	
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:16, fontWeight:'bold'},
	      message: L('loading'),
	});
	
	getNextFeedHintView.add(loginIndicator);
	loginIndicator.show();
	
	
	feedScrollView.add(getNewFeedHintView);
	
	feedView.add(feedScrollView);
	feedView.add(feedControlView);
	backgroundView.add(feedView);
	
	
	sortView.addEventListener('click',function(e) {

	    Ti.API.info('sortView click.');
       
	
	});
	
	postView.addEventListener('click',function(e) {

	    Ti.API.info('postView click.');
        NewsPostWindow = require('newsPostWindows');
        NewsPostWindow.parentGetNewFeed = getNewFeed;
		new NewsPostWindow().open(); 
	
	});
	
	
	///////   menu  ///////////////
 	var mainMenu = Ti.UI.createScrollView({
        left:'0dp',
        top:'0dp',	
        width:'80%',
        backgroundColor:'#eeeeee',
        layout: 'vertical',
        contentHeight: 'auto',
     
	});
	
	
	var headImg = Titanium.UI.createImageView({
		image:'head.png',borderRadius:15,
		top: '15dp', left:'5%', height: '60dp', width: '60dp'
	});
	
	var headimage = Ti.App.Properties.getString('headfile','');

	
	if(headimage == undefined || headimage == ''){
		headImg.image = 'headphoto.png';
	}
	else{
		headImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + headimage;
	}
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Marker Felt', fontWeight:'bold'},
		text: L('category'),
		color:'#666666',
		left:'5%',
		top: '10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var seperateLineView = Ti.UI.createView({
		backgroundColor:'#666666',
		width:'90%',
		height:'1dp',
		top:'10dp',
        left:'5%'
	});
	
	var categoryMenu = [
 
		{ leftImage:'group.png', title:'club',category:'1000' },
		{ leftImage:'sale.png', title:'sale',category:'2000' },
		{ leftImage:'help.png', title:'needhelp',category:'3000' },
		{ leftImage:'love.png', title:'dating',category:'4000' },
		{ leftImage:'news.png', title:'news',category:'5000' },
	]; 
	
	var cateDate = [];
	for(var i = 0 ; i <= categoryMenu.length -1; i++) {
		var row = Titanium.UI.createTableViewRow({

			backgroundColor:'transparent',
			width:'90%',
			height:'50dp',
            layout: 'horizontal',
	        left:'5%'
            
		});
		
		var groupImg = Titanium.UI.createImageView({
			image:categoryMenu[i].leftImage,
			backgroundColor:'transparent',left:'5dp',
			top: '10dp',  height: '30dp', width: '30dp'
		});
		
		var groupText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Marker Felt', fontWeight:'bold'},
			text: L(categoryMenu[i].title),
			backgroundColor:'transparent',
			color:'#777777',
			left:'20dp',
			top: '13dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});

		row.add(groupImg);
		row.add(groupText);

		cateDate.push(row);
	}
	
	var memuTableView = Ti.UI.createTableView({  
	    data:cateDate,
	    width:'90%',
	    top: '10dp'
	});  
	
	memuTableView.addEventListener('click',function(e) {

	    switchBackgroundView();

	
	});
	
	var menuParentView = Ti.UI.createView({
		backgroundColor:'#eeeeee',
		height:Titanium.UI.SIZE,
		top:'10dp', width:'100%',height:Titanium.UI.SIZE
		
	});
	

	mainMenu.add(headImg);
	mainMenu.add(categoryText);
	mainMenu.add(seperateLineView);
	mainMenu.add(menuParentView);
	menuParentView.add(memuTableView);
 
	
	self.add(mainMenu);
	self.add(backgroundView);
	self.add(forwardView);
	
	// get current position and render fee
	var latitude = 0;
	var longitude = 0;
	var lastposupdate = 0;
	currentdate = new Date(); 
	var nexttime = parseInt(currentdate.getTime()/1000);
	var firstFeed = true;
	//////////////////   Draw feeds  /////////////////////////
	var drawFunction = {	    
	    	'1000':drawNewsEvent
	};
	
	function parseFeed(result, feedData){
		
		if(result == true){
			
			Ti.API.info(feedData);
			feedData = sortByKeyUp(feedData, 'lastupdate');
			feedScrollView.remove(getNextFeedHintView);
			if(firstFeed == true){
				feedScrollView.visible = false;
				feedScrollView.removeAllChildren();
	            getNewFeedHintView.height = '0dp';
	            scrollHintText.text = L('pullreflash');
				feedScrollView.add(getNewFeedHintView);
				
			}
			if(feedData.length > 0){	
				for(var i = 0 ; i <= feedData.length -1; i++) {
					
				    //drawFunction[feedData[i].category.toString()](feedData[i]);
				    drawFunction['1000'](feedScrollView, feedData[i],longitude,latitude);
				}   
				
			}
			forwardView.visible = false;
			feedScrollView.visible = true;
			getNextFeedHintView.visible = false;
			feedScrollView.add(getNextFeedHintView);
			nexttime = feedData[(feedData.length -1)]['lastupdate'];
			firstFeed = false;	
		}
		else{
			
			forwardView.visible = false;
			firstFeed = false;	
			getNextFeedHintView.visible = false;
			feedScrollView.add(getNextFeedHintView);
		}
	}
	
	
	function getNewFeed(){
		Ti.API.info('getNewFeed ');
		forwardView.visible = true;
		currentdate = new Date(); 
		nexttime = parseInt(currentdate.getTime()/1000);
		firstFeed = true;
        nexttime = parseInt(currentdate.getTime()/1000);
        latitude = parseFloat(Ti.App.Properties.getString('latitude',-1));
		longitude = parseFloat(Ti.App.Properties.getString('longitude',-1));
		distance = parseInt(Ti.App.Properties.getString('distance',feedDistance));
		category = Ti.App.Properties.getList('category','none');
		limitcount = parseInt(Ti.App.Properties.getString('limitcount',5));
		
		if(latitude ==-1 || longitude == -1){
			Titanium.Geolocation.getCurrentPosition(function(e){
			    if(e.error){
			        Ti.API.error(e.error);
			        currentdate = new Date(); 
			        nexttime = parseInt(currentdate.getTime()/1000);
			        latitude = parseFloat(Ti.App.Properties.getString('latitude',0));
					longitude = parseFloat(Ti.App.Properties.getString('longitude',0));
					distance = parseInt(Ti.App.Properties.getString('distance',feedDistance));
					category = Ti.App.Properties.getList('category','none');
					limitcount = parseInt(Ti.App.Properties.getString('limitcount',5));
					queryevent([longitude,latitude], distance, category, limitcount, nexttime, parseFeed);
			        return;
			    }
		        else{
		        	currentdate = new Date(); 
					nexttime = parseInt(currentdate.getTime()/1000);
		        	latitude = e.coords.latitude;
					longitude = e.coords.longitude;
					Ti.App.Properties.setString('latitude',latitude);
					Ti.App.Properties.setString('longitude',longitude);
					distance = parseInt(Ti.App.Properties.getString('distance',feedDistance));
					category = Ti.App.Properties.getList('category','none');
					limitcount = Ti.App.Properties.getString('limitcount',5);
					queryevent([longitude,latitude], distance, category, limitcount, nexttime, parseFeed);
		        }
		    });    
		}
		else{
			
			queryevent([longitude,latitude], distance, category, limitcount, nexttime, parseFeed);
		}
		//Titanium.Geolocation.getCurrentPosition(function(e){
		//    if(e.error){
		//        Ti.API.error(e.error);
		//        currentdate = new Date(); 
		//        nexttime = parseInt(currentdate.getTime()/1000);
		//        latitude = Ti.App.Properties.getString('latitude',latitude);
		//		longitude = Ti.App.Properties.getString('longitude',longitude);
		//		distance = Ti.App.Properties.getString('distance',feedDistance);
		//		category = Ti.App.Properties.getString('category','none');
		//		limitcount = Ti.App.Properties.getString('limitcount',5);
		//		queryevent([longitude,latitude], distance, category, limitcount, nexttime, parseFeed);
		//        return;
		//    }
	    //    else{
	    //    	currentdate = new Date(); 
		//		nexttime = parseInt(currentdate.getTime()/1000);
	    //    	latitude = e.coords.latitude;
		//		longitude = e.coords.longitude;
		//		Ti.App.Properties.setString('latitude',latitude);
		//		Ti.App.Properties.setString('longitude',longitude);
		//		distance = Ti.App.Properties.getString('distance',feedDistance);
		//		category = Ti.App.Properties.getString('category','none');
		//		limitcount = Ti.App.Properties.getString('limitcount',5);
		//		queryevent([longitude,latitude], distance, category, limitcount, nexttime, parseFeed);
	    //    }
            
	};

    function getNextFeed(){
    	Ti.API.info('getNextFeed ');
    	
    	queryevent([longitude,latitude], distance, category, limitcount, nexttime, parseFeed);
    };
    
    Ti.App.addEventListener('getnewfeed',function(e) {
    	Ti.API.info('receive event getNextFeed ');
        getNewFeed();
	});
	
	
	
	
    ///////////////   scroll  update and next logic ////////////////////

	var scrolling = false;
	var scrollTimes = 0;
	var scrollLastTimes = 0;
	var flashNewFeed = false;
	var flashNextFeed = false;
	var oldY = 0;
	feedScrollView.addEventListener('scroll',function(e) {
        Ti.API.info('tpye x y : ' + e.type + '  x:' + e.x + '   y:' +e.y);
        if(scrolling == true){
        	if(e.y == 0){
        		scrollLastTimes = 0;
        		getNewFeedHintView.height = '50dp';
        		scrollTimes = scrollTimes + 1;
        		
        		if(scrollTimes > 30){
        			flashNewFeed = true;
        			flashNextFeed == false;
        			scrollHintText.text = L('releasereflash');
        		}
        	}
        	else{
        		scrollTimes = 0;
        		Ti.API.info('old y : ' + oldY);
        		if(e.y == oldY){
        			scrollLastTimes = scrollLastTimes + 1;
        			if(scrollLastTimes > 2){
        				getNextFeedHintView.visible = true;
	        			scrollLastTimes = 0;
	        			Ti.API.info('getNextFeed ');
	        			flashNewFeed = false;
	        			flashNextFeed = true;
	        		}
        		}
        		else{
        			oldY = e.y;
        			scrollLastTimes = 0;
        		}
        	}
        }

	});
	
	feedScrollView.addEventListener('touchstart',function(e) {
        Ti.API.info('touchstart');
        scrolling = true;
	});
	
	
	feedScrollView.addEventListener('touchend',function(e) {
        Ti.API.info('touchend');
        scrolling = false;
        if(flashNewFeed == true){
        	flashNewFeed = false;
        	scrollTimes = 0;
        	firstFeed == true;
        	
        	getNewFeed();
        }
        if(flashNextFeed == true){
        	
        	flashNextFeed = false;
        	scrollLastTimes = 0;
        	getNextFeed();
        }

	});
	
	
	
    getNewFeed();
    ///////////////// handle location ///////////////
    gpsProvider = Ti.Geolocation.Android.createLocationProvider({
	    name: Ti.Geolocation.PROVIDER_NETWORK,
	    minUpdateTime: 300, 
	    minUpdateDistance: 100
	});
	Ti.Geolocation.Android.addLocationProvider(gpsProvider);
	Ti.Geolocation.Android.manualMode = true;

    
	
    var locationCallback = function(e) {
	    if (!e.success || e.error) {
	        Ti.API.info('error:' + JSON.stringify(e.error));
	    } else {
	    	
	    	Ti.App.Properties.setString('latitude',e.coords.latitude);
			Ti.App.Properties.setString('longitude',e.coords.longitude);
			Ti.API.info('coords: ' + JSON.stringify(e.coords));
		}
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
    
    self.addEventListener('android:back', function(e) {
	    e.cancelBubble = true;
	
	    Ti.App.fireEvent('android_back_button');
	});
    
    
    //////////////////  GCM ////////////////////////////////////////
    function gcmUpdateCallback(result, resultmsg){
		if(result == true){
			Ti.API.info('update gcm success.');
		}
		else{
			var alertCreateAccountDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:resultmsg
			});
			alertCreateAccountDlg.show();
			Ti.API.info('update gcm false.');

		}
	};
    
    var gcm = require('net.iamyellow.gcmjs');

	var pendingData = gcm.data;
	if (pendingData && pendingData !== null) {
		// if we're here is because user has clicked on the notification
		// and we set extras for the intent 
		// and the app WAS NOT running
		// (don't worry, we'll see more of this later)
		
		tmpdata = JSON.parse(pendingData.msg);
		if(tmpdata.type == 'comment'){
			FeedContentWindow = require('feedContentWindows');
			new FeedContentWindow(tmpdata.eventid, true).open(); 
		}
		Ti.API.info('******* data (started) ' + JSON.stringify(pendingData));
	}
	
	gcm.registerForPushNotifications({
		success: function (ev) {
			
	        oldGoogleToken = Ti.App.Properties.getString('googletoken','');
	        if(oldGoogleToken == ev.deviceToken){
	        	
	        }
	        else{
	        	var data = {
					'msgtoken': {'type':'a', 'token':ev.deviceToken}
				};
	        	datastring = JSON.stringify(data);
	        	Ti.App.Properties.setString('googletoken',ev.deviceToken);
	   	    	updateaccount(datastring,gcmUpdateCallback);
	        }

			// on successful registration
			Ti.API.info('******* success, ' + ev.deviceToken);
		},
		error: function (ev) {
			// when an error occurs
			Ti.API.info('******* error, ' + ev.error);
		},
		callback: function (data) {
			// when a gcm notification is received WHEN the app IS IN FOREGROUND
			tmpdata = JSON.parse(data.data);
			if(tmpdata.type == 'comment'){
			 	eventnumText.text =  parseInt(eventnumText.text) + 1  ;
			 	eventnumText.left = eventImg.rect.x + eventImg.rect.width - 5;
			 	eventnumText.top = eventImg.rect.y-5 ;
			 	eventnumText.width = '20dp';
			 	eventnumText.height = '20dp';
			 	eventnumText.visible = true;
			 	
			}
		},
		unregister: function (ev) {
			// on unregister 
			Ti.API.info('******* unregister, ' + ev.deviceToken);
		},
		data: function (data) {
			
			tmpdata = JSON.parse(data.msg);
			if(tmpdata.type == 'comment'){
				FeedContentWindow = require('feedContentWindows');
				new FeedContentWindow(tmpdata.eventid, true).open(); 
			}
			// if we're here is because user has clicked on the notification
			// and we set extras in the intent 
			// and the app WAS RUNNING (=> RESUMED)
			// (again don't worry, we'll see more of this later)
			Ti.API.info('******* data (resumed) ' + JSON.stringify(data));
		}
	});
    
	return self;
}

//make constructor function the public component interface
module.exports = feedWindow;