module.exports = function(server){
	var controller = require('../controllers/settings.controller');
	server.get('/settings', controller.render);
}