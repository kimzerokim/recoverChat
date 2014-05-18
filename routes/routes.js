var facebookInfo = require('./facebookInfo');

var mysql = require('mysql'),
    mysqlConfig = require('./mysqlConfig').returnInfo(),
    mysqlConn = mysql.createConnection(mysqlConfig);

exports.initUser = function (io) {
    return function (req, res) {
        var curUser = req.user,
            userInfo = {
                id: curUser.id,
                displayname: curUser.displayName,
                username: curUser.username,
                gender: curUser.gender
            };

        var extractFriendList = function (data, callback) {
            var friendData = data.data;
            var friendArray = [];

            for (var i in friendData) {
                if (friendData.hasOwnProperty(i)) {
                    friendArray.push(friendData[i].id);
                }
            }

            callback(friendArray);
        };

        //check, register user
        mysqlConn.query('SELECT id FROM user WHERE id = ?', [curUser.id], function (err, result) {
            if (err)
            //res.render('message', {message: "알 수 없는 에러가 발생하였습니다."});
                console.log(err);
            else {
                if (result.length === 0) {
                    mysqlConn.query('INSERT INTO user SET ?', userInfo, function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            }
        });

        //getFacebookInfo
        facebookInfo.getFbData(req.session.catch_accessToken, '/me/friends', function (data) {
            var friendList;

            extractFriendList(data, function (list) {
                friendList = list;
                io.sockets.on('connection', function (socket) {
                    socket.emit('makingFriendListComplete');
                    console.log('sendCompleteMessage');
                });
            });
        });

        res.render('initUser');
    }
};

exports.friendChat = function (io) {
    return function (req, res) {

        //friendChat rendering
        res.render('friendChat', { user: req.user });
    };
};

exports.randomChat = function (io) {
    return function (req, res) {
        //console.log(req.session.friendList);

        res.render('randomChat', { user: req.user });
    };
};

exports.welcome = function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    else {
        res.render('welcome');
    }
};

exports.loginContact = function (req, res) {
    res.render('loginContact', {user: req.user});
};

exports.contact = function (req, res) {
    res.render('contact');
};