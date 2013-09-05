/**
 * Configure patio to connect to Mysql
 */

var patio = require("patio");
var logger = require('./log_factory').create("db_connection");
var emitter = require('./emitter');

/*
 * Camelize the Schema names
 */
patio.camelize = true;

//if you want logging
var patioConfig = {
	    "patio" : {
	        level : "INFO",
	        appenders : [
	            {
	                type : "RollingFileAppender",
	                file : "logs/patio.log",
	            },
	            {
	                type : "RollingFileAppender",
	                file : "logs/patio-error.log",
	                name : "errorFileAppender",
	                level : "ERROR"
	            }
	        ]
	}
};
patio.configureLogging(patioConfig);
//disconnect and error callback helpers
var disconnect = patio.disconnect.bind(patio);

patio.on('connect', function(conn){
	logger.debug("connected");
});

patio.on('disconnect', function(conn){
	logger.debug("disconnected");
});

patio.on('error', function(err){
	logger.debug(err);
});

emitter.on('syncFailed', function(event){
	patio.disconnect();
});

var params = {
	host : CONFIG.db.host,
    port : 3306,
    type : "mysql",
    maxConnections : 10,
    minConnections : 1,
    user : CONFIG.db.user,
    password : CONFIG.db.password,
    database : CONFIG.db.database
};

var DB = patio.createConnection(params);

module.exports = DB;
