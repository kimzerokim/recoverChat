var init = function (app, io) {
    //Fisher–Yates shuffle
    var shuffleArray = function (array) {
        var arrayLen = array.length;
        for (var i = 0; i < arrayLen; i++) {
            var k = n + Math.floor(Math.random() * (arrayLen - n));
            var temp = array[k];
            array[k] = array[n];
            array[n] = temp;
        }
    };

    var pickTwoElement = function (object) {
        var keys = [],
            firstElement,
            secondElement;

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        //shuffle keys array
        shuffleArray(keys);

        firstElement = object[keys[0]];
        secondElement = object[keys[1]];

        //delete object property
        delete object[keys[0]];
        delete object[keys[1]];

        return {firstClient: firstElement, secondClient: secondElement};
    };

    var randomChatWaitUser = {};

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

            if (randomChatWaitUser.length <= 1) {
                socket.emit('waitingForMatch');
            }
            else {
                //랜덤채팅을 기다리는 사용자들을 섞어준다.
                shuffle(randomChatWaitUser);
                var newRandomChatClient = pickTwoElement(randomChatWaitUser);
            }
        });
    });
};

module.exports = init;