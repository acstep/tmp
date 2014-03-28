// network function library

var timeoutms = 5000;
//  we will load new feed if distance is more than 500m
var feedDistance = 20;  

// we will load new feed if distance is more than 30 min
var feedTimeDiff = 30*60;
 



function getServerAddr(){
	return Ti.App.Properties.getString('serveraddr','');
}

function getFeedImgAddr(){
	return Ti.App.Properties.getString('feedimgaddr','');
}

function getHeadImgAddr(){
	return Ti.App.Properties.getString('headimgaddr','');
}

function checkTokneError(result){
	if(result == 'auth_error'){
		Ti.App.Properties.setString('userid','');
	    Ti.App.Properties.setString('token','');
	    Ti.App.Properties.setString('useremail','');
		var alertDlg = Titanium.UI.createAlertDialog({
			title:'Error !',
			message:L('tokenerror')
		});
		alertDlg.show();
		alertDlg.addEventListener('click', function(e){
		    var activity = Titanium.Android.currentActivity;
	    	activity.finish();
		});

	    return true;

	}
	else{
		return false;
	}
	
	
}

function getHeadImg(id){
	var cache= new Date().getTime();
	var expirecache = Ti.App.Properties.getDouble('expirecache',0);
	//Ti.API.info('cache : ' + cache + '    expirecache : ' + expirecache);
	if(cache > expirecache+604800000){
		expirecache = cache;
		Ti.App.Properties.setDouble('expirecache',expirecache);
	}
	return getHeadImgAddr()+'headphotos/' + id +'.jpg' + '?' + expirecache;
}

function login(email, pass, callbackf){
	
	url = getServerAddr()+'login';
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
    		
    		callbackf(false,'','',result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("POST",url);
    xhr.send({'email':email,'pass': Titanium.Utils.md5HexDigest(pass)}); 
	
};


function logout(devicetoken){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = getServerAddr()+'logout?'+ 'id=' + id + '&token=' + token +'&devicetoken='+devicetoken;
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



function createAccount(data, callbackf){
	
	url = getServerAddr()+'createaccount?' + 'data=' + data ;
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
	url = getServerAddr()+'updateaccount?'+ 'id=' + id + '&token=' + token  ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		Ti.API.info('id : ' + result.id);
    		Ti.API.info('token : ' + result.token);
    		callbackf(true,result);
    	}
    	else{
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};

function querymyself(callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = getServerAddr()+'queryself?' + 'id=' + id + '&token=' + token ;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querypeople(data, callbackf){

	url = getServerAddr()+'querypeople?' + 'data=' + data ;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
	url = getServerAddr()+'updatepos?'+ 'id=' + id + '&token=' + token ;
	Ti.API.info('url : ' + url);
	xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    };
    xhr.onerror = function(e){
    	
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
};


function createvent(data, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = getServerAddr()+'createvent?' + 'id=' + id + '&token=' + token ;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function deleteevent(eventid, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = getServerAddr()+'removeevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
	
	url = getServerAddr()+'queryeventbyid?' + 'eventid=' + eventid ;
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


function queryevent(geo, distance, category, limitcount,sorttype, nexttime, nextlikecount, callbackf){

    if(sorttype == 'time' || sorttype ==''){
    	data = {
	    	'geo':geo,
	    	'distance':distance,
	    	'category':category,
	    	'limit':limitcount,
	    	'nextstarttime':nexttime,
	    	
	    };
	    datastring = JSON.stringify(data);
		url = getServerAddr()+'queryeventtime?' + 'data=' + datastring;
    }
    else{
	    if(nextlikecount == 'first'){
	    	data = {
		    	'geo':geo,
		    	'distance':distance,
		    	'category':category,
		    	'limit':limitcount,
		    };
	    }
	    else{
	    	data = {
		    	'geo':geo,
		    	'distance':distance,
		    	'category':category,
		    	'limit':limitcount,
		    	'nextlikecount':nextlikecount,
		    };
	    }
	    
	    datastring = JSON.stringify(data);
		url = getServerAddr()+'queryeventlike?' + 'data=' + datastring;
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




function querymyevent(limitcount, nexttime, callbackf){

    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    data = {
    	'limit':limitcount,
    	'nextstarttime':nexttime,
    };
    
    datastring = JSON.stringify(data);
	url = getServerAddr()+'querymyevent?' + 'id=' + id + '&token=' + token + '&data=' + datastring;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
	url = getServerAddr()+'likeevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid;
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
    		if(checkTokneError(result.result)){
    			return;
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
	url = getServerAddr()+'commentevent?' + 'id=' + id + '&token=' + token ;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function joinevt(data, callbackf){
	id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
	url = getServerAddr()+'joinevent?' + 'id=' + id + '&token=' + token + '&data=' + data ;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function queryjoinlist(eventid, starttime, callbackf){

    if(starttime == 0){
    	url = getServerAddr()+'queryjoinlist?' + 'eventid=' + eventid ;
    }
    else{
    	url = getServerAddr()+'queryjoinlist?' + 'eventid=' + eventid + '&starttime=' + starttime;
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


function querypplnear(data, callbackf){

	url = getServerAddr()+'querypeoplenear?' +'&data=' + data ;
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
    	url = getServerAddr()+'queryeventcomment?' + 'eventid=' + eventid ;
    }
    else{
    	url = getServerAddr()+'queryeventcomment?' + 'eventid=' + eventid + '&starttime=' + starttime;
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

    url = getServerAddr()+'querynotify?' + 'id=' + id + '&token=' + token + '&starttime=' + starttime + '&limitcount=' + limitcount ;

	
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
    
    url = getServerAddr()+'createchatroom?' + 'id=' + id + '&token=' + token+'&toid=' +toid +'&check=' +check;

	
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function quitchatroom( roomid, callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    
    url = getServerAddr()+'quitchatroom?' + 'id=' + id + '&token=' + token+'&chatroomid=' +roomid;

	
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
    url = getServerAddr()+'querychatroom?' + 'id=' + id + '&token=' + token + '&starttime=' + starttime + '&limitcount=' + limitcount +lasttimeString;

	
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
    		if(checkTokneError(result.result)){
    			return;
    		}
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
    
    url = getServerAddr()+'sendmsg?' + 'id=' + id + '&token=' + token + '&roomid=' + roomid;

	
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("POST",url);
    xhr.send({'msgdata':msgdata}); 
	
};


function querymsg( roomid, starttime, limitcount ,callbackf){
    id = Ti.App.Properties.getString('userid','');
    token = Ti.App.Properties.getString('token','');
    
    url = getServerAddr()+'querymsg?' + 'id=' + id + '&token=' + token + '&roomid=' + roomid+ '&starttime=' + starttime + '&limitcount=' + limitcount ;

	
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
    		if(checkTokneError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	callbackf(false,'network error');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

