//for chatInputFunction
var chatInputFunction = (function () {
    var chatInsert = function (isSelf) {
        //find Dom element
        var chatInputText = document.getElementById('chatInput').innerText,
            messageField = document.getElementById('messages');

        //create HTML element
        var messageFragment = document.createDocumentFragment();
            articleMessage = document.createElement('article'),
            profileDiv = document.createElement('div'),
            blockDiv = document.createElement('div'),
            textSpan = document.createElement('span');

        //add class by author
        if (isSelf) {
            articleMessage.className = 'myMessage';
        }
        else {
            articleMessage.className = 'otherMessage';
        }

        //add class property
        profileDiv.className = 'profile';
        blockDiv.className = 'block';
        textSpan.innerText = chatInputText;

        //add Value
        blockDiv.appendChild(textSpan);
        articleMessage.appendChild(profileDiv);
        articleMessage.appendChild(blockDiv);
        messageFragment.appendChild(articleMessage);

        //add messageField
        messageField.appendChild(messageFragment);

        //change profile picture
        pictureChange.my();

    };

    var addEvent = function () {

    };
})();

//for socket connection
(function () {
    var APP = APP || {};
    var CHAT = CHAT || {};
    var user_me;
    var user_other;

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

// what to do on disconnected
    socket.on('disconnect', function () {
        if (APP.settings.debug) console.log('The client has disconnected');
    });

// receives message from server
    socket.on('getmessage', function (message) {
        var json = JSON.parse(message);
        if (APP.settings.debug) console.log(json);
        CHAT.message.add(json)
    });
})();
