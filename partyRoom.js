const uuid = require('uuid/v4')
const Player = require('./player')
const Grid = require('./grid')
const SocketEvent = require("./socket-event");
const waveParameter = require("./wave-parameter")

module.exports = class PartyRoom {
    constructor(io) {
        this.id = uuid();
        this.players = [];
        this.wave = 0;
        this.grid = {};

        this.status = 'await'

        Object.defineProperties(this, {
            io: { value: io, enumerable: false },
            tickStep: { value: 0, enumerable: false, writable: true },
        })

        this.tick = this.tick.bind(this)
    }

    addPlayer(socket, name) {
        const player = new Player(this, socket, name)
        this.players.push(player)
        this.sendInfos()
        this.handlePlayerEvents(player)
    }

    handlePlayerEvents(player) {
        player.socket.on(SocketEvent.Hit, (x, y) => this.onHit(player, x, y))
    }

    get isFull() {
        return (this.players.length >= 4 || this.status != 'await')
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

    emit(eventName, arg, broadcast) {
        if (broadcast) {
            this.io.to(this.id).broadcast(eventName, arg)
        } else {
            this.io.to(this.id).emit(eventName, arg)
        }
    }

    transition() {
        switch (this.status) {
            case 'await':
                if (this.isAllReady) {
                    this.launch()
                }
                break;
        }
    }

    playerReady(socket) {
        this.players.forEach(element => {
            if (element.socket == socket) {
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

    generateWave() {
        this.grid = new Grid(this.wave);
        this.sendInfos();
    }

    tick() {
        if(!(this.tickStep % 5)) { // every 5 ticks
            if(this.grid.isDone) {
                this.wave++
                this.generateWave()
            }
            this.grid.nextRound()
            this.sendGrid()
        }

        this.sendHammers()

        this.tickStep++
        if(this.tickStep > 100) this.tickStep = 0
        setTimeout(this.tick, 100)
    }

    sendGrid() {
        this.emit(SocketEvent.Grid, this)
    }

    sendHammers() {
        this.emit('hammers', this.players.map(p => p.hammer))
    }

    onHit(player, x, y) {
        if (this.grid.hitCell(x, y)) {
            player.hammer.s = 1
            setTimeout(() => player.hammer.s = 0, 500)

            player.score += 10
            this.emit('TaupeHit', { x, y, score: 10 })
        }
    }


}