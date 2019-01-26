const wikiQueries = require("../db/queries.wiki");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;
const collaboratorQueries = require("../db/queries.collaborators.js");
const User = require("../db/models").User;

module.exports = {
    index(req, res, next){
        wikiQueries.getAllWikis(req, (err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                wikiQueries.getAllPrivateWikis(req, (err, privates) => {
                    if(err){
                        res.redirect(500, "/");
                    } else {
                        res.render("wikis/index", {wikis, privates});
                    }
                })
                
            }
        })
    },
    new(req, res, next){
        const authorized = new Authorizer(req.user).new();

        if(authorized){
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    create(req, res, next) {
        const authorized = new Authorizer(req.user).create();
        if(authorized) {
            let private;
            if(req.body.private === "private"){
                private = true;
            } else {
                private = false;
            }
            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                private: private,
                userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                    res.redirect(500, "/wikis/new");
                } else {
                    if(wiki.private == true){
                        User.findById(req.user.id)
                        .then((user) => {
                        collaboratorQueries.addCollaborator(wiki.id, user, (err, collaborator) => {})
                        })
                    }
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            const markedWiki = {
                id: wiki.id,
                title: wiki.title,
                body: markdown.toHTML(wiki.body),
                userId: wiki.userId,
                private: wiki.private
            }
            if(err || wiki == null){
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {markedWiki});
            }
        });
    },
    destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                res.redirect(505, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null) {
                res. redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if(authorized){
                    res.render("wikis/edit", {wiki});
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.id}`);
                }
            }
        });
    },
    update(req, res, next){
        let private;
            if(req.body.private === "private"){
                private = true;
                User.findById(req.user.id)
                .then((user) => {
                collaboratorQueries.addCollaborator(req.params.id, user, (err, collaborator) => {})
                })
            } else {
                private = false;
            }
        updatedWiki = {
            title: req.body.title,
            body: req.body.body,
            private: private,
        }
        wikiQueries.updateWiki(req, updatedWiki, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(401, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }
}

