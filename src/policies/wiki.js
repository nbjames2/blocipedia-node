const ApplicationPolicy = require("./application");
module.exports = class TopicPolicy extends ApplicationPolicy {

    edit() {
        return this.new();
    }

    create() {
        return this.new();
    }

    update() {
        return this.new();
    }

    destroy() {
        return this.new() && this.record && (this._isOwner() || this._isAdmin());
    }
}