const SocketEvent = require("./socket-event");
const PartyRoom = require('./partyRoom')

require('./models/Users.js');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');


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

            let name = 'undefined';
            Users.findById(data).then((user)=>{
                name=user.email
            }).then(()=>{
                awaitParty.addPlayer(socket, name)
            })
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