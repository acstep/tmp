Ti.include("common_net.js");
Ti.include("common_util.js");


function joinWindow(data,stringData,type) {
	//load component dependencies
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.forwardView = forwardView;
  
    
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
		text:L(stringData.title),
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
	    backgroundColor:'#f1c40f',
	    borderRadius:10,
	});
	
	function sendJoinCB(result, data){
		forwardView.visible = false;
		if(result == false){
			
			showAlert('Error !', data);
			Ti.API.info('Post Comment false.');
			return;
		}
		else{
			if(type == 'join'){
				Ti.App.fireEvent('joinevent');
			}
	        if(type == 'lineup'){
				Ti.App.fireEvent('lineupevent');
			}
			self.close();
		}
	}
	
	doneButton.addEventListener('click',function(e)
	{
		var tmpdata = {
	    	'name': Ti.App.Properties.getString('username',''),
	    	'content':desTextArea.value,
	    	'eventid':data['eventid']
    	};
                      
    	var datastring = JSON.stringify(tmpdata);
    	forwardView.visible = true;
    	joinevt(datastring, sendJoinCB);

	});	
	
	titleView.add(doneButton);
	
	var desTextArea = Ti.UI.createTextArea({
	    font: {fontSize:'16sp'},
	    color:'#333333',
	    textAlign: 'left',
	    hintText:L('leavemsg'),
	    top: '30dp',
	    width: '90%', 
	    height : '150dp',
	    left: '5%',
        backgroundColor:'#ffffff',
	    borderColor:'#666666',
	    borderWidth:'1dp'
	});

	backgroundView.add(desTextArea);
	

	return self;
}

//make constructor function the public component interface
module.exports = joinWindow;