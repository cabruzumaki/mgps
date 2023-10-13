const MinesServer = require("../mines/minesServer");
const MinesEvent = require("../mines/minesEvent");
class defaultNetworkManager {
    static MINES_EVENTS = [MinesEvent.CONNECT, MinesEvent.LOGIN, MinesEvent.TIMEOUT, MinesEvent.LOGOUT, MinesEvent.CONNECTION_LOST];
    static SHOULD_WAIT_RESPONSE = ["RoomData", "ChangeRoomAction", "LeaveHomeAction"];
    static REQUEST_RESPONSE_MAP = { "LeaveHomeAction": "ChangeRoomAction" };
    static preff;
    static counter = 0;


    constructor(timeout = 0, options = null) {
        this.mines = new MinesServer(false, timeout);
        this.mines.addEventListener(MinesEvent.MESSAGE, this.handleMamboEvent);
        this.timeouts = options || true;
        this.timeoutTimersIds = {};
        this.retries = {};
        this.pending = [];
        this.canceled = [];
        MINES_EVENTS.forEach((event) => {
          this.mines.addEventListener(event, (e) => this.handleMinesEvent(e));
        });
      }
    
      handleMamboEvent(event) {
        const mobject = event.mobject;
        const messageId = mobject.getString("messageId");
        const messageType = mobject.getString("type");
        this.unregisterTimer(messageId);
        const forceProcess = mobject.getBoolean("forceProcess") || false;
    
        if (!forceProcess) {
          if (this.shouldWaitResponse(messageType) && !this.isPending(this.cleanRequestName(messageType) + messageId)) {
            return;
          }
          if (this.wasCanceled(messageId)) {
            return;
          }
        }
    
        this.markAsHandled(this.cleanRequestName(messageType) + messageId);
        this.handleEvent(mobject.getString("type"), mobject, mobject.hasBoolean("success") ? mobject.getBoolean("success") : true, mobject.getString("errorCode") || mobject.getString("errorMessage"));
      }
    
      cancel(mobject) {
        this.canceled.push(mobject.getString("messageId"));
      }
    
      wasCanceled(messageId) {
        return this.canceled.includes(messageId);
      }
    
      shouldWaitResponse(requestType) {
        return SHOULD_WAIT_RESPONSE.includes(this.cleanRequestName(requestType));
      }
    
      isPending(messageId) {
        return this.pending.includes(messageId);
      }
    
      markAsHandled(messageId) {
        this.pending = this.pending.filter((id) => id !== messageId);
      }
    
      handleMinesEvent(event) {
        this.unregisterTimer(event.type);
        this.handleEvent(event.type, event.mobject, event.success, event.errorCode);
      }
    
      handleEvent(eventType, mobject, success, errorCode) {
        dispatchEvent(new NetworkManagerEvent(eventType, mobject, success, errorCode));
      }
    
      connect(serverAddress, port) {
        this.mines.connect(serverAddress, port);
      }
    
      logWithID(mobject) {
        this.registerLoginTimer();
        this.mines.logWithId(mobject);
      }
    
      logout() {
        this.mines.logout();
      }
    
      sendAction(request) {
        const mobject = request.toMobject();
        const messageId = this.generateId();
        mobject.setString("request", request.type);
        mobject.setString("messageId", messageId);
        this.sendMobject(mobject);
        dispatchEvent(new NetworkManagerEvent(NetworkManagerEvent.UNIQUE_ACTION_SENT, mobject));
      }
    
      sendMobject(mobject) {
        const messageId = mobject.getString("messageId");
        const requestType = mobject.getString("request");
        if (this.timeouts.hasOwnProperty(requestType)) {
          this.registerTimer(messageId, requestType, mobject);
        }
        dispatchEvent(new NetworkManagerEvent(NetworkManagerEvent.ACTION_SENT, mobject));
        if (this.shouldWaitResponse(requestType)) {
          this.pending.push(this.responseFor(this.cleanRequestName(requestType)) + messageId);
        }
        this.mines.sendMobject(mobject);
      }
    
      cleanRequestName(requestType) {
        return requestType.replace(/request|response/i, "");
      }
    
      responseFor(requestType) {
        return REQUEST_RESPONSE_MAP.hasOwnProperty(requestType) ? REQUEST_RESPONSE_MAP[requestType] : requestType;
      }
    
      retry(mobject) {
        if (!mobject) {
          return;
        }
        const requestType = mobject.getString("request");
        if (this.shouldWaitResponse(requestType)) {
          this.sendMobject(mobject);
        }
      }
    
      registerLoginTimer() {
        if (MINES_EVENTS.includes(MinesEvent.LOGIN) && this.timeouts.hasOwnProperty(MinesEvent.LOGIN)) {
          this.registerTimer(MinesEvent.LOGIN, MinesEvent.LOGIN);
        }
      }
    
      registerTimer(messageId, requestType, mobject = null) {
        this.timeoutTimersIds[messageId] = setTimeout(() => this.requestTimeout(messageId, requestType, mobject), this.timeouts[requestType].timeout * 1000);
        if (!(messageId in this.retries)) {
          this.retries[messageId] = this.timeouts[requestType].retries || false;
        }
      }
    
      unregisterTimer(messageId) {
        if (this.timeoutTimersIds.hasOwnProperty(messageId)) {
          clearTimeout(this.timeoutTimersIds[messageId]);
          delete this.timeoutTimersIds[messageId];
          return true;
        }
        return false;
      }
    
      requestTimeout(messageId, requestType, mobject) {
        this.unregisterTimer(messageId);
        if (this.retries[messageId]) {
          this.retries[messageId]--;
          this.retry(mobject);
        } else {
          delete this.retries[messageId];
          this.cancel(mobject);
          dispatchEvent(new RequestTimeoutEvent(RequestTimeoutEvent.TIMEOUT, requestType, mobject));
        }
      }
    
      generateId() {
        preff = preff || new Date().getTime() + "_";
        return preff + counter++;
      }
    
      dispose() {
        this.mines.removeEventListener(MinesEvent.MESSAGE, this.handleMamboEvent);
        MINES_EVENTS.forEach((event) => {
          this.mines.removeEventListener(event, (e) => this.handleMinesEvent(e));
        });
        this.mines.dispose();
        this.mines = null;
      }
}