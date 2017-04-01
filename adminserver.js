var express = require('express');

module.exports = function(){
	var server = express();

	server.listen(1337, function(){
		console.log('Admin server running on port 1337');
	});

	server.set('views', './app/admin/views');
	server.set('view engine', 'ejs');

	server.use(express.static('./public/admin'));

	require('./app/admin/routes/index.routes')(server);
	require('./app/admin/routes/settings.routes')(server);
	require('./app/admin/routes/api.routes')(server);

	return server;
}