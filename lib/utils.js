var Utils = function(){
	this.arrayContains = function(arr, v) {
	    for(var i = 0; i < arr.length; i++) {
	        if(arr[i] === v) return true;
	    }
	    return false;
	};
	
	this.arrayUnique = function(arr) {
	    var arrnew = [];
	    for(var i = 0; i < arr.length; i++) {
	        if(!this.arrayContains(arrnew, arr[i])) {
	        	arrnew.push(arr[i]);
	        }
	    }
	    return arrnew; 
	};
	
	this.toCamelCase = function(str){
		return str.replace(/_([a-z])/g, function (m, w) {
		    return w.toUpperCase();
		});
	};
	
};

module.exports = new Utils();