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

            let name = 'undefined';
            Users.findById(data).then((user)=> {
                if (awaitParty.isFull) {
                    awaitParty = new PartyRoom(io)
                    partyRooms.push(awaitParty)
                    partyRoomsById[awaitParty.id] = awaitParty
                }

                awaitParty.addPlayer(socket, user.email)
            })
        })
    })
}