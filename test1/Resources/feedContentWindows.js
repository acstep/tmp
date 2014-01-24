//feed content Window Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");
Ti.include("newsview.js");

function feedContentWindow(eventid, fullcontent) {
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
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'24sp',fontFamily:'Marker Felt',fontWeight:'bold'},
		text: L('news'),
		color:'#ffffff'
	});
	titleView.add(categoryText);
	titleView.add(backImg);
    backgroundView.add(titleView);
	
	
	
	var contentScrollView = Ti.UI.createScrollView({
        left:'0dp',
        top:'0dp',	
        width:'100%',
        backgroundColor:'#ffffff',
        layout: 'vertical',
        contentHeight: 'auto'
     
	});
	
	backgroundView.add(contentScrollView);
    
    
    /////////////  event info ////////////////////////
    var drawFeedContentFunction = {	    
	    	'1000':drawNewsContnet
	};
    
    var contentView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'100%',
		height:Titanium.UI.SIZE,
		top:'0dp',
        layout: 'vertical',
	});
	
	function parseEvent(result, data){
		forwardView.visible = false;
		if(result == false){
			var alertCreateAccountDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:data
			});
			
			alertCreateAccountDlg.show();
			Ti.API.info('Post Comment false.');
			return;
		}
		else{
			Ti.API.info('drawFeedContentFunction.');
			
			drawFeedContentFunction[data['category'].toString()](contentView,data);
			self.add(contentView);
			if(inputParentView.inputView != undefined){
				inputParentView.remove(inputView);
			} 
			querycomment(eventid, 0, parseComment);
			inputParentView.add(inputView);
	
			
		}
	}
   
    contentScrollView.add(contentView);

	///////////////  comment part  ////////////////////

	
	var requestNextView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'100%',
		height:Titanium.UI.SIZE,
		top:'0dp', left:'0dp',height:'60dp'
	});
	var requestNextText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Marker Felt', fontWeight:'bold'},
		text: L('requestnextrow'),
		color:'#bbbbbb'

	});
	requestNextView.add(requestNextText);

	requestNextView.addEventListener('click',function(e)
	{
		if(inputParentView.inputView != undefined){
			inputParentView.remove(inputView);
		} 
		querycomment(eventid, lastCommentTime, parseComment);

	});	
	
	var inputParentView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		height:Titanium.UI.SIZE,
		top:'10dp', left:'10dp',right:'10dp',bottom:'10dp'
	});
	contentScrollView.add(inputParentView);
	
	var commentTableView = Titanium.UI.createView({
	
		left:'10dp',
		right:'10dp',
		layout: 'vertical',
		height:Titanium.UI.SIZE,
	});
	contentScrollView.add(commentTableView);
	
	var totalComment = false;
	var lastCommentTime = 0;
	function parseComment(result, data){
		forwardView.visible = false;
		
		if(result == false){
			var alertCreateAccountDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:data
			});
			
			alertCreateAccountDlg.show();
			Ti.API.info('Query Comment false.');
			return;
		}
		
		
		commentTableView.remove(requestNextView);
	
		
		data = sortByKeyUp(data, 'time');
		for(var i = 0 ; i <= data.length -1; i++) {
			totalComment = true;
		    var tmpContentView = Ti.UI.createView({
				backgroundColor:'#ffffff',
				height:Titanium.UI.SIZE,
				width:'100%',
				top:'0dp', left:'0dp'
			});
			
						
		    var headPhotoImg = Titanium.UI.createImageView({
		        borderRadius:15,
				height: '50dp', width: '50dp', top:'15dp', left:'10dp'
			});

			if(data[i]['headphoto'] == undefined || data[i]['headphoto'] == ''){
				headPhotoImg.image = 'headphoto.png';
			}
			else{
				headPhotoImg.image = 'https://s3-ap-southeast-1.amazonaws.com/headphotos/' + data[i]['headphoto'];
			}
			tmpContentView.add(headPhotoImg);
			
				
	        var nameText = Ti.UI.createLabel({
				font:{fontSize:'14sp',fontFamily:'Marker Felt'},
				text: data[i]['name'],
				color:'#3498db',
				top:'12dp',left:'70dp',right:'10dp',
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
			
			
	
			eventtime = new Date(data[i]['time']);
			currenttime =  new Date().getTime()/1000;
			difftime = currenttime - eventtime;
			var timeString = '';
			if(difftime < 60){
				timeString = parseInt(difftime) + ' ' + L('beforesec');
			}
			else if(difftime >=60 &&  difftime < 3600){
				timeString = parseInt(difftime/60) + ' ' + L('beforemin');
			}
			else if(difftime >=3600 &&  difftime < 86400){
				timeString = parseInt(difftime/3600) + ' ' + L('beforehour');
			}
			else{
				timeString = parseInt(difftime/86400) + ' ' + L('beforeday');
			}
			
			var timeText = Ti.UI.createLabel({
				font:{fontSize:'12sp',fontFamily:'Marker Felt'},
				text: timeString,
				color:'#aaaaaa',
				top:'35dp',left:'70dp',right:'10dp',
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
		
			var desText = Ti.UI.createLabel({
				font:{fontSize:'18sp',fontFamily:'Marker Felt'},
				text: data[i]['content'],
				color:'#333333',
				top:'55dp',left:'70dp',right:'10dp',
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			});
			
			


			lastCommentTime = data[i]['time'];
			
			tmpContentView.add(nameText);
			tmpContentView.add(timeText);
			tmpContentView.add(desText);

			commentTableView.add(tmpContentView);
			
		} 
	
		if(totalComment == true){
			commentTableView.add(requestNextView);
		}
	    inputParentView.add(inputView);
	};
	
	
	
	
	///////////////////   comment input  ///////////////////////////
	var inputView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		height:Titanium.UI.SIZE,
		top:'0dp', left:'0dp',right:'0dp',bottom:'0dp'
	});
	
	var commentTextArea = Ti.UI.createTextArea({
	    color: '#888',
	    font: {fontSize:20, fontWeight:'bold'},
	    textAlign: 'left',
	    hintText:L('comment'),
		top: '10dp',
	    width: '70%', left:'0dp',height:Titanium.UI.SIZE,
	});
	
	var sendCommentButton = Titanium.UI.createButton({
	    title: L('send'),
	    top: '10dp',
	    bottom:'10dp',
	    width:'25%',
	    height: '40dp',
	    right:'0dp'
	});

	function sendCommentCB(result, data){
		forwardView.visible = false;
		if(result == false){
			var alertCreateAccountDlg = Titanium.UI.createAlertDialog({
				title:'Error !',
				message:data
			});
			
			alertCreateAccountDlg.show();
			Ti.API.info('Post Comment false.');
			return;
		}
		else{
			self.close();
		}
	}
	
	sendCommentButton.addEventListener('click',function(e)
	{

		var headimage = Ti.App.Properties.getString('headfile',''); 
		if(commentTextArea.value == '')
			return;
	    data = {
	    	'headphoto':headimage,
	    	'name': Ti.App.Properties.getString('username',''),
	    	'content':commentTextArea.value,
	    	'eventid':eventid
    	};
                      
    	datastring = JSON.stringify(data);
    	forwardView.visible = true;
    	commentevt(eventid, datastring, sendCommentCB);
	});
	
	
			

	inputView.add(commentTextArea);
	inputView.add(sendCommentButton);
	
	forwardView.visible = true;
	self.add(backgroundView);
	self.add(forwardView);
	
	
	////////////   show event content ///////////////
	if(fullcontent == true){
		queryeventbyid(eventid, parseEvent);
	}
	else{
		if(inputParentView.inputView != undefined){
			inputParentView.remove(inputView);
		} 
		querycomment(eventid, 0, parseComment);
	}

	return self;
}

//make constructor function the public component interface
module.exports = feedContentWindow;