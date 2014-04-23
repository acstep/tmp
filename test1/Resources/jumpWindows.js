//Jump and Raduis Component Constructor
Ti.include("common_net.js");
Ti.include("common_util.js");


function jumpWindow() {
	//load component dependencies
	var winobj = {};
	winobj.createNormalWin = createNormalWin;
	var self = winobj.createNormalWin(true);
	var backgroundView = self.backgroundView;
	var forwardView = self.forwardView;
	var titleView = self.titleView;


    
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
		text:L('jumpandpos'),
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
	
	
	doneButton.addEventListener('click',function(e)
	{
		Ti.App.Properties.setInt('distance',Math.round(raduisSlider.value)); 
		if(lockmapSwitch.value == true){
			Ti.API.info('set locklocation: ' + 'true');
			Ti.App.Properties.setString('locklocation','true'); 
			Ti.API.info('set locklatitude: ' + posAnno.latitude);
			Ti.API.info('set locklongitude: ' + posAnno.longitude);
			Ti.App.Properties.setDouble('locklatitude',posAnno.latitude);
			Ti.App.Properties.setDouble('locklongitude',posAnno.longitude);
			Ti.App.Properties.setDouble('latitude',posAnno.latitude);
			Ti.App.Properties.setDouble('longitude',posAnno.longitude);
			Ti.API.info('set latitude: ' + latitude);
			Ti.API.info('set longitude: ' + longitude);
			Ti.App.fireEvent('getnewfeed');
			self.close();  
		}
		else{
			Ti.API.info('set locklocation: ' + 'false');
			Ti.App.Properties.setString('locklocation','false'); 
			getCurrentLocation();
			self.close();  
		}
		
	});	
	
	titleView.add(doneButton);
	
	///////////////////  content  ///////////////////////////
	var topLabelView = Titanium.UI.createView({
		left:'5%', top:'20dp',
		height:Titanium.UI.SIZE,width:'90%',
	});
	
	var raduisImg = Titanium.UI.createImageView({
			image:'radius.png',
			backgroundColor:'transparent',left:'0dp',
			height: '30dp', width: '30dp'
	});
	
	var raduisText = Ti.UI.createLabel({
			font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
			text: L('raduisdes'),
			color:'#333333',
			left:'50dp',right:'10dp',
	  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
		});
    topLabelView.add(raduisImg);
    topLabelView.add(raduisText);
    
    //////////////////// slider ///////////////////////////////
    var sliderView = Titanium.UI.createView({
		left:'5%', top:'20dp',
		height:Titanium.UI.SIZE,width:'90%',layout:'vertical'
	});
	
    var raduisSlider = Titanium.UI.createSlider({
		min:0,
		max:10,
		value:5,
		width:'90%',
		height:'auto',left:'5%'
	});
	
	raduisSlider.value = Ti.App.Properties.getInt('distance',5);
	
	
	raduisSlider.addEventListener('change',function(e)
	{
		var distance = raduisItems[Math.round(e.value)];
		var unit = '';
		if(distance >= 1000){
			unit = L('km');
		}
		else{
			unit = L('m');
		}
		if(distance >=1000){
			distance = distance / 1000;
		}
		raduisText.text = distance + unit;
		
	});
    
    var raduisText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: '',
		color:'#333333',
		left:'50dp',right:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
    
    sliderView.add(raduisSlider);
    sliderView.add(raduisText);
    
    //////////////////////  jump map  //////////////////////////////
    var setMapView = Titanium.UI.createView({
		left:'5%', top:'50dp',
		height:Titanium.UI.SIZE,width:'90%',
	});
	
	var setmapImg = Titanium.UI.createImageView({
			image:'sortpos.png',
			backgroundColor:'transparent',left:'0dp',
			height: '30dp', width: '30dp'
	});
	
	var setmapText = Ti.UI.createLabel({
		font:{fontSize:'16sp',fontFamily:'Helvetica Neue'},
		text: L('setmap'),
		color:'#333333',
		left:'50dp',right:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
    
    var hintText = Ti.UI.createLabel({
		font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
		text: L('dragmarker'),
		color:'#333333',
		left:'20%',right:'10dp',top:'10dp',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
    
    var lockmapSwitch = Ti.UI.createSwitch({
	    style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
	    textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT,
	    font:{fontSize:'12sp',fontFamily:'Helvetica Neue'},
	    title:L('lockmap'),
	    value:false,
	    color:'#ff0000',
	    top:'30dp', left:'5%',
	    width: '90%' // necessary for textAlign to be effective
	});
	
	if(Ti.App.Properties.getString('locklocation','false') == 'true'){
		lockmapSwitch.value = true;
	}
	
	lockmapSwitch.addEventListener('change',function(e){
	    Ti.API.info('lock map checked' );
	});
    setMapView.add(setmapImg);
    setMapView.add(setmapText);
   
    ////////////////////  map  /////////////////////////////
    var Map = require('ti.map');
    var latitude = getLat();
	var longitude = getLon();
	var bottomMapView = Titanium.UI.createView({
		left:'5%',
	    top:'20dp',
	    width:'90%',
	    height:'auto'
	});
	
	var posAnno = Map.createAnnotation({
	    latitude:latitude,
	    longitude:longitude,
	    title:L('draganno'),
	    pincolor:Map.ANNOTATION_RED,
	    draggable:true,
	    showInfoWindow:true,
	    myid:1 
	});
	
    var mapview = Map.createView({
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:latitude, longitude:longitude, latitudeDelta:0.005, longitudeDelta:0.005},
	    annotations:[posAnno],
	    userLocation:true,
	    bottom:'20dp'
	});
    bottomMapView.add(mapview);
    
    backgroundView.add(topLabelView);
    backgroundView.add(sliderView);
    backgroundView.add(setMapView);
    backgroundView.add(hintText);
    backgroundView.add(lockmapSwitch);
    backgroundView.add(bottomMapView);
	return self;
}

//make constructor function the public component interface
module.exports = jumpWindow;