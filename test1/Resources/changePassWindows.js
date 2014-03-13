//changePassWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function changePassWindow() {
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
		text:L('changepass'),
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
	
	function updateCallback(result, data){
		if(result == true){
			forwardView.visible = false;
			Ti.App.Properties.setString('token',data);
			self.close();

		}
		else{
			forwardView.visible = false;
			showAlert('Error !', resultmsg);
			Ti.API.info('update password false.');
		}	
    }
	
	
	function updatePass(){
		oldpasstext = oldpassTextField.value;
		newpasstext  = newpassTextField.value;
		vnewpasstext  = vnewpassTextField.value;
        if(oldpasstext == '' || newpasstext == '' || vnewpasstext == '' ){
        	showAlert('Error !', L('passempty'));
            return;
        }
        
        if(newpasstext != vnewpasstext){
        	var error = Titanium.UI.createAlertDialog({title:'Camera'});
            showAlert('Error !', L('passverifyerror'));
            error.show();
            return;
        }
		
         
		var data = {
			'oldpasswd': oldpasstext,
			'newpasswd': newpasstext
		};
		forwardView.visible = true;
		datastring = JSON.stringify(data);
		updateaccount(datastring, updateCallback);
	}
	
	
	doneButton.addEventListener('click',function(e)
	{
		updatePass();
	});	
	
	titleView.add(doneButton);
	
    ///////////////    old pass  ////////////////////////////
	var oldpassView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var oldpassText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('orgpass'),
		color:'#000000',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '20dp'
	});
	
	
	var oldpassTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('inputorgpass'),
	    passwordMask: true,
	});

	oldpassView.add(oldpassText);
	oldpassView.add(oldpassTextField);
    backgroundView.add(oldpassView);
    
    ///////////////    new pass  ////////////////////////////
	var newpassView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var newpassText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('newpass'),
		color:'#000000',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '20dp'
	});
	
	
	var newpassTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('inputnewpass'),
	    passwordMask: true,
	});

	newpassView.add(newpassText);
	newpassView.add(newpassTextField);
    backgroundView.add(newpassView);
    
    ///////////////    new pass  ////////////////////////////
	var vnewpassView = Titanium.UI.createView({
		height:Titanium.UI.SIZE,width:'100%',layout: 'vertical'
	});
	
	var vnewpassText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('newpassagain'),
		color:'#000000',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  		left:'5%',top: '20dp'
	});
	
	
	var vnewpassTextField = Ti.UI.createTextField({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    top: '10dp',
	    width: '90%', 
	    height : Titanium.UI.SIZE,
	    left: '5%',
	    hintText:L('inputnewpassagain'),
	    passwordMask: true,
	});

	vnewpassView.add(vnewpassText);
	vnewpassView.add(vnewpassTextField);
    backgroundView.add(vnewpassView);
    
	return self;
}

//make constructor function the public component interface
module.exports = changePassWindow;