Views.EditNote = Views.Note.extend({
	initialize : function(){
		this._super('initialize');
		this.loadTemplate('edit-note');
	},
	
	init : function(){
		this._super('init');

		this.textbox = this.$('#edit-note-text-area');
		this.textbox.focus();
		
		this.saveMsg = this.$('#save-msg');
		
		this.textbox.xautoresize();
	},
	
	onFetchNote : function(){
		if(this.notes.length > 0){
			this.note = this.notes.at(0);
			this.textbox.val(this.note.get('body'));
			this.onNoteSync();
		}else this.note = new Models.Note();
		
		this.note.bind('sync', this.onNoteSync, this);
		
		this.startSaveTimer();
	},
	
	startSaveTimer : function(){
		var ref = this;
		setInterval(function(){
			// Save the model
			var body = ref.textbox.val();
			if((body != '' || ref.note.get('body') != null) && body != ref.note.get('body')){
				ref.saveMsg.html("Saving...");
				
				if(ref.note.isNew()){
					ref.note.save({
						date : ref.date.format('YYYY-MM-DD') + " 00:00:00",
						body : body
					});
				}else{
					ref.note.save({
						body : body
					});
				}
			}

			var now = moment();
			var savedAt = undefined;
			
			if(ref.note.get('updatedAt') != undefined){
				savedAt = moment(ref.note.get('updatedAt'));
			}
			if(savedAt == undefined && ref.note.get('createdAt') != undefined){
				savedAt = moment(ref.note.get('createdAt'));
			}

			if(savedAt != undefined){
				console.log('entered');
				savedAt = savedAt.subtract('seconds', Const.LocalOffset);
				
				var html = "Saved " + moment(savedAt).fromNow();
				if(ref.note.get('wordCount') != undefined){
					html = html + " (" + ref.note.get('wordCount') + " words)";
				}
				ref.saveMsg.html(html);
			}
		}, 5000);
	}
});