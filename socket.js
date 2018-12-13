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
            if (awaitParty.isFull) {
                awaitParty = new PartyRoom(io)
                partyRooms.push(awaitParty)
                partyRoomsById[awaitParty.id] = awaitParty

                console.log('players dans la partie :')
            }

            awaitParty.addPlayer(socket)
            console.log(partyRooms)
        })

        socket.on(SocketEvent.PlayerReady, function (data) {
            console.log('playerReady')
            playerParty = partyRoomsById[data.id];
            playerParty.playerReady(socket);
            if (playerParty.isAllReady) {
                console.log('PLAYER ALL READY NIGGA')
                playerParty.setLaunch(socket);
            }
        })
    })
}