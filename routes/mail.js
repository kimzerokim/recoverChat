/**
 * Created by YoungKim on 2014. 4. 16..
 */

///////////////////////////////////////////////
//////  configure App Mail Setting
///////////////////////////////////////////////

var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "facebookrecoverchat@gmail.com",
        pass: "recoverchat"
    }
});

exports.sendMail = function (req, res) {
    var curUserInfo = {
        id: req.user.id,
        displayName: req.user.displayName,
        userName: req.user.username,
        gender: req.user.gender,
        photo: req.user.photos[0].value
    };

    var body = req.body.mailBody;

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "recoverchat <facebookrecoverchat@gmail.com>", // sender address
        to: "facebookrecoverchat@gmail.com", // list of receivers
        subject: "고객 피드백", // Subject line
        text: "고객 피드백", // plaintext body
        html: "<b>고객피드백</b>"
            + "<br/><br/>고객정보 :<br/><br/>" + curUserInfo
            + "<br/><br/>피드백 내용 :<br/><br/>" + body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });

    //message 페이지 만들어놓기.
    res.render('message', {message: "감사합니다"});
};