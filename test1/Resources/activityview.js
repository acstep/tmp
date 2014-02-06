Ti.include("common_net.js");
Ti.include("common_util.js");

var toast = Ti.UI.createNotification({
    message:'',
    duration: Ti.UI.NOTIFICATION_DURATION_LONG
});


function drawActivityEvent(view, data, lon, lat){
	
	
	var feedView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    borderColor: '#bbb',
	    borderWidth: 1,
	    layout: 'vertical',
	    width:'94%', height: Ti.UI.SIZE,
	    top: '20dp', left: '3%'
	});
	

	
	/////////  top  photo  time  name ////////////////////
	var topView = Ti.UI.createView({
	    backgroundColor: 'white',
	    width:'100%', height: '80dp',
	    top:'0dp'
	});
	

	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,
		height: '60dp', width: '60dp', top:'15dp', left:'10dp'
	});
	
	if(data['headphoto'] == undefined || data['headphoto'] == ''){
		headPhotoImg.image = 'headphoto.png';
	}
	else{
		headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + data['headphoto'];
	}
	
	var topinfoView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    layout: 'vertical',
	    height: '80dp',
	    top:'0dp',left:'70dp',right:'70dp'
	});
	
	
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: data['name'],
		color:'#333333',
		top:'10dp',
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
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
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
	    backgroundColor: 'white',
	    layout: 'horizontal',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'3dp'
	});
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text:  '   ' + L('club') +'   ',
		color:'#ffffff',

		left:'10dp',
		backgroundColor:'#f39c12',
		borderRadius:10,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	var distanceText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
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
        image:'group.png',
		height: '30dp', width: '30dp', top:'20dp', right:'20dp'
	});
	
	
	topView.add(headPhotoImg);
	topView.add(topinfoView);
	topView.add(categoryImg);
	
	feedView.add(topView);
	
	
	/////////  middle description  photo  ///////////////////////////////
	var middleView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    layout: 'vertical',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'0dp'
	});
	
	if(data['title'] != undefined && data['title'] != ''){
		var titlenameView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'100%', height: Ti.UI.SIZE,
		    top:'10dp'
		});
	    
	    var titlenameImg = Titanium.UI.createImageView({
	        image:'titlename.png',
			height: '15dp', width: '15dp', left:'20dp'
		});
		
		var titlenameText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
			text: data['title'],
			color:'#333333',
			left:'45dp', right:'10dp',height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    titlenameView.add(titlenameImg);
	    titlenameView.add(titlenameText);
	
	    middleView.add(titlenameView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['gname'] != undefined && data['pdata']['gname'] != ''){
		var groupNameView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'100%', height: Ti.UI.SIZE,
		    top:'0dp'
		});
	    
	    var groupNameImg = Titanium.UI.createImageView({
	        image:'groupname.png',
			height: '15dp', width: '15dp', left:'20dp'
		});
		
		var groupNameText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
			text: data['pdata']['gname'],
			color:'#3498db',
			left:'45dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    groupNameView.add(groupNameImg);
	    groupNameView.add(groupNameText);
	
	    middleView.add(groupNameView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['starttime'] != undefined && data['pdata']['starttime'] != ''){
		var startTimeView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'100%', height: Ti.UI.SIZE,
		    top:'0dp'
		});
	    
	    var startTimeImg = Titanium.UI.createImageView({
	        image:'sorttime.png',
			height: '15dp', width: '15dp', left:'20dp'
		});
		
		startTime = new Date(data['pdata']['starttime']*1000);
		var minutes = startTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		var startTimeText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
			text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate()+'  '+startTime.getHours()+':'+minutes,
			color:'#34495e',
			left:'45dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    startTimeView.add(startTimeImg);
	    startTimeView.add(startTimeText);
	
	    middleView.add(startTimeView);
	};
    

	var desText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		text: getStringlimit(data['des'],50,100),
		color:'#666666',
		top:'20dp',
		left:'10dp',right:'10dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		width: Ti.UI.FILL,
  		name:'destext',
  		
	});

	
	
	if(data['photos'].length > 0){
		var imageContentView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
		    top: '5dp', left:'3%',
		    width:'94%',height:'200dp',
		    name:'imagecontentview'
		});  
		Ti.API.info('image file : ',('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + data['photos'][0]).replace('.jpg','-m.jpg'));
		var activityImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		
		  
		activityImage.addEventListener('load', function(e)
		{
			platheight = Ti.Platform.displayCaps.platformHeight,
			platwidth = Ti.Platform.displayCaps.platformWidth *0.90;

			imgwidth = e.source.size.width;
			imgheight = e.source.size.height;
			
			Ti.API.info('platheight ' + platheight);
			Ti.API.info('platwidth ' + platwidth);
			Ti.API.info('imgwidth ' + imgwidth);
			Ti.API.info('imgheight ' + imgheight);
			
			if(imgwidth != 0 && imgwidth < platwidth){
		
				ratio = (platwidth / parseFloat(imgwidth));
		
				e.source.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				e.source.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				Ti.API.info('this.width ' + e.source.width);
				Ti.API.info('this.height ' + e.source.height);
				e.source.visible = true;
				e.source.eventid = data['eventid'];
				
			}

		});
		
		imageContentView.add(activityImage);
		

		middleView.add(imageContentView);
		
		activityImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + data['photos'][0]).replace('.jpg','-m.jpg');

	}

    middleView.add(desText);
		
	feedView.add(middleView);
  
  
	///////////  bottom  like common button /////////////////////////////
	var bottomView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    layout: 'horizontal',
	    width:'100%', height: '40dp',
	    borderColor: '#bbb',
	    borderWidth: 1,
	    top:'10dp'
	});
	var bottomLikeView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    width:'34%', height: '40dp',
	    top:'0dp',
	    name:'view'
	});
	
	var bottomLikecontentView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
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
  		left:'15dp',
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
	
	var bottomSepView = Ti.UI.createView({
	    backgroundColor: '#bbbbbb',
	    width:'1dp', height: '30dp',
	    top:'5dp'
	});
	var bottomCommentView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    width:'34%', height: '40dp',
	    top:'0dp',
	    name:'commentview'
	});
	bottomCommentView.eventid = data['eventid'];
	
	
	var bottomCommentcontentView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
        layout: 'horizontal',
        width: Ti.UI.SIZE,height: Ti.UI.SIZE,
	    name:'view',center:{x:'50%',y:'50%'}
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
  		left:'15dp'
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
	
	var bottomSepView1 = Ti.UI.createView({
	    backgroundColor: '#bbbbbb',
	    width:'1dp', height: '30dp',
	    top:'5dp'
	});
	
	var bottomCalendarView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    width:'auto', height: '40dp',
	    top:'0dp',
	    name:'calendarParent'
	});
	
	
	
	var calendarImg = Titanium.UI.createImageView({
		image:'addcalender.png',
		height: '23dp', width: '23dp',
		name:'calendarimg'
	});
	calendarImg.data = data;
	bottomCalendarView.data = data;
	bottomCalendarView.imageobj = calendarImg;
	bottomCalendarView.addEventListener('click',function(e) {
		e.cancelBubble = true;
		if(e.source.data['pdata']['starttime'] == undefined){
			return;
		}

		var CALENDAR_TO_USE = 3;
		var calendar = Ti.Android.Calendar.getCalendarById(CALENDAR_TO_USE);
		
		// Create the event
		var eventBegins = new Date(e.source.data['pdata']['starttime']*1000);
		var eventEnds = new Date(e.source.data['pdata']['starttime']*1000+3600*1000);
		var details = {
		    title: e.source.data['title'],
		    description: e.source.data['des'],
		    begin: eventBegins,
		    end: eventEnds
		};
		if(e.source.name == 'calendarimg'){
			e.source.image = 'addcalenderdone.png';
		}
		else{
			e.source.imageobj.image = 'addcalenderdone.png';
		}
		
		var event = calendar.createEvent(details);
		
		
	});
	
	bottomCalendarView.add(calendarImg);
	
	bottomView.add(bottomLikeView);
	bottomView.add(bottomSepView);
	bottomView.add(bottomCommentView);
	bottomView.add(bottomSepView1);
	bottomView.add(bottomCalendarView);
	
	feedView.add(bottomView);

	
	
	view.add(feedView);
	
	
	
};



function drawActivityContnet(contentView,data){
	
	Ti.API.info('enter drawActivityContnet.');
	var imageList = data['photos'];
	//////////////////   image list /////////////////////////
	if(imageList.length == 1){
		var imageScrollView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
	   
		    width:'100%',height:'200dp',
		    name:'imagecontentview'
		});  
		var topImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		topImage.addEventListener('load', function()
		{
			
			platheight = Ti.Platform.displayCaps.platformHeight,
			platwidth = Ti.Platform.displayCaps.platformWidth ;

			imgwidth = this.size.width;
			imgheight = this.size.height;
			if(imgwidth < platwidth){
		
				ratio = (platwidth / parseFloat(imgwidth));
		
				this.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				this.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				topImage.visible = true;

			}
		});
		topImage.addEventListener('click', function(){
			topImageListWindow = require('imagelistWindows');
			new topImageListWindow(imageList,0).open(); 
		});
		imageScrollView.add(topImage);
		topImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + imageList[0]).replace('.jpg','-m.jpg');
		
	}
	else{
		
	
		var imageScrollView = Ti.UI.createScrollView({
		    contentWidth: (imageList.length*140 + 20)*(Titanium.Platform.displayCaps.dpi / 160),
		    contentHeight:'160dp',
		    layout: 'horizontal',
		    backgroundColor:'#ffffff',
	        height:'160dp'
		});
		
	 
		for(var i=0; i<imageList.length; i++){
			var imageContentView = Titanium.UI.createView({
			  	backgroundColor: '#ffffff',
			    top: '15dp', 
			    borderRadius:15,
			    width:'130dp',height:'130dp',left:'10dp',
			    name:'imagecontentview'
			});  
			Ti.API.info('image file : ',('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + imageList[0]).replace('.jpg','-m.jpg'));
			var topImage = Titanium.UI.createImageView({
			    backgroundColor: '#ffffff',
			    visible : false,
			    name:'image'
			});
		    topImage.index = i;
			topImage.addEventListener('load', function()
			{
				
	
				imgwidth = this.size.width;
				imgheight = this.size.height;
				if(imgwidth < imgheight){
					ratio = (130 / parseFloat(imgwidth));
					this.width = (imgwidth * ratio) ;
					this.height = (imgheight * ratio) ;
				}
				else{
					ratio = (130 / parseFloat(imgheight));
					this.width = (imgwidth * ratio) ;
					this.height = (imgheight * ratio) ;
				}
	
				this.visible = true;
				this.addEventListener('click',function(e) {
			        Ti.API.info('photo view click.');
			        
				});
	
			});
			
			topImage.addEventListener('click', function(){
				topImageListWindow = require('imagelistWindows');
				new topImageListWindow(imageList,this.index).open(); 
			});
			topImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + imageList[i]).replace('.jpg','-m.jpg');
			imageContentView.add(topImage);
		
			imageScrollView.add(imageContentView);
		}	
	}
	
	////////////////  start end time ///////////////////////////////////////
	var eventTimeView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    layout: 'vertical',
	    top:'0dp',left:'5%',right:'5%',
	    
	});
	if(data['pdata'] != undefined && data['pdata']['starttime'] != undefined && data['pdata']['starttime'] != ''){
		startTime = new Date(data['pdata']['starttime']*1000);
        var startTimeView = Ti.UI.createView({
			backgroundColor:'#ffffff',
			width:'100%',
			height:Ti.UI.SIZE,
			top:'10dp',
		});
		
		var clockImg = Titanium.UI.createImageView({
	        image:'starttime.png',
			height: '20dp', width: '20dp', left:'0dp'
		});
		
		var starttimeText = Ti.UI.createLabel({
			font:{fontSize:'20sp'},
			text: L('starttime') + ':',
			color:'#f1c40f',
			 left:'30dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		var sDateText = Ti.UI.createLabel({
			font:{fontSize:'20sp'},
			text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate(),
			color:'#666666',
			left:'130dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		
		
		var minutes = startTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		var sTimeText = Ti.UI.createLabel({
			font:{fontSize:'20sp'},
			text: startTime.getHours()+':'+minutes,
			color:'#666666',
			right:'20dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		
		startTimeView.add(clockImg);
	    startTimeView.add(starttimeText);
		startTimeView.add(sDateText);
		startTimeView.add(sTimeText);
		eventTimeView.add(startTimeView);
	}	
	
	if(data['pdata'] != undefined && data['pdata']['endtime'] != undefined && data['pdata']['endtime'] != ''){
		Ti.API.info('we have endtime.');
        endTime = new Date(data['pdata']['endtime']*1000);
		var endTimeView = Ti.UI.createView({
			backgroundColor:'#ffffff',
			width:'100%',
			height:Ti.UI.SIZE,
			top:'10dp',
			
		});
		
		var clockImg = Titanium.UI.createImageView({
	        image:'starttime.png',
			height: '20dp', width: '20dp', left:'0dp'
		});
		
		var endtimeText = Ti.UI.createLabel({
			font:{fontSize:'20sp'},
			text: L('endtime') + ':',
			color:'#f1c40f',
			left:'30dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		var eDateText = Ti.UI.createLabel({
			font:{fontSize:'20sp'},
			text: endTime.getFullYear()+'/'+(endTime.getMonth()+1)+'/'+endTime.getDate(),
			color:'#666666',
			left:'130dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		
		
		var minutes = endTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		var eTimeText = Ti.UI.createLabel({
			font:{fontSize:'20sp'},
			text: endTime.getHours()+':'+minutes,
			color:'#666666',
			right:'20dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
	    
	    endTimeView.add(clockImg);
		endTimeView.add(endtimeText);
		endTimeView.add(eDateText);
		endTimeView.add(eTimeText);
		eventTimeView.add(endTimeView);
	}
	////////////////  description ////////////////////////////////////////////
	var desView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    top:'0dp',left:'5%',right:'5%'
	});
	
	
	
	var desText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: data['des'],
		color:'#333333',
		top:'10dp',
		left:'0dp',right:'0dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		width: Ti.UI.FILL,
  		name:'destext',
  		
	});
	desView.add(desText);
	
	//////////////  map //////////////////////////////////////////
	var mapView = Ti.UI.createView({
	    backgroundColor: 'white',
	    width:'90%', height: Ti.UI.SIZE,
	    top:'20dp',left:'5%'
	});
	
	var mapParentView = Titanium.UI.createView({
		height: '200dp', width: '100%',backgroundColor:'#transparent'
		
	});
	
	latitude = data['loc']['coordinates'][1];
	longitude = data['loc']['coordinates'][0];
	
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
	
	
	//////////////////////   head photo  /////////////////////////////
	var ownerView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'horizontal',
	    width:'90%', height: '80dp',
	    top:'10dp',left:'5%'
	});
	
	
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,
		height: '60dp', width: '60dp', top:'10dp', left:'0dp'
	});
	
	if(data['headphoto'] == undefined || data['headphoto'] == ''){
		headPhotoImg.image = 'headphoto.png';
	}
	else{
		headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + data['headphoto'];
	}
	
	var topinfoView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'vertical',
	    width:'auto', height: '80dp',
	    top:'0dp'
	});
	
	
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: data['name'],
		color:'#4aa3df',
		top:'12dp',
		left:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	nameText.ownerid = data['ownerid'];
	
	nameText.addEventListener('click',function(e) {
		//  enter talk window
	    Ti.API.info('postView click.');
        TalkWindow = require('talkWindows');
        tmpRoomData = {
            'roomid':'',
            'memberid':[],
            'lasttime':parseInt(new Date().getTime()/1000),
            'host':'',
            'lastmsg':'',
            'memdata':[]  
        };
        new TalkWindow(Ti.App.Properties.getString('userid',''), e.source.ownerid,tmpRoomData).open(); 
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
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: timeString,
		color:'#aaaaaa',
		top:'5dp',
		left:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});

	topinfoView.add(nameText);
	topinfoView.add(timeText);
	
	ownerView.add(headPhotoImg);
	ownerView.add(topinfoView);
	
	////////////  title and group name //////////////////
	var titleGroupNameView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'vertical',
	    width:'90%', height: Ti.UI.SIZE,
	    top:'10dp',left:'5%'
	});
	if(data['title'] != undefined && data['title'] != ''){
		var titleText = Ti.UI.createLabel({
			font:{fontSize:'20sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
			text: data['title'],
			color:'#000000',
			top:'10dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		titleGroupNameView.add(titleText);
		titleGroupNameView.exist = true;
	}
	if(data['pdata']['gname'] != undefined && data['pdata']['gname'] != ''){
		var groupNameView = Ti.UI.createView({
		    backgroundColor: 'white',
		    layout: 'horizontal',
		    width:'100%', height: Ti.UI.SIZE,
		    top:'10dp',left:'0dp'
		});
		var nameText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
			text: data['pdata']['gname'],
			color:'#3498db',
			left:'10dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		var groupNameImg = Titanium.UI.createImageView({
	        image:'groupname.png',
			height: '20dp', width: '20dp', left:'0dp'
		});
		groupNameView.add(groupNameImg);
		groupNameView.add(nameText);
		titleGroupNameView.add(groupNameView);
		titleGroupNameView.exist = true;
	}

    
    if(imageList.length != 0){
    	contentView.add(imageScrollView);
    	contentView.add(createHSepLine('90%','20dp','0dp'));
    }
    
    if(titleGroupNameView.exist == true){
    	contentView.add(titleGroupNameView);
    	contentView.add(createHSepLine('90%','20dp','0dp'));
    }

	contentView.add(ownerView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(eventTimeView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(desView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(mapView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
}






