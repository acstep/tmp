//Login Window Component Constructor
Ti.include("common_net.js");

function LoginWindow() {
	//load component dependencies
	var self = Ti.UI.createWindow({
		backgroundColor:'#3498db',
		navBarHidden:true,

	});
	
	var backgroundView = Ti.UI.createView({
		width:'100%',
		height:'100%',
		layout:'vertical',
		top: 0,
		left: 0
	});
	
	var forwardView = Ti.UI.createView({
		width:'100%',
		height:'100%',
		visible:false,
		backgroundColor:'#333333',
		opacity:0.5,
		top: 0,
		left: 0
	});
	
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:14, fontWeight:'bold'},
		  style:Titanium.UI.ActivityIndicatorStyle.BIG,
	
	});
	
	forwardView.add(loginIndicator);
	loginIndicator.show();
	
	var emailText= Titanium.UI.createTextField({
		editable: true,
		hintText:'Email',
		width:'80%',
		top:'35%',
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		color:'#888',
		textAlign:'left',
		borderColor:'#bbb',
		borderRadius:2,
		suppressReturn:false
	});
	var passText= Titanium.UI.createTextField({
		editable: true,
		hintText:'Password',
		width:'80%',
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		color:'#888',
		textAlign:'left',
		borderColor:'#bbb',
		borderRadius:2,
		suppressReturn:false,
		passwordMask: true
	});
	
	var loginBotton = Titanium.UI.createButton({
	    title: 'Login',
	    top:'3%',
	    width:'80%',
	    color:'#ffffff',
	    backgroundColor:'#F7AC43',
	    borderRadius:10,
	    font:{fontSize:'22sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},

	});
	
	var createAccountButton = Titanium.UI.createButton({
	    title: 'Sign Up',
	    top:'30%',
	    width:'60%',
	    color:'#ffffff',
	    backgroundColor:'#F7AC43',
	    borderRadius:10,
	    font:{fontSize:'22sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},

	});
	
	function loginCallback(result, id, token){
		if(result == true){
			Ti.API.info('login success.');
			Ti.App.Properties.setString('userid',id);
			Ti.App.Properties.setString('token',token);
			forwardView.visible = false;
			feedWindow = require('feedWindows');
			new feedWindow().open();
		}
		else{
			var alertDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:'Email or Password is not correct. Please try again.'
			});
			forwardView.visible = false;
			alertDlg.show();
			Ti.API.info('login false.');
			
			
		}
	};
	
	loginBotton.addEventListener('click',function(e)
	{
	   var emailtext = emailText.value;
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
	    createAccountWindow = require('createAccountWindows');
		new createAccountWindow().open();
	    
	   
	});	
	
	
	backgroundView.add(emailText);
	backgroundView.add(passText);
	backgroundView.add(loginBotton);
	backgroundView.add(createAccountButton);
	self.add(backgroundView);
	self.add(forwardView);
	

	return self;
}

//make constructor function the public component interface
module.exports = LoginWindow;