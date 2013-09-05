/**
 * Initialize all routes
 */
module.exports = function(app){
	require('./notes_route')(app);
	require('./auth_route')(app);
	require('./base_route')(app);
};
