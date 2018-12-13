const SocketEvent = require("./socket-event");
const PartyRoom = require('./partyRoom')

module.exports = function (serveur) {
    const io = require('socket.io').listen(serveur)

    const partyRooms = []
    const partyRoomsById = {}
    let awaitParty = new PartyRoom(io)
    partyRooms.push(awaitParty)
    partyRoomsById[awaitParty.id] = awaitParty

    io.sockets.on('connection', function (socket) {

        socket.on(SocketEvent.AwaitParty, function (data) {
            console.log(data);
            if (awaitParty.isFull) {
                awaitParty = new PartyRoom(io)
                partyRooms.push(awaitParty)
                partyRoomsById[awaitParty.id] = awaitParty
            }

            awaitParty.addPlayer(socket)
        })

        socket.on(SocketEvent.NextWave, function (data) {
            playerParty = partyRoomsById[data.id];
            playerParty.changeWave();
        })

        socket.on(SocketEvent.Hit, function (data) {
            playerParty = partyRoomsById[data.id];
            cell = data.cell;
            playerParty.grid.checkCell(cell);
            playerParty.sendInfos()
        })
    })
}