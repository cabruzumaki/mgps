const { Rijndael } = require("./rijndael");
const { EventEmitter } = require('events');

class SecurityMethod extends Rijndael {
    constructor() {
        super()
    }

    createValidationDigest(username, encryptionKey) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        let plaintext = this.prepare(username) + timestamp.toString();

        while (plaintext.length % 16 !== 0) {
            plaintext += "0";
        }

        const encryptedData = this.encrypt(plaintext, encryptionKey, "");
        const digestNum = plaintext.substr(username.length);

        return {
            "digestNum": digestNum,
            "digestHash": encryptedData
        };
    }

    prepare(username) {
        while (username.indexOf("Ñ", 0) >= 0) {
            username = username.replace("Ñ", "N");
        }
        return username;
    }
}
module.exports = SecurityMethod