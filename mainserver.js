var express = require('express');

module.exports = function(){
	var server = express();

	server.listen(443, function(){
		console.log('Main server running on port 443');
	});

	server.set('views', './app/main/views');
	server.set('view engine', 'ejs');

	server.use(express.static('./public/main'));

	require('./app/main/routes/index.routes')(server);

	return server;
}