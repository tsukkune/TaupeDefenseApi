const uuid = require('uuid/v4')
const Player = require('./player')

module.exports = class PartyRoom {
    constructor(io) {
        this.id = uuid()
        this.players = []

        this.status = 'await'

        Object.defineProperties(this, {
            io: { value: io, enumerable: false },
        })
    }

    addPlayer(socket) {
        this.players.push(new Player(this, socket))
        this.sendInfos()
    }

    get isFull() {
        return this.players.length >= 4
    }

    sendInfos() {
        this.emit('party', this)
    }

    playerDisconnected(player) {
        if (this.status === 'await') {
            this.players.splice(this.players.indexOf(player), 1)
        }
        this.sendInfos()
    }

    emit(eventName, arg) { 
        this.io.to(this.id).emit(eventName, arg)
    }

}