// network function library

var timeoutms = 5000;
//  we will load new feed if distance is more than 500m
var feedDistance = 20;  

// we will load new feed if distance is more than 30 min
var feedTimeDiff = 30*60;
 


function login(email, pass, callbackf){
	
	url = 'http://54.254.208.12/api/login?' + 'email=' + email + '&pass=' + Titanium.Utils.md5HexDigest(pass);
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		Ti.API.info('id : ' + result.id);
    		Ti.API.info('token : ' + result.token);
    		callbackf(true,result.id,result.token,result.result);
    	}
    	else{
    		callbackf(false,'','',result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function createAccount(data, callbackf){
	
	url = 'http://54.254.208.12/api/createaccount?' + 'data=' + data ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		Ti.API.info('id : ' + result.id);
    		Ti.API.info('token : ' + result.token);
    		callbackf(true,result.id,result.token,result.result);
    	}
    	else{
    		callbackf(false,'','',result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function updateaccount(data, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = 'http://54.254.208.12/api/updateaccount?'+ 'id=' + id + '&token=' + token + '&data=' + data ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		Ti.API.info('id : ' + result.id);
    		Ti.API.info('token : ' + result.token);
    		callbackf(true,result.result);
    	}
    	else{
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function updatepos(data){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = 'http://54.254.208.12/api/updatepos?'+ 'id=' + id + '&token=' + token + '&data=' + data ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    };
    xhr.onerror = function(e){
    	
    };
    xhr.open("GET",url);
    xhr.send(); 
};


function createvent(data, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = 'http://54.254.208.12/api/createvent?' + 'id=' + id + '&token=' + token + '&data=' + data;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function queryeventbyid(eventid,callbackf){
	
	url = 'http://54.254.208.12/api/queryeventbyid?' + 'eventid=' + eventid ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
}


function queryevent(geo, distance, category, limitcount, nexttime, callbackf){

    
    data = {
    	'geo':geo,
    	'distance':distance,
    	'category':category,
    	'limit':limitcount,
    	'nextstarttime':nexttime,
    	
    };
    
    datastring = JSON.stringify(data);
	url = 'http://54.254.208.12/api/queryeventtime?' + 'data=' + datastring;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querymyevent(limitcount, nexttime, callbackf){

    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    data = {
    	'limit':limitcount,
    	'nextstarttime':nexttime,
    };
    
    datastring = JSON.stringify(data);
	url = 'http://54.254.208.12/api/querymyevent?' + 'id=' + id + '&token=' + token + '&data=' + datastring;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 

};



function likeevent(eventid, sourceobj, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = 'http://54.254.208.12/api/likeevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result,sourceobj);
    	}
    	else{
    		if(result.result = 'like duplicate'){
    			
    		}
    		callbackf(false,result.result,sourceobj);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function commentevt(eventid, data, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = 'http://54.254.208.12/api/commentevent?' + 'id=' + id + '&token=' + token + '&data=' + data ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function querycomment(eventid, starttime, callbackf){

    if(starttime == 0){
    	url = 'http://54.254.208.12/api/queryeventcomment?' + 'eventid=' + eventid ;
    }
    else{
    	url = 'http://54.254.208.12/api/queryeventcomment?' + 'eventid=' + eventid + '&starttime=' + starttime;
    }
	
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querynotify( starttime, limitcount, callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');

    url = 'http://54.254.208.12/api/querynotify?' + 'id=' + id + '&token=' + token + '&starttime=' + starttime + '&limitcount=' + limitcount ;

	
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function createchatroom( id, toid, check, callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    
    url = 'http://54.254.208.12/api/createchatroom?' + 'id=' + id + '&token=' + token+'&toid=' +toid +'&check=' +check;

	
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};



function querychatroom( starttime, limitcount,onlytime ,callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    lasttimeString = '';
    if(onlytime == true){
    	lasttimeString = '&onlyupdate=0';
    }
    url = 'http://54.254.208.12/api/querychatroom?' + 'id=' + id + '&token=' + token + '&starttime=' + starttime + '&limitcount=' + limitcount +lasttimeString;

	
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function sendmsg( roomid, msgdata ,callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    
    url = 'http://54.254.208.12/api/sendmsg?' + 'id=' + id + '&token=' + token + '&roomid=' + roomid+ '&msgdata=' + msgdata ;

	
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querymsg( roomid, starttime, limitcount ,callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    
    url = 'http://54.254.208.12/api/querymsg?' + 'id=' + id + '&token=' + token + '&roomid=' + roomid+ '&starttime=' + starttime + '&limitcount=' + limitcount ;

	
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

