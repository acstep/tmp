Ti.include("common_net.js");
Ti.include("common_util.js");



function drawSocialEvent(view, data, lon, lat){
	
	Ti.API.info('enter drawSocialEvent');
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
	    width:'100%', height: Ti.UI.SIZE,
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
	    height: Ti.UI.SIZE,
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
	    backgroundColor: 'white',
	    layout: 'horizontal',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'3dp'
	});
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
		text:  '   ' + L('dating') +'   ',
		color:'#ffffff',

		left:'10dp',
		backgroundColor:'#e667af',
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
        image:'love.png',
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
	    top:'10dp'
	});
	
	if(data['title'] != undefined && data['title'] != ''){
		var titlenameView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var titlenameImg = Titanium.UI.createImageView({
	        image:'datingtitle.png',
			height: '15dp', width: '15dp',left:'10dp',
		});
		
		var titlenameText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
			text: data['title'],
			color:'#333333',
			left:'35dp', right:'10dp',height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    titlenameView.add(titlenameImg);
	    titlenameView.add(titlenameText);
	
	    middleView.add(titlenameView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['place'] != undefined && data['pdata']['place'] != ''){
		var socialPlaceView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var socialImg = Titanium.UI.createImageView({
	        image:'datingplace.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		var socialPlaceText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
			text: data['pdata']['place'],
			color:'#3498db',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    socialPlaceView.add(socialImg);
	    socialPlaceView.add(socialPlaceText);
	
	    middleView.add(socialPlaceView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['time'] != undefined && data['pdata']['time'] != ''){
		var startTimeView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var startTimeImg = Titanium.UI.createImageView({
	        image:'sorttime.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		startTime = new Date(data['pdata']['time']*1000);
		var minutes = startTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		var startTimeText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
			text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate(),
			color:'#34495e',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    startTimeView.add(startTimeImg);
	    startTimeView.add(startTimeText);
	
	    middleView.add(startTimeView);
	};
    

	var desText = Ti.UI.createLabel({
		font:{fontSize:'15sp',fontFamily:'Helvetica Neue'},
		text: getStringlimit(data['des'],50,100),
		color:'#666666',
		top:'10dp',
		left:'20dp',right:'20dp', height: Ti.UI.SIZE,
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
		var feedImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		
		  
		feedImage.addEventListener('load', function(e)
		{
			platheight = Ti.Platform.displayCaps.platformHeight,
			platwidth = Ti.Platform.displayCaps.platformWidth *0.90;

			imgwidth = e.source.size.width;
			imgheight = e.source.size.height;
			
		
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
		
		imageContentView.add(feedImage);
		

		middleView.add(imageContentView);
		
		feedImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + data['photos'][0]).replace('.jpg','-m.jpg');

	}

    middleView.add(desText);
		
	feedView.add(middleView);
  
  
	///////////  bottom  like common button /////////////////////////////
	createCardBottom(feedView, data);
	

	view.add(feedView);

};






