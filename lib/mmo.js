const GameData = require("./gameData");
const GameData = require("./urlVerifier");
class MMO {
    static LOGGERS = ["mambo", "gaturro_global"];
    static SOUNDS = ["popup", "popup2", "flecha"];
    static DIM = {
        width: 800,
        height: 480
    };
    static BROWSER_NOT_ALLOWED = "BROWSER_NOT_ALLOWED";
    static pocketId = "";
    static SETTINGS_URI = "cfgs/settings.json";
    static GAMEPLAY_URI = "cfgs/gameplay.json";
    static LOCALE_URI = "cfgs/locale.json";
    static LAST_MODIFIED_NEWS = "news/lastModified.txt";
    static LOADING_CONFIGURATION = 1;
    static DIRECTORY = 2;
    static CONNECTING = 3;
    static LOGIN = 4;
    static LOADING_WORLD_DATA = 5;
    static PLAYING = 6;
    static Cooper = "MMO_Cooper";
    static Commodore = "MMO_Commodore";


    constructor() {
        this.world = null;
        this.worldView = null;
        this.externalLoaderInfo = null;
        this.overlay = new Overlay();
        this.loading = null;
        this.directoryUnavailable = false;
        this.loginFailed = false;
        this.noRestore = false;
        this.state = 0;
        this.gameplay = new Settings();
        this.lastModifiedNews = null;
        this.developAccessToken = "";
        this.accountId = "";
        this.passwd = "";
        this.serverName = "";
        this.tabs = 0;

        var _loc1_ = new urlVerifier();
        if (!_loc1_._i_----_§(this)) {
            return;
        }

        super();
        Security.allowDomain("*");
        Security.allowInsecureDomain("*");
        this.bye();
        this.bye();
        this.addEventListener(Event.ADDED_TO_STAGE, this.added);
    }

    setupToken(mobject) {
        const key = mobject.getString("key");
        GameData.securityRequestKey = key;

        const access_token = mobject.getString("access_token");
        this.developAccessToken = access_token;

        if (MMO.pocketId === "") {
            MMO.pocketId = access_token;
        }

        const account_id = mobject.getString("account_id");
        this.accountId = account_id;
    }
}