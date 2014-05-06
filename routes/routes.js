var facebookInfo = require('./facebookInfo');

var mysql = require('mysql'),
    mysqlConfig = require('./mysqlConfig').returnInfo(),
    mysqlConn = mysql.createConnection(mysqlConfig);

exports.friendChat = function (req, res) {
    var curUser = req.user,
        userInfo = {
            id: curUser.id,
            displayname: curUser.displayName,
            username: curUser.username,
            gender: curUser.gender
        };

    //check, register user
    mysqlConn.query('SELECT id FROM user WHERE id = ?', [curUser.id], function (err, result) {
        if (err)
            res.render('message', {message: "알 수 없는 에러가 발생하였습니다."});
        else {
            if (result.length === 0) {
                mysqlConn.query('INSERT INTO user SET ?', userInfo, function (err) {
                    if (err)
                        res.render('message', {message: "알 수 없는 에러가 발생하였습니다."});
                });
            }
        }
    });

    facebookInfo.getFbData(req.session.catch_accessToken, '/me/friends', function (data) {
        req.session.firendList = data;
    });

    res.render('friendChat', { user: req.user });
};

exports.randomChat = function (req, res) {
    var curUser = req.user;

    res.render('randomChat', { user: req.user });
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
}
