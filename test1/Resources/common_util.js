

var raduisItems = [100,200,300,500,1000,2000,5000,10000,20000,50000,100000];

function getUserID(){
	return Ti.App.Properties.getString('userid','');
}


function getDistance(){
	return (parseFloat(raduisItems[Ti.App.Properties.getInt('distance',feedDistance)])/1000)/1.6;
}

function getLat(){
	if(Ti.App.Properties.getString('locklocation','false') == 'true'){
		Ti.API.info('getLat: locklocation : '  +  parseFloat(Ti.App.Properties.getDouble('locklatitude',-1)));
		return parseFloat(Ti.App.Properties.getDouble('locklatitude',-1));
	}
	return parseFloat(Ti.App.Properties.getDouble('latitude',-1));
}

function getLon(){
	if(Ti.App.Properties.getString('locklocation','false') == 'true'){
		Ti.API.info('getLon: locklocation : ' + parseFloat(Ti.App.Properties.getDouble('locklongitude',-1)) );
		return parseFloat(Ti.App.Properties.getDouble('locklongitude',-1));
	}
	return parseFloat(Ti.App.Properties.getDouble('longitude',-1));
}

function checkTokenError(result){
	return;
}

function clearProperty(){
	var devicetoken = Ti.App.Properties.getString('googletoken','');
	if(devicetoken != ''){
		logout(devicetoken);
		Ti.App.Properties.setString('googletoken','');
	}
    Ti.App.Properties.setString('userid','');
	Ti.App.Properties.setString('token','');
	Ti.App.Properties.setString('useremail','');
	Ti.App.Properties.setString('locklocation','false');
	Ti.App.Properties.setInt('gender',0);
	Ti.App.Properties.setList('category',[1000,1001,1002,1003,1004,1005,1006,1007]);
	Ti.App.Properties.setString('username','');
	Ti.App.Properties.setString('school','');
	Ti.App.Properties.setString('intro','');
	Ti.App.Properties.setString('work','');
	Ti.App.Properties.setInt('birthday',946656000);
	Ti.App.Properties.setString('sorttype','time');
	Ti.App.Properties.setInt('distance',5);
	Ti.App.Properties.setString('locationsrc','network');
	Ti.App.Properties.setString('roominfo','{}');
	Ti.App.Properties.setString('savedChatroomData','[]');
	Ti.App.Properties.setString('TalkRoomID','');
	Ti.App.Properties.setString('useremail','');
	Ti.App.Properties.setInt('notifynum',0);
	Ti.App.Properties.setInt('talknum',0);
	Ti.App.Properties.setDouble('userchooselatitude',-1);
	Ti.App.Properties.setDouble('userchooselongitude',-1);
	Ti.App.Properties.setList('photos',[]);

}

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
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:14, fontWeight:'bold'},
		  style:Titanium.UI.ActivityIndicatorStyle.BIG,
	
	});
	
	forwardView.add(loginIndicator);
	loginIndicator.show();
	
	return self;
}


function createNormalFeed(viewobj,category){
	/////////  feed  ///////////////////
	
	var lat = getLat();
	var lon = getLon();
    var feedView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100%',
		height:'100%',
		top:'0dp',
		layout:'vertical'
	});
	var pageRow = {};
	var limitcount = parseInt(Ti.App.Properties.getInt('limitcount',5));
	
	Ti.API.info('category backup  ' + category + ' : ' + Ti.App.Properties.getString(category.toString(),{'data':[]}));
	/////////////   scroll feed  ////////////////////////////

	var feedTableView = Ti.UI.createTableView({
		showVerticalScrollIndicator:false,
        backgroundSelectedColor:'#dddddd',
        top:'0dp',
	    left:'0dp',bottom:'0dp',
	    layout: 'vertical',
	    backgroundColor:'#dddddd',
        separatorColor:'#dddddd',
		data:[]
    });
	
	
	var getNewFeedHintView = Ti.UI.createView({
		height:'0dp',
		top:'50dp',
	});


	feedView.add(feedTableView);
	
	viewobj.add(feedView);

	// get current position and render fee

	var lastposupdate = 0;
	var currentdate = new Date(); 
	var nexttime = parseInt(currentdate.getTime()/1000);
	var nextlike = 0;
	var firstFeed = true;
	//////////////////   Draw feeds  /////////////////////////
	var feeditem = [];
	var oldfeeditems = {};
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
				    	var latitude = getLat();
						var longitude = getLon();
				    	var data = {'info':feedData[i],
				    	            'lat':latitude,
				    	            'lon':longitude, 
				    	            'title':layoutDataDes[feedData[i]['category']].title,
				    	            'color':layoutDataDes[feedData[i]['category']].color,
				    	            'image':layoutDataDes[feedData[i]['category']].catimage,
				    	};
				    	var tmpfeed = {
				    		draw : drawFunction[layoutDataDes[feedData[i]['category']].layouttype]
				    	};
				    	
				    	//drawFunction[layoutDataDes[feedData[i]['category']].layouttype];
				    	tmpfeed.draw(feedRow,data);
				    	//drawFunction[layoutDataDes[feedData[i]['category']].layouttype](feedRow,data);

					    feedRow.eventid = feedData[i]['eventid']; 

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
				nexttime = nextstarttime;
				
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
				else if(category == 'myfeed'){
					oldfeeditems = JSON.parse(Ti.App.Properties.getString('myfeed',{'data':[]}));
				}
				else{
					return;
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

					    feedTableView.appendRow(feedRow);
					}
				    catch(e){
				    	
				    }    
				}   

				nexttime = oldfeeditems.data[(oldfeeditems.data.length -1)]['lastupdate'];
				nextlike = oldfeeditems.data[(oldfeeditems.data.length -1)]['like'];
			}
			viewobj.forwardView.visible = false;
			firstFeed = false;	
		}

	}
	
	feedTableView.addEventListener('click', function(e){
		if(e.row.eventid == ''){
			return;
		}
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

		if((e.firstVisibleItem + e.visibleItemCount) == feedTableView.data[0].rowCount){
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
		Ti.API.info('getNewFeed ');
		feedTableView.data = [];
		feedTableView.appendRow(refleshRow);
		viewobj.forwardView.visible = true;
		var currentdate = new Date(); 
		nexttime = parseInt(currentdate.getTime()/1000);
		firstFeed = true;
        nextlike = 0;
        var latitude = 0;
        var longitude = 0;
        var distance = getDistance();
		
		if(category == 'myfeed'){
			latitude = getLat();
			longitude = getLon();
			querymyevent(limitcount, nexttime, parseFeed);
		}
		else if(category == 'group'){
			pageRow = Ti.UI.createTableViewRow({
		        backgroundSelectedColor:'#dddddd', backgroundColor:'#ffffff', layout:'vertical', height: Ti.UI.SIZE
		    });
		    
			createPage(pageRow,viewobj.gid);
		}
		else{
			latitude = getLat();
			longitude = getLon();
			
			
			var sorttype =  Ti.App.Properties.getString('sorttype','');
			if(sorttype == 'time' || sorttype ==''){
				queryevent([longitude,latitude], distance, [category], limitcount,'time', nexttime, 0,parseFeed);
			}
			else{
				queryevent([longitude,latitude], distance, [category], limitcount,'like', 0, 'first',parseFeed);
			}
			
		}
		
   
	};

    function getNextFeed(){
    	Ti.API.info('getNextFeed ');
    	var distance = getDistance();
    	var latitude = 0;
        var longitude = 0;
        
    	if(category == 'myfeed'){
			querymyevent(limitcount, nexttime, parseFeed);
		}
		else if(category == 'group'){
			queryGroupevent(viewobj.gid,limitcount, nexttime, parseFeed);
		}
		else{
			latitude = getLat();
			longitude = getLon();
			
			
			var sorttype =  Ti.App.Properties.getString('sorttype','');
			if(sorttype == 'time' || sorttype ==''){
				queryevent([longitude,latitude], distance, [category], limitcount,'time', nexttime, 0,parseFeed);
			}
			else{
				queryevent([longitude,latitude], distance, [category], limitcount,'like', 0, nextlike,parseFeed);
			}
			
		}
    	
    };
    
    Ti.App.addEventListener('getnewfeed',function(e) {
    	Ti.API.info('receive event getNextFeed ');
        getNewFeed();
	});
	
	function queryGroupCallback(result, data){
		if(result == true){
			 
			 viewobj.drawInfoFunc(pageRow, data);
			 var myid = Ti.App.Properties.getString('userid','');
			 if(myid == data['ownerid']){
			 	 viewobj.addButton.visible = true;
			 }
             
             pageRow.eventid = '';
             feedTableView.appendRow(pageRow);
             
             queryGroupevent(viewobj.gid,limitcount, nexttime, parseFeed);
		}
		else{
			viewobj.forwardView.visible = false;
			showAlert('Error !', data);
		}
		
	};
    
	function createPage(viewobj,gid){
		querygroup(gid,queryGroupCallback);
	}
	
	viewobj.getNewFeed = getNewFeed;
	viewobj.getNextFeed = getNextFeed;
	
}


function showAlert(title, message){
	var msgString = '';
	var titleString = '';
	switch(message){
		case 'networkerror':
		    titleString = L('error');
		    msgString = L('networkerror');
			break;
		case 'passempty':
			titleString = L('error');
			msgString = L('passempty');	
			break;
		case 'passverifyerror':
		    titleString = L('error');
			msgString = L('passverifyerror');	
			break;	
		case 'loginerror':
			titleString = L('error');
			msgString = L('loginerror');	
			break;		
		case 'emailempty':
			titleString = L('error');
			msgString = L('emailempty');	
			break;		
		case 'nameempty':
			titleString = L('error');
			msgString = L('nameempty');	
			break;	
		case 'fieldempty':
		 	titleString = L('error');
			msgString = L('fieldempty');	
			break;					
		case 'emailpassempty':
		 	titleString = L('');
			msgString = L('emailpassempty');	
			break;		
		case 'passsend':
		 	titleString = L('');
			msgString = L('passsend');	
			break;	
		case 'goverify':
		 	titleString = L('');
			msgString = L('goverify');	
			break;					
		default:
			
	}
	
	
	var alertDlg = Titanium.UI.createAlertDialog({
		title:title,
		message:msgString
	});
	alertDlg.show();
}


function getCurrentLocation(){
	Titanium.Geolocation.getCurrentPosition(function(e){
  
	    if(e.error){
	        Ti.API.error(e.error);
	        return;
	    }
		Ti.App.Properties.setDouble('latitude',e.coords.latitude);
		Ti.App.Properties.setDouble('longitude',e.coords.longitude);
		Ti.API.info('coords: ' + JSON.stringify(e.coords));   
		Ti.App.fireEvent('getnewfeed');
	});
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

function createMenuSepLine(){
	return Ti.UI.createView({ backgroundColor:'#666666', width:'90%', height:'1dp', top:'10dp', left:'5%'});
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
	var stringindex = -1;
	var desString = '';
    var firstSpaceIndex = orgstring.indexOf(" ",start);
    var firstlinebreakIndex = orgstring.indexOf("\n",start);
    var firstdotIndex = orgstring.indexOf(".",start);
    var firstcommaIndex = orgstring.indexOf(",",start);
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
	
	var latitude = data['loc']['coordinates'][1];
	var longitude = data['loc']['coordinates'][0];
	
	
	
	mapView.add(addressText);
	
	var mapParentView = Titanium.UI.createView({
		height: '200dp', width: '100%',backgroundColor:'transparent',
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
	        var FeedContentWindow = require('feedContentWindows');
	  		new FeedContentWindow(e.source.getParent().eventid, false).open(); 
        	
        }
        else{
        	Ti.API.info('postView click.');
	        var FeedContentWindow = require('feedContentWindows');
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
	
	if(data['gid'] != ''){
		headPhotoImg.image = getHeadImg(data['gid']);
	}
	else{
		headPhotoImg.image = getHeadImg(data['ownerid']);
	}
	

	
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
	if(data['gid'] == undefined){
		data['gid'] = '';
	}
	if(data['gid'] != ''){
		nameText.text = data['gname'];
	}
	
	var eventtime = new Date(data['lastupdate']);
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
		font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
		text: timeString,
		color:'#aaaaaa',
		top:'1dp',
		left:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	

	
	var feeddistance = GetDistance(lat, lon, data.loc['coordinates'][1], data['loc']['coordinates'][0], 'K');
	var feedDistanceStr = ''; 
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

function openPeopleInfoWin(id){
	var PersonInfoWindow = require('personInfoWindows');
	new PersonInfoWindow(id).open();
}

function openGroupInfoWin(id){
	var GroupInfoWindow = require('gFeedWindows');
	new GroupInfoWindow(id).open();
}

function showPostDialog(gid){
	var postDialog = Titanium.UI.createOptionDialog({
    //title of dialog
	    title: L('choosecategory'),
	    //options
	    options: [L('club'),L('sale'), L('needhelp'), L('dating'), L('news'), L('used'), L('teambuying'), L('gossip')],
	    //index of cancel button
	});
	
	postDialog.addEventListener('click', function(e) {
		Ti.API.info('postView click.');
		switch(e.index){
			case 0:
			   var data = {
			    	'title': 'club',
			    	'titlehinttext':'activitytitle',
			    	'grouphinttext':'groupname',
			    	'deshinttext':'addactivitycontent',
			    	'category':1001,
			    	'gid':gid
			    };
			    var Template1PostWindow = require('template1PostWindows');
				new Template1PostWindow(data).open(); 
				break;
			case 1:
			    var data = {
			    	'title':'sale',
			    	'hinttext':'addsalescontent',
			    	'category':1003,
			    	'gid':gid
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(data).open(); 
				break;	
			case 2:
			    var data = {
			    	'title':'needhelp',
			    	'hinttext':'addhelpcontent',
			    	'category':1002,
			    	'gid':gid
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(data).open(); 
				break;	
			case 3:
			    var data = {
			    	'title': 'dating',
			    	'titlehinttext':'purpose',
			    	'placehinttext':'preferredplace',
			    	'deshinttext':'addsocialcontent',
			    	'category':1006,
			    	'gid':gid
			    };
			    var Template1PostWindow = require('template2PostWindows');
				new Template1PostWindow(data).open(); 
				break;		
			case 4:
			    var data = {
			    	'title': 'news',
			    	'hinttext':'addnewscontent',
			    	'category':1000,
			    	'gid':gid
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(data).open(); 
				break;	
			case 5:
			    var data = {
			    	'title': 'used',
			    	'hinttext':'addusedcontent',
			    	'category':1004,
			    	'gid':gid
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(data).open(); 
				break;
			case 6:
			    var data = {
			    	'title': 'teambuying',
			    	'hinttext':'addteambuycontent',
			    	'category':1005,
			    	'gid':gid
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(data).open(); 
				break;	
			case 7:
			    var data = {
			    	'title': 'gossip',
			    	'hinttext':'addgossipcontent',
			    	'category':1007,
			    	'gid':gid
			    };
			    var BasePostWindow = require('basePostWindows');
				new BasePostWindow(data).open(); 
				break;								
			default:
				
		}
        
	});

	postDialog.show();
}


function drawInfo(viewobj, data){

    	/////////////////   head photo  ///////////////////
		var topView = Ti.UI.createView({
		    backgroundColor: 'transparent',
		    width:'90%', height: '120dp',
		    top:'10dp',left:'5%'
		});
		
		
		///////////////////////  head photo  //////////////
		var headPhotoImg = Titanium.UI.createImageView({
	        borderRadius:15,backgroundImage:'headphoto.png',
			height: '100dp', width: '100dp', top:'10dp', left:'0dp'
		});
		headPhotoImg.image = getHeadImg(data['gid']);
		
		var contentView = Titanium.UI.createView({
			left:'120dp',backgroundColor:'transparent',
			height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
			layout: 'vertical'
		});
		
	
		  
		var nameText = Ti.UI.createLabel({
			font:{fontSize:'20sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			text: data['name'],
			color:'#333333',left:'0dp',top:'10dp'
		});
		contentView.add(nameText);
		
		var phoneNumView = Titanium.UI.createView({
			left:'0dp',backgroundColor:'transparent',
			height: Ti.UI.SIZE,width: Ti.UI.SIZE,top:'20dp',
			layout: 'horizontal',borderRadius:10
		});
		
		
		var phoneNumImg = Titanium.UI.createImageView({
	        height: '20dp', width: '20dp',image:'info.png'
		});
		

		phoneNumView.add(phoneNumImg);
		
		
		var phoneNumText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			color:'#3498db',left:'10dp',right:'10dp',
			text :data['phone']
		});
		phoneNumView.add(phoneNumText);
		
		phoneNumView.addEventListener('click',function(e){
			Ti.API.info('phoneNumView click.');
		    Ti.Platform.openURL('tel:' + data['phone']);
		});	
		
		contentView.add(phoneNumView);
		
		var desText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: data['des'],
			color:'#666666',backgroundColor:'#ffffff',
			top:'10dp', left:'3%', width:'94%', height:Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		////////////////  join  /////////////////////////////////////////////////
		var joinView = Ti.UI.createView({
		    backgroundColor: 'transparent',
		    layout: 'horizontal',
		    top:'20dp',left:'0dp',width:'100%',height:'50dp'
		});
		
		var joinNumberView = Ti.UI.createView({
		    backgroundColor: 'transparent',
		    height: Ti.UI.SIZE,
		    top:'0dp',left:'0dp',width:'50%'
		});
		
		var joinNumber = 0;
		if(data['like'] != undefined){
			joinNumber = data['like'];
		}
		
		var joinNumberText = Ti.UI.createLabel({
			font:{fontSize:'30sp',fontFamily:'Helvetica Neue'},
			text:joinNumber,
			color:'#34495e',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		
		
		joinNumberView.addEventListener('click',function(e){
		
			var JoinListWindow = require('groupPeopleWindows');
			new JoinListWindow( data['gid']).open(); 
		});	
		
		joinNumberView.add(joinNumberText);	
		
		var SepView = Ti.UI.createView({
		    backgroundColor: '#bbbbbb',
		    height: '50dp',width:'1dp'
	
		});
	
		var joinBottomView = Ti.UI.createView({
		    backgroundColor: 'transparent',
		    height: Ti.UI.SIZE,
		    top:'0dp',left:'0dp',width:'48%'
		});
		
		var joinBottomButton = Titanium.UI.createButton({
		    title: L('join'),
		    width:'60%',
		    backgroundColor:'#3498db',borderRadius:10
		});
		
		var liked = data['liked'];
		if(liked == 1){
			joinBottomButton.title = L('leave');
			joinBottomButton.backgroundColor = '#e74c3c';
		}
		
		function likeCB(result, resultText){
			if(result == true){
				joinBottomButton.title = L('leave');
				joinBottomButton.backgroundColor = '#e74c3c';
				joinNumber = joinNumber + 1;
				joinNumberText.text = joinNumber;
				liked = 1;
	        }
	        else{
	        	
	        } 
		}
		
		function leaveCB(result, resultText){
			if(result == true){
				joinBottomButton.title = L('join');
				joinBottomButton.backgroundColor = '#3498db';
				joinNumber = joinNumber - 1;
				joinNumberText.text = joinNumber;
				liked = 0;
	        }
	        else{
	        	joinBottomButton.title = L('join');
				joinBottomButton.backgroundColor = '#3498db';
				liked = 0;
	        	
	        } 
		}
		
		joinBottomView.addEventListener('click',function(e){
			if(liked == 1){
				leavegroup(data['gid'], leaveCB);
			}
			else{
				likegroup(data['gid'], likeCB);
			}
  			
		});	
		
		joinBottomView.add(joinBottomButton);
		
		
		joinView.add(joinNumberView);
		joinView.add(SepView);
		joinView.add(joinBottomView);
	    
	    
	    /////////////////    photos  ///////////////////////////
	    if(data['photos'] != undefined){

		    var imageScrollView = Ti.UI.createScrollView({
			    contentWidth: (data['photos'].length*100 + 20)*(Titanium.Platform.displayCaps.dpi / 160),
			    contentHeight:'100dp',
			    layout: 'horizontal',
			    backgroundColor:'#ffffff',
		        height:'100dp',scrollType:'horizontal'
			});
			
		 
			for(var i=0; i<data['photos'].length; i++){
				var imageContentView = Titanium.UI.createView({
				  	backgroundColor: '#ffffff',
				    top: '10dp', bottom:'10dp',
				    borderRadius:15,
				    width:'80dp',height:'80dp',left:'10dp',
				    name:'imagecontentview'
				});  
				Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + data['photos'][0]).replace('.jpg','-m.jpg'));
				var feedImage = Titanium.UI.createImageView({
				    backgroundColor: '#ffffff',
				    visible : false,
				    name:'image'
				});
			    feedImage.index = i;
				feedImage.addEventListener('load', function()
				{
					var imgwidth = this.size.width;
					var imgheight = this.size.height;
	                if(imgwidth == 0 || imgheight == 0){
						var tmpimage = this.toBlob();
						imgwidth = tmpimage.width;
						imgheight = tmpimage.height;
					}
					if(imgwidth < imgheight){
						var ratio = (80 / parseFloat(imgwidth));
						this.width = (imgwidth * ratio) ;
						this.height = (imgheight * ratio) ;
					}
					else{
						var ratio = (80 / parseFloat(imgheight));
						this.width = (imgwidth * ratio) ;
						this.height = (imgheight * ratio) ;
					}
	
					this.visible = true;
					this.addEventListener('click',function(e) {
				        Ti.API.info('photo view click.');
				        
					});
		
				});
				
				feedImage.addEventListener('click', function(){
					var FeedImageListWindow = require('imagelistWindows');
					new FeedImageListWindow(data['photos'],this.index).open(); 
				});
				feedImage.image = (getFeedImgAddr()+'feedimgm/' + data['photos'][i]).replace('.jpg','-m.jpg');
				imageContentView.add(feedImage);
	
				imageScrollView.add(imageContentView);
			}
		}
		
		///////////   address view /////////////////
		var addressViewBack = Ti.UI.createView({
		    backgroundColor: '#dddddd',
		    height: Ti.UI.SIZE,
		    top:'20dp',left:'0dp',width:'100%'
		});
		var addressView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    height: Ti.UI.SIZE,borderRadius:10,
		    top:'20dp',left:'3%',width:'94%'
		});
		
		var addressImg = Titanium.UI.createImageView({
			image:'location.png',
			backgroundColor:'transparent',left:'10dp',
			height: '30dp', width: '30dp'
		});
		
		var addressString = L('address');
		if(data['address'] != ''){
			addressString = data['address'];
			addressString = getStringlimit(addressString,50,100) + '...';
		}  
		var addressText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
			text: addressString,
			backgroundColor:'transparent',
			color:'#777777',
			left:'50dp', right:'40dp',
			top:'10dp',bottom:'10dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		var addressArrowImg = Titanium.UI.createImageView({
			image:'next.png',
			backgroundColor:'transparent',right:'10dp',
			height: '20dp', width: '20dp'
		});
		addressView.add(addressImg);
		addressView.add(addressText);
		addressView.add(addressArrowImg);
		var lat = data['loc']['coordinates'][1];
		var lon = data['loc']['coordinates'][0];
		addressView.addEventListener('click', function(){
			var intent = Ti.Android.createIntent({
	            action : Ti.Android.ACTION_VIEW,
	            data : 'geo:' + lat +',' + lon + '?q=' + lat +',' + lon
	        });
	        Ti.Android.currentActivity.startActivity(intent);	
		});
		
		addressViewBack.add(addressView);
		
		if(data['web'] != ''){
			var webViewBack = Ti.UI.createView({
			    backgroundColor: '#dddddd',
			    height: Ti.UI.SIZE,
			    top:'0dp',left:'0dp',width:'100%'
			});
			var webView = Ti.UI.createView({
			    backgroundColor: '#ffffff',
			    height: Ti.UI.SIZE,borderRadius:10,
			    top:'20dp',left:'3%',width:'94%'
			});
			
			var webImg = Titanium.UI.createImageView({
				image:'web.png',
				backgroundColor:'transparent',left:'10dp',
				height: '30dp', width: '30dp'
			});
			
			var webText = Ti.UI.createLabel({
				font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
				text: L('weblink'),
				backgroundColor:'transparent',
				color:'#777777',
				left:'50dp', right:'40dp',
				top:'10dp',bottom:'10dp',
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			});
			
			var webArrowImg = Titanium.UI.createImageView({
				image:'next.png',
				backgroundColor:'transparent',right:'10dp',
				height: '20dp', width: '20dp'
			});
			webView.add(webImg);
			webView.add(webText);
			webView.add(webArrowImg);
			
			webView.addEventListener('click', function(){
				var intent = Ti.Android.createIntent({
				    action: Ti.Android.ACTION_VIEW,
				    className: 'com.android.browser.BrowserActivity',
    				packageName: 'com.android.browser',
				    data: data['web']
				});
				Ti.Android.currentActivity.startActivity(intent);
			});
			
			webViewBack.add(webView);
		}
		
		topView.add(headPhotoImg);
		topView.add(contentView);
		viewobj.add(topView);
		if(data['des'] != ''){
			viewobj.add(desText);
		}
		
		viewobj.add(createHSepLine('90%','20dp','0dp'));
		if(data['photos'] != undefined){
			viewobj.add(imageScrollView);
			viewobj.add(createHSepLine('90%','20dp','0dp'));
		}
		
		viewobj.add(joinView);
		viewobj.add(addressViewBack);
		
		if(data['web'] != ''){
			viewobj.add(webViewBack);
		}	

    }

