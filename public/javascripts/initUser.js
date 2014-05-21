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

(function () {
    var socket = io.connect('http://www.skkuleaf.com:3000');

    var userId = userInfo.getId();

    socket.on('connect', function () {
        socket.emit('prepareForFriendChat', userId);
    });

    //start matching, enter room
    socket.on('friendChatEnterEmptyRoom', function (self, other) {
        var bigId,
            smallId,
            friendChatRoom;

        // big id other first
        if (self >= other) {
            bigId = self;
            smallId = other;
        }
        else {
            bigId = other;
            smallId = self;
        }

        friendChatRoom = bigId + 'friend' + smallId;

        //console.log("내가 접속해야 할 방은 " + friendChatRoom);

        //check socket user id is correct
        if (self === userId) {
            socket.emit('friendChatChangeAndEnterRoom', userId, friendChatRoom);
        }
    });

    socket.on('friendChatRoomChanged', function () {
        socket.emit('friendChatRoomChangedReceive');
    });

    socket.on('friendChatMatchFinish', function () {
        window.location = '/friendChat';
    });

    socket.on('notEnoughFriend', function() {
        console.log('친구가 적어 시작할 수 없어요 ㅜㅠ ');
    });

    socket.on('waitForOtherFriend', function() {
        alert('다른 친구가 들어오길 기다리고 있어요');
    });
})();