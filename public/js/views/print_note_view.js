Views.PrintNote = Views.Note.extend({
	initialize : function(params){
		this._super('initialize');
		
		this.date = moment(params.date, this.dateFormat);
		
		this.loadTemplate('print-note');
	},
	
	init : function(){
		this.notes.fetch({reset:true, data : {q : "date:eq:" + this.date.format('YYYY-MM-DD')}})
	},
	
	onFetchNote : function(){
		if(this.notes.length > 0){
			this.note = this.notes.at(0);
			
			this.render({
				date : moment(this.note.get('date'), 'YYYY-MM-DD').format('dddd DD MMMM, YYYY'),
				body : this.note.get('body')
			});
		}
	}
});