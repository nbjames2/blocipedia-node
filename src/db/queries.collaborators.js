const Collaborators = require("./models").collaborators;

module.exports = {
    addCollaborator(wikiId, user, callback){
        Collaborators.findOne({
            where: {
                userId: user.id,
                wikiId: wikiId}
        })
        .then((coll) => {
            if(!coll){
                return Collaborators.create({
                    userId: user.id,
                    wikiId: wikiId
                })
                .then((collaborator) => {
                    if(collaborator){
                        callback(null, collaborator);
                    } else {
                        callback(err);
                    }
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                callback("exists");
            }
        });
    },
    removeCollaborator(wikiId, user, callback){
        Collaborators.findOne({
            where: {
                userId: user.id,
                wikiId: wikiId
            }
        })
        .then((coll) => {
            if(coll){
                Collaborators.destroy({
                    where: {
                        userId: user.id,
                        wikiId: wikiId
                    }
                })
                .then(() => {
                    callback(null, coll);
                })
                .catch((err) => {
                    callback(err);
                })
            } else {
                callback("nonexistant");
            }
        });
    }
}