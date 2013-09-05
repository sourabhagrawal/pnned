Models.Note = Backbone.Model.extend({
	urlRoot : function(){ return '/api/notes';},
	
	parse : function(response){
		if(response.status && response.status.code == 1000){
			return response.data;
		}else if(response.id){
			return response;
		}
		return null;
	},
	
	defaults : function(){
		body : ""
	},
	
	initialize : function(){
		this.bind('error', this.error, this);
		this.bind('sync', this.synced, this);
	},
	
	error : function(model, error){
	},
	
	synced : function(model, error){
	}
});

Lists.Notes = Backbone.Collection.extend({
	model : Models.Note,
	url : '/api/notes',
	parse : function(response){
		if(response.status && response.status.code == 1000){
			return response.data;
		}
		return null;
	}
});

Models.SharedNote = Backbone.Model.extend({
	urlRoot : function(){ return '/shared/notes';},
	
	parse : function(response){
		if(response.status && response.status.code == 1000){
			return response.data;
		}else if(response.id){
			return response;
		}
		return null;
	},
	
	defaults : function(){
		body : ""
	},
	
	initialize : function(){
		this.bind('error', this.error, this);
		this.bind('sync', this.synced, this);
	},
	
	error : function(model, error){
	},
	
	synced : function(model, error){
	}
});