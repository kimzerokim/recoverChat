var init = function (app, io) {
    //pick two element randomly
    var pickTwoElement = function (object) {
        var firstElement,
            firstKey,
            secondElement,
            secondKey,
            count = 0;

        //pick first value
        for (var prop in object) {
            if (Math.random() < 1 / ++count) {
                firstKey = prop;
            }
        }
        firstElement = object[firstKey];
        delete object[firstKey];
        count = 0;

        //pick second value
        for (prop in object) {
            if (Math.random() < 1 / ++count) {
                secondKey = prop;
            }
        }
        secondElement = object[secondKey];
        delete object[secondKey];

        return {firstClient: firstElement, secondClient: secondElement};
    };

    //return object length
    var getObjectLen = function(object) {
        var count = 0;
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    };

    var randomChatWaitUser = {};
    var randomChatRoom = {};

    io.sockets.on('connection', function (socket) {
        //////////////////////////
        ///// randomChatSetting
        //////////////////////////
        socket.on('randomChatConnected', function (userId) {
            socket.username = userId;
            socket.room = userId;
            socket.join(userId);

            //랜덤채팅에 들어온 유저들을 저장한다.
            randomChatWaitUser[userId] = userId;

            var randomChatWaitUserCount = getObjectLen(randomChatWaitUser);

            if (randomChatWaitUserCount <= 1) {
                socket.emit('waitingForMatch');
            }
            else {
                //랜덤채팅을 기다리는 사용자중 두 명을 랜덤으로 추출한다. (꼭 자신이 뽑히지 않아도 된다. 지금 새로 추가되는건 트리거일 뿐.)
                var newRandomChatClient = pickTwoElement(randomChatWaitUser),
                    client_1 = newRandomChatClient['firstClient'],
                    client_2 = newRandomChatClient['secondClient'];

                //두 클라이언트에 해당하는 소켓에게 새로운 방에 들어가라는 요청을 보낸다.
                io.sockets.in(client_1).emit('randomChatEnterEmptyRoom', client_1, client_2);
                io.sockets.in(client_2).emit('randomChatEnterEmptyRoom', client_2, client_1);
            }
        });

        socket.on('randomChatEnterRoom', function(userId, randomChatRoom) {
            //지금 요청이 들어온 소켓이 그 소켓이 맞는지 확인한다.
            if (socket.room === userId) {
                socket.leave(socket.room);
                socket.room = randomChatRoom;
                socket.join(randomChatRoom);
                io.sockets.in(randomChatRoom).emit('randomChatMatched');
            }
        });
    });
};

module.exports = init;