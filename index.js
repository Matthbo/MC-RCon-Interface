var Rcon = require('./rcon'),
	mainServer = require('./mainserver'),
	adminServer = require('./adminserver');

//var server1 = new Rcon('127.0.0.1', 25575, 'kaas').connect();

mainServer();
adminServer();