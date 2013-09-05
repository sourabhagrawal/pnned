Utils = window.Utils || {};

$(function($){
	Utils.getQueryParameterByName = function(name) {
	    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	
	Utils.isEmail = function(email) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	};
	
	/**
	 * Substitutues params in url. 
	 * e.g. url = '/foo/:bar/hex/:pie';
	 * 		Utils.replaceUrlParams(url, ['1', '2']); 
	 * 		will return /foo/1/hex/2 
	 */
	Utils.replaceUrlParams = function(url, params){
		_.each(params, function(param){
			url =  url.replace(/:[a-zA-Z]+/, param);
		});
		
		return url;
	};
});