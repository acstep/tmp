//usedAppWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function personInfoWindow(id) {
	

	
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
    backgroundView.backgroundColor = '#ffffff';
    
    var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		self.close();
	});	
	
	titleView.add(backImg);
	
	var TitleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text:'',
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
	titleView.add(TitleText);
	
	TitleText.addEventListener('click',function(e){
		self.close();
	});
	
	var contentScrollView = Ti.UI.createScrollView({
	    contentHeight: Titanium.UI.SIZE,
	    layout: 'vertical',
	    backgroundColor:'#ffffff',
        width:'100%'
	});
	
    function drawInfo(data){
    	forwardView.visible = false;
    	/////////////////   head photo  ///////////////////
		var topView = Ti.UI.createView({
		    backgroundColor: 'white',
		    width:'90%', height: '120dp',
		    top:'10dp',left:'5%'
		});
		
		
		///////////////////////  head photo  //////////////
		var headPhotoImg = Titanium.UI.createImageView({
	        borderRadius:15,backgroundImage:'headphoto.png',
			height: '100dp', width: '100dp', top:'10dp', left:'0dp'
		});
		headPhotoImg.image = getHeadImg(data['id']);
		
		var contentView = Titanium.UI.createView({
			left:'120dp',backgroundColor:'transparent',
			height: Ti.UI.SIZE,top:'10dp',bottom:'10dp',
			layout: 'vertical'
		});
		
	
		  
		var nameText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			text: data['name'],
			color:'#333333',left:'0dp',top:'10dp'
		});
		contentView.add(nameText);
		
		var genderView = Titanium.UI.createView({
			left:'0dp',backgroundColor:'transparent',
			height: Ti.UI.SIZE,width: Ti.UI.SIZE,top:'10dp',
			layout: 'horizontal',borderRadius:10
		});
		
		
		var genderImg = Titanium.UI.createImageView({
	        height: '15dp', width: '15dp',left:'10dp'
		});
		
		var gerder = data['sex'];
        if(data['sex'] == 1){
			genderImg.image = 'man.png';
			genderView.backgroundColor = '#3498db';
		}
		if(data['sex'] == 2){
			genderImg.image = 'girl.png';
			genderView.backgroundColor = '#FF80EE';
		}
		
		genderView.add(genderImg);
		
		var yearString = ' ';
		if(data['birthday'] != undefined){
			currenttime =  new Date() ;
			yearString =  new Date().getFullYear() - new Date(data['birthday']*1000).getFullYear();
			
		}
		var yearText = Ti.UI.createLabel({
			font:{fontSize:'12sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			color:'#ffffff',left:'10dp',right:'10dp',
			text :yearString
		});
		genderView.add(yearText);
		contentView.add(genderView);
		
		var desText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: data['des'],
			color:'#666666',
			top:'10dp', left:'5%', width:'90%', height:Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		////////////////  distance  and talk  /////////////////////
		var distanceTalkView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    height: Ti.UI.SIZE,layout: 'horizontal',
		    top:'20dp',left:'0dp',width:'100%',height:'50dp'
		});
		
		var distanceView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    height: Ti.UI.SIZE,
		    top:'0dp',left:'0dp',width:'50%',layout: 'vertical'
		});
		
		var timeView = Titanium.UI.createView({
			backgroundColor:'transparent',
			height: Ti.UI.SIZE, width:Ti.UI.SIZE,
			layout: 'horizontal'
		});
		var clockImg = Titanium.UI.createImageView({
	        height: '15dp', width: '15dp',image:'sorttime.png'
		});
		var timeString = '';
		eventtime = new Date(data['lastupdate']);
		currenttime =  new Date().getTime()/1000;
		var difftime = currenttime - eventtime;
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
			font:{fontSize:'14sp',fontFamily:'Marker Felt',fontWeight:'bold'},
			text: timeString,
			color:'#aaaaaa',left:'10dp'
		});
		
		timeView.add(clockImg);
		timeView.add(timeText);
		var distance = data['distance'];
		var distanceStr = '';
		if(distance < 1){
			distance =  parseInt(distance * 1000);
			distanceStr = '   '+distance+ ' '+L('m')+ '   ';
		}
		else{
			distance =  parseInt(distance);
			distanceStr = '   '+distance+ ' '+ L('km')+ '   ';
		} 
		var distanceText = Ti.UI.createLabel({
			font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
			text: distanceStr,
			color:'#ffffff',
		    top:'10dp',
			backgroundColor:'#f1c40f',
			borderRadius:10,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		
		distanceView.add(timeView);
		distanceView.add(distanceText);
		
		var SepView = Ti.UI.createView({
		    backgroundColor: '#bbbbbb',
		    height: '50dp',width:'1dp'
	
		});
	
		var talkBottomView = Ti.UI.createView({
		    backgroundColor: '#ffffff',
		    height: Ti.UI.SIZE,
		    top:'0dp',left:'0dp',width:'48%'
		});
		
		var talkBottomButton = Titanium.UI.createButton({
		    title: L('talk'),
		    width:'60%',
		    backgroundColor:'#3498db',borderRadius:10,

		});
		
		var myid = Ti.App.Properties.getString('userid','');
		talkBottomButton.addEventListener('click',function(e){
		
			
			if(myid == data['id']){
				return;
			}
		  
	        var TalkWindow = require('talkWindows');
	        tmpRoomData = {
	            'roomid':'',
	            'memberid':[],
	            'lasttime':parseInt(new Date().getTime()/1000),
	            'host':'',
	            'lastmsg':'',
	            'memdata':[]  
	        };
	        new TalkWindow(Ti.App.Properties.getString('userid',''), data['id'],tmpRoomData).open();
		});	
		
		if(myid != data['id']){
			talkBottomView.add(talkBottomButton);
		}
		
	    distanceTalkView.add(distanceView);
	    distanceTalkView.add(SepView);
	    distanceTalkView.add(talkBottomView);
	    
	    
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
				    top: '15dp', 
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
						ratio = (80 / parseFloat(imgwidth));
						this.width = (imgwidth * ratio) ;
						this.height = (imgheight * ratio) ;
					}
					else{
						ratio = (80 / parseFloat(imgheight));
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
		
		///////////////  school  /////////////////
		var schoolView = Ti.UI.createView({
			width:'100%',
			height:'50dp',
			top:'10dp',
		});
		
		var schoolTitleText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: L('school') + ':',
			color:'#2980b9',
			top:'20dp', left:'5%',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		
		if(data['school'] == ''){
			data['school'] = '---';
		}
		var schoolText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: data['school'],
			color:'#666666',
			top:'20dp', left:'130dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		schoolView.add(schoolTitleText);
		schoolView.add(schoolText);
		
		///////////////  job  /////////////////
		var jobView = Ti.UI.createView({
			width:'100%',
			height:'50dp',
			top:'10dp',
		});
		
		var jobTitleText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: L('work') + ':',
			color:'#2980b9',
			top:'20dp', left:'5%',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		if(data['job'] == ''){
			data['job'] = '---';
		}
		var jobText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: data['job'],
			color:'#666666',
			top:'20dp', left:'130dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		jobView.add(jobTitleText);
		jobView.add(jobText);
		
		topView.add(headPhotoImg);
		topView.add(contentView);
		contentScrollView.add(topView);
		if(data['des'] != ''){
			contentScrollView.add(desText);
		}
		
		contentScrollView.add(createHSepLine('90%','20dp','0dp'));
		if(data['photos'] != undefined){
			contentScrollView.add(imageScrollView);
			contentScrollView.add(createHSepLine('90%','20dp','0dp'));
		}
		
		contentScrollView.add(distanceTalkView);
		contentScrollView.add(createHSepLine('90%','20dp','0dp'));
		contentScrollView.add(schoolView);
		contentScrollView.add(jobView);
		
		backgroundView.add(contentScrollView);
    }
	
	
    
 
    forwardView.visible = true;
    
    
    
    function querypplCallback(result, data){
		if(result == true){
             drawInfo(data);
             
             
		}
		
	};
    
    var data = {
		'geo':[Ti.App.Properties.getDouble('longitude'),Ti.App.Properties.getDouble('latitude')],
		'id':id
	};
	datastring = JSON.stringify(data);
	Ti.API.info('datastring : ' + datastring);
    querypeople(datastring,querypplCallback);

    


	return self;
}

//make constructor function the public component interface
module.exports = personInfoWindow;