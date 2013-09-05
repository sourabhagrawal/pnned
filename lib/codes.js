/**
 * Module that should serve for all the Success and Error coded to returned from APIs
 */

/**
 * @private
 * Substitute values in a message.
 * Will throw an error if insufficient number of parameters is provided.
 * If excess of parameters are provided then it will ignore them
 * @param message
 * @param params
 */

var _ = require('underscore');

var substitute = function(message, params){
	if(params != undefined){
        _.each(params, function(param, index, arr){
        	// Search for index in message and replace with param. e.g. {1} for index 1
            message = message.replace("{" + (index + 1) + "}", param);
        });
        if(message.match("{[0-9]*}")){ // If placeholders left for substitution
            throw "Insufficient substitution values (Provided : " + params.length + ")";
        };
    }
    return message;
};

/**
 * Returns a function that would 
 * 	-> generate the substitued message if called with parameters.
 * 	-> Return the message itself if converted to string
 * @param message
 */
var message = function(message){
	var foo = function(){
		var options = undefined;
		
		if(arguments.length > 0)
			options = [];
		
		var firstArgument = arguments[0];
		if(_.isArray(firstArgument)){
			for(var i = 0; i < firstArgument.length; i++){
				options[i] = firstArgument[i];
			}
		}else{
			for(var i = 0; i < arguments.length; i++){
				options[i] = arguments[i];
			}
		}
		return substitute(message, options);
	};
	
	foo.toString = function(){
		return message;
	};
	
	return foo;
};

/**
 * Returns a function that would generate a status code if called with options.
 */
var status = function(opts){
	var foo = function(){
		var options = undefined;
		
		if(arguments.length > 0)
			options = [];
		
		var firstArgument = arguments[0];
		if(_.isArray(firstArgument)){
			for(var i = 0; i < firstArgument.length; i++){
				options[i] = firstArgument[i];
			}
		}else{
			for(var i = 0; i < arguments.length; i++){
				options[i] = arguments[i];
			}
		}
		
		return {code : opts.code, message : substitute(opts.message, options)};
	};
	
	foo.toString = function(){
		return opts;
	};
	
	foo.equals = function(obj){
		return obj.code == opts.code;
	};
	
	return foo;
};

/**
 * Success Codes
 */
var SuccessCodes = new function(){
	/**
	 * Common Success codes
	 */
	this.OPERATION_SUCCESSFULL = "Operation was successfull";
	this.RECORD_FETCHED = message("{1} : {2} fetched successfully");
	this.RECORD_CREATED = message("{1} created successfully");
	this.RECORD_UPDATED = message("{1} : {2} updated successfully");
	this.RECORD_DELETED = message("{1} : {2} deleted successfully");
	this.RECORDS_SEARCHED = message("{1}s searched successfully");
	
	/**
	 * Sign-up and Authentication related
	 */
	this.USER_EMAIL_EXISTS = message("User found");
	this.TOKEN_VALID = message("URL token is valid");
	
	/**
	 * Email related
	 */
	this.EMAIL_BATCH_UPDATED = message("Email batch update successful");
};

/**
 * Error codes.
 */
var ErrorCodes = new function(){
	/**
	 * Common Error codes
	 */
	this.UNKNOWN_ERROR = status({code : 1001, message : "An unknown error occurred"});
	this.ID_NULL = status({code : 1101, message : "Id can not be null"});
	this.RECORD_WITH_ID_NOT_EXISTS = status({code : 1102, message : "{1} with id : {2} does not exist"});
	this.RECORD_WITH_ID_NOT_FETCHED = status({code : 1103, message : "{1} with id : {2} could not be fetched"});
	this.CREATION_FAILED = status({code : 1104, message : "{1} could not be created"});
	this.UPDATION_FAILED = status({code : 1105, message : "{1} with id : {2} could not be updated"});
	this.DELETION_FAILED = status({code : 1106, message : "{1} with id : {2} could not be deleted"});
	this.SEARCH_FAILED = status({code : 1107, message : "Search on {1}s could not be completed"});
	this.FIELD_REQUIRED = status({code : 1108, message : "{1} can not be blank"});
	this.VALID_USER_REQUIRED = status({code : 1109, message : "Valid user not found"});
	this.UNAUTHORIZED_UPDATE = status({code : 1110, message : "The caller Unauthorized to update this record"});
	this.UNAUTHORIZED_ACCESS = status({code : 1110, message : "The caller Unauthorized to access this record"});
	
	this.NOTE_DATE_REQUIRED = status({code : 2001, message : "Date for Note can not be blank"});
	this.NOTE_BODY_REQUIRED = status({code : 2002, message : "Body for Note can not be blank"});
	this.NOTE_USER_ID_DATE_EXISTS = status({code : 2003, message : "Note for this date already exists"});
	this.NOTE_USER_ID_CANT_UPDATE = status({code : 2004, message : "User Id for Note can not be updated"});
};

exports.success = SuccessCodes;
exports.error = ErrorCodes;