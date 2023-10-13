class MinesEvent {
    static CONNECT = "MinesConnect";
    static CONNECTION_LOST = "MinesLost";
    static LOGIN = "MinesLogin";
    static LOGOUT = "MinesLogout";
    static MESSAGE = "MinesMessage";
    static TIMEOUT = "MinesTimeout";

    constructor(type, success, errorCode = null, mobject = null) {
        super(type);
        this._success = success;
        this._errorCode = errorCode;
        this._mobject = mobject;
    }

    get mobject() {
        return this._mobject;
    }

    get success() {
        return this._success;
    }

    get errorCode() {
        return this._errorCode;
    }
}