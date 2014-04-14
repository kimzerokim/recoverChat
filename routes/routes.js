exports.routeRoot = function (req, res) {
    if (req.isAuthenticated()) {
        res.render('friendChat');
    }
    else {
        res.render('welcome');
    }
};

exports.welcome = function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    else {
        res.render('welcome');
    }
};