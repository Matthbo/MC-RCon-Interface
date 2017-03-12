var net = require('net');

var PacketType = {
	COMMAND: 0x02,
	AUTH: 0x03,
	RESPONSE_VALUE: 0x00,
	RESPONSE_AUTH: 0x02
};

function Rcon(host, port, password) {
	if (!(this instanceof Rcon)) return new Rcon(host, port, password);

	this.host = host;
	this.port = port;
	this.password = password;
	this.clientID = 0x01;
	this.authed = false;
	this.reconInterval = undefined;

	this.sentCommands = [];

}

Rcon.prototype.connect = function(){
	self = this;

	this.socket = new net.Socket();
	console.log("trying to connect to: " + this.host + ":"+ this.port);
	this.socket.connect(this.port, this.host, function(){
		console.log('Connected');

		if(self.reconInterval){
			clearInterval(self.reconInterval);
			self.reconInterval = undefined;
		}

		self.send(PacketType.AUTH, self.password);
	});

	this.socket.on('data', function(data){ self.receive(data) })
			.on('error', function(err){ self.onError(err) })
			.on('close', function(had_error){ self.onClose(had_error) })
			.on('end', function(){ self.onEnd() });
}

Rcon.prototype.send = function(type, payload){
	var length = Buffer.byteLength(payload);

	buf = new Buffer.alloc(4+4+4+length+2);
	buf.writeInt32LE(length+10, 0);				// sendLength
	buf.writeInt32LE(this.clientID, 4);			// requestID
	buf.writeInt32LE(type, 8);					// type
	buf.write(payload, 12);						// payload
	buf.writeInt16LE('\x00\x00', 12+length);	// ending

	if(!this.authed && type != PacketType.AUTH){
		console.log("Can't send command '"+payload+"' because authentication failed!");
	} else {
		this.socket.write(buf.toString('binary'), 'binary');
		if(type != PacketType.AUTH)console.log("SENT: " + payload);
	}
}

Rcon.prototype.receive = function(data){
	var length = data.readInt32LE(0);
	if(!length) return;

	var id = data.readInt32LE(4);
	var type = data.readInt32LE(8);

	if(id == this.clientID){
		if(this.authed && type == PacketType.RESPONSE_VALUE){
			var payload = data.toString('utf8', 12, 12+length-10);
			console.log("GOT: (id: "+id+", type:"+type+") " + payload);

			var info = payload.split(":")[1];

			switch(this.sentCommands[0]){
				case 'list':
					this.updateServerStats(info);
			}

			this.sentCommands.shift();
		} else if(!this.authed && type == PacketType.RESPONSE_AUTH){
			this.authed = true;
			console.log("Authenticated successfully");
		} else {
			var payload = data.toString('utf8', 12, 12+length-10);
			console.log("Got unexpected packet: (type:"+type+") " + payload);
		}
	}
}

Rcon.prototype.onError = function(err){
	self = this;

	console.log("Got " + err);
	this.socket.destroy();
	if(this.reconInterval == undefined) this.reconInterval = setInterval(function() { self.connect() }, 10000);
}

Rcon.prototype.onClose = function(had_error){
	if(had_error) console.log("Closed due to error!");
	else console.log("Closed");

	console.log('----');
}

Rcon.prototype.onEnd = function(){
	this.authed = false;
	console.log('Connection ended');
}

module.exports = Rcon;