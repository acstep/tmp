//feed content Window Component Constructor
Ti.include("common_util.js");
var toast = Ti.UI.createNotification({
    message:'',
    duration: Ti.UI.NOTIFICATION_DURATION_LONG
});


function imageListWindow(imagelist,index) {
	//load component dependencies
	var self = Ti.UI.createWindow({
		backgroundColor:'#000000',
		navBarHidden:true,

 	});
 	
    var imageViewList = [];

    for(var i=0 ; i< imagelist.length; i++){
    	var imgWrapperh = Ti.UI.createScrollView({
            backgroundColor:'#000000',scrollType:'vertical',contentHeight:'auto',contentWidth:'auto'
		});
		var imgWrapperv = Ti.UI.createScrollView({
            backgroundColor:'#000000',scrollType:'horizontal',contentHeight:'auto',contentWidth:'auto'
		});
		
		var imgWrapper2 = Ti.UI.createView({
            backgroundColor:'#000000'
		});
		
        var baseHeight = Ti.Platform.displayCaps.platformHeight;
		var baseWidth = Ti.Platform.displayCaps.platformWidt;
		
    	var imgView = Ti.UI.createImageView({
		    backgroundColor:'#000000',
		    visible:false
		});
		

		imgView.addEventListener('load', function(e)
		{
			var platheight = Ti.Platform.displayCaps.platformHeight;
			var platwidth = Ti.Platform.displayCaps.platformWidth;

			var imgwidth = e.source.size.width;
			var imgheight = e.source.size.height;

            Ti.API.info('imgwidth ' + imgwidth);
			Ti.API.info('imgheight ' + imgheight);
			if(imgwidth != 0 && imgwidth < platwidth){
		
				var ratio = (platwidth / parseFloat(imgwidth));
		       
				e.source.width = (imgwidth * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				e.source.height = (imgheight * ratio) / (Titanium.Platform.displayCaps.dpi / 160);
				Ti.API.info('this.width ' + e.source.width);
				Ti.API.info('this.height ' + e.source.height);
				baseHeight = e.source.height;
				baseWidth = e.source.width;
				e.source.visible = true;
	
			}

		});
		
		imgView.image = getFeedImgAddr() +'feedimgl/' + imagelist[i].replace('.jpg','-l.jpg');
        imgView.vscroll = imgWrapperv;
        imgView.hscroll = imgWrapperh;
        
        var pageText = Ti.UI.createLabel({
			font:{fontSize:'30sp',fontFamily:'Helvetica Neue'},      
			text: (i+1) + '/' + imagelist.length,
			color:'#ffffff',backgroundColor:'#000000',
			bottom:'50dp',
			right:'50dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		
		imgView.addEventListener('pinch', function(e) {
			Ti.API.info('pinch : ' + e.scale);
			this.vscroll.scrollingEnabled = false;
		    this.hscroll.scrollingEnabled = false;
		    this.height = baseHeight * e.scale;
		    this.width = baseWidth * e.scale;
		    
		});
		

		imgView.addEventListener('touchstart', function(e) {
			Ti.API.info('touchstart  ' );
		    baseHeight = this.height;
		    baseWidth = this.width;

		    
		    
		});
		imgView.addEventListener('touchend', function(e) {
			Ti.API.info('touchend  ' );
		    this.vscroll.scrollingEnabled = true;
		    this.hscroll.scrollingEnabled = true;
		    
		});



	    imgWrapperv.add(imgView);
	    imgWrapperv.add(pageText);
		//imgWrapperv.add(imgWrapper2);
		imgWrapperh.add(imgWrapperv);
		imageViewList.push(imgWrapperh);
    }

	
	var photosView = Ti.UI.createScrollableView({
	    showPagingControl:true,
	    views:imageViewList
	});
	
	
		
		
	self.add(photosView);
    photosView.currentPage = index;
	return self;
}

//make constructor function the public component interface
module.exports = imageListWindow;