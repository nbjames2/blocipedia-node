const User = require("./models").User;
const bcrypt = require("bcryptjs");
const { body } = require('express-validator/check');

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);        
        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        });      
    },
    upgrade(updatedUser, callback){
        return User.findById(updatedUser.id)
        .then((user) => {
            console.log(user);
            if(!user){
                return callback("user not found");
            }
            user.update(updatedUser, {
                fields: Object.keys(updatedUser)
            })
            .then((userUpdated) => {
                callback(null, userUpdated);
            })
            .catch((err) => {
                callback(err);
            })
        });
    }
}