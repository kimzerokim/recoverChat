var init = function (io) {
    var userSelf = req.user,
        userOther;

    console.log(userSelf);

    io.sockets.on('connection', function (socket) {
        socket.emit('connect');

        socket.on('join', function() {

        });
    });
};

module.exports = init;