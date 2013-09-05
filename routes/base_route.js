var logger = require(LIB_DIR + 'log_factory').create("base_route");

var BaseRoute = function(app){
	app.get('/', function(req, res){
		res.render('index');
	});
	
	app.get('/_*', function(req, res){
		res.redirect('/');
	});
	
	app.get('/note/*', function(req, res){
		res.render('note');
	});
	
	app.get('/shared/*', function(req, res){
		res.render('note');
	});
	
	app.get('/print/*', function(req, res){
		res.render('print');
	});
	
	app.get('/profile(\/)?', function(req, res){
		res.render('profile');
	});
	
	app.get('/about(\/)?', function(req, res){
		res.render('about')
	});
	
	app.get('/robots.txt', function(req, res){
		var str = 'User-agent: *\nAllow : /';
		res.render('robots');
	});
}

module.exports = function(app){
	return new BaseRoute(app);
};