var socket = io.connect('http://www.skkuleaf.com:3000');

var socketFunction = (function () {
    var userId = document.getElementById('userId').innerHTML,
        chatRoom = undefined;

    //socket connect with server
    socket.on('connect', function () {
        socket.emit('randomChatConnected', userId);
        console.log('connect with server');
        console.log(userId);
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

        console.log("내가 접속해야 할 방은 " + randomChatRoom);

        //check socket user id is correct
        if (self === userId) {
            socket.emit('randomChatChangeAndEnterRoom', userId, randomChatRoom);
        }
    });

    socket.on('randomChatMatched', function (self, chatRoom) {
        if (userId === self) {
            console.log("연결된 나는 " + userId);
            console.log("채팅방 이름은 - 전달 받은 채팅방" + chatRoom);
            console.log("채팅방 이름은 - 실제 접속한 채팅방" + socket.room);
        }

    });

    var getChatRoom = function() {
        return chatRoom;
    };

    return {
        getChatRoom : getChatRoom
    }
})();

//can't access from client console
var chatCount = (function () {
    var chatTimeDiv = document.getElementById('chatTimeInfo'),
        chatTime = 0;

    // increase chatTime
    setInterval(function () {
        chatTime++;
        chatTimeDiv.innerHTML = chatTime + '분 째 채팅 중!';
    }, 60 * 1000);
})();