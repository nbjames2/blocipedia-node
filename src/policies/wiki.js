const ApplicationPolicy = require("./application");
module.exports = class TopicPolicy extends ApplicationPolicy {

    create() {
        return this.new();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}