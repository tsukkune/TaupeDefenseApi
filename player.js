module.exports = class Player {
    constructor(room, socket) {
        Object.defineProperties(this, {
            socket: { value: socket, enumerable: false },
            partyRoom: { value: room, enumerable: false },
        })

        this.status = 'await'

        this.socket.player = this
        
        socket.join(room.id)

        socket.on('disconnect', this.disconnect.bind(this))
    }

    disconnect() {
        this.status = 'disconnected'
        this.partyRoom.playerDisconnected(this)
    }

    setReady(){
        this.status = 'ready'
    }
}