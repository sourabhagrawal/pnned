var url = require('url');
var _ = require('underscore');
var passport = require('passport');
var request = require('request');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var logger = require(LIB_DIR + 'log_factory').create("app");

var usersImpl = require(IMPLS_DIR + 'users_impl');

exports.init = function(){
	passport.use(new FacebookStrategy({
		  clientID: CONFIG.fb.clientID,
		  clientSecret: CONFIG.fb.clientSecret,
		  callbackURL: "http://" + CONFIG.domain.host + "/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			usersImpl.findOrCreate({identifier : profile.id, strategy : 'facebook', name : profile.displayName}, 
					function(err, user) {
						if (err) { return done(err); }
					    done(null, user);
					});
		}
	));
	
	passport.use(new GoogleStrategy({
	    returnURL: "http://" + CONFIG.domain.host + "/auth/google/return",
	    realm: "http://" + CONFIG.domain.host
	  },
	  function(identifier, profile, done) {
		  urlParams = url.parse(identifier, true);
		  var id = urlParams.query['id'];
		  usersImpl.findOrCreate({identifier : id, strategy : 'google', name : profile.displayName}, 
					function(err, user) {
						if (err) { return done(err); }
					    done(null, user);
					});
	  }
	));

	//define REST proxy options based on logged in user
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
};

exports.filter = function(req, res, next){
	return function(req, res, next) {
		logger.debug(req.method + " request on " + req.url);
		
		/**
		 * Url patterns to be put under auth
		 */
		var blackList = ['^/', '^/api/'];
		
		/**
		 * Url patterns to be excluded from auth
		 */
		var whiteList = ['/login', '^/auth/*', '/templates*', '/static*', '/images*', '/about(\/)?', '/shared/*', '/robots.txt'];
		
		var skipAuth = true;
		_.each(blackList, function(url){
			if(req.url.match(url)){
				skipAuth = false;
			}
		});
		_.each(whiteList, function(url){
			if(req.url.match(url)){
				skipAuth = true;
			}
		});
		if(skipAuth == true){
			logger.info(req.url + " : skipped authentication");
		}
		if (skipAuth == true || req.isAuthenticated()){
			return next();
		}else{ //Say Unauthorized
			res.clearCookie('isAuthenticated');
			res.clearCookie('uid');
			res.clearCookie('uemail');
			
			if(req.xhr === true){
				res.status(LOGIN_REQUIRED);
				res.send();
			}else{
				res.redirect('/login');
			}
		}
	};
};