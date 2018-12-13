const uuid = require('uuid/v4')
const Player = require('./player')
const Grid = require('./grid')
const SocketEvent = require("./socket-event");

module.exports = class PartyRoom {
    constructor(io) {
        this.id = uuid();
        this.players = [];
        this.wave = 0;
        this.grid = {};

        this.status = 'await'

        Object.defineProperties(this, {
            io: { value: io, enumerable: false },
        })
    }

    addPlayer(socket) {
        console.log('addPlayer')
        this.players.push(new Player(this, socket))
        this.sendInfos(socket)
    }

    get isFull() {
        return this.players.length >= 1
    }

    get isAllReady() {
        let partyReady = true;
        this.players.forEach(element => {
            if (element.status != 'ready') {
                partyReady = false;
            }
        });
        return partyReady;
    }

    sendInfos(socket) {
        socket.emit(SocketEvent.Party, this)
    }

    playerDisconnected(player) {
        if (this.status === 'await') {
            this.players.splice(this.players.indexOf(player), 1)
        }
        this.sendInfos(socket)
    }

    emit(eventName, arg) {
        this.io.to(this.id).emit(eventName, arg)
    }

    playerReady(socket) {
        console.log('dans playerReady')
        console.log(this.players)
        this.players.forEach(element => {
            let index = this.players.indexOf(element);
            this.players[index].setReady();
            this.sendInfos(socket);
        });
    }

    setLaunch(socket) {
        this.status = 'launch'
        this.wave++;
        this.grid = new Grid(this.wave);
        this.sendInfos(socket);
    }

}