var comb = require('comb');
var _ = require('underscore');
var check = require('validator').check;
var ridict = require('ridict');
var moment = require('moment');
var Utils = require(LIB_DIR + 'utils');
var logger = require(LIB_DIR + 'log_factory').create("notes_impl");
var impl = require('./impl.js');
var emitter = require(LIB_DIR + 'emitter');
var notesDao = require(DAOS_DIR + 'notes_dao');
var codes = require(LIB_DIR + 'codes');
var response = require(LIB_DIR + 'response');
var Bus = require(LIB_DIR + 'bus');

var NotesImpl = comb.define(impl,{
	instance : {
		displayName : "Note",
		constructor : function(options){
			options = options || {};
			options.dao = notesDao;
//			options.auditableFields = [];
			
            this._super([options]);
		},
		
		getById : function(id, userId, callback){
			var ref = this;
			if(id == null){
				callback(response.error(codes.error.ID_NULL));
			}else{
				this._dao.getById(id).then(function(model){
					if(model == undefined){
						callback(response.error(codes.error.RECORD_WITH_ID_NOT_EXISTS([ref.displayName, id])));
					}else{
						var json = model.toJSON();
						if(userId != json.userId){
							callback(response.error(codes.error.UNAUTHORIZED_ACCESS()));
						}else{
							callback(null,response.success(json, 1, codes.success.RECORD_FETCHED([ref.displayName, id])));
						}
					}
				}, function(error){
					logger.error(error);
					callback(response.error(codes.error.RECORD_WITH_ID_NOT_FETCHED([ref.displayName, id])));
				});
			}
		},
		
		getByIdShared : function(id, callback){
			var ref = this;
			if(id == null){
				callback(response.error(codes.error.ID_NULL));
			}else{
				this._dao.getById(id).then(function(model){
					if(model == undefined){
						callback(response.error(codes.error.RECORD_WITH_ID_NOT_EXISTS([ref.displayName, id])));
					}else{
						var json = model.toJSON();
						if(1 != json.shared){
							callback(response.error(codes.error.UNAUTHORIZED_ACCESS()));
						}else{
							callback(null,response.success(json, 1, codes.success.RECORD_FETCHED([ref.displayName, id])));
						}
					}
				}, function(error){
					logger.error(error);
					callback(response.error(codes.error.RECORD_WITH_ID_NOT_FETCHED([ref.displayName, id])));
				});
			}
		},
		
		create : function(params, callback){
			var bus = new Bus();
			
			var ref = this;
			var m = this._getSuper();
			
			// User ID should not be valid
			var userId = params['userId'];
			try{
				check(userId).notNull().notEmpty().isInt();
			}catch(e){
				callback(response.error(codes.error.VALID_USER_REQUIRED()));
				return;
			}
			
			// Date should not be blank
			var date = params['date'];
			try{
				check(date).notNull().notEmpty();
			}catch(e){
				callback(response.error(codes.error.NOTE_DATE_REQUIRED()));
				return;
			}
			
			// Body should not be blank
			var body = params['body'];
			try{
				check(body).notNull().notEmpty();
				
				// Set word count
				params['wordCount'] = body.split(/\s+/).length;
			}catch(e){
				callback(response.error(codes.error.NOTE_BODY_REQUIRED()));
				return;
			}
			
			bus.on('start', function(){
				ref.search(function(err,data){
					// If error occurred
					if(err){
						callback(err);
						return;
					}
					
					if(data && data.totalCount > 0){ // Records with same User Id and Date can not exist 
						callback(response.error(codes.error.NOTE_USER_ID_DATE_EXISTS()));
					}else{
						bus.fire('noDuplicates');
					}
				}, 'userId:eq:' + params.userId + '___date:eq:' + params.date);
			});
			
			bus.on('noDuplicates', function(){
				if(params['body'] != undefined){
					params['wordCount'] = params['body'].split(/\s+/).length;
					emo = ridict.matches(params['body']);
					_.map(emo, function(value, key){
						params[Utils.toCamelCase(key.toLowerCase())] = value;
					});
				}
				
				m.call(ref, params, callback);
			});
			
			bus.fire('start');
		},
		
		update : function(id, userId, params, callback){
			if(id == null){
				callback(response.error(codes.error.ID_NULL));
			}else{
				
				var bus = new Bus();
				
				var ref = this;
				var m = this._getSuper();
				
				bus.on('start', function(){
					ref._dao.getById(id).then(function(model){
						if(model == undefined){
							callback(response.error(codes.error.RECORD_WITH_ID_NOT_EXISTS([ref.displayName, id])));
						}else{
							if(userId != model.userId){
								callback(response.error(codes.error.UNAUTHORIZED_UPDATE()));
							}else
								bus.fire('modelFound', model);
						}
					}, function(error){
						callback(response.error(codes.error.RECORD_WITH_ID_NOT_FETCHED([ref.displayName, id])));
					});
				});
				
				bus.on('modelFound', function(model){
					if(params.userId && params.userId != model.userId){
						// Can't change the user id of an experiment
						callback(response.error(codes.error.NOTE_USER_ID_CANT_UPDATE()));
						return;
					}
					
					if(params.date && params.date != model.date){ // date is getting changed
						// Date should not be blank
						try{
							check(params['date']).notNull().notEmpty();
						}catch(e){
							callback(response.error(codes.error.NOTE_DATE_REQUIRED()));
							return;
						}
					}
					
					if(params['body'] != undefined){
						params['wordCount'] = params['body'].split(/\s+/).length;
						emo = ridict.matches(params['body']);
						_.map(emo, function(value, key){
							params[Utils.toCamelCase(key.toLowerCase())] = value;
						});
					}
					
					m.call(ref, id, params, callback);
				});
				
				bus.fire('start');
			}
		},
		
		getWordStats : function(userId, callback){
			this.search(function(err, data){
				if(err){
					callback(err);
				}else{
					var notes = data.data;
					
					var totalNotes = notes.length;
					var totalWords = 0;
					var totalTime = 0;
					var monthMap = {};
					
					var emotions = ['orality','anality','sex','touch','taste','odor','genSensation','sound','vision',
					                'cold','hard','soft','passivity','voyage','randomMovement','diffusion','chaos',
					                'unknow','timelessnes','counscious','brinkPassage','narcissism','concreteness','ascend',
					                'height','descent','depth','fire','water','abstractThought','socialBehavior',
					                'instruBehavior','restraint','order','temporalRepere','moralImperative','positiveAffect',
					                'anxiety','sadness','affection','aggression','expressiveBeh','glory'];
					var emotionsMap = {};
					
					_.each(notes, function(note){
						totalWords += note.wordCount;
						totalTime += (Date.parse(note.updatedAt) - Date.parse(note.createdAt)); // seconds
						
						var month = new Date(Date.parse(note.date)).getMonth() + 1;
						if(monthMap[month] == undefined){
							monthMap[month] = 0;
						}
						monthMap[month]++;
						
						_.each(emotions, function(emotion){
							emotionsMap[emotion] = emotionsMap[emotion] ? emotionsMap[emotion] + note[emotion] : note[emotion];
						});
					});
					
					var params = {
						avgWords : Math.round((totalWords/totalNotes) * 100)/100,
						avgTime : moment.duration(Math.round((totalTime/totalNotes) * 100)/100).humanize(),
						wordsPerMinute : Math.round((totalWords * 60000 / totalTime) * 100)/100
					};
					
					_.each(emotions, function(emotion){
						if(totalWords > 100)
							params[emotion] = Math.round(((emotionsMap[emotion] * 1000)/totalWords) * 100)/100;
						else
							params[emotion] = Math.round(((emotionsMap[emotion] * 100)/totalWords) * 100)/100;
					});
					
					callback(null, response.success(params, 1, codes.success.RECORDS_SEARCHED(["Notes"])));
				}
			}, "userId:eq:" + userId, null, null, null, null);
		}
	}
});

module.exports = new NotesImpl();