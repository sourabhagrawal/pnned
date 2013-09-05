/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var log4js = require('log4js');
var _ = require('underscore');
var passport = require('passport');

var constants = require('./lib/constants');
var logger = require(LIB_DIR + 'log_factory').create("app");

var assetManager = require('connect-assetmanager');
var assetGroups = require(LIB_DIR + 'asset_groups');

var auth = require(LIB_DIR + 'auth');
auth.init();

var sessionParams = {secret : 'sutta'};
if(IS_PROD){
	var RedisStore = require('connect-redis')(express);
	sessionParams = {
		secret : 'sutta',
		store: new RedisStore,
		cookie: {secure: false, maxAge: 7 * 24 * 60 * 60 * 1000}
	};
}

/**
 * Initialize asset manager
 */
assetManagerGroups = assetGroups.getAll();
var assetsManagerMiddleware = assetManager(assetManagerGroups);

/**
 * Initialize App
 */
var app = express();

app.configure(function(){
  app.set('port', CONFIG.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout : false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(sessionParams));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(auth.filter());
  app.use(assetsManagerMiddleware);
  app.use(express.static(path.join(__dirname, 'public')));

  //To access in JADE
  app.use(function(req, res, next) {
      res.locals.app = app;
      next();
  });
  
  app.use(app.router);

  app.use(function(err, req, res, next) {
	  // only handle `next(err)` calls
	  console.log("Error occurred");
	  logger.error(err);
	  next();
  });
});

/**
 * Routes
 */
require('./routes')(app);

/**
 * Initialize the Server
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

logger.info("Started with settings : " + JSON.stringify(app.settings));