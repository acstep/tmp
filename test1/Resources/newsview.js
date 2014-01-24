Ti.include("common_net.js");
Ti.include("common_util.js");

var toast = Ti.UI.createNotification({
    message:'',
    duration: Ti.UI.NOTIFICATION_DURATION_LONG
});


function drawNewsEvent(view, data, lon, lat){
	
	
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

	    layout: 'horizontal',
	    width:'100%', height: '80dp',
	    top:'0dp'
	});
	
	
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,
		height: '60dp', width: '60dp', top:'10dp', left:'10dp'
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
	    width:'auto', height: '80dp',
	    top:'0dp'
	});
	
	
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Marker Felt',fontWeight:'bold'},
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
		font:{fontSize:'12sp',fontFamily:'Marker Felt'},
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
		font:{fontSize:'12sp',fontFamily:'Marker Felt'},
		text:  '   ' + L('news') +'   ',
		color:'#ffffff',

		left:'10dp',
		backgroundColor:'#2ecc71',
		borderRadius:10,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	var distanceText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Marker Felt'},
		text: feedDistanceStr,
		color:'#ffffff',

		left:'20dp',
		backgroundColor:'#3498db',
		borderRadius:10,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	topinfoView.add(nameText);
	topinfoView.add(timeText);
	
	topCategoryDistanceView.add(categoryText);
	topCategoryDistanceView.add(distanceText);
	
	topinfoView.add(topCategoryDistanceView);
	
	topView.add(headPhotoImg);
	topView.add(topinfoView);
	
	feedView.add(topView);
	
	
	/////////  middle description  photo  ///////////////////////////////
	var middleView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'vertical',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'0dp'
	});
	

	var desText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Marker Felt'},
		text: getStringlimit(data['des'],200,250),
		color:'#666666',
		top:'10dp',
		left:'10dp',right:'10dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		width: Ti.UI.FILL,
  		name:'destext',
  		
	});

	middleView.add(desText);
	
	if(data['photos'].length > 0){
		var imageContentView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
		    top: '5dp', left:'3%',
		    width:'94%',height:'200dp',
		    name:'imagecontentview'
		});  
		Ti.API.info('image file : ',('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + data['photos'][0]).replace('.jpg','-m.jpg'));
		var newsImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		
		  
		newsImage.addEventListener('load', function()
		{
			platheight = Ti.Platform.displayCaps.platformHeight,
			platwidth = Ti.Platform.displayCaps.platformWidth *0.90;

			imgwidth = this.size.width;
			imgheight = this.size.height;
			if(imgwidth < platwidth){
		
				ratio = (platwidth / parseFloat(imgwidth));
		
				this.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				this.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				newsImage.visible = true;
				newsImage.eventid = data['eventid'];
				
			}

		});
		newsImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + data['photos'][0]).replace('.jpg','-m.jpg');
		imageContentView.add(newsImage);
		middleView.add(imageContentView);

	}

    
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
	    width:'50%', height: '40dp',
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
		font:{fontSize:'18sp',fontFamily:'Marker Felt'},
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
	    width:'auto', height: '40dp',
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
		font:{fontSize:'18sp',fontFamily:'Marker Felt'},
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
	
	bottomView.add(bottomLikeView);
	bottomView.add(bottomSepView);
	bottomView.add(bottomCommentView);
	feedView.add(bottomView);

	
	
	view.add(feedView);
	
	
	
};



function drawNewsContnet(contentView,data){
	
	Ti.API.info('enter drawNewsContnet.');
	
	//////////////////   image list /////////////////////////
	var imageList = data['photos'];

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
		var newsImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
	    newsImage.index = i;
		newsImage.addEventListener('load', function()
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
		
		newsImage.addEventListener('click', function(){
			NewsImageListWindow = require('imagelistWindows');
			new NewsImageListWindow(imageList,this.index).open(); 
		});
		newsImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + imageList[i]).replace('.jpg','-m.jpg');
		imageContentView.add(newsImage);
	
		imageScrollView.add(imageContentView);
	}
	
	////////////////  description ////////////////////////////////////////////
	var desView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    top:'0dp',left:'5%',right:'5%'
	});
	
	
	
	var desText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Marker Felt'},
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
	
	var mapImg = Titanium.UI.createImageView({
		
		height: '200dp', width: '100%'
	});
	latitude = data['loc']['coordinates'][1];
	longitude = data['loc']['coordinates'][0];
	var mapwidth = Titanium.Platform.displayCaps.platformWidth * 0.9;
	var mapheight =  200 * (Titanium.Platform.displayCaps.dpi / 160);
	url = "http://maps.googleapis.com/maps/api/staticmap?center=" +latitude +',' +longitude 
	    + "&zoom=17&size=" + mapwidth +'x' + mapheight +'&markers=color:red%7C'+ latitude
	    +',' + longitude +'&sensor=false';
	    
	mapImg.image = url;     
	mapImg.addEventListener('click', function(){
		var intent = Ti.Android.createIntent({
                action : Ti.Android.ACTION_VIEW,
                data : 'geo:' + latitude +',' + longitude + '?q=' + latitude +',' + longitude
            });
            Ti.Android.currentActivity.startActivity(intent);	
	});
	mapView.add(mapImg);
	
	
	//////////////////////   head photo  /////////////////////////////
	var topView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'horizontal',
	    width:'100%', height: '80dp',
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
		font:{fontSize:'20sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: data['name'],
		color:'#3498db',
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
		font:{fontSize:'20sp',fontFamily:'Marker Felt'},
		text: timeString,
		color:'#aaaaaa',
		top:'5dp',
		left:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});

    
	
	topinfoView.add(nameText);
	topinfoView.add(timeText);
	
	topView.add(headPhotoImg);
	topView.add(topinfoView);
	
	
	contentView.add(imageScrollView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(topView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(desView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(mapView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
}






