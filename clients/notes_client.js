var comb = require('comb');
var client = require('./client.js');
var logger = require(LIB_DIR + 'log_factory').create("notes_client");

var NotesClient = comb.define(client,{
	instance : {
		constructor : function(options){
			options = options || {};
			options.url = "notes";
            this._super([options]);
		}
	}
});

module.exports = new NotesClient();
