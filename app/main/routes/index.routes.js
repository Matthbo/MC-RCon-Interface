module.exports = function(server){
	var indexController = require('../controllers/index.controller');
	server.get('/', indexController.render);
}