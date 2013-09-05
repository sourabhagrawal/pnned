Views.SharedNote = Views.BaseView.extend({
	initialize : function(params){
		this.$el = $("#main");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.dateFormat = 'DD-MM-YYYY';
		this.id = params.id;
		
		this.note = new Models.SharedNote({id : this.id});
		this.note.bind('change', this.onFetchNote, this);
		
		this.loadTemplate('shared-note');
	},
	
	init : function(){
		this.note.fetch();
	},
	
	onFetchNote : function(){
		this.render({
			date : moment(this.note.get('date'), 'YYYY-MM-DD').format('dddd DD MMMM, YYYY'),
			body : this.note.get('body')
		});
	}
});