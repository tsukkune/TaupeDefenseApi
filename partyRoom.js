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

        this.tick = this.tick.bind(this)
    }

    addPlayer(socket, name) {
        this.players.push(new Player(this, socket, name))
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

    transition() {
        switch(this.status) {
            case 'await': 
                if(this.isAllReady) {
                    this.launch()
                }
                break;
        }
    }

    playerReady(socket) {
        this.players.forEach(element => {
            if(element.socket == socket){
                let index = this.players.indexOf(element);
                this.players[index].setReady();
            }
        });
        this.sendInfos();
    }

    launch() {
        this.status = 'launch'
        this.generateWave()
        this.tick()
    }

    generateWave(){
        this.grid = new Grid(this.wave);
        this.sendInfos();
    }

    tick() {
        if(this.grid.isDone) {
            this.wave++
            this.generateWave()
        }
        this.grid.nextRound()
        this.sendGrid()
        setTimeout(this.tick, 500)
    }

    sendGrid() {
        this.emit(SocketEvent.Grid, this)
    }

}