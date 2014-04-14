exports.friendChat = function (req, res) {
    res.render('friendChat', { user: req.user });
    console.log('hello');
};

exports.welcome = function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    else {
        res.render('welcome');
    }
};