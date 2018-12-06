module.exports = function (serveur) {
    const io = require('socket.io').listen(serveur)
    io.sockets.on('connection', function (socket) {

        socket.on('awaitParty', function (data) {
            console.log(data);
            
            //mise en attente
            socket.join('await');

            //quitte la room par defaut
            socket.leave(socket.id);
            
            //check les rooms existante
            console.log(Object.keys(io.sockets.adapter.rooms));
            let roomsName = Object.keys(io.sockets.adapter.rooms);

            //si que la room await
            if (roomsName.length == 1 && roomsName[0] == 'await'){
                //creation
                let partyName = 'party'+roomsName.length;
                socket.join(partyName);
                console.log(partyName+' créer')
                socket.leave('await')
                socket.emit('partyCreated', JSON.stringify({ party: partyName,}));
            } else{
                
                try {
                    
                    roomsName.forEach(element => {
                        if(element == 'await'){
                            console.log('await donc return');
                            return;
                        }else{
                            var room = io.sockets.adapter.rooms[element];
                            console.log('il y a '+room.length+' user dans la room '+element);
                            if(room.length < 2){
                                socket.join(element);
                                console.log('join' + element);
                                socket.leave('await');
                                socket.emit('partyFull', JSON.stringify({ party: element,}));
                                throw BreakException;
                            }
                        }
                    });
                } catch (e) {
                    if (e !== BreakException) throw e;
                }
                //creation
                let partyName = 'party'+roomsName.length;
                socket.join(partyName);
                console.log(partyName+' créer')
                socket.leave('await')
                socket.emit('partyCreated', JSON.stringify({ party: partyName,}));
            }

            
            // si aucune room ou toute les room contenant 2 perso creation
            // et envoi event en attente d'un autre
            
            // sinon rejoint la premiere avec une place
            // et envoi room full 
          
        });
        
    })
}