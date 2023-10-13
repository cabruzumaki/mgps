class MinesServer {
    static TIMEOUT_INTERVAL = 1000;

    constructor(debug = true, timeout = 0) {
        super();
        this.debug = debug;
        this.timeout = timeout;
        this.init();
    }

    get connected() {
        return !this.disposed && (!this.isWeb ? this.socket.connected : true);
    }

    init() {
        this.isWeb = ExternalInterface.available ? ExternalInterface.call("onWeb") : false;
        this.initEvents();
        if (this.timeout) {
            this.timeoutId = setInterval(this.checkTimeout, MinesServer.TIMEOUT_INTERVAL);
        }
    }

    initEvents() {
        if (this.isWeb) {
            ExternalInterface.addCallback("sendEvent", this.receivedFromJavaScript);
        } else {
            this.socket = new Socket();
            this.socket.addEventListener(Event.CLOSE, this.closeHandler);
            this.socket.addEventListener(Event.CONNECT, this.connectHandler);
            this.socket.addEventListener(IOErrorEvent.IO_ERROR, this.failedConnectHandler);
            this.socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.failedConnectHandler);
            this.socket.addEventListener(ProgressEvent.SOCKET_DATA, this.socketDataHandler);
        }
    }

    receivedFromJavaScript(param1) {
        let _loc2;
        this.receivedStamp = getTimer();
        param1 = JSON.parse(param1);
        if (param1.data) {
            _loc2 = new Process(String(param1.data).split(","));
            this.processMessage(_loc2);
        } else {
            this.dispatch(param1.evt, param1.success, param1.errorCode, param1.mo);
        }
    }

    dispatch(param1, param2 = true, param3 = null, param4) {
        dispatchEvent(new MinesEvent(param1, param2, param3, param4));
    }

    closeHandler(param1) {
        this.dispatch(MinesEvent.CONNECTION_LOST);
    }

    connectHandler(param1) {
        this.dispatch(MinesEvent.CONNECT);
    }

    failedConnectHandler(param1) {
        this.dispatch(MinesEvent.CONNECT, false, param1.type);
    }

    socketDataHandler(param1) {
        this.receivedStamp = getTimer();
        while (this.socket && this.socket.bytesAvailable > 0) {
            if (!this.message) {
                let _loc2 = this.socket.readByte();
                if (_loc2 !== Message.HEADER_TYPE) {
                    return;
                }
                this.message = new Message();
            }
            if (this.message.needsPayload()) {
                if (this.socket.bytesAvailable < 4) {
                    return;
                }
                this.message.setPayload(this.socket.readInt());
            }
            this.message.read(this.socket);
            if (this.message.isComplete()) {
                this.processMessage(this.message);
                this.message = null;
            }
        }
    }

    processMessage(param1) {
        let _loc2 = param1.toMobject();
        let _loc3 = _loc2.getString("type");
        let _loc4 = "null";
        switch (_loc4) {
            case "":
            case null:
                break;
            default:
                this.dispatch(_loc4, _loc2.getBoolean("result"), _loc2.getString("errorCode"), _loc2.getMobject("mobject"));
        }
    }

    connect(param1, param2) {
        if (this.isWeb) {
            this.call("connect", {
                "url": param1,
                "port": param2
            });
        } else {
            this.socket.connect(param1, param2);
        }
    }

    logWithId(param1) {
        this.send(param1);
    }

    logout() {
        let _loc1 = new Mobject();
        _loc1.setString("type", "logout");
        this.send(_loc1);
    }

    sendMobject(param1) {
        let _loc2 = new Mobject();
        _loc2.setString("type", "data");
        _loc2.setMobject("mobject", param1);
        this.send(_loc2);
    }

    get waitingForAReply() {
        return this.sentStamp !== 0 && this.sentStamp >= this.receivedStamp;
    }

    send(param1) {
        let _loc2 = new MinesOutputStream();
        _loc2.writeMobject(param1);
        if (this.isWeb) {
            _loc2.writeMobjectBuffer();
            this.call("Mobject", { "data": _loc2.getBuffer() });
        } else {
            this.socket.writeByte(Message.HEADER_TYPE);
            this.socket.writeInt(_loc2.length);
            this.socket.writeBytes(_loc2, 0, _loc2.length);
            this.socket.flush();
        }
        if (!this.waitingForAReply) {
            this.sentStamp = getTimer();
        }
    }

    call(param1, param2) {
        ExternalInterface.call("dispatch", param1, param2 instanceof Object ? JSON.stringify(param2) : param2);
    }

    checkTimeout() {
        if (this.waitingForAReply && getTimer() - this.sentStamp >= this.timeout) {
            this.sentStamp = getTimer();
            this.dispatch(MinesEvent.TIMEOUT);
        }
    }

    get disposed() {
        return this.socket === null;
    }

    clean() {
        if (this.disposed) {
            return;
        }
        if (!this.isWeb) {
            this.socket.removeEventListener(Event.CLOSE, this.closeHandler);
            this.socket.removeEventListener(Event.CONNECT, this.connectHandler);
            this.socket.removeEventListener(IOErrorEvent.IO_ERROR, this.failedConnectHandler);
            this.socket.removeEventListener(ProgressEvent.SOCKET_DATA, this.socketDataHandler);
            if (this.connected) {
                this.socket.close();
            }
        }
        clearInterval(this.timeoutId);
    }

    dispose() {
        this.clean();
        this.socket = null;
        this.message = null;
    }
}