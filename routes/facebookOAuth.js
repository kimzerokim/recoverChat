/**
 * Created by YoungKim on 2014. 4. 13..
 */

var init = function (app) {
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

    // 엑세스토큰을 가로채올 변수를 만들어준다. 내가 직접 만들어 관리하는 변수라 조심히 다룰 것.
    // 현재는 로그아웃하였을 경우 사라지게끔 만들어놓아서 엄청 위험하진 않다.
    var accessToken_catch;

    passport.use(new FacebookStrategy({
        clientID: pkginfo.oauth.facebook.FACEBOOK_APP_ID,
        clientSecret: pkginfo.oauth.facebook.FACEBOOK_APP_SECRET,
        callbackURL: pkginfo.oauth.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'username', 'gender']
    }, function (accessToken, refreshToken, profile, done) {
        //
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // req.session.passport 정보를 저장하는 단계이다.
        // done 메소드에 전달된 정보가 세션에 저장된다.
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //
        process.nextTick(function () {
            accessToken_catch = accessToken;
            return done(null, profile);
        });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/welcome'}), function (req, res) {
        req.session.catch_accessToken = accessToken_catch;
        res.redirect('/');
    });
    app.get('/logout', function (req, res) {
        //
        // passport 에서 지원하는 logout 메소드이다.
        // req.session.passport 의 정보를 삭제한다.
        //
        req.logout();
        req.session.catch_accessToken = null;
        res.redirect('/');
    });
};

module.exports = init;