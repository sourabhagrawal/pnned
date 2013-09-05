Views.Note = Views.BaseView.extend({
	
	events : {
		"click #save-options" : 'saveOptions'
	},
	
	initialize : function(params){
		this.$el = $("#main");
		this._super('initialize');
		
		eventBus.on('close_view', this.close, this );
		
		this.dateFormat = 'DD-MM-YYYY';
		this.notes = new Lists.Notes();
		this.notes.bind('reset', this.onFetchNote, this);
		this.notes.bind('error', this.onError, this);
		
		this.notesTabs = new Lists.Notes();
		this.notesTabs.bind('reset', this.createDayLabels, this);
	},
	
	init : function(){
		this.render();
		
		if(this.date == undefined){
			this.date = moment();
		}
		
		this.today = this.$('#today');
		this.today.html(this.date.format('dddd DD MMMM, YYYY'));
		
		this.noteOptions = this.$('#note-options');
		
		this.days = this.$('#days');
		this.notesTabs.fetch({reset:true, data : {q : "date:like:" + this.date.format('YYYY-MM'), columns : "id,date"}})
		
		this.notes.fetch({reset:true, data : {q : "date:eq:" + this.date.format('YYYY-MM-DD')}})
	},
	
	onError : function(){
		
	},
	
	getDaysInMonth : function(m, y){
	    // months in JavaScript start at 0 so decrement by 1 e.g. 11 = Dec
//	    --m;

	    // if month is Sept, Apr, Jun, Nov return 30 days
	    if( /8|3|5|10/.test( m ) ) return 30;

	    // if month is not Feb return 31 days
	    if( m != 1 ) return 31;

	    // To get this far month must be Feb ( 1 )
	    // if the year is a leap year then Feb has 29 days
	    if( ( y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0 ) return 29;

	    // Not a leap year. Feb has 28 days.
	    return 28;
	},
	
	createDayLabels : function(){
		var date = this.date;
		var today = moment();
		
		var dates = this.notesTabs.pluck('date');
		this.days.append("<a href='/note/" + moment([date.year(), date.month() - 1, 1]).format(this.dateFormat) +"'><<</a> ");
		
		var numDays = this.getDaysInMonth(date.month(), date.year());
		if(date.month() == moment().month() && date.year() == moment().year()){
			// Current month
			for(var i = 1; i <= numDays; i++){
				if(i > today.date()){
					this.days.append("<a id='day-" + i + "'><span class='label day-label'>" + i + "</span></a>");
				}else if(i == today.date() && date.date() == today.date()){
					this.days.append("<a id='day-" + i + "'><span class='label label-inverse day-label'>" + i + "</span></a>");
				}else if(i == today.date() && date.date() != today.date()){
					this.days.append("<a href='/' id='day-" + i + "'><span class='label label-success day-label'>" + i + "</span></a>");
				}else if(i == date.date()){
					this.days.append("<a id='day-" + i + "'><span class='label label-inverse day-label'>" + i + "</span></a>");
				}else{
					if(dates.indexOf(moment(i + "-" + (date.month() + 1) + "-" + date.year(), this.dateFormat).format('YYYY-MM-DD') + " 00:00:00") == -1){
						// Note not written
						this.days.append("<a id='day-" + i + "'><span class='label label-important day-label'>" + i + "</span></a>");
					}else
						this.days.append("<a href='/note/" + moment(i + "-" + (date.month() + 1) + "-" + date.year(), this.dateFormat).format(this.dateFormat) + "' id='day-" + i + "'><span class='label label-success day-label'>" + i + "</span></a>");
				}
			}
		}else{
			for(var i = 1; i <= numDays; i++){
				if(i == date.date()){
					this.days.append("<a href='/' id='day-" + i + "'><span class='label label-inverse day-label'>" + i + "</span></a>");
				}else{
					if(dates.indexOf(moment(i + "-" + (date.month() + 1) + "-" + date.year(), this.dateFormat).format('YYYY-MM-DD') + " 00:00:00") == -1){
						// Note not written
						this.days.append("<a id='day-" + i + "'><span class='label label-important day-label'>" + i + "</span></a>");
					}else
						this.days.append("<a href='/note/" + moment(i + "-" + (date.month() + 1) + "-" + date.year(), this.dateFormat).format(this.dateFormat) + "' id='day-" + i + "'><span class='label label-success day-label'>" + i + "</span></a>");
				}
			}
			this.days.append("<a href='/note/" + moment([date.year(), date.month() + 1, 1]).format(this.dateFormat) +"'> >></a> ");
		}
		this.days.append("<a style='float:right; margin-left:10px;' href='/profile'>Profile Statistics</a>");
	},
	
	onNoteSync : function(){
		this.noteOptions.html(_.template(templateLoader.getTemplate('note-options'))(this.note.toJSON()));
	},
	
	saveOptions : function(e){
		this.note.save({
			shared : $('input:radio[name=note-options-radios]:checked').val()
		});
	} 
});