//Create group Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function createGroupWindow(type,gid,selfdata) {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    var groupID = gid;
    
    var headChange = false;
    var photoList = [];
    var needUploadImage = [];
    var currentUploadPhoto = 0;
    
    tracker.trackScreen('createGroupWindow' );
    
    if(type == 'new'){
    	headChange = true;
    }
    
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
		text:L('creategroup'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
	if(type == 'edit'){
		TitleText.text = L('editgroup');
	}
	
	TitleText.addEventListener('click',function(e){
		self.close();
	});
	
	titleView.add(TitleText);
	
	var doneButton = Titanium.UI.createButton({
	    title: L('done'),
	    top: '10dp',
	    bottom:'10dp',
	    height: '30dp',
	    right:'10dp',
	    color:'#666666',
	    borderRadius:3,
	    backgroundColor:'#f1c40f'
	});
	
	
	doneButton.addEventListener('click',function(e)
	{
		
		if(nameTextField.value.length == 0 || introTextArea.value.length == 0){
			showAlert('Error !', 'fieldempty');
			return;
		}
		
		for(var i=0; i<tmpImageList.length; i++){
			if(tmpImageList[i].filename != ''){
				photoList.push(tmpImageList[i].filename);
			}
			else{
				needUploadImage.push(tmpImageList[i].image);
			}
		}
		if(needUploadImage.length == 0){
			ind.visible = false;
			forwardView.visible = true;
			saveGroup();
		}
		else{
			forwardView.visible = true;
			uploadPhotos();
		}
		
		
	});	
	
	titleView.add(doneButton);
	
	function updateCallback(result, gid){
		if(result == true){
			groupID = gid;
			Ti.API.info('groupID = ' + groupID);
			if(headChange == true){
				uploadHeadImage(groupID);
			}
			else{
				forwardView.visible = false;
				Ti.App.fireEvent('getnewfeed');
				Ti.App.fireEvent('reloadGroupList');
				self.close();
			}
		}
		else{
			forwardView.visible = false;
			
			Ti.API.info('update group false.');
		}	
    }
	
	function uploadPhotos(){
		currentUploadPhoto = 0;
		uploadImage();
	}
	
	function saveGroup(){
		var nametext = nameTextField.value;
		var phonetext  = phoneTextField.value;
		var addresstext  = addressTextField.value;
		var weburltext  = weburlTextField.value;
		var userdestext  = introTextArea.value;
		Ti.API.info('updateGroup groupID= '+ groupID);
		if(nametext == ''){
			showAlert('Error !', 'nameempty');
			return;
		}

		var data = {
			
			'name': nametext,
			'phone':phonetext,
			'des':userdestext,
			'address':addresstext,
			'web':weburltext,
			'photos':photoList,
			'pos':[parseFloat(Ti.App.Properties.getDouble('userchooselongitude',0)),parseFloat(Ti.App.Properties.getDouble('userchooselatitude',0))]
		};
		forwardView.visible = true;
		
		if(groupID == ''){
			Ti.API.info('creategroup');
			datastring = JSON.stringify(data);
			createGroup(datastring, updateCallback);
		}
		else{
			Ti.API.info('updateGroup');
			data['gid'] = groupID;
			datastring = JSON.stringify(data);
			updateGroup(datastring, updateCallback);
		}
		
	}
	
	
	//////  content  /////////////////
	var contentScrollView = Ti.UI.createScrollView({
	    contentHeight: Titanium.UI.SIZE,
	    layout: 'vertical',
	    backgroundColor:'#ecf0f1',
        width:'100%'
	});
	
	///////////////////  head image  ///////////////////////////
	var headView = Titanium.UI.createView({
		left:'0dp', 
		height:'140dp',width:'100%',backgroundColor:'#ecf0f1'
	});
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:5,backgroundImage:'headphoto.png',
		height: '100dp', width: '100dp', top:'20dp', left:'20dp'
	});
	
	var changeImgText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text: L('changehead'),
		color:'#ffffff',
		backgroundColor:'#000000',borderRadius:5,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		bottom:'20dp',width:'100dp', left:'20dp',height:Titanium.UI.SIZE
	});
	
	 
	headView.add(headPhotoImg);
	headView.add(changeImgText);

	
	///////////////    name  ////////////////////////////
	var nameView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'90%',layout: 'vertical',borderRadius:5,top:'15dp',backgroundColor:'#ffffff'
	});
	
	var nameTextView = Titanium.UI.createView({
		left:'0%',top: '0dp',width:'100%',height:'50dp',backgroundColor:'#dddddd'
	});
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('basicinfo'),
		color:'#2980b9',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%'
	});
	nameTextView.add(nameText);
	
	var nameTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('groupname'),
	});
	
	var phoneTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('phone'),keyboardType:Titanium.UI.KEYBOARD_NUMBER_PAD,
	});
	
	var addressTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('address'),
	});
	
	var weburlTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',bottom:'10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('weblink'),
	});
	
	
		
	nameView.add(nameTextView);
	nameView.add(nameTextField);
	nameView.add(createHSepLine('100%','10dp','0dp'));
    nameView.add(phoneTextField);
    nameView.add(createHSepLine('100%','10dp','0dp'));
	nameView.add(addressTextField);
	nameView.add(createHSepLine('100%','10dp','0dp'));
	nameView.add(weburlTextField);
	
	///////////////    intro  ////////////////////////////
	var introView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var introText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('groupintro'),
		color:'#2980b9',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '30dp'
	});
	
	var introTextArea = Ti.UI.createTextArea({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('inputgroupintro'),
	    top: '10dp',
	    height : '200dp', width:'90%',
	    left: '5%',
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',
        maxLength:500
	});
	
	
	
	introView.add(introText);
	
	introView.add(introTextArea);

    // set orginal data 
    if(type == 'edit' && selfdata != 'name'){
		nameTextField.value = selfdata['name'];
		phoneTextField.value = selfdata['phone'];
		addressTextField.value = selfdata['address'];
		weburlTextField.value = selfdata['web'];
		introTextArea.value = selfdata['des'];
		headPhotoImg.image = getHeadImg(selfdata['gid']);
	}

	
	var tmpView = Titanium.UI.createView({
		height:'30dp',width:'100%',layout: 'vertical'
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
	var newimage = {};
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
	                    
	                    var CropPhotoWindow = require('headWindows');
	                    newimage = image;
	                    if(image.width >  image.height){
	                    	if(image.width > 1000){
	                    		var ratio = image.width / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
	                    else{
	                    	if(image.height > 1000){
	                    		var ratio = image.height / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
						new CropPhotoWindow(newimage,'modify').open();
	                    
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
	                	showAlert('Error !','Device does not have camera');
	                }
	                else
	                {
	                	showAlert('Error !','Unexpected error: ' + error.code);

	                }
	 
	                // show alert
	                a.show();
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
	                    var CropPhotoWindow = require('headWindows');
	                    newimage = image;
	                    if(image.width >  image.height){
	                    	if(image.width > 1000){
	                    		var ratio = image.width / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
	                    else{
	                    	if(image.height > 1000){
	                    		var ratio = image.height / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
						new CropPhotoWindow(newimage,'modify').open();
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

    headView.addEventListener('click',function(e)
	{
		dialog.show();
	});
	
	var getheadphoto = function(e) {
		Ti.API.info('receive event headphotodone ');
		headChange = true;
        var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory,'head.jpg');
        if (f.exists()) {
	        headPhotoImg.image =  f.read();
	        headPhotoImg.visible = true;
	        headphotoExist = true;
	    }
	};
	
	Ti.App.addEventListener('modifyheadphotodone',getheadphoto);
	
	
	////////////   map  //////////////
    
    var mapHintText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('changemap'),
		color:'#2c3e50',
		top:'50dp',
		left: '5%',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	}); 
	

    
    var mapImg = Titanium.UI.createImageView({
		
		height: '200dp', width: '90%', top:'20dp',bottom:'30dp'
	});

	var latitude = 0;
	var longitude = 0;
  
	latitude = getLat();
	longitude = getLon();
	
	if(type == 'edit' && selfdata != 'name'){
		latitude = selfdata['loc']['coordinates'][1];
		longitude = selfdata['loc']['coordinates'][0];
	}
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
	
	
	///////////////   photos  ////////////////////////////
	var addPhotosView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical',top: '20dp'
	});
	
	var addPhotosText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('addgroupphotos'),
		color:'#e67e22',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '10dp'
	});
	addPhotosView.add(addPhotosText);
	
	var tmpImageList = [];
	
	
	var imageScrollView = Ti.UI.createScrollView({
	    contentWidth: 'auto',
	    contentHeight:'160dp',
	    layout: 'horizontal',
	    backgroundColor:'#ffffff',
        height:'160dp',
        top:'20dp'
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
	
	var addImgView = Titanium.UI.createImageView({
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
			position =  tmpImageList.indexOf(deleteImageobj);
            Ti.API.info('remove image list pos : ' + position);
			if ( ~position ) tmpImageList.splice(position, 1);
			imageScrollView.remove(deleteImageobj.imgobj);
		}
	});	
	
	var chooseImgdialog = Titanium.UI.createOptionDialog({
    //title of dialog
	    title: L('chooseimage'),
	    //options
	    options: [L('camera'),L('photogallery'), L('cancel')],
	    //index of cancel button
	    cancel:2
	});
	 
	//add event listener
	chooseImgdialog.addEventListener('click', function(e) {
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
	                  
	                    var addSelectImgView = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:5
						});
						
						
						var imageobj = {'filename': '', 'image':image,'imgobj':addSelectImgView};
	                    tmpImageList.push(imageobj);
	                    addSelectImgView.imageobj = imageobj;
	                    addSelectImgView.addEventListener('click',function(e)
						{
							deleteImageobj = this.imageobj; 
							deleteImageDialog.show();
							
						});	
	                    
						imageScrollView.contentWidth = ((tmpImageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						imageScrollView.add(addSelectImgView);
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
	                    
	                    var addSelectImgView = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:5
						});
						
						
						var imageobj = {'filename': '', 'image':image,'imgobj':addSelectImgView};
	                    tmpImageList.push(imageobj);
	                    addSelectImgView.imageobj = imageobj;
	                    addSelectImgView.addEventListener('click',function(e)
						{
							deleteImageobj = this.imageobj; 
							deleteImageDialog.show();
						});	
	                    
						imageScrollView.contentWidth = ((tmpImageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						imageScrollView.add(addSelectImgView);
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
		if(tmpImageList.length > 8){
			showAlert('Warning !', 'No more than 8 photos.');
		}
		chooseImgdialog.show();
	});	

	cameraViewImageView.add(addImgView);
	cameraViewImageView.add(addPhotoText);
	
	imageScrollView.add(cameraViewImageView);
	
	var orginalPhotos = [];
	
	if(type == 'edit'){
		orginalPhotos = selfdata['photos'];
	}
	
	for(var i=0; i<orginalPhotos.length; i++){
		var tmpImageView = Titanium.UI.createImageView({
			width:'100dp',
			height:'100dp',
			top:'30dp',
			left:'10dp',
			borderRadius:5,
		    image: (getFeedImgAddr()+'feedimgsm/' + orginalPhotos[i]).replace('.jpg','-m.jpg')
		});
		
		var imageobj = {'filename': orginalPhotos[i], 'image':{},'imgobj':tmpImageView};
		tmpImageList.push(imageobj);
		tmpImageView.imageobj = imageobj;
		tmpImageView.addEventListener('click',function(e){
			deleteImageobj = this.imageobj; 
			deleteImageDialog.show();
		});	
		imageScrollView.contentWidth = ((tmpImageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);

		imageScrollView.add(tmpImageView);
	}
	

	//////////////  upload photos //////////////////////
	function uploadImage(){
		var data_to_send = { 
            "file": needUploadImage[currentUploadPhoto], 
            "id": Ti.App.Properties.getString('userid',''),
            'token':Ti.App.Properties.getString('token','') 
        };
		var xhr = Titanium.Network.createHTTPClient({validatesSecureCertificate: false});
        xhr.open("POST",getServerAddr()+"uploadimg");
        xhr.send(data_to_send); 
        xhr.onload = function(e) {
        	currentUploadPhoto = currentUploadPhoto + 1;
            var result =  JSON.parse(this.responseText);
            if(result.result == 'ok'){
            	Ti.API.info('result.filename: ' + result.filename);
            	photoList.push(result.filename);
            	
			}
			if(currentUploadPhoto == (needUploadImage.length)){
				
				ind.value = 90;
				//  finish image upload, post event to server
				saveGroup();
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
			ind.value = (100/needUploadImage.length)*currentUploadPhoto + (e.progress*100)/needUploadImage.length ;
			
			Ti.API.info('upload - PROGRESS: ' + e.progress);
		};
	}
	////////////////////////////   upload head photo  ///////////////////////
	function uploadHeadImage(){
		expireCache();
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory,'head.jpg');
        Ti.API.info('Upload image gid = ' + groupID);
		var data_to_send = { 
            "file": f.read(), 
            "name": 'head.jpg',
            'gid':groupID,
            "id": Ti.App.Properties.getString('userid',''),
            'token':Ti.App.Properties.getString('token','')
        };
		var xhr = Titanium.Network.createHTTPClient({validatesSecureCertificate: false});
        xhr.open("POST",getServerAddr()+"uploadheadimg");
        xhr.send(data_to_send); 
        xhr.onload = function(e) {
            var result =  JSON.parse(this.responseText);
            if(result.result == 'ok'){
				forwardView.visible = false;
				Ti.App.fireEvent('reloadGFeed');
				Ti.App.fireEvent('reloadGroupList');
				self.close();
            	
			}
			forwardView.visible = false;
        };
        xhr.onerror = function(e){

			showAlert('Error !', 'Upload image error.');
			Ti.API.info('Upload image fail.');
        	
        };
		xhr.onsendstream = function(e) {
			ind.value = e.progress*100 ;
			Ti.API.info('upload - PROGRESS: ' + e.progress);
		};
	}
	
	contentScrollView.add(headView);
	//contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(nameView);
	contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(addPhotosView);
	contentScrollView.add(imageScrollView);
	contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(introView);
	contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(mapHintText);
    contentScrollView.add(mapParentView);
	contentScrollView.add(tmpView);
	backgroundView.add(contentScrollView);
	
	function queryGroupCallback(result, data){
		forwardView.visible = false;
		if(result == true){
			nameTextField.value;
			phoneTextField.value;
			addressTextField.value;
			weburlTextField.value;
			introTextArea.value;
           
		}
	}
	

	return self;
}

//make constructor function the public component interface
module.exports = createGroupWindow;