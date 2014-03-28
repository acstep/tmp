//Create account Window Component Constructor
Ti.include("common_util.js");
function createAccountWindow() {

    var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	var headphotoExist = false;
	
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
	
	////////////// window title  /////////////////
	
	
	var titleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: L('signup'),
		color:'#ffffff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	var backWardImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'5dp', height: '30dp', width: '30dp'
	});
	
	backWardImg.addEventListener('click',function(e)
	{
	   self.close();

	});	
	

	var doneButton = Titanium.UI.createButton({
	    title: L('done'),
	    top: '10dp',
	    bottom:'10dp',
	    height: '30dp',
	    right:'10dp',
	    color:'#ffffff',
	    borderRadius:10,
	    backgroundColor:'#f1c40f'
	});
	
	function createAccountCallback(result, id, token, resultmsg){
		if(result == true){
			Ti.API.info('create account success.');
			Ti.App.Properties.setString('userid',id);
			Ti.App.Properties.setString('token',token);
			Ti.App.Properties.setString('username',nameField.value);
			
			if(headphotoExist == true){
				uploadHeadImage();
			}
			else{
				forwardView.visible = false;
				var feedWindow = require('feedWindows');
				new feedWindow().open();
				self.close();
			}
			
			
			
		}
		else{
			
			forwardView.visible = false;
			
			showAlert('Error !', resultmsg);
			Ti.API.info('create account false.');
			
			
		}
	};
	
	
	doneButton.addEventListener('click',function(e)
	{
		var nametext = nameField.value; 
	    var emailtext = emailField.value;
	    var passwdtext = passwdField.value;
	    var passwdVtext = passwdVField.value;
	    Ti.API.info('nametext :'+ nametext);
	    Ti.API.info('emailtext :'+ emailtext);
	    Ti.API.info('passwdtext :'+ passwdtext);
	    Ti.API.info('passwdVtext :'+ passwdVtext);
	    var headfile = Ti.App.Properties.getString('headfile','');
	    if(passwdtext.length == 0 ||passwdtext != passwdVtext){
	   	    showAlert('Error !', 'Password empty or not the same.');
			
			passwdField.value = '';
			passwdVtext.value = '';
	    }
	    else{
	   	    Ti.App.Properties.setString('useremail',emailtext);
			forwardView.visible = true;
			var data = {
				'name': nametext,
				'email':emailtext,
				'password':passwdtext,
				'headfile':headfile
			};
	    
	    	datastring = JSON.stringify(data);
	   	    createAccount(datastring,createAccountCallback);
	    }	   

	});	
	
	titleView.add(backWardImg);
	titleView.add(titleText);
	titleView.add(doneButton);
	
	var profilellScrollView = Ti.UI.createScrollView({
	    top:'0dp',
	    layout: 'vertical',
	    backgroundColor:'#eeeeee',
	    contentHeight: 'auto',
	});

    
	//////////////  headFieldView  /////////////////
	var headFieldView = Ti.UI.createView({
		width:'100%',
		height:'150dp',
		top:'0dp',
		backgroundColor:'#ffffff',
	});
	
	var headImageView = Ti.UI.createView({
		backgroundColor:'#dddddd',
		width:'100dp',
		height:'100dp',
		top:'25dp',
		left:'10dp',

	});
	
	var headPhotoImg = Titanium.UI.createImageView({
		visible : false,
		height: '100dp', width: '100dp', top:'0dp', left:'0dp'
	});
	
	var doneImg = Titanium.UI.createImageView({
		image:'add.png',
		height: '30dp', width: '30dp', top:'25dp'
	});
	
	var addPhoeoText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text: L('addphoto'),
		color:'#555555',
		top:'65dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	headImageView.add(headPhotoImg);
	headImageView.add(doneImg);
	headImageView.add(addPhoeoText);
	headFieldView.add(headImageView);
	
	
	///////////////  head dialog //////////////////////////
	
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
	                    		ratio = image.width / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
	                    else{
	                    	if(image.height > 1000){
	                    		ratio = image.height / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
						new CropPhotoWindow(newimage,'create').open();
	                    
	                }
	            },
	            cancel:function()
	            {
	                //do somehting if user cancels operation
	            },
	            error:function(error)
	            {
	                //error happend, create alert
	                var a = Titanium.UI.createAlertDialog({title:'Camera'});
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA)
	                {
	                    a.setMessage('Device does not have camera');
	                }
	                else
	                {
	                    a.setMessage('Unexpected error: ' + error.code);
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
	                    		ratio = image.width / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
	                    else{
	                    	if(image.height > 1000){
	                    		ratio = image.height / 1000.0;
	                    		newimage = image.imageAsResized(image.width/ratio,image.height/ratio);
	                    	}
	                    }
						new CropPhotoWindow(newimage,'create').open();
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

    headFieldView.addEventListener('click',function(e)
	{
		dialog.show();
	});
	
	var getheadphoto = function(e) {
		Ti.API.info('receive event headphotodone ');
        var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory,'head.jpg');
        if (f.exists()) {
	        headPhotoImg.image =  f.read();
	        headPhotoImg.visible = true;
	        headphotoExist = true;
	    }
	};
	
	Ti.App.addEventListener('createheadphotodone',getheadphoto);
	
	
	//////////////  profile data  //////////////////////////
	var profileDataView = Ti.UI.createView({
		backgroundColor:'#eeeeee',
		width:'90%',
		top:'0dp',
		left:'5%',
		layout:'vertical'
	});
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('name'),
		color:'#333333',
		top:'10dp',
  		left:'0dp'
	});
	
	var nameField = Titanium.UI.createTextField({
		editable: true,
		width:'100%',
		left:'0dp',
		top:'5dp',
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		color:'#333333',
		textAlign:'left',
		backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:10,
		hintText:L('inputname'),
        
	});
	
	
	
	var emailText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('email'),
		color:'#333333',
		top:'10dp',
  		left:'0dp'
	});
	
	var emailField = Titanium.UI.createTextField({
		editable: true,
		width:'100%',
		left:'0dp',
		top:'5dp',
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		color:'#333333',
		textAlign:'left',
		backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:10,
		hintText:L('inputemail')
	});
    
	var passwdText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('passwd'),
		color:'#333333',
		top:'10dp',
  		left:'0dp'
	});
	
	var passwdField = Titanium.UI.createTextField({
		editable: true,
		width:'100%',
		left:'0dp',
		top:'5dp',
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		color:'#333333',
		textAlign:'left',
		backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:10,
		passwordMask: true,
		hintText:L('inputpass')
	});
	
	var passwdVText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('passwdagain'),
		color:'#333333',
		top:'10dp',
  		left:'0dp'
	});
	
	var passwdVField = Titanium.UI.createTextField({
		editable: true,
		width:'100%',
		left:'0dp',
		top:'5dp',
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue'},
		color:'#333333',
		textAlign:'left',
		backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp',borderRadius:10,
		passwordMask: true,
		hintText:L('inputpassagain')
	});
	

    
	profileDataView.add(nameText);
	profileDataView.add(nameField);
	profileDataView.add(emailText);
	profileDataView.add(emailField);
	profileDataView.add(passwdText);
	profileDataView.add(passwdField);
	profileDataView.add(passwdVText);
	profileDataView.add(passwdVField);
    
 
	passwdVField.addEventListener('click', function f(e){
	    passwdVField.enable = true;
	    passwdVField.focus();
	});

	profilellScrollView.add(headFieldView);
	profilellScrollView.add(profileDataView);

    backgroundView.add(profilellScrollView);
  


    var firstTimeBlur = false;
	self.addEventListener('postlayout',function(e){
		if(firstTimeBlur == false){
			firstTimeBlur = true;
			nameField.blur();
			emailField.blur();
			passwdField.blur();
			passwdVField.blur();
		} 
		
	});
	
	self.addEventListener('android:back', function(e) {
	    Ti.App.removeEventListener('headphotodone',getheadphoto);
	    Ti.API.info('remove listener');
	    self.close();
	});


    ////////////////////////////   upload photo  ///////////////////////
	function uploadHeadImage(){
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory,'head.jpg');

		var data_to_send = { 
            "file": f.read(), 
            "name": 'head.jpg',
            "id": Ti.App.Properties.getString('userid',''),
            'token':Ti.App.Properties.getString('token','')
        };
		xhr = Titanium.Network.createHTTPClient();
        xhr.open("POST",getServerAddr()+"uploadheadimg");
        xhr.send(data_to_send); 
        xhr.onload = function(e) {
            var result =  JSON.parse(this.responseText);
            if(result.result == 'ok'){
            	Ti.App.Properties.setString('headfile',result.filename);

				forwardView.visible = false;
				var feedWindow = require('feedWindows');
				new feedWindow().open();
				self.close();
            	
			}
			forwardView.visible = false;
        };
        xhr.onerror = function(e){

			showAlert('Error !', 'Upload image error. Please reset in setup menu.');
			Ti.API.info('Upload image fail.');
			forwardView.visible = false;
			var feedWindow = require('feedWindows');
			new feedWindow().open();
			self.close();
        	
        };
		xhr.onsendstream = function(e) {
			ind.value = e.progress*100 ;
			
			Ti.API.info('upload - PROGRESS: ' + e.progress);
		};
	}

	return self;
};

//make constructor function the public component interface
module.exports = createAccountWindow;