const { ServerData } = require('./serverData.js');
class GaturroServerData extends ServerData {
    constructor() {
        super();
        this._resellPriceRatio = 0;
        this._maxPremiumItems = 0;
        this._minigameData = {};
        this._localTime = 0;
    }

    buildFromMobject(param1) {
        super.buildFromMobject(param1);

        const gamedata = param1.getMobject('gamedata');
        if (gamedata) {
            const props = gamedata.getStringArray('props');
            this._minigameData = this.parseGameData(props);
        }

        param1 = param1.getMobject('extraData');
        this._resellPriceRatio = settings.price.resellPriceRatio || 0.5;
        this._maxPremiumItems = param1.getInteger('maxPremiumItems');
        this.time = super.time;
    }

    parseGameData(param1) {
        const minigameData = {};
        for (const item of param1) {
            const [name, valueStr] = item.split('|');
            const values = valueStr.split(';');
            const parsedData = {};
            for (const value of values) {
                if (!value) {
                    break;
                }
                const [key, val] = value.split('=');
                if (key && val) {
                    parsedData[key] = val;
                } else {
                    break;
                }
            }
            minigameData[name] = parsedData;
        }
        return minigameData;
    }

    get resellPriceRatio() {
        return this._resellPriceRatio;
    }

    get maxPremiumItems() {
        return this._maxPremiumItems;
    }

    get minigameData() {
        return this._minigameData;
    }

    get serverName() {
        return settings.connection.serverName;
    }

    get time() {
        return this._localTime + performance.now();
    }

    set time(value) {
        this._localTime = value;
    }

    get serverTimeReady() {
        return !isNaN(this._localTime);
    }

    get timeStamp() {
        return this._localTime;
    }
}