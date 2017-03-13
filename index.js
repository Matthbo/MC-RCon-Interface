var Rcon = require('./rcon'),
	express = require('express');

var server1 = new Rcon('127.0.0.1', 25575, 'kaas').connect();

var mainWebServer = express();

mainWebServer.listen(443, function(){
	console.log("Main webserver on port 443");
});

var adminPanelServer = express();

adminPanelServer.listen(1337, function(){
	console.log("Admin webserver on port 1337");
});