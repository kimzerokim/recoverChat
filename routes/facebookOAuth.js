/**
 * Created by YoungKim on 2014. 4. 13..
 */
module.exports = init;

function init(app) {
    var pkginfo = require('../package');
    var passport = require('passport');

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    var FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new FacebookStrategy({
        clientID: pkginfo.oauth.facebook.FACEBOOK_APP_ID,
        clientSecret: pkginfo.oauth.facebook.FACEBOOK_APP_SECRET,
        callbackURL: pkginfo.oauth.facebook.callbackURL,
        profileFields: 'https://graph.facebook.com/me?fields=picture,id,name,username,first_name,last_name,middle_name,gender,link,email'
    }, function (accessToken, refreshToken, profile, done) {
        //
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // req.session.passport 정보를 저장하는 단계이다.
        // done 메소드에 전달된 정보가 세션에 저장된다.
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //
        process.nextTick(function () {
            return done(null, profile);
        });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'publish_actions' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/welcome'
    }), function (req, res) {
        res.redirect('/');
    });
    app.get('/logout', function (req, res) {
        //
        // passport 에서 지원하는 logout 메소드이다.
        // req.session.passport 의 정보를 삭제한다.
        //
        req.logout();
        res.redirect('/');
    });
}