const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {
    signUp(req, res, next){
        res.render("users/sign_up");
    },
    create(req, res, next){
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err) {
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
                // apiKey = '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';
                // sgMail.setApiKey(apiKey);
                // const msg = {
                //     to: newUser.email,
                //     from: 'test@example.com',
                //     subject: 'Sending with SendGrid is Fun',
                //     text: 'and easy to do anywhere, even with Node.js',
                //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                // };
                // sgMail.send(msg);
            }
        });
    }
}