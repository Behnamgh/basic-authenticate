var express = require("express"),
    port = process.env.PORT || 3000,
    path = require("path"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    session = require("express-session"),
    morgan = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser");

var app = express();

app.use(morgan("dev"));


mongoose.connect(`mongodb://<dbuser>:<dbpassword>@ds047792.mlab.com:47792/ayandeyeman`, {
    useMongoClient: false
});

require('./passport/passport')(passport); // pass passport for configuration


app.use(flash());
app.use(session({
    secret: 'behnamgoozSCREW19locked'
}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

require('./app/routes')(app, passport);

app.listen(port);
console.log("The Server runs on " + port);
