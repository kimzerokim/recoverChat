//var APP = APP || {};
//var CHAT = CHAT || {};
//
//APP.settings = {
//    debug: true,	// debuggin turned on?
//    socketURL: 'http://www.skkuleaf.com:3000'	// socket url to point to
//};
//
//var socket = io.connect(APP.settings.socketURL);
//
//// Socket Connection/Disconnection
//socket.on('connect', function () {
//    // create/join a room using page title
//    socket.emit('join', 'lobby');
//    if (APP.settings.debug) console.log('The client has connected');
//});
//
//// what to do on dissconection
//socket.on('disconnect', function () {
//    if (APP.settings.debug) console.log('The client has disconnected');
//});
//
//// receives message from server
//socket.on('getmessage', function (message) {
//    var json = JSON.parse(message);
//    if (APP.settings.debug) console.log(json);
//    CHAT.message.add(json)
//});

var buttonToggle = (function () {
    var menuPopup = function () {
        var info = document.getElementById('info'),
            chatInfo = document.getElementById('chatInfo'),
            body = document.body,
            chatScroller = document.getElementById('chatScroller');

        if (info.style.display === "none") {
            info.style.display = 'block';
            chatInfo.style.display = 'block';
            body.addEventListener('click', menuPopup, true);
            chatScroller.addEventListener('click', menuPopup, true);

        }
        else {
            info.style.display = 'none';
            chatInfo.style.display = 'none';
            body.removeEventListener('click', menuPopup, true);
            chatScroller.removeEventListener('click', menuPopup, true);
        }

    };

    var addEvent = function () {
        var chatMenuButton = document.getElementById('chatMenu'),
            info = document.getElementById('info'),
            chatInfo = document.getElementById('chatInfo');

        console.log('hello');
        console.log(info);
        console.log(chatMenuButton);

        info.style.display = 'none';
        chatInfo.style.display = 'none';
        chatMenuButton.addEventListener('click', menuPopup, true);
    };

    return {
        addEvent: addEvent
    }
})();

var dynamicResize = (function () {
    var changeChatFieldHeight = function () {
        var chatField = document.getElementById('chatContainer');
        var chatScroller = document.getElementById('chatScroller');
        chatField.style.height = window.innerHeight - 215;
        chatScroller.style.height = window.innerHeight - 259;
    };

    return {
        changeChatFieldHeight: changeChatFieldHeight
    }
})();

//execute when loaded
(function () {
    dynamicResize.changeChatFieldHeight();
    buttonToggle.addEvent();
    window.onresize = dynamicResize.changeChatFieldHeight;
//    var iscroll = new IScroll('#chatScroller', {
//        mouseWheel: true
//    });
})();