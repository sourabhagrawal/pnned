Views.Footer = Views.BaseView.extend({
	initialize : function(params){
		this.$el = $("#footer");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.loadTemplate('footer');
	},
	
	init : function(){
		this.render({isAuth : $.cookie('isAuthenticated'), name : $.cookie('uname')});
	}
});