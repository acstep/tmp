//Activity Post Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function ActivityPostWindow() {
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
		text: L('club'),
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
			postActivityEvent();
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
    var titleTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('activitytitle'),
	    top: '30dp',
	    width: '90%', 
	    height : 'auto',
	    left: '5%',
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:10,
	});
	
	var groupTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('groupname'),
	    top: '10dp',
	    width: '90%', 
	    height : 'auto',
	    left: '5%',backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:10,
	});
	
	
	
	startTime = new Date(); 
    endTime = new Date(startTime); 
    endTime.setHours(startTime.getHours()+1);
	
	function adjTimeText(start){
		if(start == true){
			if(startTime.getTime() > endTime.getTime()){
				endTime = new Date(startTime); 
				endTime.setHours(endTime.getHours()+1);
			}
		}
		else{
			if(startTime.getTime() > endTime.getTime()){
				startTime = new Date(endTime); 
				startTime.setHours(startTime.getHours()-1);
			}
		}
		sDateText.text = startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate();
		eDateText.text = endTime.getFullYear()+'/'+(endTime.getMonth()+1)+'/'+endTime.getDate();
		var minutes = startTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		sTimeText.text = startTime.getHours()+':'+minutes;
		minutes = endTime.getMinutes();
		if(minutes < 10){
			minutes = '0'+minutes;
		}
		eTimeText.text = endTime.getHours()+':'+minutes;
	}
	
	
	function showDatePicker(start, mtime){
		
		var picker = Ti.UI.createPicker({
		    type:Ti.UI.PICKER_TYPE_DATE,
		    
		    value:mtime
		});
	    picker.showDatePickerDialog({
	    	value:mtime,
		    callback: function(e) {
		      if (e.cancel) {
		          Ti.API.info('User canceled dialog');
		      } 
		      else {
                    if(start == true){
                    	startTime.setFullYear(e.value.getFullYear()) ;
	      		    	startTime.setMonth(e.value.getMonth());
	      		    	startTime.setDate( e.value.getDate()) ;
	      		    	
                    }
                    else{
                    	endTime.setFullYear(e.value.getFullYear()) ;
	      		    	endTime.setMonth(e.value.getMonth());
	      		    	endTime.setDate( e.value.getDate()) ;
                    }
	      		    adjTimeText(start);
                    
		        }
		    }
		});
	}
	
	function showTimePicker(start, mtime){
		var picker = Ti.UI.createPicker({
		    type:Ti.UI.PICKER_TYPE_TIME,
		    
		    value:mtime
		});
	    picker.showTimePickerDialog({
	    	value: mtime,
		    callback: function(e) {
		      if (e.cancel) {
		          Ti.API.info('User canceled dialog');
		      } 
		      else{
		      	
		      	  if(start == true){
                    	startTime.setHours(e.value.getHours()) ;
	      		    	startTime.setMinutes( e.value.getMinutes()) ;
	      		    	
                    }
                    else{
                    	endTime.setHours(e.value.getHours()) ;
	      		    	endTime.setMinutes( e.value.getMinutes()) ;
                    }
	      		    adjTimeText(start);  
		        }
		    }
		});
	}
	
    var startTimeView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'90%',
		height:'50dp',
		top:'30dp',
		left: '5%',

		
	});
	
	var starttimeText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('starttime') + ':',
		color:'#3498db',
		top:'10dp', left:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var sDateText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate(),
		color:'#666666',
		top:'10dp', left:'130dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	sDateText.addEventListener('click',function(e){
		showDatePicker(true, startTime);
	
	});
	
	var minutes = startTime.getMinutes();
	if(minutes < 10){
		minutes = '0'+minutes;
	}
	var sTimeText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: startTime.getHours()+':'+minutes,
		color:'#666666',
		top:'10dp', right:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	sTimeText.addEventListener('click',function(e){
		showTimePicker(true, startTime);
	});
	
    startTimeView.add(starttimeText);
	startTimeView.add(sDateText);
	startTimeView.add(sTimeText);
	
	var endTimeView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'90%',
		height:'50dp',
		top:'30dp',
		left: '5%',

		
	});
	
	var endtimeText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('endtime') + ':',
		color:'#3498db',
		top:'10dp', left:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var eDateText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: endTime.getFullYear()+'/'+(endTime.getMonth()+1)+'/'+endTime.getDate(),
		color:'#666666',
		top:'10dp', left:'130dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	eDateText.addEventListener('click',function(e){
		showDatePicker(false, endTime);
	
	});
	
	var minutes = endTime.getMinutes();
	if(minutes < 10){
		minutes = '0'+minutes;
	}
	var eTimeText = Ti.UI.createLabel({
		font:{fontSize:'20sp'},
		text: endTime.getHours()+':'+minutes,
		color:'#666666',
		top:'10dp', right:'20dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	eTimeText.addEventListener('click',function(e){
		showTimePicker(false, endTime);
	});
	
	endTimeView.add(endtimeText);
	endTimeView.add(eDateText);
	endTimeView.add(eTimeText);
	
	
	
    
    var desTextArea = Ti.UI.createTextArea({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('addactivitycontent'),
	    top: '30dp',
	    width: '90%', 
	    height : Ti.UI.SIZE,
	    left: '5%',
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',
        maxLength:500
	});
    
    contentScrollView.add(titleTextField);
    contentScrollView.add(groupTextField);
    contentScrollView.add(startTimeView);
    contentScrollView.add(endTimeView);
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

	latitude = Ti.App.Properties.getDouble('latitude',latitude);
	longitude = Ti.App.Properties.getDouble('longitude',longitude);
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
        xhr.open("POST","http://54.254.208.12/api/uploadimg");
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
				postActivityEvent();
			}
			else{
				uploadImage();
			}
        };
        xhr.onerror = function(e){
			showAlert('Error !', 'Server Error. Please try again.');
			Ti.API.info('Upload image fail.');
			forwardView.visible = false;
        	
        };
		xhr.onsendstream = function(e) {
			ind.value = (100/totalUploadImg)*currentUploadImg + (e.progress*100)/totalUploadImg ;
			
			Ti.API.info('upload - PROGRESS: ' + e.progress);
		};
	}
	
	function activityPostCallback(result, resultmsg){
		if(result == true){
			Ti.API.info('Post Activity Event success.');
			forwardView.visible = false;
			Ti.App.fireEvent('getnewfeed');
     
			self.close();

		}
		else{
			
			showAlert('Error !', resultmsg);
			forwardView.visible = false;
			Ti.API.info('Post event false.');
			
			
		}
	};
	
	function postActivityEvent(){
		currentdate = new Date(); 
		extime = parseInt(currentdate.getTime()/1000)+Ti.App.Properties.getInt('defaultexpiretime',0);
		
		var data = {
			'name': Ti.App.Properties.getString('username'),
			'photos':uploadimg,
			'des':desTextArea.value,
			'pos':[parseFloat(Ti.App.Properties.getDouble('userchooselongitude',0)),parseFloat(Ti.App.Properties.getDouble('userchooselatitude',0))],
			'title':titleTextField.value,
			'extime':extime,
			'headphoto':Ti.App.Properties.getString('headfile',''),
			'category':1001,
			'pdata':{
				 'gname':groupTextField.value,
				 'starttime':parseInt(startTime.getTime()/1000),
				 'endtime':parseInt(endTime.getTime()/1000)
			}
		};
	    
	    datastring = JSON.stringify(data);
	    Ti.API.info('datastring : ' + datastring);
		createvent(datastring ,activityPostCallback);
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
module.exports = ActivityPostWindow;