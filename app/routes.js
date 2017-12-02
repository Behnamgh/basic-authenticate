var User = require('./models/user');

module.exports = function(app, passport, smtpTransport) {
    app.get('/send', isLoggedIn, function(req, res) {
        rand = Math.floor((Math.random() * 100) + 54);
        host = req.get('host');
        link = "http://" + req.get('host') + "/verify?id=" + rand;
        console.log(link);
        mailOptions = {
                to: req.user.user.email,
                subject: "Please confirm your Email account",
                html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
            }
            //console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            } else {
                console.log("verification Message sent: " + info.message);
                res.render('profile.ejs', {
                    user: req.user
                });
            }
        });
    });

    app.get('/verify', isLoggedIn, function(req, res) {
        host = req.get('host');
        console.log(req.protocol + ":/" + req.get('host'));
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
            console.log(req.user.user.email + " is verified");
            if (req.query.id) {


                User.update({
                    'user.email': req.user.user.email,
                    'user.verifii': false
                }, {
                    $set: {
                        'user.verifii': true
                    }
                }, function(err) {
                    console.log(err);
                });
                //  mongoose.Schema.local.verifii.update(function(err) {
                //        done(err);
                //   });

                //mongoose.Schema.user.update({"verifii":1 },{upsert: false });


                //  console.log(req.user.local.verifii);
                //  console.log(mongoose.Schema.user);

                res.end("<h1>Email " + req.user.user.email + " is been Successfully verified");
            } else {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        } else {
            res.end("<h1>Request is from unknown source");
        }
    });

    app.post('/wrote', isLoggedIn, function(req, res) {
        var newMsg = new Msg();

        newMsg.date = new Date(req.body.date);
        newMsg.letter = req.body.letter;
        newMsg.subject = req.body.subject;
        newMsg.email = req.user.email;

        newMsg.save(function(err) {
            if (err) {
                console.error(err);
                return;
            }
            res.send('your email is on the way');
            console.log('an email from ' + req.user.email + 'sent to future on ' + req.body.date)

        });
    });

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user
        });

    });



    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));





    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));




};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
