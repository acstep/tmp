//Map Window Component Constructor


function mapWindow() {
	//load component dependencies
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		navBarHidden:true,
		layout: 'vertical',
 	});
 	
 	var titleView = Ti.UI.createView({
		backgroundColor:'#f39c12',
		width:'100%',
		height:'50dp',
		top:'0dp',

	});
 	var selectPosText = Ti.UI.createLabel({
		font:{fontSize:'20sp',fontFamily:'Marker Felt'},
		text: L('dragmarker'),
		color:'#555555',
		top:'10dp',
		left:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	});
	
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
	
	
	doneButton.addEventListener('click',function(e)
	{
		self.close();  
	});	

    titleView.add(selectPosText);
    titleView.add(doneButton);
    self.add(titleView);
    
	self.image = {};
	self.latitude = parseFloat(Ti.App.Properties.getString('latitude'));
	self.longitude = parseFloat(Ti.App.Properties.getString('longitude'));
	
	
	/////   map  /////
	var mapContentView = Ti.UI.createView({
		backgroundColor:'#ffffff',
		width:'100%',
	    top:'0dp',
        height:'auto'       
	});
	
    var Map = require('ti.map');
    
    var posAnno = Map.createAnnotation({
	    latitude:self.latitude,
	    longitude:self.longitude,
	    title:"Drag to position",
	    pincolor:Map.ANNOTATION_RED,
	    draggable:true,
	    myid:1 
	});
    
    
    var mapview = Map.createView({
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:self.latitude, longitude:self.longitude,
	            latitudeDelta:0.01, longitudeDelta:0.01},
	    regionFit:true,
	    userLocation:true,
	    annotations:[posAnno],
	    width:'100%',
	    height:'100%'
	});
	self.map = mapview;
	self.anno = posAnno;
	
	var mapwidth = Titanium.Platform.displayCaps.platformWidth * 0.9;
	var mapheight =  200 * (Titanium.Platform.displayCaps.dpi / 160);
	
	mapview.addEventListener('pinchangedragstate',function(e)
	{
		
	    url = "http://maps.googleapis.com/maps/api/staticmap?center=" +e.annotation.latitude +',' +e.annotation.longitude 
        	    + "&zoom=16&size=" + mapwidth/2 +'x' + mapheight/2 +'&markers=color:red%7C'+ e.annotation.latitude
        	    +',' + e.annotation.longitude +'&sensor=false';
    	Ti.API.info('url : ' + url);
        Ti.App.Properties.setString('userchooselatitude',e.annotation.latitude);
		Ti.App.Properties.setString('userchooselongitude',e.annotation.longitude);
    	self.image.image = url;   
	});	
	
	mapview.addEventListener('click',function(e)
	{
	    url = "http://maps.googleapis.com/maps/api/staticmap?center=" +e.annotation.latitude +',' +e.annotation.longitude 
        	    + "&zoom=16&size=" + mapwidth/2 +'x' + mapheight/2 +'&markers=color:red%7C'+ e.annotation.latitude
        	    +',' + e.annotation.longitude +'&sensor=false';
    	Ti.API.info('url : ' + url);
        //Ti.App.Properties.setString('latitude',e.annotation.latitude);
		//Ti.App.Properties.setString('longitude',e.annotation.longitude);
    	self.image.image = url;   
	});	
	
    mapContentView.add(mapview);
    self.add(mapContentView);
	return self;
}

//make constructor function the public component interface
module.exports = mapWindow;