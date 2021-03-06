const Wiki = require("./models").Wiki;
const Collaborators = require("./models").collaborators;
const Authorizer = require("../policies/wiki");

module.exports = {
    getAllWikis(req, callback){
        return Wiki.findAll({where: {private: false}})
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        });
    },
    getAllPrivateWikis(req, callback){
        return Wiki.findAll({
            include: {
                model: Collaborators,
                as: "collaborators",
                where: {userId: req.user.id}
            }
        })
        .then((privates) => {
            callback(null, privates);
        })
        .catch((err) => {
            callback(err);
        });
    },
    getWiki(id, callback){
        return Wiki.findById(id, {
            include: [{
                model: Collaborators,
                as: "collaborators"
            }]
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();
            if(authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },
    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }
            const authorized = new Authorizer(req.user, wiki).update();
            if(authorized){
                updatedWiki.userId = wiki.userId;
                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                .then(() => {
                    callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback("Forbidden");
            }
        });
    }
}