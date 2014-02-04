//Map Window Component Constructor
Ti.include("common_util.js");

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
		font:{fontSize:'20sp',fontFamily:'Helvetica Neue'},
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
	    region: {latitude:self.latitude, longitude:self.longitude, latitudeDelta:0.005, longitudeDelta:0.005},
	    userLocation:true,
	    annotations:[posAnno],
	    width:'100%',
	    height:'100%'
	});
	self.map = mapview;
	self.anno = posAnno;
	
	
	mapview.addEventListener('pinchangedragstate',function(e)
	{
		
	    self.orgAnnotation.latitude = e.annotation.latitude;
		self.orgAnnotation.longitude = e.annotation.longitude;
    	self.orgmapview.region = {latitude:e.annotation.latitude, longitude:e.annotation.longitude, latitudeDelta:0.005, longitudeDelta:0.005};
        Ti.App.Properties.setString('userchooselatitude',e.annotation.latitude);
		Ti.App.Properties.setString('userchooselongitude',e.annotation.longitude);
	});	
	
	mapview.addEventListener('longclick',function(e)
	{
		Ti.API.info('longclick : ' + e.latitude + '  ' + e.longitude); 
		posAnno.latitude = e.latitude;
		posAnno.longitude = e.longitude;
	    self.orgAnnotation.latitude = e.latitude;
		self.orgAnnotation.longitude = e.longitude;
    	self.orgmapview.region = {latitude:e.latitude, longitude:e.longitude, latitudeDelta:0.005, longitudeDelta:0.005};
        Ti.App.Properties.setString('userchooselatitude',e.latitude);
		Ti.App.Properties.setString('userchooselongitude',e.longitude);
	});	
	
    mapContentView.add(mapview);
    self.add(mapContentView);
	return self;
}

//make constructor function the public component interface
module.exports = mapWindow;