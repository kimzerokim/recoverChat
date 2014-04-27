/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes/routes'),
    http = require('http'),
    path = require('path'),
    app = express(),
    server = http.createServer(app);

// app environments
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.set('view option', { layout: false });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    //app.use(express.cookieDecoder());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));
    app.use(express.methodOverride());
    app.use(express.compress());

    //configure passport-facebook
    require('./routes/facebookOAuth')(app);

    app.use(app.router);
    // Since this is the last non-error-handling
    // middleware use()d, we assume 404, as nothing else
    // responded.
//
//    app.use(function (req, res, next) {
//        // the status option, or res.statusCode = 404
//        // are equivalent, however with the option we
//        // get the "status" local available as well
//        res.render('message', { message: "페이지를 찾을 수 없어요!" });
//    });

    // error-handling middleware, take the same form
    // as regular middleware, however they require an
    // arity of 4, aka the signature (err, req, res, next).
    // when connect has an error, it will invoke ONLY error-handling
    // middleware.

    // If we were to next() here any remaining non-error-handling
    // middleware would then be executed, or if we next(err) to
    // continue passing the error, only error-handling middleware
    // would remain being executed, however here
    // we simply respond with an error page.

//    app.use(function (err, req, res, next) {
//        // we may use properties of the error object
//        // here and next(err) appropriately, or if
//        // we possibly recovered from the error, simply next().
//        res.render('message', {message: "알 수 없는 에러입니다. 다시 시도해주세요" });
//    });

    app.use(express.static(path.join(__dirname, 'public')), {maxAge: 30 * 24 * 60 * 60 * 1000});
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/welcome');
}

app.get('/', ensureAuthenticated, routes.friendChat);
app.get('/randomChat', ensureAuthenticated, routes.randomChat);
app.get('/welcome', routes.welcome);
app.get('/contact', routes.contact);
app.get('/testchat', routes.friendChat);
app.get('/randomChatTest', routes.randomChat);

server.listen(app.get('port'), function () {
    console.log('\n///////////////////////////////////////////////\n' +
        '//// Express server listening on port ' + app.get('port') + ' ////' +
        '\n///////////////////////////////////////////////\n');
});
