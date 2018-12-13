const SocketEvent = require("./socket-event");
const PartyRoom = require('./partyRoom')

module.exports = function (serveur) {
    const io = require('socket.io').listen(serveur)

    const partyRooms = []
    const partyRoomsById = {}
    let awaitParty = new PartyRoom(io)

    io.sockets.on('connection', function (socket) {

        socket.on(SocketEvent.AwaitParty, function (data) {
            console.log('awaitServer')
            console.log(data)
            if (awaitParty.isFull) {
                awaitParty = new PartyRoom()
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
            console.log(playerParty)
            playerParty.playerReady(socket);
            if (playerParty.isAllReady) {
                console.log('PLAYER ALL READY NIGGA')
                playerParty.setLaunch(socket);
            }

        })
    })
}

/*




            console.log(data);
            //mise en attente
            socket.join('await');
            //quitte la room par defaut
            socket.leave(socket.id);
            //check les rooms existante
            console.log(Object.keys(io.sockets.adapter.rooms));

            check

            let roomsName = Object.keys(io.sockets.adapter.rooms);
            //si que la room await
            if (roomsName.length == 1 && roomsName[0] == 'await'){
                //creation
                let partyName = 'party'+roomsName.length;
                socket.join(partyName);
                console.log(partyName+' créer')
                socket.leave('await')
                socket.emit(SocketEvent.PartyCreated, JSON.stringify({ party: partyName,}));
            } else{
                
                roomsName.forEach(element => {
                    if(element == 'await'){
                        console.log('await donc return');
                        return;
                    }else{
                        let room = io.sockets.adapter.rooms[element];
                        console.log('il y a '+room.length+' user dans la room '+element);
                        if(room.length < 2){
                            socket.join(element);
                            console.log('join' + element);
                            socket.leave('await');
                            socket.emit(SocketEvent.PartyFull, JSON.stringify({ party: element,}));

                        }
                    }
                });
                
                //creation
                console.log(Object.keys(socket.rooms));
                if(Object.keys(socket.rooms).includes('await')){
                    let partyName = 'party'+roomsName.length;
                    socket.join(partyName);
                    console.log(partyName+' créer')
                    socket.leave('await')
                    socket.emit(SocketEvent.PartyCreated, JSON.stringify({ party: partyName,}));
                }
            }
        });

        socket.on(SocketEvent.GameReady, function(data){
            
            let receiveData = JSON.parse(data);
            
            var jsonData = {};
            for(let x=0;x<receiveData.x;x++){
                for(let y=0;y<receiveData.y;y++){
                    jsonData['cell-'+x+'-'+y]={x:x,y:y,status:0}
                }
            }
            console.log(jsonData);
        });
    })
}
*/