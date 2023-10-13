class ServerData {
    constructor() {
        this._time = 0;
        this._version = '';
        this._extensionVersion = '';
    }

    buildFromMobject(param1) {
        this._time = parseFloat(param1.getString('time')) - performance.now();
        this._version = param1.getString('version');
        this._extensionVersion = param1.getString('extensionVersion');
    }

    get time() {
        return this._time + performance.now();
    }

    get date() {
        return new Date(this.time);
    }

    get version() {
        return this._version;
    }

    get extensionVersion() {
        return this._extensionVersion;
    }
}
module.exports = { ServerData }