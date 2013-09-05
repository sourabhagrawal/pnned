Views.Header = Views.BaseView.extend({
	initialize : function(params){
		this.$el = $("#header");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.loadTemplate('header');
	},
	
	init : function(){
		this.render({isAuth : $.cookie('isAuthenticated'), name : $.cookie('uname')});
	}
});