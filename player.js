const SocketEvent = require("./socket-event");
module.exports = class Player {
    constructor(room, socket, name) {
        Object.defineProperties(this, {
            socket: { value: socket, enumerable: false },
            partyRoom: { value: room, enumerable: false },
            hammer: { value: { x: 0, y: 0, s: 0 }, enumerable: false }
        })

        this.status = 'await'
        this.name = name
        this.score = 0


        this.socket.player = this

        socket.join(room.id)

        this.handleEvents()
    }

    handleEvents() {
        this.socket.on('disconnect', this.onDisconnect.bind(this))
        this.socket.on(SocketEvent.PlayerReady, this.onReady.bind(this))
        this.socket.on('mouse', this.onMouse.bind(this))
    }

    onReady() {
        this.status = 'ready'
        this.partyRoom.transition()
    }

    onDisconnect() {
        this.status = 'disconnected'
        this.partyRoom.playerDisconnected(this)
    }

    onMouse(x, y){
        this.x = x;
        this.y = y;
    }
}