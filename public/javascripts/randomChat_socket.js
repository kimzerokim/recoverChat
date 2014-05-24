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

    var userId = userInfo.getId(),
        chatRoom = undefined,
        chatAlert = false;

    //socket connect with server
    socket.on('connect', function () {
        socket.emit('randomChatConnected', userId);
        //console.log('connect with server');
        //console.log(userId);
    });

    socket.on('waitingForMatch', function () {
        //emit message that client now wait for matching
        console.log('wait for enough user poll');
    });

    //start matching, enter room
    socket.on('randomChatEnterEmptyRoom', function (self, other) {
        var bigId,
            smallId,
            randomChatRoom;

        // big id other first
        if (self >= other) {
            bigId = self;
            smallId = other;
        }
        else {
            bigId = other;
            smallId = self;
        }

        randomChatRoom = bigId + 'random' + smallId;

        chatRoom = randomChatRoom;

        //console.log("내가 접속해야 할 방은 " + randomChatRoom);

        //check socket user id is correct
        if (self === userId) {
            socket.emit('randomChatChangeAndEnterRoom', userId, randomChatRoom);
        }
    });

    socket.on('randomChatMatched', function (self, chatRoom) {
        var messageField = document.getElementById('messages');

        //when new randomChat start, clear messageField
        messageField.innerHTML = '';

        if (userId === self) {
            //console.log("연결된 나는 " + userId);
            //console.log("채팅방 이름은 - 전달 받은 채팅방 " + chatRoom);
        }

        if (chatAlert === false) {
            alert('랜덤채팅에 연결되었습니다.');
            chatAlert = true;
            chatCount.start();
            var chatConnectionStatus = document.getElementById('connectionStatus');
            chatConnectionStatus.style.display = 'none';
        }
    });

    socket.on('disconnect', function () {
        socket.emit('randomChatDisconnected', userId);
    });

    socket.on('randomChatOppositeDisconnected', function (reqUser) {
        if (userId === reqUser) {
            console.log('little error occur');
        }
        else {
            var chatConnectionStatus = document.getElementById('connectionStatus');
            chatConnectionStatus.innerHTML = '채팅이 종료되었습니다';
            chatConnectionStatus.style.backgroundColor = '#803F36';
            chatConnectionStatus.style.display = 'block';
        }
    });

    var getChatRoom = function () {
        return chatRoom;
    };

    return {
        getChatRoom: getChatRoom,
        getSocket: getSocket
    }
})();

//can't access from client console
var chatCount = (function () {
    var chatTimeDiv = document.getElementById('chatTimeInfo'),
        chatTime = 0;

    // increase chatTime
    var chatCountStart = function () {
        setInterval(function () {
            chatTime++;
            chatTimeDiv.innerHTML = chatTime + '분 째 채팅 중!';
        }, 60 * 1000);
    };

    var getChatTime = function () {
        return chatTime;
    };

    return {
        getChatTime: getChatTime,
        start: chatCountStart
    }
})();