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
var userInfo = (function () {
    var userId;

    var setUserId = function () {
        userId = document.getElementById('userId').innerHTML;
        document.getElementById('userId').innerHTML = '';
        console.log("userId set");
    };

    setUserId();

    var getUserId = function () {
        return userId;
    };

    return {
        getId: getUserId
    }
})();

var socketFunction = (function () {
    var socket = io.connect('http://www.recoverchat.co.kr');

    var getSocket = function () {
        return socket;
    };

    //socket connect with server
    socket.on('connect', function () {
        socket.emit('friendChatConnected');
        //console.log('connect with server');
        //console.log(userId);
    });

    return  {
        getSocket : getSocket
    }
})();
