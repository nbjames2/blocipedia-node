const User = require("../db/models").User;
const bcrypt = require("bcryptjs");

module.exports = {
    validateSignUp(req, res, next) {
        if(req.method ==="POST") {    
            req.checkBody("name", "must be at least 2 characters").isLength({min: 2});
            req.checkBody("email", "must be valid").isEmail();
            req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
            req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
        }
        const errors = req.validationErrors();
        if(errors) {
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
        } else {
            return next();
        }
    },
    validateSignIn(req, res, next){
        if(req.method === "POST"){
            req.checkBody("email", "must be valid").isEmail();
            req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
        }
        const errors = req.validationErrors();
        if(errors) {
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
        } else {
            return next();
        }
    },
    validateWiki(req, res, next){
        if(req.method === "POST"){
            req.checkBody("title", "must be at least 4 characters in length").isLength({min: 4});
            req.checkBody("body", "must be at least 10 characters in length").isLength({min: 10});
        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
            } else {
            return next();
        }
    },
    validateCollaborator(req, res, next){
        if(req.method === "POST"){
            req.checkBody("collaborator", "must be a valid email address").isEmail();
        }
        const errors = req.validationErrors();
        if(errors){
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
        } else {
            return next();
        }
    }
}