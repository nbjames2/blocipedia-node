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
                const apiKey = process.env.SENDGRID_API_KEY;
                sgMail.setApiKey(apiKey);
                const msg = {
                    to: newUser.email,
                    from: 'Blocipedia@example.com',
                    subject: 'Welcome to Blocipedia',
                    text: 'You are now a lucky owner of a Blocipedia membership. Congratulations!',
                    html: '<strong>You are now a lucky owner of a Blocipedia membership. Congratulations!</strong>',
                };
                sgMail.send(msg)
            }
        });
    }
}