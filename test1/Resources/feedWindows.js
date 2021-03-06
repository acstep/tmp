//Main Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");
Ti.include("baseFeedView.js");

function feedWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	var categoryChanged = false;
	
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
	
	}
	else{
		var GA = require('analytics.google');
		var tracker = GA.getTracker("UA-50815409-1");
		tracker.trackScreen('feedWindow');
	}
  	

    
	var listappImg = Titanium.UI.createImageView({
		image:'list.png',
		top: '10dp', left:'10dp', height: '30dp', width: '30dp'
	});
	
	var menuclose = true;
	function switchBackgroundView(close)	{
		Ti.API.info('switchBackgroundView'); 
		if(close == true){ 
			menuclose = true;
			var animation = Titanium.UI.createAnimation();
			animation.left = '0%';
			animation.duration = 300;
	        backgroundView.animate(animation);
	        if(categoryChanged == true){
	        	categoryChanged = false;
	        	getNewFeed();
	        }
		}
		else{
			menuclose = false;
			var animation = Titanium.UI.createAnimation();
			animation.left = '80%';
			animation.duration = 300;
	        backgroundView.animate(animation);
		}
		
	};
	listappImg.addEventListener('click',function(e)
	{
		if(menuclose == true){
			switchBackgroundView(false);
		}
		else{
			switchBackgroundView(true);
		}
		
	    
	});	
	
	var setupImg = Titanium.UI.createImageView({
		image:'humannear.png',
		top: '10dp', right:'10dp', height: '30dp', width: '30dp'
	});
	
	setupImg.addEventListener('click',function(e)
	{

		var nearbyWindow = require('nearPeopleWindows');
		new nearbyWindow().open(); 
	});	
	
	var titleCenterView = Ti.UI.createView({
		
		width:'50%',
		height:'50dp',
		top:'0dp',
        layout: 'horizontal',
		center:{x:'50%',y:'50%'}
	});
	
	var homeView = Ti.UI.createView({
		width:'33%',height:'50dp',	top:'0dp',
	});
	
	var homeImg = Titanium.UI.createImageView({
		image:'home.png',
		height: '20dp', width: '20dp'
	});
    homeView.add(homeImg);

	homeView.addEventListener('click',function(e)
	{
		Ti.API.info('homeView getnewfeed'); 
		getNewFeed();
 	});	
	
	var eventView = Ti.UI.createView({
		width:'33%',height:'50dp',	top:'0dp',
	});
	var eventImg = Titanium.UI.createImageView({
		image:'event.png',
		cneter:{x:'50%',y:'50%'}, height: '20dp', width: '20dp'
	});
    eventView.add(eventImg);
	eventView.addEventListener('click',function(e)
	{
		eventnumText.text =  0  ;
		eventnumText.visible = false;
		Ti.App.Properties.setInt('notifynum',0);
        
		var NotifyWindow = require('notifyWindows');
		new NotifyWindow().open();  

	});	

	var eventnumText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text: '0',
		color:'#ffffff',
		backgroundColor:'#e74c3c',
		borderRadius:20,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		visible:false
	});
	eventView.add(eventnumText);
	
	var talkView = Ti.UI.createView({
		width:'33%',height:'50dp',	top:'0dp',
	});
	var talkImg = Titanium.UI.createImageView({
		image:'talk.png',
		height: '20dp', width: '20dp'
	});
	
	var talknumText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text: '0',
		color:'#ffffff',
		backgroundColor:'#e74c3c',
		borderRadius:20,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		visible:false
	});

	talkView.addEventListener('click',function(e)
	{
        talknumText.text =  0  ;
        talknumText.visible = false;
        Ti.App.Properties.setInt('talknum',0);
		var chatroomWindow = require('chatroomWindows');
		new chatroomWindow().open();  

	});	
	
	talkView.add(talkImg);
	talkView.add(talknumText);
	
	
	titleCenterView.add(homeView);
	titleCenterView.add(eventView);
	titleCenterView.add(talkView);
	
	//   notify number ///
	
	
	titleView.add(listappImg);
	titleView.add(titleCenterView);
	titleView.add(setupImg);


    /////////  feed  ///////////////////
    var feedView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100%',
		height:'100%',
		top:'0dp',
		layout:'vertical'
	});
	
	/////////  feed  control  ///////////////////
	var feedControlView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'100%',
		height:'50dp',
		top:'0dp',
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
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('sortorder'),
		color:'#333333',
		top:'13dp',
  		left:'5%'
	});
	sortView.add(sortImg);
	sortView.add(sortText);
	
	
	
	sortView.addEventListener('click',function(e) {
	    Ti.API.info('sortView click.');
	    var sortDialog = Titanium.UI.createOptionDialog({

		    title: L('sorttype'),
		    options: [L('sorttime'),L('sortlike')],
		});
		
		sortDialog.addEventListener('click', function(e) {
			var orgsorttype = Ti.App.Properties.getString('sorttype','');
			if(e.index == 0){
				sorttype = 'time';
				Ti.App.Properties.setString('sorttype','time');
			}
			else{
				sorttype = 'like';
				Ti.App.Properties.setString('sorttype','like');
			}
			getNewFeed();
	
				
		});	
	    sortDialog.show();
	});
	
	
	
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
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('postnew'),
		color:'#333333',
		top:'13dp',
  		left:'5%'
	});
	postView.add(postImg);
	
	

	postView.addEventListener('click',function(e)
	{
		showPostDialog('');
	});	
	
	
	
	postView.add(postText);
	
	feedControlView.add(sortView);
	feedControlView.add(conSeperateView);
	feedControlView.add(postView);
	
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
	
	
	
	feedView.add(feedControlView);
	feedView.add(feedTableView);
	
	backgroundView.add(feedView);
	

	///////   menu  ///////////////
 	var mainMenu = Ti.UI.createScrollView({
        left:'0dp',
        top:'0dp',	
        width:'80%',
        backgroundColor:'#eeeeee',
        layout: 'vertical',
        contentHeight: 'auto',
        zIndex:1
     
	});
	
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
		mainMenu.top = 20;
	}
	
	
	var headImg = Titanium.UI.createImageView({
		borderRadius:5,backgroundImage:'headphoto.png',
		left:'0dp', height: '60dp', width: '60dp'
	});
	
	

	
	headImg.image = getHeadImg(Ti.App.Properties.getString('userid',''));
	
	
	Ti.App.addEventListener('changemenuhead',function(e) {
    	Ti.API.info('receive event changemenuhead ');
        headImg.image = getHeadImg(Ti.App.Properties.getString('userid',''));
	});
	
	
	var menuTopView = Ti.UI.createView({
		width:'90%',
		height:Titanium.UI.SIZE,
        left:'5%',
        top:'20dp'
	});
	
	menuTopView.addEventListener('click',function(e) {
	    var myFeedWindow = require('myFeedWindows');
		new myFeedWindow().open(); 
		switchBackgroundView(true);
	});
	
	
	
	
	var topNameText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: Ti.App.Properties.getString('username'),
		color:'#4aa3df',
		left:'80dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	menuTopView.add(headImg);
	menuTopView.add(topNameText);
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: L('category'),
		color:'#666666',
		left:'5%',
		top: '20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	
	function baseAppWindow(index){
	    var baseAppWindow = require('baseAppWindows');
		new baseAppWindow(categoryMenu[index]).open(); 
		switchBackgroundView(true);
	}
	
	var categoryMenu = [
 
		{ leftImage:'group.png', title:'club',category:1001 , 'appfunction':baseAppWindow},
		{ leftImage:'sale1.png', title:'sale',category:1003 , 'appfunction':baseAppWindow},
		{ leftImage:'help.png', title:'needhelp',category:1002 , 'appfunction':baseAppWindow},
		{ leftImage:'love.png', title:'dating',category:1006 , 'appfunction':baseAppWindow},
		{ leftImage:'news.png', title:'news',category:1000 , 'appfunction':baseAppWindow},
		{ leftImage:'used.png', title:'used',category:1004 , 'appfunction':baseAppWindow},
		{ leftImage:'teambuy.png', title:'teambuying',category:1005 , 'appfunction':baseAppWindow},
		{ leftImage:'gossip.png', title:'gossip',category:1007 , 'appfunction':baseAppWindow},
		{ leftImage:'parttime.png', title:'parttime',category:1008 , 'appfunction':baseAppWindow},
		{ leftImage:'blog.png', title:'blog',category:1009 , 'appfunction':baseAppWindow}
	]; 
	
	
	var cateDate = [];
	for(var i = 0 ; i <= categoryMenu.length -1; i++) {
		var row = Titanium.UI.createTableViewRow({
            showVerticalScrollIndicator:false,
			backgroundColor:'transparent',
			width:'90%',
			height:'50dp',
	        left:'5%'
            
		});
		
		var groupView = Ti.UI.createView({
			width:'100%',
			height:'50dp',
			layout: 'horizontal'
		});
		
		var groupImg = Titanium.UI.createImageView({
			image:categoryMenu[i].leftImage,
			backgroundColor:'transparent',left:'5dp',
			top: '10dp',  height: '30dp', width: '30dp'
		});
		
		var groupText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
			text: L(categoryMenu[i].title),
			backgroundColor:'transparent',
			color:'#777777',
			left:'20dp',
			top: '13dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		var checkboxView = Ti.UI.createView({
			right:'0dp'
		});
		
		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
		}
		else{
			checkboxView.width = '20%';
			checkboxView.height = '50dp'; 
		}
			
		
		var category = Ti.App.Properties.getList('category',[]);
		var tmpExist = false;
		if(category.indexOf(categoryMenu[i].category) != -1){
			tmpExist = true;
		}
		
		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
			var enableSwitch = Ti.UI.createSwitch({
			    textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT,right:0,
			    value:tmpExist,
			});
		}
		else{
			var enableSwitch = Ti.UI.createSwitch({
			    style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
			    textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
			    value:tmpExist,
			});
		}
	
		
		enableSwitch.category = categoryMenu[i].category;
		
		
		enableSwitch.addEventListener('change',function(e){
			Ti.API.info(this.category);
			var tmpCategory = Ti.App.Properties.getList('category',[]);
			if(this.value == true){
				if(tmpCategory.indexOf(this.category) == -1){
					tmpCategory.push(this.category);
					Ti.App.Properties.setList('category',tmpCategory);
					categoryChanged = true;
					Ti.API.info('change category left: ' +  tmpCategory);
				}
			}
			else{
				if(tmpCategory.indexOf(this.category) != -1){
					tmpCategory.splice(tmpCategory.indexOf(this.category) , 1 );
					Ti.App.Properties.setList('category',tmpCategory);
					categoryChanged = true;
					Ti.API.info('change category left: ' +  tmpCategory);
				}
			}
			
		    e.cancelBubble = true;
		});		
		enableSwitch.addEventListener('click',function(e){
		    e.cancelBubble = true;
		});		
		checkboxView.add(enableSwitch);

		groupView.add(groupImg);
		groupView.add(groupText);
        row.add(groupView);
        row.add(checkboxView);
		cateDate.push(row);
	}
	
	var memuTableView = Ti.UI.createTableView({  
	    data:cateDate,
	    width:'90%',
	    top: '10dp'
	});  
	
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
		memuTableView.backgroundColor ='transparent';
	    memuTableView.height = Titanium.UI.SIZE;
	}
	
	memuTableView.addEventListener('click',function(e) {
		categoryMenu[e.index]['appfunction'](e.index);
	});
	
	var menuParentView = Ti.UI.createView({
		backgroundColor:'#eeeeee',
		height:Titanium.UI.SIZE,
		top:'10dp', width:'100%',height:Titanium.UI.SIZE
		
	});
	
	////////////////////////main menu command  ////////////////////////
	var mainMenuList = [
	    { leftImage:'ppl.png', title:'groups' },
        { leftImage:'add.png', title:'creategroup' },
		{ leftImage:'setupm.png', title:'setup' },
		{ leftImage:'jumpm.png', title:'jump' },
		{ leftImage:'logoutm.png', title:'logout'},
	]; 
	
	var mainMenuListRow = [];
	for(var i = 0 ; i <= mainMenuList.length -1; i++) {
		var row = Titanium.UI.createTableViewRow({
            showVerticalScrollIndicator:false,
			backgroundColor:'transparent',
			width:'90%',
			height:'50dp',
	        left:'5%',
            layout: 'horizontal'
		});
		
		
		
		var groupImg = Titanium.UI.createImageView({
			image:mainMenuList[i].leftImage,
			backgroundColor:'transparent',left:'5dp',
			top: '10dp',  height: '30dp', width: '30dp'
		});
		
		var groupText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
			text: L(mainMenuList[i].title),
			backgroundColor:'transparent',
			color:'#777777',
			left:'20dp',
			top: '13dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		
		row.add(groupImg);
		row.add(groupText);
		mainMenuListRow.push(row);
	}	
	
	var memuCommandTableView = Ti.UI.createTableView({  
	    data:mainMenuListRow,
	    width:'90%',
	    top: '10dp'
	});  
	
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
		memuCommandTableView.backgroundColor ='transparent';
	    memuCommandTableView.height = Titanium.UI.SIZE;
	}
	
	memuCommandTableView.addEventListener('click',function(e) {
		switch(e.index){
			case 0:
				var groupListWindow = require('groupsWindows');
				new groupListWindow('new','').open(); 
				switchBackgroundView(true);
			break;	
			case 1:
				var createGroupWindow = require('createGroupWindows');
				new createGroupWindow('new','','').open(); 
				switchBackgroundView(true);
			break;	
			case 2:
				var SetupWindow = require('setupWindows');
				new SetupWindow().open(); 
				switchBackgroundView(true);
			break;		
			case 3:
			    // set location 
				var JumpWindow = require('jumpWindows');
				new JumpWindow().open(); 
				switchBackgroundView(true);
			    break;	
			case 4:
			    //logout
			    clearProperty();
				self.close();
				var LoginWindow = require('loginWindows');
				new LoginWindow().open();
				break;
			default:
					
		}
		   

	});
	
	mainMenu.add(menuTopView);
	mainMenu.add(categoryText);
	mainMenu.add(createMenuSepLine());
	mainMenu.add(menuParentView);
	menuParentView.add(memuTableView);
    mainMenu.add(createMenuSepLine());
	mainMenu.add(memuCommandTableView);
	self.add(mainMenu);

	
	// get current position and render fee
	var latitude = 0;
	var longitude = 0;
	var lastposupdate = 0;
	var currentdate = new Date(); 
	var nexttime = parseInt(currentdate.getTime()/1000);
	var nextlike = 0;
	var firstFeed = true;
	
	//////////////////   Draw feeds  /////////////////////////
	var feeditem = [];
	var drawFunction = {	   
		    'base':createBaseFeedView ,
		    'template1':drawtemplate1Event ,
		    'template2':drawtemplate2Event
	};
	
	var layoutDataDes = {
		'1000': {'layouttype':'base','title': 'news','color':'#2ecc71','catimage':'newsicon.png'},
		'1001': {'layouttype':'template1','title':'club','color':'#f39c12','catimage':'groupicon.png'},
		'1002': {'layouttype':'base','title':'needhelp','color':'#ff0000','catimage':'help2.png'},
		'1003': {'layouttype':'base','title':'sale','color':'#ff0000','catimage':'sale2.png'},
		'1004': {'layouttype':'base','title':'used','color':'#bdc3c7','catimage':'usedicon.png'},
		'1005': {'layouttype':'base','title':'teambuying','color':'#9b59b6','catimage':'teambuyicon.png'},
		'1006': {'layouttype':'template2','title':'dating','color':'#e667af','catimage':'loveicon.png'},
		'1007': {'layouttype':'base','title':'gossip','color':'#e667af','catimage':'gossipicon.png'},
		'1008': {'layouttype':'base','title':'parttime','color':'#1abc9c','catimage':'parttimeicon.png'},
		'1009': {'layouttype':'base','title':'blog','color':'#9b59b6','catimage':'blogicon.png'}
	};
	
	
	function parseFeed(result, feedData,nextstarttime){
		feedLoading = false;
		try{
			feedRowstatus = 'none';
			feedTableView.deleteRow(loadRow);
		}
		catch(err){
			
		}

		if(result == true){
			
			Ti.API.info(feedData);
			if(feedData.length == 0 && firstFeed == true){
				Ti.API.info('new area!'); 
				var exampleData = {    
                        "eventid":'',
                        "ownerid":'',
                        "photos":[],
                        "lastupdate":(new Date().getTime()/1000),
                        "loc" : { "type" : "Point" , "coordinates" : [ getLon(), getLat() ]},
                        "extime":0,
                        "title":"",
                        "des":L('noevent'),
                        "name":"System",
                        "like":0,
                        "comment":0,
                        "category":1000,
                        "starttime":(new Date().getTime()/1000),
                        "joinnumber":0,
                        "pdata":{},
                        "gid":"",
                        "gownerid":"",
                        "gname":"",
                   };
				feedData = [exampleData];
			}

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
				    	latitude = getLat();
						longitude = getLon();
				    	var data = {'info':feedData[i],
				    	            'lat':latitude,
				    	            'lon':longitude, 
				    	            'title':layoutDataDes[feedData[i]['category']].title,
				    	            'color':layoutDataDes[feedData[i]['category']].color,
				    	            'image':layoutDataDes[feedData[i]['category']].catimage,
				    	};
				    	Ti.API.info('11data.title: ' + data.title);
				    	Ti.API.info('22data.title: ' + layoutDataDes[feedData[i]['category']].title);
				    	drawFunction[layoutDataDes[feedData[i]['category']].layouttype](feedRow,data);

					    feedRow.eventid = feedData[i]['eventid']; 
					    feedtableItems.push(feedRow);
					    feedTableView.appendRow(feedRow);
				    }
				    catch(e){
				    	
				    }
				    
				}   

				Ti.App.Properties.setString('feed',JSON.stringify({'data':feeditem}));
				nexttime = nextstarttime;
			}
			forwardView.visible = false;
			
			firstFeed = false;	
		}
		else{
			Ti.API.info('parseFeed result error feedData= ' + feedData);
			forwardView.visible = false;
			if(feedData == 'networkerror' && firstFeed == true){
				
				firstFeed = false;
				var oldfeeditems = JSON.parse(Ti.App.Properties.getString('feed',{'data':[]}));
				Ti.API.info('parseFeed oldfeeditems= ' + Ti.App.Properties.getString('feed',{'data':[]}));
				for(var i = 0 ; i <= oldfeeditems.data.length -1; i++) {
					Ti.API.info('parseFeed result error drawFunction 0' );
					latitude = getLat();
					longitude = getLon();
				    //drawFunction[feedData[i].category.toString()](feedData[i]);
				    var feedRow = Ti.UI.createTableViewRow({
				        backgroundSelectedColor:'#dddddd',
				        backgroundColor:'#dddddd'
				        
				    });
				    try{
	    
					    var data = {'info':oldfeeditems.data[i],
				    	            'lat':latitude,
				    	            'lon':longitude, 
				    	            'title':layoutDataDes[oldfeeditems.data[i]['category']].title,
				    	            'color':layoutDataDes[oldfeeditems.data[i]['category']].color,
				    	            'image':layoutDataDes[oldfeeditems.data[i]['category']].catimage,
				    	};
				    	drawFunction[layoutDataDes[oldfeeditems.data[i]['category']].layouttype](feedRow,data);
					    feedRow.eventid = oldfeeditems.data[i]['eventid'];
					    feedtableItems.push(feedRow);
					    feedTableView.appendRow(feedRow);
					    
					    
					}
				    catch(e){
				    	
				    }    
				}   

				nexttime = oldfeeditems.data[(oldfeeditems.data.length -1)]['lastupdate'];
				nextlike = oldfeeditems.data[(oldfeeditems.data.length -1)]['like'];
			}
			forwardView.visible = false;
			firstFeed = false;	
		}

	}
	
	feedTableView.addEventListener('click', function(e){
    	var FeedContentWindow = require('feedContentWindows');
		new FeedContentWindow(e.row.eventid, true).open(); 
    });
    
    var loadRow = {};
	
	
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
				
				loadRow = Ti.UI.createTableViewRow({
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

        if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
	
		}
		else{
			var GA = require('analytics.google');
			var tracker = GA.getTracker("UA-50815409-1");
			tracker.trackEvent({category: "getNewFeed",action: "click",label: "getNewFeed main",value: 1});
		}
		

		
		Ti.API.info('getNewFeed ');
		feedtableItems = [];
		feedTableView.data = [];
		feedTableView.appendRow(refleshRow);
		forwardView.visible = true;
		var currentdate = new Date(); 
		nexttime = parseInt(currentdate.getTime()/1000);
		nextlike = 0;
		firstFeed = true;
		var distance = getDistance();
        var latitude = getLat();
		var longitude = getLon();
		var category = Ti.App.Properties.getList('category','none');
		var limitcount = parseInt(Ti.App.Properties.getInt('limitcount',5));
		var sorttype =  Ti.App.Properties.getString('sorttype','');
		Ti.API.info('getNewFeed sorttype: ' + sorttype);
		if(sorttype == 'time' || sorttype ==''){
			queryevent([longitude,latitude], distance, category, limitcount,'time', nexttime, 0,parseFeed);
		}
		else{
			queryevent([longitude,latitude], distance, category, limitcount,'like', 0, 'first',parseFeed);
		}
		
   
	};

    function getNextFeed(){
    	Ti.API.info('getNextFeed ');
    	var distance = getDistance();
    	var latitude = getLat();
		var longitude = getLon();
    	var sorttype =  Ti.App.Properties.getString('sorttype','');
    	var limitcount = parseInt(Ti.App.Properties.getInt('limitcount',5));
		if(sorttype == 'time' || sorttype ==''){
			queryevent([longitude,latitude], distance, category, limitcount,'time', nexttime, 0,parseFeed);
		}
		else{
			queryevent([longitude,latitude], distance, category, limitcount,'like', 0, nextlike,parseFeed);
		}
    	   
    };
    
    Ti.App.addEventListener('getnewfeed',function(e) {
    	Ti.API.info('receive event getNewFeed ');
        getNewFeed();
	});
	
	Ti.App.addEventListener('closechatroom',function(e) {
    	talknumText.text =  0  ;
        talknumText.visible = false;
	});
	
	
	
	
	
	function shownotifynum(notifynum){
		eventnumText.text =  notifynum  ;
	 	eventnumText.left = eventImg.rect.x + eventImg.rect.width - 5;
	 	eventnumText.top = eventImg.rect.y-5 ;
	 	eventnumText.width = '20dp';
	 	eventnumText.height = '20dp';
	 	eventnumText.visible = true;

	}
	
	function showtalknum(talknum){
	 	
	 	talknumText.text =  talknum ;
	 	talknumText.left = talkImg.rect.x + talkImg.rect.width - 5;
	 	talknumText.top = talkImg.rect.y-5 ;
	 	talknumText.width = '20dp';
	 	talknumText.height = '20dp';
	 	talknumText.visible = true;
	}
	
    ///////////////   scroll  update and next logic ////////////////////

    if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
	
	}
	else{
		///////////////// handle location ///////////////
    
	    var locationsrc = Ti.App.Properties.getString('locationsrc','network');
	    
	    
		var locationProvider = {};
		
		if(locationsrc == 'gps'){
			locationProvider = Ti.Geolocation.Android.createLocationProvider({
		    	name: Ti.Geolocation.PROVIDER_GPS,
			    minUpdateTime: 300, 
			    minUpdateDistance: 300
			});
		}
		else{
			locationProvider = Ti.Geolocation.Android.createLocationProvider({
		    	name: Ti.Geolocation.PROVIDER_NETWORK,
			    minUpdateTime: 300, 
			    minUpdateDistance: 300
			});
		}
		
		
		Ti.Geolocation.Android.addLocationProvider(locationProvider);
		Ti.Geolocation.Android.manualMode = true;
	
	    Ti.App.addEventListener('changelocationsrc',function(e) {
	
	    	var locationsrc = Ti.App.Properties.getString('locationsrc','network');
	    	Ti.Geolocation.Android.removeLocationProvider(locationProvider);
	    	if(locationsrc == 'gps'){
	    		Ti.API.info('receive event changegps ');
		    	locationProvider = Ti.Geolocation.Android.createLocationProvider({
			    	name: Ti.Geolocation.PROVIDER_GPS,
				    minUpdateTime: 300, 
				    minUpdateDistance: 300
				});
		        Ti.Geolocation.Android.addLocationProvider(locationProvider);
	    	}
	    	else{
	    		Ti.API.info('receive event changenetwork ');
		    	locationProvider = Ti.Geolocation.Android.createLocationProvider({
			    	name: Ti.Geolocation.PROVIDER_NETWORK,
				    minUpdateTime: 300, 
				    minUpdateDistance: 300
				});
		        Ti.Geolocation.Android.addLocationProvider(locationProvider);
	    	}
		});
		
	
	    var firstOpen = false;
	
	    var locationCallback = function(e) {
		    if (!e.success || e.error) {
		        Ti.API.info('error:' + JSON.stringify(e.error));
		    } 
		    else {
		    	
		    	var oldlatitude = Ti.App.Properties.getDouble('latitude',e.coords.latitude);
		    	var oldlongitude = Ti.App.Properties.getDouble('longitude',e.coords.longitude);
				Ti.API.info('lat lot : ' + oldlatitude +'  ' +e.coords.latitude+'  '+ oldlongitude +'  '+ e.coords.longitude);
				var distance = GetDistance(oldlatitude, oldlongitude, e.coords.latitude, e.coords.longitude, 'K');
				Ti.API.info('distance : ' + distance);
		        // if user move than 500m update the postion to server
		    	if(distance > 0.5 || firstOpen == false){
		    		var data = {
						'pos':[e.coords.longitude,e.coords.latitude],
						'geoapp':'true'
					};
			    
				    var datastring = JSON.stringify(data);
				    Ti.API.info('datastring : ' + datastring);
				    firstOpen = true;
			    	updatepos(datastring);
		    	}
		    	
		    	
		    	Ti.App.Properties.setDouble('latitude',e.coords.latitude);
				Ti.App.Properties.setDouble('longitude',e.coords.longitude);
				Ti.API.info('coords: ' + JSON.stringify(e.coords));
			}
		};
		Titanium.Geolocation.addEventListener('location', locationCallback);
	    
	    self.addEventListener('android:back', function(e) {
	    	if(menuclose == true){
	    		var activity = Titanium.Android.currentActivity;
	        	activity.finish();
	    	}
		    e.cancelBubble = true;
		    switchBackgroundView(true);
		    Ti.App.fireEvent('android_back_button');
		});
	    
	    
	    //////////////////  GCM ////////////////////////////////////////
	    function gcmUpdateCallback(result, resultmsg){
			if(result == true){
				Ti.API.info('update gcm success.');
			}
			else{
				
				showAlert('Error !', resultmsg);
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
			
			var tmpdata = JSON.parse(pendingData.msg);
			if(tmpdata.type == 'comment'){
				
				var FeedContentWindow = require('feedContentWindows');
				new FeedContentWindow(tmpdata.eventid, true).open(); 
			}
			if(tmpdata.type == 'talk'){
				
			}
			Ti.API.info('******* data (started) ' + JSON.stringify(pendingData));
		}
		
		gcm.registerForPushNotifications({
			success: function (ev) {
				
		        var oldGoogleToken = Ti.App.Properties.getString('googletoken','');
		        if(oldGoogleToken == ev.deviceToken){
		        	
		        }
		        else{
		        	var data = {
						'msgtoken': {'type':'a', 'token':ev.deviceToken}
					};
		        	var datastring = JSON.stringify(data);
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
				var tmpdata = JSON.parse(data.data);
				if(tmpdata.type == 'comment'){
					Ti.API.info('get comment notify');
					var notifynum = Ti.App.Properties.getInt('notifynum',0);
					notifynum = notifynum + 1;
					Ti.App.Properties.setInt('notifynum',notifynum);
					if(notifynum > 0){
						shownotifynum(notifynum);
					}
	
				}
				if(tmpdata.type == 'talk'){
					var talkingRoomID = Ti.App.Properties.getString('TalkRoomID','');
					var userid = Ti.App.Properties.getString('userid','');
					if(talkingRoomID == tmpdata.roomid){
						Ti.App.fireEvent('updattalk',tmpdata);
						return;
					}
					if(tmpdata.owner != userid){
						var roominfo = JSON.parse(Ti.App.Properties.getString('roominfo','{}'));
						if(typeof(roominfo[tmpdata.roomid] )== 'undefined'){
							var currentdate = new Date(); 
							var starttime = parseInt(currentdate.getTime()/1000);
							roominfo[tmpdata.roomid] = {'number':1,'time':starttime};
							Ti.API.info(' roominfo bbb' + JSON.stringify(roominfo));
						}
						else{
							if(tmpdata.owner != userid)
								roominfo[tmpdata.roomid]['number'] = roominfo[tmpdata.roomid]['number'] + 1;
							Ti.API.info(' roominfo aaa' + JSON.stringify(roominfo));
						}
						Ti.App.Properties.setString('roominfo',JSON.stringify(roominfo));
						
						var talknum = Ti.App.Properties.getInt('talknum',0);
						talknum = talknum + 1;
						Ti.App.Properties.setInt('talknum',talknum);
						if(talknum > 0){
							showtalknum(talknum);
						}
	
					 	Ti.App.fireEvent('updatechatroom',tmpdata);
					}
					
				}
			},
			unregister: function (ev) {
				// on unregister 
				Ti.API.info('******* unregister, ' + ev.deviceToken);
			},
			data: function (data) {
	
				var tmpdata = JSON.parse(data.msg);
	
				if(tmpdata.type == 'comment'){
					var notifynum = Ti.App.Properties.getInt('notifynum',0);
					if(notifynum > 0){
						shownotifynum(notifynum);
					}
				}
				
				if(tmpdata.type == 'talk'){
					
					var talkingRoomID = Ti.App.Properties.getString('TalkRoomID','');
	
					if(talkingRoomID == tmpdata.roomid){
						Ti.App.fireEvent('updattalk',tmpdata);
						return;
					}
					var talknum = Ti.App.Properties.getInt('talknum',0);
					if(talknum > 0){
						showtalknum(talknum);
					}
				 	Ti.App.fireEvent('updatechatroom',tmpdata);
				}
				
				
				// if we're here is because user has clicked on the notification
				// and we set extras in the intent 
				// and the app WAS RUNNING (=> RESUMED)
				// (again don't worry, we'll see more of this later)
				Ti.API.info('******* data (resumed) ' + JSON.stringify(data));
			}
		});
		
	    setTimeout(function(){
		    var notifynum = Ti.App.Properties.getInt('notifynum',0);
		    if(notifynum > 0){
				shownotifynum(notifynum);
			}
	
		 	var talknum = Ti.App.Properties.getInt('talknum',0);
			if(talknum > 0){
				showtalknum(talknum);
			}
			
		}, 5000);
		
		setTimeout(function(){
		    var notifynum = Ti.App.Properties.getInt('notifynum',0);
		    if(notifynum > 0){
				shownotifynum(notifynum);
			}
	
		 	var talknum = Ti.App.Properties.getInt('talknum',0);
			if(talknum > 0){
				showtalknum(talknum);
			}
			
		}, 1000);
	    
	    self.addEventListener('open', function(ev) {
	        self.activity.addEventListener('resume', function(e) {
	            var notifynum = Ti.App.Properties.getInt('notifynum',0);
			    if(notifynum > 0){
					shownotifynum(notifynum);
				}
			 	var talknum = Ti.App.Properties.getInt('talknum',0);
				if(talknum > 0){
					showtalknum(talknum);
				}
	        });
	    });
	}
    
	
	var tmplatitude = getLat();
	var tmplongitude = getLon();
	if(tmplatitude == -1 || tmplongitude == -1){
		Titanium.Geolocation.getCurrentPosition(function(e){

		    if(e.error){
		        Ti.API.error(e.error);
		        return;
		    }
		    Ti.App.Properties.setDouble('latitude',e.coords.latitude);
			Ti.App.Properties.setDouble('longitude',e.coords.longitude);
		    getNewFeed();
		});
	}
	else{
		getNewFeed();
	}
    
	return self;
}

//make constructor function the public component interface
module.exports = feedWindow;