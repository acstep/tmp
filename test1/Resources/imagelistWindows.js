//feed content Window Component Constructor

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
    		contentWidth:'auto',
            contentHeight:'auto',
            top:0,left:0,backgroundColor:'#000000',
		});
    	var imgView = Ti.UI.createImageView({
		    image: 'https://s3-ap-southeast-1.amazonaws.com/feedimg/' + imagelist[i],
		    width:'100%',backgroundColor:'#000000',
		});

        
		imgWrapper.add(imgView);
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