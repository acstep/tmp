//notifyWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");



function notifyWindow() {
	//load component dependencies
	var self = Ti.UI.createWindow({
		backgroundColor:'#dddddd',
		navBarHidden:true,
        layout: 'vertical'
 	});
 	

 	var backgroundView = Ti.UI.createView({
		width:'100%',
		layout:'vertical',
		top: 0,
		left: 0,
		backgroundColor:'#dddddd',
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
	
	////  title  //////
	
	var titleView = Ti.UI.createView({
		backgroundColor:'#3498db',
		width:'100%',
		height:'50dp',
		top:'0dp'

	});
	
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		self.close();
	});	
	
    function parseNotify(result, notifydData){
    	forwardView.visible = false;
		var alertCreateAccountDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:JSON.stringify(notifydData)
			});
			alertCreateAccountDlg.show();
	}	
	

	    

	function requestNotify(){
		forwardView.visible = true;
		currentdate = new Date(); 
		starttime = parseInt(currentdate.getTime()/1000);
		querynotify( starttime, 10, parseNotify);
		
	}
	
	backgroundView.add(titleView);
	
	self.add(backgroundView);
	self.add(forwardView);
	
	requestNotify();
	
	return self;
}

//make constructor function the public component interface
module.exports = notifyWindow;