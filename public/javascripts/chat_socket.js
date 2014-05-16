////for socket connection
//(function () {
//    var APP = APP || {};
//    var CHAT = CHAT || {};
//    var user_me;
//    var user_other;
//
//    APP.settings = {
//        debug: true,	// debuggin turned on?
//        socketURL: 'http://www.skkuleaf.com:3000'	// socket url to point to
//    };
//
//    var socket = io.connect(APP.settings.socketURL);
//
//// Socket Connection/Disconnection
//    socket.on('connect', function () {
//        // create/join a room using page title
//        socket.emit('join', 'lobby');
//        if (APP.settings.debug) console.log('The client has connected');
//    });
//
//// what to do on disconnected
//    socket.on('disconnect', function () {
//        if (APP.settings.debug) console.log('The client has disconnected');
//    });
//
//// receives message from server
//    socket.on('getmessage', function (message) {
//        var json = JSON.parse(message);
//        if (APP.settings.debug) console.log(json);
//        CHAT.message.add(json)
//    });
//})();

var socket = io.connect('http://www.skkuleaf.com:3000');

var socketfunction = (function () {
    //socket connect with server
    socket.on('connect', function () {
        socket.emit('friendChatConnected');
        //console.log('connect with server');
        //console.log(userId);
    });

    socket.on('friendChatEnterEmptyRoom', function (data) {
        console.log(data);
    });
})();
