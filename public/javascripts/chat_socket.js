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

    //socket connect with server
    socket.on('connect', function () {
        socket.emit('friendChatConnected');
        //console.log('connect with server');
        //console.log(userId);
    });

    return  {
        getSocket : getSocket
    }
})();
