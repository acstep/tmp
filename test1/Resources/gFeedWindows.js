//usedAppWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function gFeedWindow(id) {
	

	
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
	
	var addPostImg = Titanium.UI.createImageView({
		image:'addw.png',
		top: '10dp', right:'15dp', height: '30dp', width: '30dp'
	});
	
	addPostImg.addEventListener('click',function(e){
		showPostDialog(id);
	});	
	
	titleView.add(addPostImg);
	
	
	var contentScrollView = Ti.UI.createScrollView({
	    contentHeight: Titanium.UI.SIZE,
	    layout: 'vertical',
	    backgroundColor:'#eeeeee',
        width:'100%'
	});
	
    function drawInfo(data){
    	forwardView.visible = false;
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
		contentView.add(phoneNumView);
		
		var desText = Ti.UI.createLabel({
			font:{fontSize:'16sp'},
			text: data['des'],
			color:'#666666',
			top:'10dp', left:'5%', width:'90%', height:Ti.UI.SIZE,
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		////////////////  join  /////////////////////////////////////////////////
		var joinView = Ti.UI.createView({
		    backgroundColor: 'transparent',
		    height: Ti.UI.SIZE,layout: 'horizontal',
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
		
			//var JoinListWindow = require('joinMsgWindows');
			//var stringData = {'title':'joinlist'};
			//new JoinListWindow(data['eventid'],stringData).open(); 
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
		
		joinBottomView.addEventListener('click',function(e){
		
			//var JoinWindow = require('joinWindows');
			//var stringData = {'title':'join'};
			//new JoinWindow(data,stringData).open(); 
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
		
		contentScrollView.add(joinView);
		contentScrollView.add(createHSepLine('90%','20dp','0dp'));

		
		backgroundView.add(contentScrollView);
    }
	

    forwardView.visible = true;
    
    
    
    function queryGroupCallback(result, data){
		if(result == true){
             drawInfo(data);
     
		}
		
	};
    

    querygroup(id,queryGroupCallback);

    


	return self;
}

//make constructor function the public component interface
module.exports = gFeedWindow;