//Account info Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function accountinfoWindow(selfdata) {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
 
    tracker.trackScreen('accountinfoWindow');
    var headChange = false;
    var photoList = [];
    var needUploadImage = [];
    var currentUploadPhoto = 0;
    
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
		text:L('personalinfo'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'50dp'
	});
	
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
		
		if(nameTextField.value.length == 0){
	    	showAlert('Error !', 'nameempty');
	    	return;
	    }
	    
		for(var i=0; i<accountImageList.length; i++){
			if(accountImageList[i].filename != ''){
				photoList.push(accountImageList[i].filename);
			}
			else{
				needUploadImage.push(accountImageList[i].image);
			}
		}
		if(needUploadImage.length == 0){
			ind.visible = false;
			forwardView.visible = true;
			updateAccount();
		}
		else{
			forwardView.visible = true;
			uploadPhotos();
		}
		
		
	});	
	
	titleView.add(doneButton);
	
	function updateCallback(result, data){
		if(result == true){
			Ti.App.Properties.setString('username',nameTextField.value);
			Ti.App.Properties.setString('school',schoolTextField.value);
			Ti.App.Properties.setString('intro',introTextArea.value);
			Ti.App.Properties.setString('work',workTextField.value);
			Ti.App.Properties.setInt('birthday',parseInt(birthdayDate.getTime()/1000));
			Ti.App.Properties.setList('photos',photoList);
			if(headChange == true){
				uploadHeadImage();
			}
			else{
				forwardView.visible = false;
				self.close();
			}
		}
		else{
			forwardView.visible = false;
			Ti.API.info('update account false.');
		}	
    }
	
	function uploadPhotos(){
		currentUploadPhoto = 0;
		uploadImage();
	}
	
	function updateAccount(){
		var nametext = nameTextField.value;
		var schooltext  = schoolTextField.value;
		var worktext  = workTextField.value;
		var userdestext  = introTextArea.value;
		
		if(nametext == ''){
			showAlert('Error !', 'nameempty.');
			return;
		}

		var data = {
			'name': nametext,
			'job':worktext,
			'school':schooltext,
			'des':userdestext,
			'birthday':parseInt(birthdayDate.getTime()/1000),
			'sex':Ti.App.Properties.getInt('gender',0),
			'photos':photoList
		};
		forwardView.visible = true;
		datastring = JSON.stringify(data);
		updateaccount(datastring, updateCallback);
	}
	
	
	//////  content  /////////////////
	var contentScrollView = Ti.UI.createScrollView({
	    contentHeight: Titanium.UI.SIZE,
	    layout: 'vertical',
	    backgroundColor:'#ffffff',
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
	
	if(selfdata['verified'] == 0){
		var notVerifiedText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
			text: L('notverified'),
			color:'#e74c3c',
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
	  		right:'5%',top: '20dp'
		});
		var resendButton = Titanium.UI.createButton({
		    title: ' '+L('resendv')+' ',
		    top: '70dp',
		    height: '30dp',
		    right:'5%',
		    color:'#ffffff',
		    borderRadius:3,
		    backgroundColor:'#e74c3c'
		});
		
		resendButton.addEventListener('click',function(e){
			resendVEmail(resendVEmailCB);
		});
		
		headView.add(notVerifiedText);
		headView.add(resendButton);
	}
	
	function resendVEmailCB(result, data){
		if(result == true){
			showAlert('','vsent');
		}
		else{
			
		}	
    }
	
	headPhotoImg.image =  getHeadImg(getUserID());  
	headView.add(headPhotoImg);
	headView.add(changeImgText);

	
	///////////////    name  ////////////////////////////
	var nameView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('name'),
		color:'#2980b9',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '10dp'
	});
	
	
	var nameTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('inputname'),
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:3,
	});
	
	var hintname = Ti.App.Properties.getString('username','');
	if(hintname != ''){
		nameTextField.value = hintname;
	}
	
	nameView.add(nameText);
	nameView.add(nameTextField);
	

	
	/////////////// birthday ///////////////////////////
	var birthdayDate = new Date(); 
	var saveBirthdat = Ti.App.Properties.getInt('birthday',0)*1000;
	if(saveBirthdat != 0){
		birthdayDate.setTime(saveBirthdat);
	}
	else{
		birthdayDate.setFullYear(2000,0,1);
	}
	
	var birthdayView = Ti.UI.createView({
		width:'100%',
		height:'50dp',
		top:'10dp',
	});
	
	var birthdayText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('birthday') + ':',
		color:'#2980b9',
		top:'20dp', left:'5%',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var bDateText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: birthdayDate.getFullYear()+'/'+(birthdayDate.getMonth()+1)+'/'+birthdayDate.getDate(),
		color:'#666666',
		top:'20dp', left:'130dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	bDateText.addEventListener('click',function(e){
		showDatePicker(true, birthdayDate);
	
	});
	
	function showDatePicker(start, mtime){
		
		var picker = Ti.UI.createPicker({
		    type:Ti.UI.PICKER_TYPE_DATE,
		    
		    value:birthdayDate
		});
	    picker.showDatePickerDialog({
	    	value:birthdayDate,
		    callback: function(e) {
		        if (e.cancel) {
		            Ti.API.info('User canceled dialog');
		        } 
		        else {
		        	Ti.API.info('set date: ' + e.progress);
                    bDateText.text = e.value.getFullYear()+'/'+(e.value.getMonth()+1)+'/'+e.value.getDate();
                    birthdayDate = new Date(e.value.getFullYear(), e.value.getMonth(), e.value.getDate());
                    Ti.API.info('birthdayDate: ' + birthdayDate.getTime());
		        }
		    }
		});
	}
	
	birthdayView.add(birthdayText);
	birthdayView.add(bDateText);

	
	////////////////   Gender  ///////////////////////
	var genderView = Ti.UI.createView({
		width:'100%',
		height:'50dp',
		top:'10dp',
	});
	
	var genderTitleText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text: L('gender') + ':',
		color:'#2980b9',
		top:'20dp', left:'5%',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var gender = Ti.App.Properties.getInt('gender',0);
	var gnederSTring = L('none');
	if(gender == 1){
		gnederSTring = L('boy');
	}
	if(gender == 2){
		gnederSTring = L('girl');
	}
	var genderText = Ti.UI.createLabel({
		font:{fontSize:'16sp'},
		text:gnederSTring,
		color:'#666666',
		top:'20dp', left:'130dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
	var genderDialog = Titanium.UI.createOptionDialog({
	    title: L('gender'),
	    options: [L('boy'),L('girl')]
	});
	
	genderDialog.addEventListener('click', function(e) {
		if(e.index == 0){
			Ti.App.Properties.setInt('gender',1);
            genderText.text = L('boy');
		}
		else if(e.index == 1){
			Ti.App.Properties.setInt('gender',2);
            genderText.text = L('girl');
		}
		else{
			
		}
	});	
	genderView.addEventListener('click',function(e) {
		genderDialog.show();
	});	
	
	genderView.add(genderTitleText);
	genderView.add(genderText);

	///////////////    school  ////////////////////////////
	var schoolView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var schoolText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('school'),
		color:'#2980b9',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '30dp'
	});
	
	var schoolTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('inputschool'),
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:3,
	});
	
	var hintschool = Ti.App.Properties.getString('school','');
	if(hintschool != ''){
		schoolTextField.value = hintschool;
	}
	
	schoolView.add(schoolText);
	schoolView.add(schoolTextField);

	
	
	///////////////    work  ////////////////////////////
	var workView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var workText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('work'),
		color:'#2980b9',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '30dp'
	});
	
	var workTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('inputwork'),
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:3,
	});
	var hintwork = Ti.App.Properties.getString('work','');
	if(hintwork != ''){
		workTextField.value = hintschool;
	}
	
	workView.add(workText);
	workView.add(workTextField);

	
	///////////////    intro  ////////////////////////////
	var introView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var introText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('intro'),
		color:'#2980b9',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '30dp'
	});
	
	var introTextArea = Ti.UI.createTextArea({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('inputintro'),
	    top: '10dp',
	    height : '200dp', width:'90%',
	    left: '5%',
	    backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',
        maxLength:500
	});
	
	var hintintro = Ti.App.Properties.getString('intro','');
	if(hintintro != ''){
		introTextArea.value = hintintro;
	}
	
	introView.add(introText);
	introView.add(introTextArea);

	
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
	                	showAlert('Camera','Device does not have camera');

	                }
	                else
	                {
	                	showAlert('Camera','Unexpected error: ' + error.code);

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

    headPhotoImg.addEventListener('click',function(e)
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
	
	
	
	
	
	///////////////   photos  ////////////////////////////
	var addPhotosView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical',top: '20dp'
	});
	
	var addPhotosText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('addsomephotos'),
		color:'#e67e22',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '10dp'
	});
	addPhotosView.add(addPhotosText);
	
	var accountImageList = [];
	
	
	var accountimageScrollView = Ti.UI.createScrollView({
	    contentWidth: 'auto',
	    contentHeight:'160dp',
	    layout: 'horizontal',
	    backgroundColor:'#ffffff',
        height:'160dp',
        top:'20dp'
	});
	
	//////   camera  /////////////
	
	
	var accountcameraViewImageView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100dp',
		height:'100dp',
		top:'30dp',
		left:'10dp',
		layout:'vertical',
		borderRadius:5,
		
	});
	
	var accountaddImg = Titanium.UI.createImageView({
		image:'add.png',
		height: '30dp', width: '30dp', top:'20dp'
	});
	
	var accountaddPhotoText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('addphoto'),
		color:'#666666',
		top:'15dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	
	/////////////   select image from camera or gallary ///////////////////
	var accountDeleteImageobj = {};
	var accountDeleteImageDialog = Titanium.UI.createOptionDialog({

	    title: L('deletefile'),
	    options: [L('delete'),L('cancel')],
        cancel:1
	});
	accountDeleteImageDialog.addEventListener('click', function(e) {
		if(e.index == 0){
			position =  accountImageList.indexOf(accountDeleteImageobj);
            Ti.API.info('remove image list pos : ' + position);
			if ( ~position ) accountImageList.splice(position, 1);
			accountimageScrollView.remove(accountDeleteImageobj.imgobj);
		}
	});	
	
	var accountImgdialog = Titanium.UI.createOptionDialog({
    //title of dialog
	    title: L('chooseimage'),
	    //options
	    options: [L('camera'),L('photogallery'), L('cancel')],
	    //index of cancel button
	    cancel:2
	});
	 
	//add event listener
	accountImgdialog.addEventListener('click', function(e) {
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
	                  
	                    var accountAddSelectImg = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:5
						});
						
						
						var imageobj = {'filename': '', 'image':image,'imgobj':accountAddSelectImg};
	                    accountImageList.push(imageobj);
	                    accountAddSelectImg.imageobj = imageobj;
	                    accountAddSelectImg.addEventListener('click',function(e)
						{
							accountDeleteImageobj = this.imageobj; 
							accountDeleteImageDialog.show();
							
						});	
	                    
						accountimageScrollView.contentWidth = ((accountImageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						accountimageScrollView.add(accountAddSelectImg);
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
	                    
	                    var accountAddSelectImg = Titanium.UI.createImageView({
							image:image,
							width:'100dp',
							height:'100dp',
							top:'30dp',
							left:'10dp',
							borderRadius:5
						});
						
						
						var imageobj = {'filename': '', 'image':image,'imgobj':accountAddSelectImg};
	                    accountImageList.push(imageobj);
	                    accountAddSelectImg.imageobj = imageobj;
	                    accountAddSelectImg.addEventListener('click',function(e)
						{
							accountDeleteImageobj = this.imageobj; 
							accountDeleteImageDialog.show();
						});	
	                    
						accountimageScrollView.contentWidth = ((accountImageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);
						accountimageScrollView.add(accountAddSelectImg);
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

    accountcameraViewImageView.addEventListener('click',function(e)
	{
		if(accountImageList.length > 8){
			showAlert('Warning !', 'No more than 8 photos.');
		}
		accountImgdialog.show();
	});	

	accountcameraViewImageView.add(accountaddImg);
	accountcameraViewImageView.add(accountaddPhotoText);
	
	accountimageScrollView.add(accountcameraViewImageView);
	
	var orginalPhotos = Ti.App.Properties.getList('photos',[]);
	
	for(var i=0; i<orginalPhotos.length; i++){
		var accountImage = Titanium.UI.createImageView({
			width:'100dp',
			height:'100dp',
			top:'30dp',
			left:'10dp',
			borderRadius:5,
		    image: (getFeedImgAddr()+'feedimgsm/' + orginalPhotos[i]).replace('.jpg','-m.jpg')
		});
		
		var imageobj = {'filename': orginalPhotos[i], 'image':{},'imgobj':accountImage};
		accountImageList.push(imageobj);
		accountImage.imageobj = imageobj;
		accountImage.addEventListener('click',function(e){
			accountDeleteImageobj = this.imageobj; 
			accountDeleteImageDialog.show();
		});	
		accountimageScrollView.contentWidth = ((accountImageList.length+1)*110 + 20)*(Titanium.Platform.displayCaps.dpi / 160);

		accountimageScrollView.add(accountImage);
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
				updateAccount();
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

		var data_to_send = { 
            "file": f.read(), 
            "name": 'head.jpg',
            "id": Ti.App.Properties.getString('userid',''),
            'token':Ti.App.Properties.getString('token','')
        };
		var xhr = Titanium.Network.createHTTPClient({validatesSecureCertificate: false});
        xhr.open("POST",getServerAddr()+"uploadheadimg");
        xhr.send(data_to_send); 
        xhr.onload = function(e) {
            var result =  JSON.parse(this.responseText);
            if(result.result == 'ok'){
            	Ti.App.Properties.setString('headfile',result.filename);
                Ti.App.Properties.setDouble('expirecache',0);
				Ti.App.fireEvent('changemenuhead');
				forwardView.visible = false;
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
	contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(nameView);
	contentScrollView.add(birthdayView);
	contentScrollView.add(genderView);
	contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(addPhotosView);
	contentScrollView.add(accountimageScrollView);
	contentScrollView.add(createHSepLine('90%','20dp','0dp'));
	contentScrollView.add(schoolView);
	contentScrollView.add(workView);
	contentScrollView.add(introView);

	contentScrollView.add(tmpView);
	backgroundView.add(contentScrollView);
	return self;
}

//make constructor function the public component interface
module.exports = accountinfoWindow;