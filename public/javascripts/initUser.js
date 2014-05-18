(function () {
    var socket = io.connect('http://www.skkuleaf.com:3000');

    socket.on('makingFriendListComplete', function () {
        window.location = '/friendChat';
    });
})();