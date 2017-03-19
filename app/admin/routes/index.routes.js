module.exports = function(server){
	var controller = require('../controllers/index.controller');
	server.get('/', controller.render);
}