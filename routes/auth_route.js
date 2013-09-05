var passport = require('passport');

var logger = require(LIB_DIR + 'log_factory').create("auth_route");

var AuthRoute = function(app){
	app.get('/auth/facebook', passport.authenticate('facebook'));
	
	app.get('/auth/facebook/callback', function(req, res, next) {
		passport.authenticate('facebook', function(err, data, info) {
			if (err) { res.redirect('/login');}
			else{
				req.logIn(data, function(err) {
					if (err) { res.redirect('/login');}
					else{
						res.cookie('isAuthenticated', 1);
						res.cookie('uid', req.user.id);
						res.cookie('uname', req.user.name);
						res.redirect('/');
					}
				});
			}
		})(req, res, next);
	});
	
	app.get('/auth/google', passport.authenticate('google'));
	
	app.get('/auth/google/return', function(req, res, next) {
		passport.authenticate('google', function(err, data, info) {
			if (err) { res.redirect('/login');}
			else{
				req.logIn(data, function(err) {
					if (err) { res.redirect('/login');}
					else{
						res.cookie('isAuthenticated', 1);
						res.cookie('uid', req.user.id);
						res.cookie('uname', req.user.name);
						res.redirect('/');
					}
				});
			}
		})(req, res, next);
	});
	
	app.get('/login', function(req, res){
		if(req.isAuthenticated()){
			res.redirect('/');
		}else
			res.render('login');
	});
	
	app.get('/logout', function(req, res){
		res.clearCookie('isAuthenticated');
		res.clearCookie('uid');
		res.clearCookie('uemail');
		req.logOut();
		res.redirect('/');
	});
};

module.exports = function(app){
	return new AuthRoute(app);
};