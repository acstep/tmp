
function sortByKeyUp(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

function sortByKeyDown(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


function GetDistance(lat1, lon1, lat2, lon2, unit) {
	    var radlat1 = Math.PI * lat1/180;
	    var radlat2 = Math.PI * lat2/180;
	    var radlon1 = Math.PI * lon1/180;
	    var radlon2 = Math.PI * lon2/180;
	    var theta = lon1-lon2;
	    var radtheta = Math.PI * theta/180;
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    dist = Math.acos(dist);
	    dist = dist * 180/Math.PI;
	    dist = dist * 60 * 1.1515;
	    if (unit=="K") { dist = dist * 1.609344; };
	    if (unit=="N") { dist = dist * 0.8684; };
	    return dist;
};

function createHSepLine(width, top, bottom){
	if (top == '0dp'){
		var SepView = Ti.UI.createView({
		    backgroundColor: '#bbbbbb',
		    width:width, height: '1dp',
		    bottom:bottom
		});
	}
	else{
		var SepView = Ti.UI.createView({
		    backgroundColor: '#bbbbbb',
		    width:width, height: '1dp',
		    top:top
		});
	}
	
	return SepView;
	
}

function createVSepLine(height, top,bottom,left){
	var SepView = Ti.UI.createView({
	    backgroundColor: '#bbbbbb',
	    width:'1dp', height: height,
	    top:top,bottom:bottom,left:left
	});
	return SepView;
}

function getStringlimit(orgstring,start,end){
	if(orgstring.length < start){
		return orgstring;
	}
	stringindex = -1;
	desString = '';
    firstSpaceIndex = orgstring.indexOf(" ",start);
    firstlinebreakIndex = orgstring.indexOf("\n",start);
    firstdotIndex = orgstring.indexOf(".",start);
    firstcommaIndex = orgstring.indexOf(",",start);
    if(firstSpaceIndex > 0 && firstSpaceIndex < end){
    	stringindex = firstSpaceIndex;
    }
    else if(firstlinebreakIndex > 0 && firstlinebreakIndex < end){
    	stringindex = firstlinebreakIndex;
    }
    else if(firstdotIndex > 0 && firstdotIndex < end){
    	stringindex = firstdotIndex;
    }
    else if(firstcommaIndex > 0 && firstcommaIndex < end){
    	stringindex = firstcommaIndex;
    }
    
   
    
    if(stringindex != -1 && stringindex<end){
    	desString = orgstring.substring(0,stringindex);
    	desString = desString + '...';
    }
    else{
    	desString = orgstring.substring(0,start);
    	desString = desString + '...';
    }
    return desString;
}
