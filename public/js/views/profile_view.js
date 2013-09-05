Views.WordCountWidget = Views.BaseView.extend({
	initialize : function(params){
		this.$el = $("#word-count-widget");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.data = params.data;
		
		this.loadTemplate('word-count-widget');
	},
	
	init : function(){
		this.render(this.data);
	}
}); 

Views.EmotionsWidget = Views.BaseView.extend({
	initialize : function(params){
		this.$el = $("#emotions-widget");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.data = params.data;
		
		this.loadTemplate('emotions-widget');
	},
	
	init : function(){
		this.render(this.data);
	}
});

Views.Profile = Views.BaseView.extend({
	initialize : function(params){
		this.$el = $("#main");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.loadTemplate('profile');
	},
	
	init : function(){
		this.render({name : $.cookie('uname')});
	},
	
	render : function(params){
		this.$el.html(this.template(params));
		
		var ref = this;
		
		$.ajax({
			url : '/api/notes/word_stats'
		}).done(function(data){
			var res = data.data;
			
			if(res.avgWords == undefined || res.avgWords == null){
				ref.$('#nothing-alert').show();
			}else{
				new Views.WordCountWidget({data : res});
				new Views.EmotionsWidget({data : res});
			}
		});
		
		return this;
	}
});