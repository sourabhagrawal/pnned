Views.ReadNote = Views.Note.extend({
	initialize : function(params){
		this._super('initialize');
		
		this.date = moment(params.date, this.dateFormat);
		
		this.loadTemplate('read-note');
	},
	
	init : function(){
		this._super('init');
		
		this.textbox = this.$('#read-note-box');
	},
	
	onFetchNote : function(){
		if(this.notes.length > 0){
			this.note = this.notes.at(0);
			this.textbox.html(this.note.get('body'));
			
			this.note.bind('sync', this.onNoteSync, this);
			this.onNoteSync();
		}else this.textbox.html("You didn't write anything on this day!");
	}
});