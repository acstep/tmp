//News Post Window Component Constructor
Ti.include("common_net.js");



function NewsPostWindow() {
	//load component dependencies
	
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
	
	var ind=Titanium.UI.createProgressBar({
	        width:'90%',
	        min:0,
	        max:100,
	        value:0,
	        height:'50dp',
	        color:'#ffffff',
	        message:L('uploadimage'),
	        font:{fontSize:14, fontWeight:'bold'},
	        
	        top:'50dp' 
	});

	
	forwardView.add(ind);


	////  title  //////
	
	
	
	var selectPosText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: L('news'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	
	
	
	var uploadimg = [];
	var totalUploadImg = 0;
	var currentUploadImg = 0;
	
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		self.close();
	});	
	
	var doneButton = Titanium.UI.createButton({
	    title: L('done'),
	    top: '10dp',
	    bottom:'10dp',
	    height: '30dp',
	    right:'10dp',
	    color:'#666666',
	    backgroundColor:'#f1c40f',
	    borderRadius:10,
	});
	
	doneButton.addEventListener('click',function(e)
	{
	    totalUploadImg = imageList.length;
	    currentUploadImg = 0;
	    uploadimg = [];
		forwardView.visible = true; 
		if(totalUploadImg == 0){
			postNewsEvent();
		}
		else{
			uploadImage();
		};
	});	
	
	titleView.add(selectPosText);
    titleView.add(backImg);
    titleView.add(doneButton);
	
	//////  content  /////////////////
	var contentScrollView = Ti.UI.createScrollView({
	    contentHeight: 'auto',
	    layout: 'vertical',
	    backgroundColor:'#eeeeee',
        width:'100%'
	});
	
	
	///////  image  scroll///////////////////
	var imageList = [];
	
	
	var imageScrollView = Ti.UI.createScrollView({
	    contentWidth: 'auto',
	    contentHeight:'160dp',
	    layout: 'horizontal',
	    backgroundColor:'#ffffff',
        height:'160dp'
	});
	
	//////   camera  /////////////
	
	
	var cameraViewImageView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100dp',
		height:'100dp',
		top:'30dp',
		left:'10dp',
		layout:'vertical',
		borderRadius:15,
		
	});
	
	var addImg = Titanium.UI.createImageView({
		image:'add.png',
		height: '30dp', width: '30dp', top:'20dp'
	});
	
	var addPhotoText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('addphoto'),
		color:'#666666',
		top:'15dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	
	/////////////   select image from camera or gallary ///////////////////
	deleteImageobj = {};
	var deleteImageDialog = Titanium.UI.createOptionDialog({

	    title: L('deletefile'),
	    options: [L('delete'),L('cancel')],
        cancel:1
	});
	deleteImageDialog.addEventListener('click', function(e) {
		if(e.index == 0){
			position = imageList.indexOf(deleteImageobj.image);
            Ti.API.info('remove image list pos : ' + position);
			if ( ~position ) imageList.splice(position, 1);
			imageScrollView.remove(deleteImageobj);
		}
	});	
	
	var dialog = Titanium.UI.createOptionDialog({
    //title of dialog
	    title: L('chooseimage'),
	    //options
	    options: [L('camera'),L('photogallery'), L('cancel')],
	    //index of cancel button
	    cancel:2
	});
	 
	//add event listener
	dialog.addEventListener('click', function(e) {
	    //if first option was selected
	    if(e.index == 0)
	    {
	        //then we are getting image from camera
	        Titanium.Media.showCamera({
	            //we got something
	            success:function(event)
	            {
	                //getting media
	                var image = event.media;
	                 
	                //checking if it is photo
	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	                {
	                    //we may create image view with contents from image variable
	                    //or simply save path to image
	                    imageList.push(image);
	                    var addSelectImg = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:15
						});
						addSelectImg.addEventListener('click',function(e)
						{
							deleteImageobj = this; 
							deleteImageDialog.show();
							
						});	
						imageScrollView.contentWidth = ((imageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						imageScrollView.add(addSelectImg);
	                }
	            },
	            cancel:function()
	            {
	                //do somehting if user cancels operation
	            },
	            error:function(error)
	            {
	                //error happend, create alert
	            
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA)
	                {
	                	showAlert('Camera', 'Device does not have camera'); 
	                    
	                }
	                else
	                {
	                	showAlert('Camera', 'Unexpected error: ' + error.code);  

	                }

	            },
	            allowImageEditing:true,
	            saveToPhotoGallery:true
	        });
	    }
	    else if(e.index == 1)
	    {
	        //obtain an image from the gallery
	        Titanium.Media.openPhotoGallery({
	            success:function(event)
	            {
	                //getting media
	                var image = event.media;
	                // set image view
	                 
	                //checking if it is photo
	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	                {
	                    //we may create image view with contents from image variable
	                    //or simply save path to image
	                    imageList.push(image);
	                    var addSelectImg = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:15
						});
						addSelectImg.addEventListener('click',function(e)
						{
							deleteImageobj = this; 
							deleteImageDialog.show();
						});	
						imageScrollView.contentWidth = ((imageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						imageScrollView.add(addSelectImg);
	                }  
	            },
	            cancel:function()
	            {
	                //user cancelled the action fron within
	                //the photo gallery
	            }
	        });
	    }
	    else
	    {
	        //cancel was tapped
	        //user opted not to choose a photo
	    }
	});

    cameraViewImageView.addEventListener('click',function(e)
	{
		dialog.show();
	});	
	
	
	cameraViewImageView.add(addImg);
	cameraViewImageView.add(addPhotoText);
	
	imageScrollView.add(cameraViewImageView);
	contentScrollView.add(imageScrollView);

    ///////    description and map /////////////
    var desTextArea = Ti.UI.createTextArea({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('addnewscontent'),
	    top: '30dp',
	    width: '90%', 
	    height : 'auto',
	    left: '5%',
        backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp'
	});

	contentScrollView.add(desTextArea);
     

    ////////////   map  //////////////
    
    var mapHintText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('changemap'),
		color:'#2c3e50',
		top:'50dp',
		left: '5%',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	}); 
	
	contentScrollView.add(mapHintText);
    
    var mapImg = Titanium.UI.createImageView({
		
		height: '200dp', width: '90%', top:'20dp',bottom:'30dp'
	});

	var latitude = 0;
	var longitude = 0;

	latitude = getLat();
	longitude = getLon();
	Ti.App.Properties.setDouble('userchooselatitude',latitude);
	Ti.App.Properties.setDouble('userchooselongitude',longitude);
	//url = "http://maps.googleapis.com/maps/api/staticmap?center=" +latitude +',' +longitude 
	//    + "&zoom=16&size=" + mapwidth/2 +'x' + mapheight/2 +'&markers=color:red%7C'+ latitude
	//    +',' + longitude +'&sensor=false';
	//Ti.API.info('url : ' + url);
	//mapImg.image = url; 
	
	var mapParentView = Titanium.UI.createView({
		
		height: '200dp', width: '90%', top:'20dp',bottom:'30dp',backgroundColor:'#transparent'
	});
	
    var Map = require('ti.map');    
	var posAnno = Map.createAnnotation({
	    latitude:latitude,
	    longitude:longitude,
	    pincolor:Map.ANNOTATION_RED,
	    myid:1 
	});
	
	var mapview = Map.createView({
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:latitude, longitude:longitude, latitudeDelta:0.005, longitudeDelta:0.005},
	    userLocation:false,
	    enableZoomControls:false,
	    annotations:[posAnno],
	    height: '100%', width: '100%', top:'0dp',left:'0dp'
	});
	
	var mapforgroundView = Titanium.UI.createImageView({
		height: '100%', width: '100%', top:'0dp',left:'0dp',backgroundColor:'transparent',
	});
	
	mapforgroundView.addEventListener('click',function(e)
	{
	     mapWindow = require('mapWindows');
	     var map = new mapWindow();
	     map.latitude = latitude;
	     map.longitude = longitude;
	     map.orgmapview = mapview;
	     map.orgAnnotation = posAnno;
		 map.anno.latitude = latitude; 
		 map.anno.longitude = longitude; 
		 map.map.region =  {latitude:latitude, longitude:longitude, latitudeDelta:0.005, longitudeDelta:0.005};
	     map.open();         
	});	
	
	mapParentView.add(mapview);
	mapParentView.add(mapforgroundView);
    contentScrollView.add(mapParentView);

    backgroundView.add(contentScrollView);
     

	
	
	function uploadImage(){
		var data_to_send = { 
            "file": imageList[currentUploadImg], 
            "id": Ti.App.Properties.getString('userid',''),
            'token':Ti.App.Properties.getString('token','') 
        };
		xhr = Titanium.Network.createHTTPClient();
        xhr.open("POST",getServerAddr()+"uploadimg");
        xhr.send(data_to_send); 
        xhr.onload = function(e) {
        	currentUploadImg = currentUploadImg + 1;
            var result =  JSON.parse(this.responseText);
            if(result.result == 'ok'){
            	Ti.API.info('result.filename: ' + result.filename);
            	uploadimg.push(result.filename);
            	
			}
			if(currentUploadImg == (totalUploadImg)){
				
				ind.value = 100;
				//  finish image upload, post event to server
				postNewsEvent();
			}
			else{
				uploadImage();
			}
        };
        xhr.onerror = function(e){
        	var alertDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:'Server Error. Please try again.'
			});
			alertDlg.show();
			Ti.API.info('Upload image fail.');
			forwardView.visible = false;
        	
        };
		xhr.onsendstream = function(e) {
			ind.value = (100/totalUploadImg)*currentUploadImg + (e.progress*100)/totalUploadImg ;
			
			Ti.API.info('upload - PROGRESS: ' + e.progress);
		};
	}
	
	function newsPostCallback(result, resultmsg){
		if(result == true){
			Ti.API.info('Post News Event success.');
			forwardView.visible = false;
			Ti.App.fireEvent('getnewfeed');
     
			self.close();

		}
		else{
			var alertDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:resultmsg
			});
			forwardView.visible = false;
			alertDlg.show();
			Ti.API.info('Post event false.');
			
			
		}
	};
	
	function postNewsEvent(){
		currentdate = new Date(); 
		extime = parseInt(currentdate.getTime()/1000)+Ti.App.Properties.getInt('defaultexpiretime',0);
		
		var data = {
			'name': Ti.App.Properties.getString('username'),
			'photos':uploadimg,
			'des':desTextArea.value,
			'pos':[parseFloat(Ti.App.Properties.getDouble('userchooselongitude',0)),parseFloat(Ti.App.Properties.getDouble('userchooselatitude',0))],
			'title':'',
			'extime':extime,
			'category':1000
		};
	    
	    datastring = JSON.stringify(data);
	    Ti.API.info('datastring : ' + datastring);
		createvent(datastring ,newsPostCallback);
	}
	
	var firstTimeBlur = false;
	self.addEventListener('postlayout',function(e){
		if(firstTimeBlur == false){
			firstTimeBlur = true;
			desTextArea.blur();
		} 
		
	});
	
	return self;
}

//make constructor function the public component interface
module.exports = NewsPostWindow;