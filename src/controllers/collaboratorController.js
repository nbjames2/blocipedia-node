const collaboratorQueries = require("../db/queries.collaborators.js");
const User = require("../db/models").User;

module.exports = {
    add(req, res, next){
        User.findOne({where: {
            email: req.body.collaborator
        }})
        .then((user) => {
            collaboratorQueries.addCollaborator(req.params.id, user, (err, collaborator) => {
                if(err == "exists") {
                    req.flash("notice", "user is already a collaborator on this wiki");
                    res.redirect(301, `/wikis/${req.params.id}/edit`);
                } else if (err){
                    req.flash("notice", "error, collaborator not added");
                    res.redirect(401, `/wikis/${req.params.id}/edit`);
                } else {
                    req.flash("notice", "success, collaborator added!");
                    res.redirect(301, `/wikis/${req.params.id}/edit`);
                }
            });
        })
        .catch((err) => {
            req.flash("notice", "user does not exist");
            res.redirect(302, `/wikis/${req.params.id}/edit`);
        })
    },
    remove(req, res, next){
        User.findOne({where: {
            email: req.body.removeCollaborator
        }})
        .then((user) => {
            collaboratorQueries.removeCollaborator(req.params.id, user, (err, collaborator) => {
                if(err == "nonexistant") {
                    req.flash("notice", "user is not a collaborator on this wiki");
                    res.redirect(301, `/wikis/${req.params.id}/edit`);
                } else if (err) {
                    req.flash("notice", "error, collaborator not removed");
                    res.redirect(301, `/wikis/${req.params.id}/edit`);
                } else {
                    req.flash("notice", "success, collaborator removed from wiki!");
                    res.redirect(301, `/wikis/${req.params.id}/edit`);
                }
            })
        })
    }
}