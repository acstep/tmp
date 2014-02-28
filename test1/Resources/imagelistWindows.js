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
    	var imgWrapper = Ti.UI.createScrollView({
    		contentWidth:'100%',
            contentHeight:'100%',
            top:0,left:0,backgroundColor:'#000000',
		});
    	var imgView = Ti.UI.createImageView({
		    image: 'https://s3-ap-southeast-1.amazonaws.com/feedimgl/' + imagelist[i].replace('.jpg','-l.jpg'),
		    width:'100%',backgroundColor:'#000000',
		});

        var pageText = Ti.UI.createLabel({
			font:{fontSize:'30sp',fontFamily:'Helvetica Neue'},      
			text: (i+1) + '/' + imagelist.length,
			color:'#ffffff',backgroundColor:'#000000',
			bottom:'50dp',
			right:'50dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
		});
	
		imgWrapper.add(imgView);
		imgWrapper.add(pageText);
		imageViewList.push(imgWrapper);
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