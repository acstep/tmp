Ti.include("common_net.js");
Ti.include("common_util.js");

function drawBaseContnet(contentView,data){
	
	Ti.API.info('enter drawTeambuyContnet.: data:  ' + JSON.stringify(data));
	
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
			
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth ;

			var imgwidth = this.size.width;
			var imgheight = this.size.height;
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
			var FeedImageListWindow = require('imagelistWindows');
			new FeedImageListWindow(imageList,0).open(); 
		});
		imageScrollView.add(feedImage);
		feedImage.image = (getFeedImgAddr()+'feedimgm/' + imageList[0]).replace('.jpg','-m.jpg');

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
			Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + imageList[0]).replace('.jpg','-m.jpg'));
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
				var FeedImageListWindow = require('imagelistWindows');
				new FeedImageListWindow(imageList,this.index).open(); 
			});
			feedImage.image = (getFeedImgAddr()+'feedimgm/' + imageList[i]).replace('.jpg','-m.jpg');
			imageContentView.add(feedImage);

			imageScrollView.add(imageContentView);
		}	
	}
	
	/////////////////////  title ///////////////////////////
	if(data['title'] != ''){
		var titleView = Titanium.UI.createView({
			left:'5%',backgroundColor:'transparent',
			height: Ti.UI.SIZE,width: '90%',top:'10dp'

		});
		
		
		
		var titleText = Ti.UI.createLabel({
			font:{fontSize:'18sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			text: data['title'],textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color:'#2c3e50',horizontalWrap:'false'
		});

		titleView.add(titleText);

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
	
    if(data['gid'] != ''){
		headPhotoImg.image = getHeadImg(data['gid']);
	}
	else{
		headPhotoImg.image = getHeadImg(data['ownerid']);
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
		color:'#3498db',
		top:'12dp',
		left:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	if(data['gid'] == undefined){
		data['gid'] = '';
	}
	if(data['gid'] != ''){
		nameText.text = data['gname'];
		nameText.ownerid = data['gid'];
		nameText.type = 'group';
	}
	else{
		nameText.ownerid = data['ownerid'];
		nameText.type = 'people';
	}
	
	
	nameText.addEventListener('click',function(e) {
		//  enter talk window
		if(e.source.type == 'group'){
			openGroupInfoWin(e.source.ownerid);
		}
		else{
			openPeopleInfoWin(e.source.ownerid);
		}

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
	if(data['title'] != ''){
		contentView.add(titleView);
		contentView.add(createHSepLine('90%','20dp','0dp'));
	}
	contentView.add(topView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(desView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(mapView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	

	
}


function drawtemplate1Contnet(contentView,data){
	
	Ti.API.info('enter drawActivityContnet.');
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
			
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth ;

			var imgwidth = this.size.width;
			var imgheight = this.size.height;
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
			var topImageListWindow = require('imagelistWindows');
			new topImageListWindow(imageList,0).open(); 
		});
		imageScrollView.add(feedImage);
		feedImage.image = (getFeedImgAddr()+'feedimgm/' + imageList[0]).replace('.jpg','-m.jpg');
	
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
			Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + imageList[0]).replace('.jpg','-m.jpg'));
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
				var topImageListWindow = require('imagelistWindows');
				new topImageListWindow(imageList,this.index).open(); 
			});
			feedImage.image = (getFeedImgAddr()+'feedimgm/' + imageList[i]).replace('.jpg','-m.jpg');
			imageContentView.add(feedImage);

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
	    width:'90%', height: Ti.UI.SIZE,layout: 'vertical',
	    top:'20dp',left:'5%'
	});
	
	createMapView(mapView,data);
	
	
	//////////////////////   head photo  /////////////////////////////
	var ownerView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'horizontal',
	    width:'90%', height: '80dp',
	    top:'10dp',left:'5%'
	});
	
	
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,backgroundImage:'headphoto.png',
		height: '60dp', width: '60dp', top:'10dp', left:'0dp'
	});
	
    if(data['gid'] != ''){
		headPhotoImg.image = getHeadImg(data['gid']);
	}
	else{
		headPhotoImg.image = getHeadImg(data['ownerid']);
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
	if(data['gid'] == undefined){
		data['gid'] = '';
	}
	if(data['gid'] != ''){
		nameText.text = data['gname'];
		nameText.ownerid = data['gid'];
		nameText.type = 'group';
	}
	else{
		nameText.ownerid = data['ownerid'];
		nameText.type = 'people';
	}
	
	
	
	nameText.addEventListener('click',function(e) {
		//  enter talk window
		if(e.source.type == 'group'){
			openGroupInfoWin(e.source.ownerid);
		}
		else{
			openPeopleInfoWin(e.source.ownerid);
		}
		

	});
	
	
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
	

    
    if(imageList.length != 0){
    	contentView.add(imageScrollView);
    	contentView.add(createHSepLine('90%','20dp','0dp'));
    }
    
    if(titleGroupNameView.exist == true){
    	contentView.add(titleGroupNameView);
    	contentView.add(createHSepLine('90%','20dp','0dp'));
    }

    ////////////////  join  /////////////////////////////////////////////////
	var joinView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,layout: 'horizontal',
	    top:'20dp',left:'0dp',width:'100%',height:'50dp'
	});
	
	var joinNumberView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    top:'0dp',left:'0dp',width:'50%'
	});
	
	var joinNumber = 0;
	if(data['joinnumber'] != undefined){
		joinNumber = data['joinnumber'];
	}
	
	var joinNumberText = Ti.UI.createLabel({
		font:{fontSize:'30sp',fontFamily:'Helvetica Neue'},
		text:joinNumber,
		color:'#34495e',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	
	joinNumberView.addEventListener('click',function(e){
	
		var JoinListWindow = require('joinMsgWindows');
		var stringData = {'title':'joinlist'};
		new JoinListWindow(data['eventid'],stringData).open(); 
	});	
	
	joinNumberView.add(joinNumberText);	
	
	var SepView = Ti.UI.createView({
	    backgroundColor: '#bbbbbb',
	    height: '50dp',width:'1dp'

	});

	var joinBottomView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    top:'0dp',left:'0dp',width:'48%'
	});
	
	var joinBottomButton = Titanium.UI.createButton({
	    title: L('join'),
	    width:'60%',
	    backgroundColor:'#3498db',borderRadius:10
	});
	
	joinBottomView.addEventListener('click',function(e){
	    if(eventjoined == 0){
	    	var JoinWindow = require('joinWindows');
			var stringData = {'title':'join'};
			var type = 'join';
			new JoinWindow(data,stringData,type).open(); 
	    }
	    else{
	    	leaveevent(data['eventid'],leaveEventCB);
	    }
		
	});	
	
	joinBottomView.add(joinBottomButton);
	
	
	joinView.add(joinNumberView);
	joinView.add(SepView);
	joinView.add(joinBottomView);
	
	var eventjoined = 0;
	Ti.App.addEventListener('joinevent',function(e) {
		eventjoined = 1;
		joinNumber = joinNumber + 1;
    	Ti.API.info('receive event joinevent ');
        joinBottomButton.title = L('leave');
        joinNumberText.text = joinNumber;
    	joinBottomButton.backgroundColor = '#e74c3c';
	});
	
	function leaveEventCB(result, joined){
    	if(result == true){
   			eventjoined = 0;
   			joinNumber = joinNumber - 1;
   			joinBottomButton.title = L('join');
   			joinNumberText.text = joinNumber;
    		joinBottomButton.backgroundColor = '#3498db';
    	}
    }

    function queryJoinCB(result, joined){
    	if(result == true){
    		if(joined == 0){
    			eventjoined = 0;
    		}
    		else{
    			eventjoined = 1;
    			joinBottomButton.title = L('leave');
    			joinBottomButton.backgroundColor = '#e74c3c';
    			
    		}
    	}
    }
    
    queryjoinevent(data['eventid'], queryJoinCB);
    
    
	contentView.add(ownerView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(eventTimeView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(joinView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(desView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(mapView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	
	
}


function drawtemplate2Contnet(contentView,data){
	
	Ti.API.info('enter drawSocialContnet.');
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
			
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth ;

			var imgwidth = this.size.width;
			var imgheight = this.size.height;
			Ti.API.info('222this.width ' + imgwidth);
			Ti.API.info('222this.height ' + imgheight);
			if(imgwidth == 0 || imgheight == 0){
				var tmpimage = this.toBlob();
				imgwidth = tmpimage.width;
				imgheight = tmpimage.height;
			}
			if(imgwidth < platwidth){
				var ratio = (platwidth / parseFloat(imgwidth));
				this.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				this.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
			}
			this.visible = true;
			
		});
		feedImage.addEventListener('click', function(){
			var FeedImageListWindow = require('imagelistWindows');
			new FeedImageListWindow(imageList,0).open(); 
		});
		imageScrollView.add(feedImage);
		feedImage.image = (getFeedImgAddr()+'feedimgm/' + imageList[0]).replace('.jpg','-m.jpg');

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
			Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + imageList[0]).replace('.jpg','-m.jpg'));
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
				if(imgwidth != 0 && imgheight != 0){
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
				}
		
				this.visible = true;
				this.addEventListener('click',function(e) {
			        Ti.API.info('photo view click.');
			        
				});
	
			});
			
			feedImage.addEventListener('click', function(){
				var FeedImageListWindow = require('imagelistWindows');
				new FeedImageListWindow(imageList,this.index).open(); 
			});
			feedImage.image = (getFeedImgAddr()+'feedimgm/' + imageList[i]).replace('.jpg','-m.jpg');
			imageContentView.add(feedImage);
	
			imageScrollView.add(imageContentView);
		}	
	}
	
	//////////////// prefer time and place ////////////////////////////
	var preferView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,layout: 'vertical',
	    top:'20dp',left:'5%',right:'5%'
	});
	
	if(data['title'] != undefined && data['title'] != ''){
		var titlenameView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'0dp',
		    top:'0dp'
		});
	    
	    var titlenameImg = Titanium.UI.createImageView({
	        image:'datingtitle.png',
			height: '15dp', width: '15dp',left:'10dp',
		});
		
		var titlenameText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
			text: data['title'],
			color:'#333333',
			left:'35dp', right:'10dp',height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    titlenameView.add(titlenameImg);
	    titlenameView.add(titlenameText);
	
	    preferView.add(titlenameView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['place'] != undefined && data['pdata']['place'] != ''){
		var socialPlaceView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'0dp',
		    top:'10dp'
		});
	    
	    var socialImg = Titanium.UI.createImageView({
	        image:'datingplace.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		var socialPlaceText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
			text: data['pdata']['place'],
			color:'#3498db',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    socialPlaceView.add(socialImg);
	    socialPlaceView.add(socialPlaceText);
	
	    preferView.add(socialPlaceView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['time'] != undefined && data['pdata']['time'] != ''){
		var startTimeView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'0dp',
		    top:'10dp'
		});
	    
	    var startTimeImg = Titanium.UI.createImageView({
	        image:'sorttime.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		var startTime = new Date(data['pdata']['time']*1000);
		var minutes = startTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		var startTimeText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
			text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate(),
			color:'#34495e',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    startTimeView.add(startTimeImg);
	    startTimeView.add(startTimeText);
	
	    preferView.add(startTimeView);
	};
	
	if(data['pdata'] != undefined && data['pdata']['numppl'] != undefined && data['pdata']['numppl'] != ''){
		var socialnumpplView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'0dp',
		    top:'10dp'
		});
	    
	    var pplImg = Titanium.UI.createImageView({
	        image:'ppl.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		var numpplText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
			text: L('preferredppl') + data['pdata']['numppl'] +' '+ L('people'),
			color:'#333333',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    socialnumpplView.add(pplImg);
	    socialnumpplView.add(numpplText);
	
	    preferView.add(socialnumpplView);
	};
	
	////////////////  join  /////////////////////////////////////////////////
	var joinView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,layout: 'horizontal',
	    top:'20dp',left:'0dp',width:'100%',height:'50dp'
	});
	
	var joinNumberView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    top:'0dp',left:'0dp',width:'50%'
	});
	
	var joinNumber = 0;
	if(data['joinnumber'] != undefined){
		joinNumber = data['joinnumber'];
	}
	
	var joinNumberText = Ti.UI.createLabel({
		font:{fontSize:'30sp',fontFamily:'Helvetica Neue'},
		text:joinNumber,
		color:'#34495e',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	
	joinNumberView.addEventListener('click',function(e){
	
		var JoinListWindow = require('joinMsgWindows');
		var stringData = {'title':'lineuplist'};
		new JoinListWindow(data['eventid'],stringData).open(); 
	});	
	
	joinNumberView.add(joinNumberText);	
	
	var SepView = Ti.UI.createView({
	    backgroundColor: '#bbbbbb',
	    height: '50dp',width:'1dp'

	});

	var joinBottomView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    height: Ti.UI.SIZE,
	    top:'0dp',left:'0dp',width:'48%'
	});
	
	var joinBottomButton = Titanium.UI.createButton({
	    title: L('lineup'),
	    width:'60%',
	    backgroundColor:'#3498db',borderRadius:10
	});
	
	joinBottomView.addEventListener('click',function(e){

		if(eventjoined == 0){
	    	var JoinWindow = require('joinWindows');
			var stringData = {'title':'lineup'};
			var type = 'lineup';
			new JoinWindow(data,stringData,type).open(); 
	    }
	    else{
	    	leaveevent(data['eventid'],leaveEventCB);
	    }
	
	});	
	
	joinBottomView.add(joinBottomButton);
	
	
	joinView.add(joinNumberView);
	joinView.add(SepView);
	joinView.add(joinBottomView);
	
	
	var eventjoined = 0;
	Ti.App.addEventListener('lineupevent',function(e) {
		eventjoined = 1;
		joinNumber = joinNumber + 1;
    	Ti.API.info('receive event joinevent ');
        joinBottomButton.title = L('leave');
        joinNumberText.text = joinNumber;
    	joinBottomButton.backgroundColor = '#e74c3c';
	});
	
	function leaveEventCB(result, joined){
    	if(result == true){
   			eventjoined = 0;
   			joinNumber = joinNumber - 1;
   			joinBottomButton.title = L('lineup');
   			joinNumberText.text = joinNumber;
    		joinBottomButton.backgroundColor = '#3498db';
    	}
    }

    function queryJoinCB(result, joined){
    	if(result == true){
    		if(joined == 0){
    			eventjoined = 0;
    		}
    		else{
    			eventjoined = 1;
    			joinBottomButton.title = L('leave');
    			joinBottomButton.backgroundColor = '#e74c3c';
    			
    		}
    	}
    }
    
    queryjoinevent(data['eventid'], queryJoinCB);
	
	
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
	
    if(data['gid'] != ''){
		headPhotoImg.image = getHeadImg(data['gid']);
	}
	else{
		headPhotoImg.image = getHeadImg(data['ownerid']);
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
		color:'#3498db',
		top:'12dp',
		left:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	if(data['gid'] == undefined){
		data['gid'] = '';
	}
	if(data['gid'] != ''){
		nameText.text = data['gname'];
		nameText.ownerid = data['gid'];
		nameText.type = 'group';
	}
	else{
		nameText.ownerid = data['ownerid'];
		nameText.type = 'people';
	}

	
	nameText.addEventListener('click',function(e) {
		//  enter talk window
		if(e.source.type == 'group'){
			openGroupInfoWin(e.source.ownerid);
		}
		else{
			openPeopleInfoWin(e.source.ownerid);
		}
 
	});
	
	
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
	contentView.add(preferView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(joinView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(desView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	contentView.add(mapView);
	contentView.add(createHSepLine('90%','20dp','0dp'));
	

	
}
