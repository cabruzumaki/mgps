const { Mobject } = require("../mobject")
class BaseMamboRequest {
    constructor(type = null) {
        this._type = type || this.constructor.name;
    }

    get type() {
        return this._type;
    }

    toMobject() {
        const mobject = new Mobject();
        this.build(mobject);
        return mobject;
    }

    build(mobject) {
        // Debes implementar esta función en las clases que hereden de BaseMamboRequest
    }
}
module.exports = { BaseMamboRequest }