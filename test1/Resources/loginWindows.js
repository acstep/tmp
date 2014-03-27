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
	
	var emailText= Titanium.UI.createTextField({
		editable: true,
		hintText:'Email',
		width:'80%',
		top:'35%',
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
	    borderRadius:10,
	    font:{fontSize:'22sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},

	});
	
	var createAccountButton = Titanium.UI.createButton({
	    title: L('signup'),
	    bottom:'20dp',
	    width:'60%',
	    color:'#ffffff',
	    backgroundColor:'#F7AC43',
	    borderRadius:10,
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
			feedWindow = require('feedWindows');
			new feedWindow().open(); 
		}
		else{
			
			forwardView.visible = false;
			showAlert('Error !', 'Email or Password is not correct. Please try again.');
			
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
	self.add(createAccountButton);

	return self;
}

//make constructor function the public component interface
module.exports = LoginWindow;