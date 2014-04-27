var facebookInfo = require('../routes/facebookInfo');

exports.friendChat = function (req, res) {
    res.render('friendChat', { user: req.user });
};

exports.randomChat = function (req, res) {
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

exports.contact = function (req, res) {
    res.render('contact');
};
