//notifyWindow Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");



function talkWindow(id, toid,roomdata) {

    
    var messageLock = true; 
    var lastMsgTime = 0;
    var msgItems = []; 
    var recordText = [];
 
	//load component dependencies
	
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
	
	tracker.trackScreen('talkWindow' );
	
	backgroundView.layout = 'composite';
	Ti.API.info('id: '+ id +'toid : ' + toid);
	////  title  //////
	
		
	var backImg = Titanium.UI.createImageView({
		image:'backward.png',
		top: '10dp', left:'15dp', height: '30dp', width: '30dp'
	});
	
	backImg.addEventListener('click',function(e){
		Ti.App.Properties.setString('TalkRoomID','');
		Ti.App.removeEventListener('updattalk', getgcm);
		self.close();
		
	});	
	
	var talkTitleText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
		color:'#ffffff'
		
	});
	
	titleView.add(backImg);
	titleView.add(talkTitleText);
	
	
	///////////////   talk content //////////////////
	var middleView = Ti.UI.createView({
		backgroundColor:'#ff00ff',
		width:'100%',
		top:'50dp',
		bottom:'60dp'

	});
	
	var talkDataItems = [];
	

	var talkTableView = Ti.UI.createTableView({
		
        backgroundSelectedColor:'#dddddd',
        top:'0dp',
	    left:'0dp',bottom:'0dp',
	    layout: 'vertical',
	    backgroundColor:'#dddddd',
        separatorColor:'#dddddd'
    });

	
	middleView.add(talkTableView);
	
	
	/////////////////   input  ////////////////////////
	var bottomView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'100%',
		height:Titanium.UI.SIZE,
		bottom:'0dp',

	});
	
	var inputView = Ti.UI.createView({
		backgroundColor:'#eeeeee',
		height:Titanium.UI.SIZE,
		top:'0dp', left:'0dp',right:'0dp',bottom:'0dp'
	});
	
	var msgTextArea = Ti.UI.createTextArea({
	    color: '#888',
	    font: {fontSize:20,fontFamily:'Helvetica Neue', fontWeight:'bold'},
	    textAlign: 'left',backgroundColor:'#aaaaaa',
	    hintText:L('comment'),
		top: '10dp',
	    width: '70%', left:'2%',height:Titanium.UI.SIZE,borderWidth:'1dp',borderColor:'#999999'
	});
	
	var sendMsgButton = Titanium.UI.createButton({
	    title: L('sendmsg'),
	    top: '10dp',
	    bottom:'10dp',
	    width:'23%',
	    height: '40dp',borderRadius:3,
	    right:'2%',backgroundColor:'#3498db'
	});



    msgTextArea.addEventListener('click',function(e)
	{
		setTimeout(function(){
		    talkTableView.scrollToIndex(talkDataItems.length-1);
		}, 500);
    });
    
	function sendMsgCB(result, data){
		
		if(result == false){

		}
		else{
			
		}
	}
	
	var needSendMsg = '';
	
	sendMsgButton.addEventListener('click',function(e)
	{

		if(msgTextArea.value == '')
			return;
		
		var data = {
	    	'type':'string',
	    	'string': msgTextArea.value,
	    	'roomid':roomdata['roomid'],
	    	'from':id,
	    	'name':Ti.App.Properties.getString('username')
    	};
                      
    	var datastring = JSON.stringify(data);
    		
		if(roomdata['roomid'] == ''){
			needSendMsg = datastring;
			createchatroom(id, toid, 'false', reSendMsg);
		}	
	    else{
	    	var tmpRow = createTextRow(id, msgTextArea.value);
	    	talkDataItems.push(tmpRow);
	    	talkTableView.appendRow(tmpRow);

	    	talkTableView.scrollToIndex(talkDataItems.length-1);
	    	msgTextArea.value = '';
	    	
	    	sendmsg(roomdata['roomid'], datastring, sendMsgCB);
	    }
	
	});
	
	function reSendMsg(result, data){
		
		if(result == true){
			if(data['roomid'] == '0'){
				
			}
			else{
                // we have create a new room. send msg now.
				roomdata = data;
				Ti.App.Properties.setString('TalkRoomID',roomdata['roomid']);
				parseHeadPhoto(data);
				var tmpRow = createTextRow(id, msgTextArea.value);
		    	talkDataItems.push(tmpRow);
		    	talkTableView.appendRow(tmpRow);
		    	talkTableView.scrollToIndex(talkDataItems.length-1);
		    	msgTextArea.value = '';
		    	Ti.API.info('roomdata 2: ' + JSON.stringify({'data':roomdata}));
		    	setTitle(roomdata);
				sendmsg(roomdata['roomid'] , needSendMsg, sendMsgCB);
			}
			
		}
		else{

		}
	}
			

	inputView.add(msgTextArea);
	inputView.add(sendMsgButton);
	bottomView.add(inputView);
	
	backgroundView.add(middleView);
	backgroundView.add(bottomView);

	
	
	var loadmoreRow = Ti.UI.createTableViewRow({
        selectedBackgroundColor:'#3f9ddd',
        backgroundColor:'transparent'
        
    });
    var itemView = Titanium.UI.createView({
		backgroundColor:'transparent',
		width:Ti.UI.SIZE ,height: Ti.UI.SIZE,width: Ti.UI.SIZE,top:'10dp',bottom:'10dp'
	});
	
	var loadmoreText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
			text: L('loading'),
			color:'#888888',
			backgroundColor:'transparent'
		});
		
	var loginIndicator = Ti.UI.createActivityIndicator({
		  font: {fontFamily:'Helvetica Neue', fontSize:18, fontWeight:'bold'},
		  style:Titanium.UI.ActivityIndicatorStyle.DARK,
		  message: L('loading'),visible:false
	});

	itemView.add(loginIndicator);
	itemView.add(loadmoreText);
	
	loadmoreRow.add(itemView);
	
	var needScroolEnd = true;
	loadmoreRow.addEventListener('click',function(e){
		loadmoreText.visible = false;
		needScroolEnd = false;
		loginIndicator.show();
		querymsg( roomdata['roomid'], lastMsgTime, 10 ,parseMsg);
	});	
	
	
	var headimage = {};
	
	function parseHeadPhoto(data){
		for(var i=0 ; i< data['memdata'].length  ; i++){
			headimage[data['memdata'][i]['id']] =  data['memdata'][i]['photo'] ;
		}
	}
	
	function createTextRow(ownerid, textstring){
		
		var msgRow = Ti.UI.createTableViewRow({
	        backgroundSelectedColor:'#eeeeee',
	        
	    });
	    var itemView = Titanium.UI.createView({
			
			height: Ti.UI.SIZE,width:'80%'
		});
	    var msgView = Titanium.UI.createView({
			backgroundColor:'#ffffff',
			height: Ti.UI.SIZE,width: Ti.UI.SIZE,
			borderRadius:5,top:'10dp',bottom:'10dp'
		});
	    var msgText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue',fontWeight:'bold'},
			text: textstring,
			color:'#888888',left:'10dp',top:'10dp',right:'10dp',bottom:'10dp',
			backgroundColor:'#ffffff'
		});
		var triangleImg = Titanium.UI.createImageView({
	        height: '20dp', width: '20dp',top:'20dp'
		});
		

		if(id == ownerid){
			itemView.right = '2%';
			msgView.right = '10dp';
			triangleImg.right = '-5dp';

			triangleImg.image = 'triangleright.png';
		}
		else{
			itemView.left = '2%';
			
			msgView.left = '50dp';
			triangleImg.left = '35dp';
			
			triangleImg.image = 'triangleleft.png';
			
			var headPhotoImg = Titanium.UI.createImageView({
		        borderRadius:5 ,height: '40dp', width: '40dp',top:'10dp',backgroundImage:'headphoto.png'
			});
			

			headPhotoImg.image = getHeadImg(ownerid) ;

			headPhotoImg.left = '0dp';
			itemView.add(headPhotoImg);
		}

		msgView.add(msgText);
		
		itemView.add(msgView);
		itemView.add(triangleImg);
		msgRow.add(itemView);
		return msgRow;
	}
	
	function parseMsg(result, data){
		if(result == true){
			loadmoreText.visible = true;
			loginIndicator.hide();
            try{
            	talkTableView.deleteRow(loadmoreRow);
            }catch(e){};
				
	
			for(var i = 0 ; i <= data.length -1; i++){
				
				var tmpRow = createTextRow(data[i]['owner'], data[i]['data']['string']);
				talkDataItems.unshift(tmpRow);
				talkTableView.insertRowBefore(0,tmpRow);
				lastMsgTime = data[i]['time'];
			}
	
	        talkTableView.insertRowBefore(0,loadmoreRow);
	
			if(needScroolEnd == true){
				talkTableView.scrollToIndex(talkDataItems.length-1);
			}
			else{
				Ti.API.info('scroll to : '+(talkDataItems.length-data.length));
				
			}
		}
		else{
			
			showAlert('Error !', data); 
		}
		messageLock = false;
		
	}
	
	
	
	
	function checkchatroomCB(result, data){
		if(result == true){
			
			if(data['roomid'] == '0'){
				
			}
			else{
				roomdata = data;
				parseHeadPhoto(data);
				var currentdate = new Date(); 
				var starttime = parseInt(currentdate.getTime()/1000);
				Ti.API.info('roomid : ' + roomdata['roomid']);
				Ti.App.Properties.setString('TalkRoomID',roomdata['roomid']);
				Ti.API.info('roomdata1 : ' + JSON.stringify({'data':roomdata}));
				setTitle(roomdata);
				querymsg( roomdata['roomid'], starttime, 10 ,parseMsg);
			}
			
		}
		else{

		}
		forwardView.visible = false;
		
	}
	
	///////////////  receive message  /////////////
	
	var getgcm = function(e) {
		if(e.owner == id || e.roomid != roomdata['roomid'] || messageLock == true)
			return;
	    var tmpRow = createTextRow(e.owner, e.content.string);
    	talkDataItems.push(tmpRow);
    	talkTableView.appendRow(tmpRow);
    	talkTableView.scrollToIndex(talkDataItems.length-1);
	};
	
	
	Ti.App.addEventListener('updattalk', getgcm);

	setTimeout(function(){
	    talkTableView.scrollToIndex(talkDataItems.length-1);
	}, 1000);
	

	
	if(roomdata['roomid'] == ''){
		messageLock = false;
		forwardView.visible = true;
		createchatroom(id, toid, 'true', checkchatroomCB);
	}
	else{
		
		Ti.App.Properties.setString('TalkRoomID',roomdata['roomid']);
		parseHeadPhoto(roomdata);
		Ti.API.info('first');
		
	}
	
	self.addEventListener('android:back', function(e) {
	    Ti.App.Properties.setString('TalkRoomID', '');
	    Ti.App.removeEventListener('updattalk', getgcm);
	    Ti.API.info('remove listener');
	   
	    self.close();
	});
	
	self.addEventListener('open', function(ev) {
        self.activity.addEventListener('resume', function(e) {
        	if(roomdata['roomid'] != ''){
        		Ti.API.info('resume and query msg');
        		var currentdate = new Date(); 
				var starttime = parseInt(currentdate.getTime()/1000);
				talkDataItems = [];
				talkTableView.data = [];
				recordText = [];
				Ti.API.info('roomdata : ' + JSON.stringify({'data':roomdata}));
				setTitle(roomdata);
				querymsg( roomdata['roomid'], starttime, 10 ,parseMsg);
        	}
            
        });
    });
	
	function setTitle(roomdata){
		var myid = Ti.App.Properties.getString('userid','');
		for(var i=0 ; i< roomdata['memdata'].length ; i++){
			if(roomdata['memdata'][i]['id'] != myid){
				talkTitleText.text = roomdata['memdata'][i]['name'];
			}
		}
		
	}
	
	return self;
}

//make constructor function the public component interface
module.exports = talkWindow;