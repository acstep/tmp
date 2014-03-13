//Choose head photo Window Component Constructor




function HeadWindow(cropimage,mode) {
	//load component dependencies
	
	var self = createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;
    backgroundView.layout = 'composite';
    
	


	var middleView = Ti.UI.createView({
		width:'100%',
		height:'auto',
		backgroundColor:'#000000',
		top: 50, bottom:80,
		left: 0
	});
	
	var bottonView = Ti.UI.createView({
		width:'100%',
		height:'80dp',
		backgroundColor:'#000000',
		bottom: 0,
		left: 0
	});
	
	var cropText = Ti.UI.createLabel({
		font:{fontSize:'14sp',fontFamily:'Helvetica Neue', fontWeight:'bold'},
		text: L('cropimage'),
		color:'#ffffff',

  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	titleView.add(cropText);
	
	//////////////////   handle crop image /////////////////////////

    width = cropimage.width;
    height = cropimage.height;
   
	
	var headImg = Titanium.UI.createImageView({
		image:cropimage,
		zIndex:0

	});

	
	
	dpratio = (Titanium.Platform.displayCaps.dpi / 160);
	
	var baseWidth = 100, baseHeight = 100;
	var halfWidth = 50, halfHeight = 50;
	var oldX = 0, oldY = 0;
	
	var cropView = Ti.UI.createView({
	    height : 100,
	    width : 100,
	    center:{x:(headImg.rect.width/2)  ,y:(headImg.rect.y+headImg.rect.height)/2},
	    borderColor : '#0000ff',
	    borderWidth : '3dp',
	    backgroundColor : 'transparent',
	    zIndex : 3,
	    touchEnabled : false
	});
	
	
	
	
	var orgin = {};
	var orgindiff = {};
	
	headImg.addEventListener('touchstart', function(e) {
	    
	    baseHeight = cropView.height;
	    baseWidth = cropView.width;
	    orgindiff.x = e.x/dpratio;
	    orgindiff.y = e.y/dpratio;
	    orgin.x = cropView.rect.x;
	    orgin.y = cropView.rect.y;
	});
	 
	headImg.addEventListener('pinch', function(e) {
	    var newWidth = baseWidth * e.scale;


	    //dont allow to scale larger than smallest distance
	    if(headImg.rect.width > headImg.rect.height){
	    	if(newWidth > headImg.rect.height){
		    	newWidth = headImg.rect.height;
		    	cropView.top = headImg.rect.top;
		    }
	    }
	    else{
	    	if(newWidth > headImg.rect.width){
		    	newWidth = headImg.rect.width;
		    	cropView.left = headImg.rect.left;
		    }
	    	
	    }
	  
        cropView.height = newWidth;
        cropView.width = newWidth;

	    
	 
	}); 
	 
	headImg.addEventListener('touchmove', function(e) {
	    
        
	    tmptop =  orgin.y + e.y/dpratio  - orgindiff.y;  
	    tmpleft =  orgin.x + e.x/dpratio  - orgindiff.x;    
	   
    	
    	if(tmptop < headImg.rect.y){
    		cropView.top = headImg.rect.y;
    	}
    	else if(tmptop+cropView.height  > headImg.rect.y+headImg.rect.height){
    		cropView.top = headImg.rect.y+headImg.rect.height-cropView.height;
    	}
    	else{
    		cropView.top = orgin.y + e.y/dpratio   - orgindiff.y;
    	}
    	
    	if(tmpleft < headImg.rect.x){
    		cropView.left = headImg.rect.x;
    	}	
    	else if(tmpleft+cropView.width  > headImg.rect.x+headImg.rect.width){
    		cropView.left = headImg.rect.x+headImg.rect.width-cropView.width;
    	}
    	else{
    		cropView.left = orgin.x + e.x/dpratio - orgindiff.x;
    	}	
    	//ddd.text = 'image: ' + cropView.left +'   ' +cropView.top+'   ' + cropView.width +'   ' +cropView.height+'   ' +cropView.rect.width+'   ' +cropView.rect.height+'   ' +cropView.rect.x+'   ' +cropView.rect.y;
	    
	});
	

	var cropDoneButton = Titanium.UI.createButton({
	    title: L('done'),
	    top:'10%',
	    height:'60dp',
	    width:'90%',
	    color:'#dddddd',
	    font:{fontSize:'18sp',fontFamily:'Helvetica Neue', fontWeight:'bold'}

	});
	
	cropDoneButton.addEventListener('click',function(e)
	{
		forwardView.visible = true; 
	    imageWidth = cropimage.width;
	    imageHeight = cropimage.height;
	    ratioX = imageWidth / headImg.rect.width;
	    ratioY = imageHeight / headImg.rect.height;
	    realX = (cropView.rect.x  - headImg.rect.x)* ratioX;
	    realY = (cropView.rect.y - headImg.rect.y)* ratioY;
	    realWidth = cropView.rect.width * ratioX;
	    realHeight = cropView.rect.height * ratioY;

	    var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory,'head.jpg');
	    
		f.write(cropimage.imageAsCropped({x:realX,y:realY,width:realWidth,height:realHeight}).imageAsResized(200,200));
		if(mode == 'create'){
			Ti.App.fireEvent('createheadphotodone');
		}
		if(mode == 'modify'){
			Ti.App.fireEvent('modifyheadphotodone');
		}
		
        self.close();
	});	
	

	
	
	
	bottonView.add(cropDoneButton);
	
	middleView.add(headImg);
    middleView.add(cropView);
   
	
	backgroundView.add(bottonView);
	backgroundView.add(middleView);
    
	
	
	return self;
}

//make constructor function the public component interface
module.exports = HeadWindow;