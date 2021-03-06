// network function library

var timeoutms = 10000;
//  we will load new feed if distance is more than 500m
var feedDistance = 20;  

// we will load new feed if distance is more than 30 min
var feedTimeDiff = 30*60;
 



function getServerAddr(){
	return Ti.App.Properties.getString('serveraddr','');
}

function getImgServerAddr(){
	return Ti.App.Properties.getString('imgserveraddr','');
}

function getFeedImgAddr(){
	return Ti.App.Properties.getString('feedimgaddr','');
}

function getFeedImgLAddr(){
	return Ti.App.Properties.getString('feedimgladdr','');
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
			message:'tokenerror'
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

function expireCache(){
	var cache= new Date().getTime();
	Ti.App.Properties.setDouble('expirecache',cache);
}

function getHeadImg(id){
	var cache= new Date().getTime();
	var myid = Ti.App.Properties.getString('userid','');
	var expirecache = Ti.App.Properties.getDouble('expirecache',0);
	//Ti.API.info('cache : ' + cache + '    expirecache : ' + expirecache);
	if(cache > expirecache+604800000){
		expirecache = cache;
		Ti.App.Properties.setDouble('expirecache',expirecache);
	}
	if(id == myid){
		expirecache = cache;
	}
	return getHeadImgAddr() + id +'.jpg' + '?' + expirecache;
}

function login(email, pass, callbackf){
	
	var url = getServerAddr()+'login';
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
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
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'email':email,'pass': Titanium.Utils.md5HexDigest(pass)}); 
	
};


function logout(devicetoken){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'logout?'+ 'id=' + id + '&token=' + token +'&devicetoken='+devicetoken;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
};

function forgetpwd(email){

	var url = getServerAddr()+'forgetpwd?'+ 'email=' + email ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	showAlert('','passsend');
    	Ti.API.info('response : ' + this.responseText);
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	//callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
};



function createAccount(data, callbackf){
	
	var url = getServerAddr()+'createaccount';
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
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
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function updateaccount(data, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'updateaccount?'+ 'id=' + id + '&token=' + token  ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
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
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function resendVEmail(callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'resendvemail?' + 'id=' + id + '&token=' + token ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function createGroup(data, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'creategroup?'+ 'id=' + id + '&token=' + token;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		callbackf(true,result.id);
    	}
    	else{
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function deleteGroup(gid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'deletegroup?'+ 'id=' + id + '&token=' + token+ '&gid=' + gid;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		callbackf(true,result);
    	}
    	else{
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function updateGroup(data, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'updategroup?'+ 'id=' + id + '&token=' + token;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		callbackf(true,result.id);
    	}
    	else{
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function likegroup(gid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'likegroup?' + 'id=' + id + '&token=' + token + '&gid=' + gid;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(result.result = 'like duplicate'){
    			
    		}
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function leavegroup(gid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'removelikegroup?' + 'id=' + id + '&token=' + token + '&gid=' + gid;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(result.result = 'like duplicate'){
    			
    		}
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querygroupnear(data, callbackf){

	var url = getServerAddr()+'querygroupnear?' +'&data=' + data ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querygroup(gid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'querygroup?'+ 'id=' + id + '&token=' + token + '&gid=' + gid ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function queryidgroup(data, callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'queryidgroup?'+ 'id=' + id + '&token=' + token +'&data=' + data ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function queryGroupevent(gid,limitcount, nexttime, callbackf){

    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    var data = {
    	'gid':gid,
    	'limit':limitcount,
    	'nextstarttime':nexttime,
    };
    
    var datastring = JSON.stringify(data);
	var url = getServerAddr()+'querygroupevent?' +'&data=' + datastring;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    	
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data,result.nexttime);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result,0);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror',0);
    };
    xhr.open("GET",url);
    xhr.send(); 

};


function queryGroupPpl(datastring, callbackf){

    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    
  
	var url = getServerAddr()+'querygroupppllist?' +'&data=' + datastring;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    	
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data,result.nexttime);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result,0);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror',0);
    };
    xhr.open("GET",url);
    xhr.send(); 

};



function querymyself(callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'queryself?' + 'id=' + id + '&token=' + token ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querypeople(data, callbackf){

	var url = getServerAddr()+'querypeople?' + 'data=' + data ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function updatepos(data){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'updatepos?'+ 'id=' + id + '&token=' + token ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
};


function createvent(data, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'createvent?' + 'id=' + id + '&token=' + token ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});

    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	Ti.API.info('response : ' + 'networkerror');
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
  
    xhr.send({'data':data}); 
	
};


function deleteevent(eventid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'removeevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}

    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function queryeventbyid(eventid,callbackf){
	
	var url = getServerAddr()+'queryeventbyid?' + 'eventid=' + eventid ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
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
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
}


function queryevent(geo, distance, category, limitcount,sorttype, nexttime, nextlikecount, callbackf){
    var url = '';
    var data = {};
    var datastring = '';
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
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data,result.nexttime);
    	}
    	else{
    		callbackf(false,result.result,0);
    	}

    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror',0);
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};




function querymyevent(limitcount, nexttime, callbackf){

    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    var data = {
    	'limit':limitcount,
    	'nextstarttime':nexttime,
    };
    
    var datastring = JSON.stringify(data);
	var url = getServerAddr()+'querymyevent?' + 'id=' + id + '&token=' + token + '&data=' + datastring;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
    	
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data,result.nexttime);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result,0);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror',0);
    };
    xhr.open("GET",url);
    xhr.send(); 

};



function likeevent(eventid, sourceobj, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'likeevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result,sourceobj);
    	}
    	else{
    		if(result.result == 'duplicate'){
    			callbackf(false,result.result,sourceobj);
    			return;
    		}
    		if(checkTokenError(result.result)){
    			callbackf(false,result.result,sourceobj);
    			return;
    		}
    		else{
    			showAlert('Error !', result.result);
    			callbackf(false,result.result,sourceobj);
    		}
    		
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function commentevt(eventid, data, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'commentevent?' + 'id=' + id + '&token=' + token ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'data':data}); 
	
};


function joinevt(data, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'joinevent?' + 'id=' + id + '&token=' + token + '&data=' + data ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function leaveevent(eventid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'leaveevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function queryjoinevent(eventid, callbackf){
	var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
	var url = getServerAddr()+'queryjoinevent?' + 'id=' + id + '&token=' + token + '&eventid=' + eventid ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.join);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function queryjoinlist(eventid, starttime, callbackf){
    var url = '';
    if(starttime == 0){
    	url = getServerAddr()+'queryjoinlist?' + 'eventid=' + eventid ;
    }
    else{
    	url = getServerAddr()+'queryjoinlist?' + 'eventid=' + eventid + '&starttime=' + starttime;
    }
	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
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
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querypplnear(data, callbackf){

	var url = getServerAddr()+'querypeoplenear?' +'&data=' + data ;
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function querycomment(eventid, starttime, callbackf){
    var url = '';
    if(starttime == 0){
    	url = getServerAddr()+'queryeventcomment?' + 'eventid=' + eventid ;
    }
    else{
    	url = getServerAddr()+'queryeventcomment?' + 'eventid=' + eventid + '&starttime=' + starttime;
    }
	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
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
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querynotify( starttime, limitcount, callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');

    var url = getServerAddr()+'querynotify?' + 'id=' + id + '&token=' + token + '&starttime=' + starttime + '&limitcount=' + limitcount ;

	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function createchatroom( id, toid, check, callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    
    var url = getServerAddr()+'createchatroom?' + 'id=' + id + '&token=' + token+'&toid=' +toid +'&check=' +check;

	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function quitchatroom( roomid, callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    
    var url = getServerAddr()+'quitchatroom?' + 'id=' + id + '&token=' + token+'&chatroomid=' +roomid;

	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.result);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};


function querychatroom( starttime, limitcount,onlytime ,callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    var lasttimeString = '';
    if(onlytime == true){
    	lasttimeString = '&onlyupdate=0';
    }
    url = getServerAddr()+'querychatroom?' + 'id=' + id + '&token=' + token + '&starttime=' + starttime + '&limitcount=' + limitcount +lasttimeString;

	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};

function sendmsg( roomid, msgdata ,callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    
    var url = getServerAddr()+'sendmsg?' + 'id=' + id + '&token=' + token + '&roomid=' + roomid;

	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		showAlert('Error !', result.result);
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("POST",url);
    xhr.send({'msgdata':msgdata}); 
	
};


function querymsg( roomid, starttime, limitcount ,callbackf){
    var id = Ti.App.Properties.getString('userid','');
    var token = Ti.App.Properties.getString('token','');
    
    var url = getServerAddr()+'querymsg?' + 'id=' + id + '&token=' + token + '&roomid=' + roomid+ '&starttime=' + starttime + '&limitcount=' + limitcount ;

	
	Ti.API.info('url : ' + url);
	var xhr = Titanium.Network.createHTTPClient({ timeout : timeoutms,validatesSecureCertificate: false});
    xhr.onload = function(e) {
    	Ti.API.info('response : ' + this.responseText);
        var result =  JSON.parse(this.responseText);
    	if(result.result == 'ok')
    	{
    		
    		callbackf(true,result.data);
    	}
    	else{
    		if(checkTokenError(result.result)){
    			return;
    		}
    		callbackf(false,result.result);
    	}
    };
    xhr.onerror = function(e){
    	showAlert('Error','networkerror');
    	callbackf(false,'networkerror');
    };
    xhr.open("GET",url);
    xhr.send(); 
	
};



