var APP = APP || {};
var CHAT = CHAT || {};

APP.settings = {
    debug: true,	// debuggin turned on?
    socketURL: 'http://www.skkuleaf.com:3000'	// socket url to point to
};

var socket = io.connect(APP.settings.socketURL);

// Socket Connection/Disconnection
socket.on('connect', function () {
    // create/join a room using page title
    socket.emit('join', 'lobby');
    if (APP.settings.debug) console.log('The client has connected');
});

// what to do on dissconection
socket.on('disconnect', function () {
    if (APP.settings.debug) console.log('The client has disconnected');
});

// receives message from server
socket.on('getmessage', function (message) {
    var json = JSON.parse(message);
    if (APP.settings.debug) console.log(json);
    CHAT.message.add(json)
});