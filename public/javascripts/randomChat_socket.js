var socketFunction = (function () {
    var socket = io.connect('http://www.skkuleaf.com:3000');
    var userId = document.getElementById('userId').innerHTML;

    // catch Error
//    if (userId === undefined || userId === null)
//        window.location = "/welcome";
//    else {
    //socket connect with server
    socket.on('connect', function () {
        socket.emit('randomChatConnected', userId);
        console.log('connect with server');
        console.log(userId);
    });

    socket.on('waitingForMatch', function () {
        //emit message that client now wait for matching
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

        //check socket user id is correct
        if (self === userId) {
            socket.emit('randomChatEnteredRoom', userId, randomChatRoom);
        }
    });

    socket.on('randomChatMatched', function (userId, chatRoom) {
        if (userId === userId) {
            console.log("연결된 나는 " + userId);
            console.log("채팅방 이름은 " + chatRoom);
        }
    });
//   }
})();
//
////can't access from client console
//var chatCount = (function () {
//
//})();