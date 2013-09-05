var routeUtils = require('./route_utils.js');
var logger = require(LIB_DIR + 'log_factory').create("notes_route");
var notesImpl = require(IMPLS_DIR + 'notes_impl');

var NotesRoute = function(app){
	app.get('/api/notes/word_stats', function(req, res){
		notesImpl.getWordStats(req.user.id, function(err, data){
			if(err == undefined){
				routeUtils.respond(req, res, data);
			}else{
				routeUtils.respond(req, res, err);
			}
		});
	});
	
	app.get('/api/notes/:id', function(req, res){
		req.params.userId = req.user.id;
		notesImpl.getById(req.params.id, req.params.userId, function(err, data){
			if(err == undefined){
				routeUtils.respond(req, res, data);
			}else{
				routeUtils.respond(req, res, err);
			}
		});
	});
	
	app.post('/api/notes', function(req, res){
		req.body = req.body || {};
		req.body.userId = req.body.userId || req.user.id;
		routeUtils.create(req, res, notesImpl);
	});
	
	app.put('/api/notes/:id', function(req, res){
		req.params.userId = req.user.id;
		if(req.body && req.user){
			req.body.updatedBy = req.user.id;
		}
		notesImpl.update(req.params.id, req.params.userId, req.body, function(err, data){
			if(err == undefined){
				routeUtils.respond(req, res, data);
			}else{
				routeUtils.respond(req, res, err);
			}
		});
	});
		
	app.get('/api/notes', function(req, res){
		req.query.q = req.query.q || '';
		req.query.q = req.query.q + '___userId:eq:' + req.user.id;
		routeUtils.search(req, res, notesImpl);
	});
	
//	app['delete']('/api/notes/:id', function(req, res){
//		routeUtils.deleteById(req, res, notesImpl);
//	});
	
	app.get('/shared/notes/:id', function(req, res){
		notesImpl.getByIdShared(req.params.id, function(err, data){
			if(err == undefined){
				routeUtils.respond(req, res, data);
			}else{
				routeUtils.respond(req, res, err);
			}
		});
	});
};

module.exports = function(app){
	return new NotesRoute(app);
};