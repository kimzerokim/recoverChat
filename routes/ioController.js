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
                //랜덤채팅을 기다리는 사용자들을 같은 방에 넣어준다.
                var newRandomChatClient = pickTwoElement(randomChatWaitUser);

            }
        });
    });
};

module.exports = init;