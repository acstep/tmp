//feed content Window Component Constructor

Ti.include("baseContentView.js");


function feedContentWindow(eventid, fullcontent) {
	//load component dependencies
	
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
    tracker.trackScreen('feedContentWindow' );

	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		self.close();
	});	
	
	
	
	var categoryText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		text: '',
		color:'#ffffff'
	});
	titleView.add(categoryText);
	titleView.add(backImg);

	var doneButton = Titanium.UI.createButton({
	    title: L('delete'),
	    top: '10dp',
	    bottom:'10dp',
	    height: '30dp',
	    right:'10dp',
	    color:'#ffffff',
	    backgroundColor:'#ff0000',
	    borderRadius:3,
	    visible:false
	});
	
	function deleteCB(result, data){
		if(result == false){
			Ti.API.info('Delete event false.');
			return;
		}
		else{
			Ti.App.fireEvent('getnewfeed');
			self.close();
		}
	}
	
	doneButton.addEventListener('click',function(e)
	{
	    deleteevent(eventid, deleteCB);
	});	
	
	titleView.add(doneButton);
	
	
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
    	
	var contentDataDes = {
		'1000': {'layouttype':'base'},
		'1001': {'layouttype':'template1'},
		'1002': {'layouttype':'base'},
		'1003': {'layouttype':'base'},
		'1004': {'layouttype':'base'},
		'1005': {'layouttype':'base'},
		'1006': {'layouttype':'template2'},
		'1007': {'layouttype':'base'},
	};
    
    var drawFunction = {	   
		    'base':drawBaseContnet ,
		    'template1':drawtemplate1Contnet ,
		    'template2':drawtemplate2Contnet
	};
    
    
    var titleString = {
    	'1000':'news',
    	'1001':'club',
    	'1002':'needhelp',
    	'1003':'sale',
    	'1004':'used',
    	'1005':'teambuying',
    	'1006':'dating',
    	'1007':'gossip',
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
			
			showAlert('Error !', data);
			Ti.API.info('Post Comment false.');
			self.close();
			return;
		}
		else{
			Ti.API.info('drawFeedContentFunction.');
			var myid =  Ti.App.Properties.getString('userid','');
			
			if(data['ownerid'] == myid || data['gownerid'] == myid){
				doneButton.visible = true;
			}
			categoryText.text = L(titleString[data['category'].toString()]);
			drawFunction[contentDataDes[data['category'].toString()]['layouttype']](contentView,data);
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
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
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
			
			showAlert('Error !', data);
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
		        borderRadius:5,backgroundImage:'headphoto.png',
				height: '50dp', width: '50dp', top:'15dp', left:'10dp'
			});

			
			headPhotoImg.image = getHeadImg(data[i]['ownerid']);
	
			tmpContentView.add(headPhotoImg);
			
				
	        var nameText = Ti.UI.createLabel({
				font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
				text: data[i]['name'],
				color:'#3498db',
				top:'12dp',left:'70dp',right:'10dp',
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
			nameText.ownerid = data[i]['ownerid'];
			Ti.API.info('nameText.ownerid : ' + nameText.ownerid);
			nameText.addEventListener('click',function(e) {
				//  enter talk window
				var myid = Ti.App.Properties.getString('userid','');
				Ti.API.info('e.source.ownerid : ' + e.source.ownerid);
				Ti.API.info('myid : ' + myid);
				if(myid == e.source.ownerid){
					return;
				}
			    Ti.API.info('postView click.');
		        var TalkWindow = require('talkWindows');
		        var tmpRoomData = {
		            'roomid':'',
		            'memberid':[],
		            'lasttime':parseInt(new Date().getTime()/1000),
		            'host':'',
		            'lastmsg':'',
		            'memdata':[]  
		        };
		        new TalkWindow(Ti.App.Properties.getString('userid',''), e.source.ownerid,tmpRoomData).open(); 
			});
			
			
	
			var eventtime = new Date(data[i]['time']);
			var currenttime =  new Date().getTime()/1000;
			var difftime = currenttime - eventtime;
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
				font:{fontSize:'10sp',fontFamily:'Helvetica Neue'},
				text: timeString,
				color:'#aaaaaa',
				top:'35dp',left:'70dp',right:'10dp',
		  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
		
			var desText = Ti.UI.createLabel({
				font:{fontSize:'15sp',fontFamily:'Helvetica Neue'},
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
	    font: {fontSize:20,fontFamily:'Helvetica Neue', fontWeight:'bold'},
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
	    right:'0dp',backgroundColor:'#3498db',borderRadius:3
	});

	function sendCommentCB(result, data){
		forwardView.visible = false;
		if(result == false){

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
	    var data = {
	    	'headphoto':headimage,
	    	'name': Ti.App.Properties.getString('username',''),
	    	'content':commentTextArea.value,
	    	'eventid':eventid
    	};
                      
    	var datastring = JSON.stringify(data);
    	forwardView.visible = true;
    	commentevt(eventid, datastring, sendCommentCB);
	});
	
	
			

	inputView.add(commentTextArea);
	inputView.add(sendCommentButton);
	
	forwardView.visible = true;

	
	
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