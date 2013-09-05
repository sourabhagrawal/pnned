var comb = require('comb');
var patio = require("patio");
var logger = require('./log_factory').create("models");
var DB = require('./db_connection');
var emitter = require('./emitter');
var entities = require('./entities');

var ModelsFactory = comb.define(null,{
	instance : {
		constructor : function(){
            this._super(arguments);
            
            var pre = {
                "save":function(next){
                    this.createdAt = new Date();
                    next();
                },
                "update" : function(next){
                    this.updatedAt = new Date();
                    next();
                }
            };
            
            var staticConf = {
            	typecastEmptyStringToNull : false
            };
            
            this.Notes = patio.addModel("Notes",{
            	pre:pre,
            	"static" : staticConf
            });
            
            this.Users = patio.addModel("Users",{
            	pre:pre,
            	"static" : staticConf
            });
            
            patio.syncModels().then(function(){
            	logger.debug("synced");
            	emitter.emit("modelsSynced");
            }, function(error){
            	logger.fatal(error);
            	emitter.emit("syncFailed");
            });
		}
	}
});

var factory = comb.singleton(ModelsFactory);

module.exports = new factory();