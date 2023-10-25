const MinesEvent = require('../mines/minesEvent.js');

class NetworkManagerEvent extends Event {
    static CONNECT = MinesEvent.CONNECT;
    static CONNECTION_LOST = MinesEvent.CONNECTION_LOST;
    static LOGIN = MinesEvent.LOGIN;
    static LOGOUT = MinesEvent.LOGOUT;
    static TIMEOUT = MinesEvent.TIMEOUT;
    static UNIQUE_ACTION_SENT = "UniqueActionSent";
    static ACTION_SENT = "ActionSent";
    static CHANGE_ROOM = "ChangeRoomActionResponse";
    static ROOM_DATA = "RoomDataResponse";
    static SCENE_OBJECTS_DATA = "SceneObjectsListDataResponse";
    static OBJECT_JOINS = "ObjectJoinsRoom";
    static OBJECT_LEFT = "ObjectLeavesRoom";
    static AVATAR_DATA = "AvatarDataResponse";
    static AVATARS_WHO_ADDED_ME_DATA = "AvatarsWhoAddedMeDataResponse";
    static AVATAR_JOINS = "AvatarJoinsRoom";
    static AVATAR_LEFT = "AvatarLeftRoom";
    static AVATAR_MOVE = "MoveActionResponse";
    static INVENTORY_DATA = "InventoryDataResponse";
    static ADDED_TO_INVENTORY = "AddedToInventory";
    static REMOVED_FROM_INVENTORY = "RemovedFromInventory";
    static DROP_OBJECT = "DropObjectActionRequest";
    static GRAB_OBJECT = "GrabObjectActionRequest";
    static DESTROY_OBJECT = "DestroyObjectActionResponse";
    static CUSTOM_ATTRIBUTES_CHANGED = "CustomAttributesChanged";
    static MESSAGE_RECEIVED = "MessageReceived";
    static WHITE_LIST_DATA = "WhiteListDataResponse";
    static MAIL_RECEIVED = "MailReceived";
    static MAIL_DELETED = "DeleteMailActionResponse";
    static MAIL_READ = "MarkMailAsReadActionResponse";
    static MAIL_DATA = "MailsDataResponse";
    static MAIL_SENT = "MailMessageActionResponse";
    static SERVER_DATA = "ServerDataResponse";
    static SERVER_MESSAGE = "ServerMessage";
    static WORLD_DATA_CHANGED = "WorldDataChanged";
    static QUEUE_CREATED = "JoinQueueActionResponse";
    static USER_ADDED_TO_QUEUE = "UserJoinsToQueue";
    static USER_REMOVED_FROM_QUEUE = "UserLeavesFromQueue";
    static QUEUE_READY = "GameLaunched";
    static QUEUE_FAILED = "GameLaunchFailed";
    static BUDDY_ADDED = "AddBuddyActionResponse";
    static BUDDY_REMOVED = "RemoveBuddyActionResponse";
    static BUDDY_BLOCKED = "BlockBuddyActionResponse";
    static BUDDY_UNBLOCKED = "UnblockBuddyActionResponse";
    static BUDDY_STATUS_CHANGED = "BuddyStatusChanged";
    static PLAYER_WARNED = "WarnPlayer";
    static PLAYER_SUSPENDED = "SuspendPlayer";


    constructor(type, mobject, success = true, errorCode = "") {
        super(type, false, true);
        this._mobject = mobject;
        this._success = success;
        this._errorCode = errorCode;
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

    clone() {
        return new NetworkManagerEvent(this.type, this.mobject, this.success, this.errorCode);
    }
}