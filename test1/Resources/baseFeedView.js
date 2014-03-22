Ti.include("common_net.js");
Ti.include("common_util.js");

function createBaseFeedView(view, data){
	
	var feedView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    borderColor: '#bbb',
	    borderWidth: 1,
	    layout: 'vertical',
	    width:'94%', height: Ti.UI.SIZE,
	    top: '20dp', left: '3%'
	});
	

	Ti.API.info('data.title: ' + data.title);
	/////////  top  photo  time  name ////////////////////
	createFeedTop(feedView, data.info, data.lon, data.lat);
	feedView.categoryText.text = '   ' + L(data.title) +'   ';
	feedView.categoryText.backgroundColor = data.color;
	feedView.categoryImg.image = data.image;
	
	
	
	
	/////////  middle description  photo  ///////////////////////////////
	var middleView = Ti.UI.createView({
	    backgroundColor: 'white',
	    layout: 'vertical',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'10dp'
	});
	
	/////////////   title  ///////////////////////
	if(data.info['title'] != ''){
		var titleView = Titanium.UI.createView({
			left:'5%',backgroundColor:'transparent',
			height: Ti.UI.SIZE,width: '90%',

		});
		var titleImg = Titanium.UI.createImageView({
	        height: '15dp', width: '15dp',image:'title.png',left:'0dp'
		});
		
		if(data.info['title'].length > 50 ){
			data.info['title'] = data.info['title'].substr(0,50) + '...';
		}
		var titleText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			text: data.info['title'],textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			color:'#2c3e50',left:'30dp',horizontalWrap:'false'
		});
		titleView.add(titleImg);
		titleView.add(titleText);
		middleView.add(titleView);
	}
	
	

	var desText = Ti.UI.createLabel({
		font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
		text: getStringlimit(data.info['des'],100,150).replace(/\n\s*\n/g, '\n'),
		color:'#666666',
		top:'10dp',
		left:'20dp',right:'20dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		width: Ti.UI.FILL,
  		name:'destext',
  		
	});

	
	
	if(data.info['photos'].length > 0){
		var imageContentView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
		    top: '10dp', left:'3%',
		    width:'94%',height:'200dp',
		    name:'imagecontentview'
		});  
		
		var tmpview = Ti.UI.createView({
            backgroundColor:'#ffffff'
		});
		
		Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + data.info['photos'][0]).replace('.jpg','-m.jpg'));
		var feedImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		
		  
		feedImage.addEventListener('load', function(e)
		{
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth *0.90;

			var imgwidth = e.source.size.width;
			var imgheight = e.source.size.height;
			
			Ti.API.info('platheight ' + platheight);
			Ti.API.info('platwidth ' + platwidth);
			Ti.API.info('imgwidth ' + imgwidth);
			Ti.API.info('imgheight ' + imgheight);
			if(imgwidth == 0 || imgheight == 0){
				var tmpimage = this.toBlob();
				imgwidth = tmpimage.width;
				imgheight = tmpimage.height;
			}
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
		
		tmpview.add(feedImage);
		imageContentView.add(tmpview);
		
		
		middleView.add(imageContentView);
		
		
		feedImage.image = (getFeedImgAddr()+'feedimgm/' + data.info['photos'][0]).replace('.jpg','-m.jpg');

	}

    middleView.add(desText);
	feedView.add(middleView);
  
  
	///////////  bottom  like common button /////////////////////////////
	createCardBottom(feedView, data.info);


	view.add(feedView);
}


function drawtemplate1Event(view, data){
	
	
	var feedView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    borderColor: '#bbb',
	    borderWidth: 1,
	    layout: 'vertical',
	    width:'94%', height: Ti.UI.SIZE,
	    top: '20dp', left: '3%'
	});
	

	
	/////////  top  photo  time  name ////////////////////
	createFeedTop(feedView, data.info, data.lon, data.lat);
	feedView.categoryText.text = '   ' + L(data.title) +'   ';
	feedView.categoryText.backgroundColor = data.color;
	feedView.categoryImg.image = data.image;
	
	
	
	/////////  middle description  photo  ///////////////////////////////
	var middleView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    layout: 'vertical',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'10dp'
	});
	
	if(data.info['title'] != undefined && data.info['title'] != ''){
		var titlenameView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var titlenameImg = Titanium.UI.createImageView({
	        image:'titlename.png',
			height: '15dp', width: '15dp',left:'10dp',
		});
		
		var titlenameText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
			text: data.info['title'],
			color:'#333333',
			left:'35dp', right:'10dp',height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    titlenameView.add(titlenameImg);
	    titlenameView.add(titlenameText);
	
	    middleView.add(titlenameView);
	};
	
	if(data.info['pdata'] != undefined && data.info['pdata']['gname'] != undefined && data.info['pdata']['gname'] != ''){
		var groupNameView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var groupNameImg = Titanium.UI.createImageView({
	        image:'groupname.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		var groupNameText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
			text: data.info['pdata']['gname'],
			color:'#3498db',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    groupNameView.add(groupNameImg);
	    groupNameView.add(groupNameText);
	
	    middleView.add(groupNameView);
	};
	
	if(data.info['pdata'] != undefined && data.info['pdata']['starttime'] != undefined && data.info['pdata']['starttime'] != ''){
		var startTimeView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var startTimeImg = Titanium.UI.createImageView({
	        image:'sorttime.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		startTime = new Date(data.info['pdata']['starttime']*1000);
		var minutes = startTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		var startTimeText = Ti.UI.createLabel({
			font:{fontSize:'14sp',fontFamily:'Helvetica Neue'},
			text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate()+'  '+startTime.getHours()+':'+minutes,
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
		text: getStringlimit(data.info['des'],50,100),
		color:'#666666',
		top:'10dp',
		left:'20dp',right:'20dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		width: Ti.UI.FILL,
  		name:'destext',
  		
	});

	
	
	if(data.info['photos'].length > 0){
		var imageContentView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
		    top: '10dp', left:'3%',
		    width:'94%',height:'200dp',
		    name:'imagecontentview'
		});  
		
		var tmpview = Ti.UI.createView({
            backgroundColor:'#ffffff'
		});
		
		Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + data.info['photos'][0]).replace('.jpg','-m.jpg'));
		var feedImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		
		  
		feedImage.addEventListener('load', function(e)
		{
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth *0.90;

			var imgwidth = e.source.size.width;
			var imgheight = e.source.size.height;
			
			Ti.API.info('platheight ' + platheight);
			Ti.API.info('platwidth ' + platwidth);
			Ti.API.info('imgwidth ' + imgwidth);
			Ti.API.info('imgheight ' + imgheight);
			if(imgwidth == 0 || imgheight == 0){
				var tmpimage = this.toBlob();
				imgwidth = tmpimage.width;
				imgheight = tmpimage.height;
			}
			if(imgwidth != 0 && imgwidth < platwidth){
		
				ratio = (platwidth / parseFloat(imgwidth));
		
				e.source.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				e.source.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				Ti.API.info('this.width ' + e.source.width);
				Ti.API.info('this.height ' + e.source.height);
				e.source.visible = true;
				e.source.eventid = data.info['eventid'];
				
			}

		});
		
		tmpview.add(feedImage);
		imageContentView.add(tmpview);
		

		middleView.add(imageContentView);
		
		feedImage.image = (getFeedImgAddr()+'feedimgm/' + data.info['photos'][0]).replace('.jpg','-m.jpg');

	}

    middleView.add(desText);
		
	feedView.add(middleView);
  
  
	///////////  bottom  like common button /////////////////////////////
	var bottomView = Ti.UI.createView({
	    backgroundColor: '#f6f6f6',

	    width:'100%', height: '40dp',
	    top:'10dp'
	});
	
	var bottomlikecommentView = Ti.UI.createView({
	    left:'0dp',
	    layout: 'horizontal',
	    width:Ti.UI.SIZE, height: '40dp',

	});
	
	var bottomLikeView = Ti.UI.createView({
	    width:Ti.UI.SIZE, height: '40dp',left:'30dp',
	    top:'0dp',
	    name:'view'
	});
	
	var bottomLikecontentView = Ti.UI.createView({
        layout: 'horizontal',
	    name:'view',
	    width: Ti.UI.SIZE,height: Ti.UI.SIZE,
	    name:'view1',center:{x:'50%',y:'50%'}
	});
	

	bottomLikeView.eventid = data.info['eventid'];
	bottomLikecontentView.eventid = data.info['eventid'];
	
	var likeImg = Titanium.UI.createImageView({
		image:'like.png',
		height: '20dp', width: '20dp',
		name:'img'
	});
	likeImg.eventid = data.info['eventid'];
	
	var likeText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		text: data.info['like'] ,
		color:'#666666',
  		left:'15dp',
  		name:'text'
	});
	likeText.eventid = data.info['eventid'];
	
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
	 //   backgroundColor: '#bbbbbb',
	//    width:'1dp', height: '30dp',
	//    top:'5dp'
	//});
	var bottomCommentView = Ti.UI.createView({
	    width:Ti.UI.SIZE, height: '40dp',
	    top:'0dp',left:'30dp',
	    name:'commentview'
	});
	bottomCommentView.eventid = data.info['eventid'];
	
	
	var bottomCommentcontentView = Ti.UI.createView({
        layout: 'horizontal',
        width: Ti.UI.SIZE,height: Ti.UI.SIZE,
	    name:'view',center:{x:'50%',y:'50%'}
	});
	
	
	bottomCommentcontentView.eventid = data.info['eventid'];
	
	var commentImg = Titanium.UI.createImageView({
		image:'comment.png',
		height: '20dp', width: '20dp'
	});
	commentImg.eventid = data.info['eventid'];
	if(data['comment'] == undefined){
		data['comment'] = 0;
	}
	var commentText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		text: data.info['comment'],
		color:'#666666',
  		left:'15dp'
	});
	commentText.eventid = data.info['eventid'];
	
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
	
	//var bottomSepView1 = Ti.UI.createView({
	//    backgroundColor: '#bbbbbb',
	//    width:'1dp', height: '30dp',
	//    top:'5dp'
	//});
	
	var bottomCalendarView = Ti.UI.createView({
	    width:Ti.UI.SIZE, height: '40dp',
	    top:'0dp',right:'20dp',
	    name:'calendarParent'
	});
	
	
	
	var calendarImg = Titanium.UI.createImageView({
		image:'addcalender.png',
		height: '23dp', width: '23dp',left:'30dp',right:'30dp',
		name:'calendarimg'
	});
	calendarImg.data = data.info;
	bottomCalendarView.data = data.info;
	bottomCalendarView.imageobj = calendarImg;
	
	
	
	
	
	bottomCalendarView.addEventListener('click',function(e) {
			e.cancelBubble = true;
			if(e.source.data['pdata']['starttime'] == undefined){
				return;
			}
			var improvedintent = require('com.test.module');
			
            //intent.addCategory(Ti.Android.Calendar);
            //intent.packageName("com.android.calender");
        	var intent = improvedintent.createImprovedIntent({
				data : 'content://com.android.calendar/events',
				action : Ti.Android.ACTION_INSERT
			});

            var eventBegins =e.source.data['pdata']['starttime']*1000;
			var eventEnds = e.source.data['pdata']['starttime']*1000+3600*1000;
            intent.getPackageName(intent.packageName);
            intent.putExtra("title" , e.source.data['title']);
            intent.putExtra("description" ,e.source.data['des']);
            intent.putLongExtra("beginTime", eventBegins);
            intent.putLongExtra("endTime",eventEnds);
            intent.putExtra("allDay", false);
            intent.putExtra("eventStatus", true);
            intent.putExtra("visible", true);
            intent.putExtra("hasAlarm", true);
            intent.putExtra("calendar_id", 1);
 
      
            //intent.addCategory(Ti.Android.Calendar);
             intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
	         try {
	              Ti.Android.currentActivity.startActivity(intent);
	         } catch (ex) {
	             
	         }
		
		
	});

	bottomCalendarView.add(calendarImg);
	
	bottomlikecommentView.add(bottomLikeView);

	bottomlikecommentView.add(bottomCommentView);
	
	bottomView.add(bottomlikecommentView);
	bottomView.add(bottomCalendarView);
	
	feedView.add(bottomView);

	view.add(feedView);
	
	
	
};


function drawtemplate2Event(view, data){
	
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
	createFeedTop(feedView, data.info, data.lon, data.lat);
	feedView.categoryText.text = '   ' + L(data.title) +'   ';
	feedView.categoryText.backgroundColor = data.color;
	feedView.categoryImg.image =  data.image;
	
	
	
	/////////  middle description  photo  ///////////////////////////////
	var middleView = Ti.UI.createView({
	    backgroundColor: '#ffffff',
	    layout: 'vertical',
	    width:'100%', height: Ti.UI.SIZE,
	    top:'10dp'
	});
	
	if(data.info['title'] != undefined && data.info['title'] != ''){
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
			text: data.info['title'],
			color:'#333333',
			left:'35dp', right:'10dp',height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    titlenameView.add(titlenameImg);
	    titlenameView.add(titlenameText);
	
	    middleView.add(titlenameView);
	};
	
	if(data.info['pdata'] != undefined && data.info['pdata']['place'] != undefined && data.info['pdata']['place'] != ''){
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
			text: data.info['pdata']['place'],
			color:'#3498db',
			left:'35dp', right:'10dp', height: Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
	    socialPlaceView.add(socialImg);
	    socialPlaceView.add(socialPlaceText);
	
	    middleView.add(socialPlaceView);
	};
	
	if(data.info['pdata'] != undefined && data.info['pdata']['time'] != undefined && data.info['pdata']['time'] != ''){
		var startTimeView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    width:'90%', height: Ti.UI.SIZE,left:'5%',
		    top:'0dp'
		});
	    
	    var startTimeImg = Titanium.UI.createImageView({
	        image:'sorttime.png',
			height: '15dp', width: '15dp', left:'10dp'
		});
		
		startTime = new Date(data.info['pdata']['time']*1000);
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
		text: getStringlimit(data.info['des'],50,100),
		color:'#666666',
		top:'10dp',
		left:'20dp',right:'20dp', height: Ti.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		width: Ti.UI.FILL,
  		name:'destext',
  		
	});

	
	
	if(data.info['photos'].length > 0){
		var imageContentView = Titanium.UI.createView({
		  	backgroundColor: '#ffffff',
		    top: '10dp', left:'3%',
		    width:'94%',height:'200dp',
		    name:'imagecontentview'
		});  
		
		var tmpview = Ti.UI.createView({
            backgroundColor:'#ffffff'
		});
		
		
		Ti.API.info('image file : ',(getFeedImgAddr()+'feedimgm/' + data.info['photos'][0]).replace('.jpg','-m.jpg'));
		var feedImage = Titanium.UI.createImageView({
		    backgroundColor: '#ffffff',
		    visible : false,
		    name:'image'
		});
		
		  
		feedImage.addEventListener('load', function(e)
		{
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth *0.90;

			var imgwidth = e.source.size.width;
			var imgheight = e.source.size.height;
			if(imgwidth == 0 || imgheight == 0){
				var tmpimage = this.toBlob();
				imgwidth = tmpimage.width;
				imgheight = tmpimage.height;
			}
		
			if(imgwidth != 0 && imgwidth < platwidth){
		
				ratio = (platwidth / parseFloat(imgwidth));
		
				e.source.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				e.source.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				Ti.API.info('this.width ' + e.source.width);
				Ti.API.info('this.height ' + e.source.height);
				e.source.visible = true;
				e.source.eventid = data.info['eventid'];
				
			}

		});
		
		tmpview.add(feedImage);
		imageContentView.add(tmpview);
		

		middleView.add(imageContentView);
		
		feedImage.image = (getFeedImgAddr()+'feedimgm/' + data.info['photos'][0]).replace('.jpg','-m.jpg');

	}

    middleView.add(desText);
		
	feedView.add(middleView);
  
  
	///////////  bottom  like common button /////////////////////////////
	createCardBottom(feedView, data.info);
	

	view.add(feedView);

};
