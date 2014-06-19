//Login Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");
function LoginWindow() {
	//load component dependencies
	
	var self = createNormalWin(false);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
	self.backgroundColor = '#4aa3df';
	backgroundView.backgroundColor = '#4aa3df';
	backgroundView.height='80%';
	
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad'){
	
	}
	else{
		var GA = require('analytics.google');
		var tracker = GA.getTracker("UA-50815409-1");
		tracker.trackScreen('LoginWindow' );
	}
	
	
	var titleText = Ti.UI.createLabel({
		font:{fontSize:'50sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: 'NexBBS',
		color:'#ffffff', top:'15%',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	var smalltitleText = Ti.UI.createLabel({
		font:{fontSize:'14sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: 'Next Generation Bulletin Board System',
		color:'#ffffff', top:'3dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	var emailText= Titanium.UI.createTextField({
		editable: true,
		hintText:'Email',
		width:'80%',
		top:'50dp',
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		color:'#333333',
		textAlign:'left',
		borderColor:'#bbb',
		borderRadius:2,
		suppressReturn:false,
		backgroundColor:'#ffffff',

	});
	var passText= Titanium.UI.createTextField({
		editable: true,
		hintText:'Password',
		width:'80%',
		top:'10dp',
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		color:'#333333',
		textAlign:'left',
		borderColor:'#bbb',
		borderRadius:2,
		suppressReturn:false,
		passwordMask: true,
		backgroundColor:'#ffffff',
        top:'1dp'
	});
	
	var loginBotton = Titanium.UI.createButton({
	    title: L('login'),
	    top:'3%',
	    width:'80%',
	    color:'#ffffff',
	    backgroundColor:'#F7AC43',
	    borderRadius:3,
	    font:{fontSize:'22sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},

	});
	
	var forgetPassText = Ti.UI.createLabel({
		font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: L('frogetPass'),
		color:'#ffffff', top:'20dp',right:'10%',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
	});
	
	forgetPassText.addEventListener('click',function(e){
		if(emailText.value.length == 0){
			showAlert('', 'emailpassempty');
		}
		else{
			forgetpwd(emailText.value);
		}
		
	
	});
	
	var createAccountButton = Titanium.UI.createButton({
	    title: L('signup'),
	    bottom:'20dp',
	    width:'60%',
	    color:'#ffffff',
	    backgroundColor:'#F7AC43',
	    borderRadius:3,
	    font:{fontSize:'22sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},

	});
	
	function loginCallback(result, data){
		if(result == true){
			Ti.API.info('login success.');
			
            try{
            	Ti.App.Properties.setString('userid',data['id']);
				Ti.App.Properties.setString('token',data['token']);
				Ti.App.Properties.setString('headfile',data['photo']);
	            Ti.App.Properties.setString('useremail',data['email']);
	            Ti.App.Properties.setString('username',data['name']);
	            Ti.App.Properties.setString('userdata',JSON.stringify(data));
	            Ti.App.Properties.setString('school',data['school']);
	            Ti.App.Properties.setString('intro',data['des']);
	            Ti.App.Properties.setString('work',data['job']);
	            Ti.App.Properties.setInt('birthday',data['birthday']);
				Ti.App.Properties.setInt('gender',data['sex']);
				Ti.App.Properties.setList('photos',data['photos']);
			}
			catch(err){
				
			}
           
            Ti.API.info('user data : '  + JSON.stringify(data));
			forwardView.visible = false;
			var feedWindow = require('feedWindows');
			new feedWindow().open(); 
		}
		else{
			
			forwardView.visible = false;
			if(data != 'networkerror'){
				showAlert('Error !', 'loginerror');
			}
			
			
			Ti.API.info('login false.');
			
			
		}
	};
	
	loginBotton.addEventListener('click',function(e)
	{
	   var emailtext = emailText.value.toLowerCase().replace(/ /g,'');
	   var passtext = passText.value;
	   Ti.API.info('emailtext :'+ emailtext);
	   Ti.API.info('passtext :'+ passtext);
	   if(emailtext.length == 0 || passtext.length == 0){
	   	   return;
	   }
	   else{
	   	    
			forwardView.visible = true;
	   	    login(emailtext, passtext, loginCallback);
	   }	   
	});	
	
	createAccountButton.addEventListener('click',function(e)
	{
	    var createAccountWindow = require('createAccountWindows');
		new createAccountWindow().open();
	    
	   
	});	
	
	self.addEventListener('android:back', function(e) {
		var activity = Titanium.Android.currentActivity;
        activity.finish();
	});
	
	backgroundView.add(titleText);
	backgroundView.add(smalltitleText);
	backgroundView.add(emailText);
	backgroundView.add(passText);
	backgroundView.add(loginBotton);
	backgroundView.add(forgetPassText);
	
	self.add(createAccountButton);

	return self;
}

//make constructor function the public component interface
module.exports = LoginWindow;