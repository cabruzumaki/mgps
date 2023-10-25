const mobject = require("./lib/mobject.js")

const object = new mobject.MObject();

object.setBoolean("test", true)

console.log(object.getBoolean("test"))