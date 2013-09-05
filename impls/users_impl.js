var comb = require('comb');
var _ = require('underscore');
var check = require('validator').check;
var logger = require(LIB_DIR + 'log_factory').create("users_impl");
var impl = require('./impl.js');
var emitter = require(LIB_DIR + 'emitter');
var usersDao = require(DAOS_DIR + 'users_dao');
var codes = require(LIB_DIR + 'codes');
var response = require(LIB_DIR + 'response');
var Bus = require(LIB_DIR + 'bus');

var UsersImpl = comb.define(impl,{
	instance : {
		displayName : "User",
		constructor : function(options){
			options = options || {};
			options.dao = usersDao;
//			options.auditableFields = [];
			
            this._super([options]);
		},
		
		findOrCreate : function(options, callback){
			var bus = new Bus();
			var ref = this;
			
			bus.on('start', function(){
				ref.search(function(err, data){
					if(err != undefined){
						callback(err);
					}else{
						if(data.totalCount > 0){
							var user = data.data[0];
							callback(null, user);
						}else{
							//Create
							bus.fire('create');
						}
					}
				}, 'identifier:eq:' + options.identifier);
			});
			
			bus.on('create', function(){
				ref.create(options, function(err, data){
					if(err != undefined){
						callback(err);
					}else{
						if(data.totalCount > 0){
							var user = data.data;
							console.log(user);
							callback(null, user);
						}else{
							callback("User creation failed");
						}
					}
				});
			});
			
			bus.fire('start');
		}
	}
});

module.exports = new UsersImpl();