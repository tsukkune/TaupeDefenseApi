const SocketEvent = require("./socket-event");
module.exports = class Player {
    constructor(room, socket, name) {
        Object.defineProperties(this, {
            socket: { value: socket, enumerable: false },
            partyRoom: { value: room, enumerable: false },
        })

        this.status = 'await'
        this.name = name

        this.socket.player = this

        socket.join(room.id)

        this.handleEvents()
    }

    handleEvents() {
        this.socket.on('disconnect', this.onDisconnect.bind(this))
        this.socket.on(SocketEvent.PlayerReady, this.onReady.bind(this))
    }

    onReady() {
        this.status = 'ready'
        this.partyRoom.transition()
    }

    onDisconnect() {
        this.status = 'disconnected'
        this.partyRoom.playerDisconnected(this)
    }
}