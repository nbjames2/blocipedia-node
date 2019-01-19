const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const stripe = require("stripe")(process.env.Stripe_Key);
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;

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
    },
    signInForm(req, res, next){
        res.render("users/sign-in");
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
                req.flash("notice", "Sign in failed. Please try again.");
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        });
    },
    signOut(req, res, next){
       req.logout();
       req.flash("notice", "You've successfully signed out!");
       res.redirect("/"); 
    },
    payment(req, res, next){
        res.render("users/payment");
    },
    payed(req, res, next){
        if(req.body.stripeToken){
            User.findById(req.params.id)
            .then((user) => {
                let updatedUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: 1
                }
                userQueries.upgrade(updatedUser, (err, upgrade) => {
                    if(err || upgrade == null){
                        req.flash("notice", "Upgrade failed");
                        res.redirect("/users/payment");
                    } else {
                        const token = req.body.stripeToken;
                        const charge = stripe.charges.create({
                            amount: '1500',
                            currency: 'cad',
                            description: 'Upgrade to premium Blocipedia account',
                            source: token,
                        });
                        req.flash("notice", "Payment accepted, Welcome to the cool side of the pillow!");
                        res.redirect(303, "/");
                    }
                })
            })
            
        } else {
            req.flash("notice", "payment error");
            res.redirect(500, "/users/payment");
        }
    },
    downgradeConf(req, res, next){
        res.render("users/downgrade");
    },
    downgrade(req, res, next){
        console.log("downgrade function start");
        User.findById(req.params.id)
        .then((user) => {
            newUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: 0
            }
            user.update(newUser, {
                fields: Object.keys(newUser)
            })
            .then(() => {
                Wiki.findAll({where: {
                    private: true,
                    userId: user.id
                }})
                .then((wikis) => {
                    wikis.forEach((wiki) => {
                        newWiki = {
                            title: wiki.title,
                            body: wiki.body,
                            private: false,
                            userId: wiki.userId
                        }
                        wiki.update(newWiki, {
                            fields: Object.keys(newWiki)
                        })
                        .then(() => {
                            req.flash("notice", "You are now a lowly surf");
                            res.redirect(303, "/");
                        })
                    });
                })
                
            })
        })
    }
}