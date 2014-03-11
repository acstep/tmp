Ti.include("common_net.js");
Ti.include("common_util.js");


function drawSalesEvent(view, data, lon, lat){
	
	
	var feedView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    borderColor: '#bbb',
	    borderWidth: 1,
	    layout: 'vertical',
	    width:'94%', height: Ti.UI.SIZE,
	    top: '20dp', left: '3%'
	});
	

	
	/////////  top  photo  time  name ////////////////////
	createFeedTop(feedView, data, lon, lat);
	feedView.categoryText.text = '   ' + L('sale') +'   ';
	feedView.categoryText.backgroundColor = '#ff0000';
	feedView.categoryImg.image = 'sale2.png';
	
	
	
	
	/////////  middle description  photo  ///////////////////////////////
	var middleView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'vertical',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'10dp'
	});
	

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
		    top: '10dp', left:'3%',
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



function drawSalesContnet(contentView,data){
	
	Ti.API.info('enter drawSalesContnet.');
	var imageList = data['photos'];
	//////////////////   image list /////////////////////////
	if(imageList.length == 1){
		var imageScrollView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
		    width:'100%',height:'200dp',
		    name:'imagecontentview'
		});  
		var feedImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		feedImage.addEventListener('load', function()
		{
			
			platheight = Ti.Platform.displayCaps.platformHeight,
			platwidth = Ti.Platform.displayCaps.platformWidth ;

			imgwidth = this.size.width;
			imgheight = this.size.height;
			if(imgwidth == 0 || imgheight == 0){
				var tmpimage = this.toBlob();
				imgwidth = tmpimage.width;
				imgheight = tmpimage.height;
			}
			if(imgwidth < platwidth){
				ratio = (platwidth / parseFloat(imgwidth));
				this.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				this.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
			}
			this.visible = true;
		});
		feedImage.addEventListener('click', function(){
			FeedImageListWindow = require('imagelistWindows');
			new FeedImageListWindow(imageList,0).open(); 
		});
		imageScrollView.add(feedImage);
		feedImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + imageList[0]).replace('.jpg','-m.jpg');

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
			var feedImage = Titanium.UI.createImageView({
			    backgroundColor: '#ffffff',
			    visible : false,
			    name:'image'
			});
		    feedImage.index = i;
			feedImage.addEventListener('load', function()
			{
				imgwidth = this.size.width;
				imgheight = this.size.height;
                if(imgwidth == 0 || imgheight == 0){
					var tmpimage = this.toBlob();
					imgwidth = tmpimage.width;
					imgheight = tmpimage.height;
				}
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
			
			feedImage.addEventListener('click', function(){
				FeedImageListWindow = require('imagelistWindows');
				new FeedImageListWindow(imageList,this.index).open(); 
			});
			feedImage.image = ('https://s3-ap-southeast-1.amazonaws.com/feedimgm/' + imageList[i]).replace('.jpg','-m.jpg');
			imageContentView.add(feedImage);

			imageScrollView.add(imageContentView);
		}	
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
	    width:'90%', height: Ti.UI.SIZE,layout: 'vertical',
	    top:'20dp',left:'5%'
	});
	
	createMapView(mapView,data);
	
	
	
	//////////////////////   head photo  /////////////////////////////
	var topView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'horizontal',
	    width:'100%', height: '80dp',
	    top:'10dp',left:'5%'
	});
	
	
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,backgroundImage:'headphoto.png',
		height: '60dp', width: '60dp', top:'10dp', left:'0dp'
	});
	

	headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + data['ownerid']+'.jpg';
	
	var topinfoView = Ti.UI.createView({
	    backgroundColor: 'white',

	    layout: 'vertical',
	    width:'auto', height: '80dp',
	    top:'0dp'
	});
	
	
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: data['name'],
		color:'#3498db',
		top:'12dp',
		left:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	nameText.ownerid = data['ownerid'];
	
	nameText.addEventListener('click',function(e) {
		//  enter talk window
		var myid = Ti.App.Properties.getString('userid','');
		if(myid == e.source.ownerid){
			return;
		}
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
	
	topView.add(headPhotoImg);
	topView.add(topinfoView);
	
	if(imageList.length > 0){
		contentView.add(imageScrollView);
		contentView.add(createHSepLine('90%','20dp','0dp'));
	}
	contentView.add(topView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(desView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(mapView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	
	
}






