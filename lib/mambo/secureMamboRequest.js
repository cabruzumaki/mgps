class SecureMamboRequest extends BaseMamboRequest {
    constructor(data = null) {
        super(data);
    }

    applyValidationDigest(requestParams) {
        const SecurityMethod = require('SecurityMethod');
        const GameData = require('GameData');

        const securityMethod = new SecurityMethod();
        const validationDigest = securityMethod.createValidationDigest(GameData.securityRequestKey);

        requestParams.setString('digestNum', validationDigest.digestNum);
        requestParams.setString('digestHash', validationDigest.digestHash);
    }
}

module.exports = { SecureMamboRequest };