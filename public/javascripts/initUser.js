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

    socket.on('makingFriendListComplete', function () {
        window.location = '/friendChat';
    });
})();