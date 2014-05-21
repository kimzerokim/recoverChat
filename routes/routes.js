var facebookInfo = require('./facebookInfo');

var mysql = require('mysql'),
    mysqlConfig = require('./mysqlConfig').returnInfo(),
    mysqlConn = mysql.createConnection(mysqlConfig);

var friendMatrix = require('./friendMatrix');

var friendChatWaitUser = {};
var friendChatWaitUserArray = [];

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
                    friendArray.push(parseInt(friendData[i].id));
                }
            }
            callback(friendArray);
        };

        var getSignedUserList = function (callback) {
            mysqlConn.query('SELECT id FROM user', function (err, result) {
                if (err)
                    console.log(err);
                else {
                    var userList = [];
                    var userListLength = result.length;
                    for (var i = 0; i < userListLength; i++) {
                        userList.push(parseInt(result[i].id));
                    }
                    callback(userList);
                    // output example
                    // [ 1055497070, 100008109462734 ]
                }
            });
        };

        var findDuplicate = function (arr1, arr2) {
            var duplicateValue = [];

            var len1 = arr1.length,
                len2 = arr2.length;

            var i = 0, j = 0;

            //arr1 and arr2 art pre-sorted
            while (i < len1 && j < len2) {
                if (arr1[i] > arr2[j]) {
                    j++;
                }
                else if (arr1[i] < arr2[j]) {
                    i++;
                }
                else {
                    duplicateValue.push(arr1[i]);
                }
            }

            return duplicateValue;
        };

        var matchingFriend = function (userId, userFriend, curWaitingUser, callback) {
            //userFriend, curWaitingUser are pre-sorted
            var randomList = findDuplicate(userFriend, curWaitingUser),
                matchingResult = {
                    matched: false,
                    matchClient: null
                };

            if (randomList.length === 0) {
                callback(matchingResult);
            }
            else {
                var resultClient = randomList[Math.floor(Math.random() * randomList.length)];
                matchingResult.matched = true;
                matchingResult.matchClient = resultClient;
                callback(matchingResult);
            }

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

        io.sockets.on('connection', function (socket) {
            socket.on('prepareForFriendChat', function (userId) {
                socket.username = userId;
                socket.room = userId;
                socket.join(userId);

                //push and sort
                friendChatWaitUserArray.push(parseInt(userId));
                friendChatWaitUserArray.sort(function (a, b) {
                    return a - b
                });

                //getFacebookInfo
                facebookInfo.getFbData(req.session.catch_accessToken, '/me/friends', function (data) {
                    //친구 목록을 배열에 저장한다.
                    extractFriendList(data, function (list) {
                        socket.friendList = list;
                        console.log(list);
                        //전체 사용자를 배열에 저장한다.
                        getSignedUserList(function (result) {
                            console.log(result);
                            //친구와 사용자 중 겹치는 사람들을 추출한다.
                            friendMatrix.makeMatrix(socket.friendList, result, function (friendArray) {
                                console.log(friendArray);
                                friendChatWaitUser[userId] = friendArray;
                                if (friendArray.length === 0) {
                                    socket.emit('notEnoughFriend');
                                }
                                else {
                                    //친구 리스트 중 매칭을 시켜준다.
                                    matchingFriend(userId, friendArray, friendChatWaitUserArray, function (final) {
                                        if (final.matched === true) {
                                            io.sockets.in(userId).emit('friendChatEnterEmptyRoom', userId, final.matchClient);
                                            io.sockets.in(final.matchClient).emit('friendChatEnterEmptyRoom', final.matchClient, userId);
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
            });

            socket.on('friendChatChangeAndEnterRoom', function (userId, friendChatRoom) {
                //지금 요청이 들어온 소켓이 그 소켓이 맞는지 확인한다.
                if (socket.room === userId) {
                    socket.leave(socket.room);
                    socket.room = friendChatRoom;
                    socket.join(friendChatRoom);
                    socket.emit('friendChatRoomChanged');
                }
            });

            socket.on('friendChatRoomChangedReceive', function () {
                io.sockets.in(socket.room).emit('friendChatMatchFinish');
            })
        });

        res.render('initUser', {user: req.user});
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
        //randomChat rendering
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