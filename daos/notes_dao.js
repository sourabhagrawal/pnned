var comb = require('comb');
var logger = require(LIB_DIR + 'log_factory').create("notes_dao");
var DAO = require('./dao.js');

var NotesDAO = comb.define(DAO,{
	instance : {
		constructor : function(options){
			options = options || {};
			options.model = "Notes";
            this._super([options]);
		}
	}
});

module.exports = new NotesDAO();
