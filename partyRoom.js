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
        this.players.push(new Player(this, socket))
        this.sendInfos()
    }

    get isFull() {
        return this.players.length >= 4
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

    sendInfos() {
        this.emit(SocketEvent.Party, this)
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

    playerReady(socket) {
        this.players.forEach(element => {
            if(element.socket == socket){
                console.log("joueur passe a ready")
                let index = this.players.indexOf(element);
                this.players[index].setReady();
            }
        });
        this.sendInfos();
    }

    setLaunch() {
        this.status = 'launch'
        this.wave++;
        this.grid = new Grid(this.wave);
        this.sendInfos();
    }

}