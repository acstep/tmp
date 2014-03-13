//Account info Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function accountinfoWindow() {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
 
    var headChange = false;
    
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
	    borderRadius:10,
	    backgroundColor:'#f1c40f'
	});
	
	
	doneButton.addEventListener('click',function(e)
	{
		updateAccount();
		
	});	
	
	titleView.add(doneButton);
	
	function updateCallback(result, resultmsg){
		if(result == true){
			Ti.App.Properties.setString('username',nameTextField.value);
			Ti.App.Properties.setString('school',schoolTextField.value);
			Ti.App.Properties.setString('intro',introTextArea.value);
			Ti.App.Properties.setString('work',workTextField.value);
			Ti.App.Properties.setInt('birthday',parseInt(birthdayDate.getTime()/1000));
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
			showAlert('Error !', resultmsg);
			Ti.API.info('update account false.');
		}	
    }
	
	
	function updateAccount(){
		nametext = nameTextField.value;
		schooltext  = schoolTextField.value;
		worktext  = workTextField.value;
		userdestext  = introTextArea.value;
		
		if(nametext == ''){
			showAlert('Error !', 'Name empty.');
			return;
		}

		var data = {
			'name': nametext,
			'job':worktext,
			'school':schooltext,
			'des':userdestext,
			'birthday':parseInt(birthdayDate.getTime()/1000)
		};
		forwardView.visible = true;
		datastring = JSON.stringify(data);
		updateaccount(datastring, updateCallback);
	}
	
	
	//////  content  /////////////////
	var contentScrollView = Ti.UI.createScrollView({
	    contentHeight: Titanium.UI.SIZE,
	    layout: 'vertical',
	    backgroundColor:'#eeeeee',
        width:'100%'
	});
	
	///////////////////  head image  ///////////////////////////
	var headView = Titanium.UI.createView({
		left:'0dp', 
		height:'140dp',width:'100%',
	});
	
	var headPhotoImg = Titanium.UI.createImageView({
        borderRadius:15,backgroundImage:'headphoto.png',
		height: '100dp', width: '100dp', top:'20dp', left:'20dp'
	});
	
	var changeImgText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text: L('changehead'),
		color:'#ffffff',
		backgroundColor:'#000000',borderRadius:15,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		bottom:'20dp',width:'100dp', left:'20dp',height:Titanium.UI.SIZE
	});
	
	headPhotoImg.image =  getHeadImg(getUserID());  
	headView.add(headPhotoImg);
	headView.add(changeImgText);
	contentScrollView.add(headView);
	
	///////////////    name  ////////////////////////////
	var nameView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var nameText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('name'),
		color:'#000000',
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
	    borderWidth:'1dp',borderRadius:10,
	});
	
	hintname = Ti.App.Properties.getString('username','');
	if(hintname != ''){
		nameTextField.value = hintname;
	}
	
	nameView.add(nameText);
	nameView.add(nameTextField);
	
	contentScrollView.add(nameView);
	
	/////////////// birthday ///////////////////////////
	birthdayDate = new Date(); 
	saveBirthdat = Ti.App.Properties.getInt('birthday',0)*1000;
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
		color:'#333333',
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
	contentScrollView.add(birthdayView);
	
	///////////////    school  ////////////////////////////
	var schoolView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var schoolText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('school'),
		color:'#000000',
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
	    borderWidth:'1dp',borderRadius:10,
	});
	
	hintschool = Ti.App.Properties.getString('school','');
	if(hintschool != ''){
		schoolTextField.value = hintschool;
	}
	
	schoolView.add(schoolText);
	schoolView.add(schoolTextField);
	contentScrollView.add(schoolView);
	
	
	///////////////    work  ////////////////////////////
	var workView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var workText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('work'),
		color:'#000000',
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
	    borderWidth:'1dp',borderRadius:10,
	});
	hintwork = Ti.App.Properties.getString('work','');
	if(hintwork != ''){
		workTextField.value = hintschool;
	}
	
	workView.add(workText);
	workView.add(workTextField);
	contentScrollView.add(workView);
	
	///////////////    intro  ////////////////////////////
	var introView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var introText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('intro'),
		color:'#000000',
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
	
	hintintro = Ti.App.Properties.getString('intro','');
	if(hintintro != ''){
		introTextArea.value = hintintro;
	}
	
	introView.add(introText);
	introView.add(introTextArea);
	contentScrollView.add(introView);
	
	var tmpView = Titanium.UI.createView({
		height:'30dp',width:'100%',layout: 'vertical'
	});
	
	contentScrollView.add(tmpView);
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
	
	
	backgroundView.add(contentScrollView);
	
	
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
	
	
	return self;
}

//make constructor function the public component interface
module.exports = accountinfoWindow;