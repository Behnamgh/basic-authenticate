module.exports = function(app, passport) {
    app.get("/login", function(req, res) {
        var error = req.flash("error");
        var form = '<form action="/login" method="post">' +
            '    <div>' +
            '        <label>email:</label>' +
            '        <input type="text" name="email"/>' +
            '    </div>' +
            '    <div>' +
            '        <label>Password:</label>' +
            '        <input type="password" name="password"/>' +
            '    </div>' +
            '    <div>' +
            '        <input type="submit" value="Log In"/>' +
            '    </div>' +
            '</form>';

        if (error && error.length) {
            form = "<b> " + error[0] + "</b><br/>" + form;
        }

        res.send(form);
    });
    app.post("/login", passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/login",
        successFlash: {
            message: "welcome back!"
        },
        failureFlash: true
    }));

    app.get("/signup", function(req, res) {
        var error = req.flash("error");
        var form = '<form action="/signup" method="post">' +
            '    <div>' +
            '        <label>email:</label>' +
            '        <input type="text" name="email"/>' +
            '    </div>' +
            '    <div>' +
            '        <label>Password:</label>' +
            '        <input type="password" name="password"/>' +
            '    </div>' +
            '    <div>' +
            '        <input type="submit" value="signup"/>' +
            '    </div>' +
            '</form>';

        if (error && error.length) {
            form = "<b> " + error[0] + "</b><br/>" + form;
        }

        res.send(form);
    });
    app.post("/signup", passport.authenticate("localsignup", {
        successRedirect: "/profile", // redirect to the secure profile section
        failureRedirect: "/signup", // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get("/profile", isLoggedIn, function(req, res) {
        res.end('profile');
    });

    app.get("*", function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect("/profile");
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            var content = "<a href='/login'>login</a></br><a href='/signup'>signup</a>";
            res.end(content);
        }
    });

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect("/");
}
