// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var db = require('./db.js');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var path = require('path')
var fs = require('fs');
var Msg = require('./app/models/msg');
//
// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/javascript', express.static(path.join(__dirname, 'public/javascript')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.set('view engine', 'ejs');

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//-----------------email------------------
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "ayandeyeman.ir@gmail.com",
        pass: "your pass"
    }
});
//let transporter = nodemailer.createTransport(options[, defaults])

//--


var CronJob = require('cron').CronJob;
new CronJob('00 00 12 * * *', letterCron, null, true, 'Asia/Tehran');

function letterCron() {
    var date = new Date();

    var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    console.log(startDate);
    Msg.find({
        "date": {
            $gte: startDate,
            $lt: endDate
        }
    }).exec(function(error, results) {
        results.forEach(function(result, key) {
            console.log(key, result);
            dailymail = {
                    to: result.email,
                    subject: result.subject,
                    html: result.letter
                }
                //console.log(mailOptions);
            smtpTransport.sendMail(dailymail, function(error, response) {
                if (error) {
                    console.log(error);
                    return;
                } else {
                    console.log("An email sent now to " + result.email);

                }
            });

        })
    });


}
//---------------end of email-----------------
// routes ======================================================================
require('./app/routes.js')(app, passport, smtpTransport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
