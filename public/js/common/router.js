$(function($){
	new Views.Header();
	new Views.Footer();
	
	var Router = Backbone.Router.extend({
		initialize : function(options){
			/**
			 * (\/)? to ignore trailing slash
			 */
			this.route(/^(\/)?$/, "index");
			this.route("_=_", "index"); // Facebook puts #_=_ on callback
			this.route(/^profile(\/)?$/, "profile");
			this.route("note/:date", "note");
			this.route("note/:date/", "note");
			this.route("shared/:id", "shared");
			this.route("shared/:id/", "shared");
			this.route("print/:date", "print");
			this.route("print/:date/", "print");
		},
		
		index : function(){
			// If logged in - show today's note
			templateLoader.loadRemoteTemplate('note-options', 'note-options' + ".html", function(data) {
				new Views.EditNote();
			});
		},
		
		note : function(date){
			templateLoader.loadRemoteTemplate('note-options', 'note-options' + ".html", function(data) {
				new Views.ReadNote({date : date});
			});
		},
		
		shared : function(id){
			new Views.SharedNote({id : id});
		},
		
		print : function(date){
			new Views.PrintNote({date : date});
		},
		
		profile : function(){
			new Views.Profile();
		}

	});
	
	Comp.router = new Router();
	
	Backbone.history.start({pushState: true});
});