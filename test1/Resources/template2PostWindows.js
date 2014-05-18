//Template Post Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function Template2PostWindows(data) {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;

    tracker.trackScreen('Template2PostWindows' );

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
		text: L(data.title),
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
	    borderRadius:3,
	});
	
	doneButton.addEventListener('click',function(e)
	{
		if(desTextArea.value.length == 0 || purposeTextField.value.length == 0 || placeTextField.value.length == 0){
			showAlert('Error !', 'fieldempty');
			return;
		}
		

	    totalUploadImg = imageList.length;
	    currentUploadImg = 0;
	    uploadimg = [];
		forwardView.visible = true; 
		if(totalUploadImg == 0){
			ind.visible = false;
			postTemplate2Event();
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
		borderRadius:5,
		
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
	var deleteImageobj = {};
	var deleteImageDialog = Titanium.UI.createOptionDialog({

	    title: L('deletefile'),
	    options: [L('delete'),L('cancel')],
        cancel:1
	});
	deleteImageDialog.addEventListener('click', function(e) {
		if(e.index == 0){
			var position = imageList.indexOf(deleteImageobj.image);
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
							borderRadius:5
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
							borderRadius:5
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
    var purposeTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L(data.titlehinttext),
	    top: '20dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:3,
	});
	
	var placeTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L(data.placehinttext),
	    top: '20dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:3,
	});

    ///////////  time //////////////////
	var startTime = new Date(); 
 
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
                  
                	startTime.setFullYear(e.value.getFullYear()) ;
      		    	startTime.setMonth(e.value.getMonth());
      		    	startTime.setDate( e.value.getDate()) ;
      		    	sDateText.text = startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate();
		        }
		    }
		});
	}
	
	
	
    var startTimeView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'90%',
		height:Titanium.UI.SIZE,
		top:'20dp',
		left: '5%',
        layout: 'horizontal'
	});
	
	var socialTimeImg = Titanium.UI.createImageView({
        image:'starttime.png',
		height: '15dp', width: '15dp', left:'10dp'
	});
	
	var starttimeText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('preferredtime') + ':',
		color:'#3498db',
		top:'10dp', left:'10dp',bottom:'10dp',
		height:Titanium.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var sDateText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: startTime.getFullYear()+'/'+(startTime.getMonth()+1)+'/'+startTime.getDate(),
		color:'#666666',
		top:'10dp', left:'30dp',bottom:'10dp',
		height:Titanium.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	sDateText.addEventListener('click',function(e){
		showDatePicker(true, startTime);
	
	});
	
	
	startTimeView.add(socialTimeImg);
    startTimeView.add(starttimeText);
	startTimeView.add(sDateText);

	var peopleView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'90%',
		height:Titanium.UI.SIZE,
		top:'20dp',
		left: '5%',
        layout: 'horizontal'
	});
	
	var pplImg = Titanium.UI.createImageView({
        image:'ppl.png',
		height: '15dp', width: '15dp', left:'10dp'
	});
	
	var lookingText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('preferredppl') ,
		color:'#3498db', width:'35%',
		left:'10dp',
		height:Titanium.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	
	var pplTextfield = Titanium.UI.createTextField({
		editable: true,
		value:'1',
		hintText:'1',
		width:'20%',
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		color:'#000000',
		textAlign:'left',
	});
	
	var peopleText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('people') ,
		color:'#3498db', width:'25%',
		left:'10dp',
		height:Titanium.UI.SIZE,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
    peopleView.add(pplImg);
    peopleView.add(lookingText);
	peopleView.add(pplTextfield);
	peopleView.add(peopleText);
    
    var desTextArea = Ti.UI.createTextArea({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L(data.deshinttext),
	    top: '30dp',
	    width: '90%', 
	    height : Ti.UI.SIZE,
	    left: '5%',
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',
        maxLength:500
	});
    
    contentScrollView.add(purposeTextField);
    contentScrollView.add(placeTextField);
    contentScrollView.add(startTimeView);
    contentScrollView.add(peopleView);
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
	
	var mapParentView = Titanium.UI.createView({
		
		height: '200dp', width: '90%', top:'20dp',bottom:'30dp',backgroundColor:'transparent'
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
	     var mapWindow = require('mapWindows');
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
		var xhr = Titanium.Network.createHTTPClient({validatesSecureCertificate: false});
        xhr.open("POST",getImgServerAddr()+"uploadimg");
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
				postTemplate2Event();
			}
			else{
				uploadImage();
			}
        };
        xhr.onerror = function(e){
			showAlert('Error !', 'networkerror');
			Ti.API.info('Upload image fail.');
			forwardView.visible = false;
        	
        };
		xhr.onsendstream = function(e) {
			ind.value = (100/totalUploadImg)*currentUploadImg + (e.progress*100)/totalUploadImg ;
			
			Ti.API.info('upload - PROGRESS: ' + e.progress);
		};
	}
	
	function template2PostCallback(result, resultmsg){
		if(result == true){
			Ti.API.info('Post template2 Event success.');
			forwardView.visible = false;
			Ti.App.fireEvent('getnewfeed');
     
			self.close();

		}
		else{

			forwardView.visible = false;
			Ti.API.info('Post event false.');
			
			
		}
	};
	
	function postTemplate2Event(){
		var currentdate = new Date(); 
		var extime = parseInt(currentdate.getTime()/1000)+Ti.App.Properties.getInt('defaultexpiretime',0);
		var numppl = parseInt(pplTextfield.value);
		if(isNaN(numppl)) {
            numppl = 1;
        }
        if(numppl <= 1){
        	numppl = 1;
        }
		var postdata = {
			'name': Ti.App.Properties.getString('username'),
			'photos':uploadimg,
			'des':desTextArea.value,
			'pos':[parseFloat(Ti.App.Properties.getDouble('userchooselongitude',0)),parseFloat(Ti.App.Properties.getDouble('userchooselatitude',0))],
			'title':purposeTextField.value,
			'extime':extime,
			'category':data.category,
			'pdata':{
				 'place':placeTextField.value,
				 'time':parseInt(startTime.getTime()/1000),
				 'numppl':numppl,
				 
			}
		};
	    if(data.gid != ''){
	    	postdata['gid'] = data.gid;
	    }
	    var datastring = JSON.stringify(postdata);
	    Ti.API.info('datastring : ' + datastring);
		createvent(datastring ,template2PostCallback);
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
module.exports = Template2PostWindows;