var express = require('express');

module.exports = function(){
	var adminServer = express();

	adminServer.listen(1337, function(){
		console.log('Admin server running on port 1337');
	});

	return adminServer;
}