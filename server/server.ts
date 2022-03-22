import express from 'express';
import http from 'http';
import cors from 'cors';
import crypto from 'node:crypto';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

interface Player {
    username: string;
    uuid: string;
}

interface Room {
    roomId: string,
    isPrivate: boolean, 
    players: {
        [key: string]: {
            player: Player,
            currentGuess?: string;
        }
    }
}

const openRooms: string[] = [];
const rooms: { [key: string]: Room } = {};


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('init');
    socket.on('getUUID', () => {
        socket.emit('uuid', crypto.randomBytes(4).toString('hex'));
    });

    socket.on('join', ({ player, roomCode }: {player: Player, roomCode?: string}) => {
        console.log(openRooms);
        if (!player) return;
        console.log(`${player.uuid} : ${player.username} is attempting to join a game`);

        let room: string = '';
        let start = false;

        
        if (roomCode) { // The user is attempting to join a private room
            console.log("Creating custom room: " + roomCode)
            if (rooms[roomCode]) { // check if the room has been created yet
                let players = rooms[roomCode].players;
                let numPlayers = Object.keys(players).length;

                if (!rooms[roomCode].isPrivate) {
                    socket.emit('roomerror', 'Invalid Room Code');
                    return;
                }

                if (numPlayers >= 2) {
                    socket.emit('roomerror', 'Room is full!');
                    return;
                }
                

                if (numPlayers === 1) {
                    room = roomCode;
                    start = true;
                    
                } else {
                    room = roomCode;
                }

            } else {
                rooms[roomCode] = {
                    roomId: roomCode,
                    isPrivate: true,
                    players: {}
                };
                room = roomCode;
                console.log("Created Room");
            }
        } else {
            if (openRooms.length > 0) {
                room = openRooms.shift()!;
                start = true;
            } else {
                room = crypto.randomBytes(4).toString('hex');
                openRooms.push(room);
                rooms[room] = {
                    roomId: room,
                    isPrivate: false,
                    players: {}
                };
            }
        }

        rooms[room].players[player.uuid] = {
            player: player,
        };

        socket.join(room);
        socket.emit('joinedRoom', room);
        if (start) {
            console.log('starting game');
            const players: Player[] = [];
            for (const player in rooms[room].players) {
                players.push(rooms[room].players[player].player);
            }
            io.to(room).emit('start', players);
        }

        socket.on('guess', (guess) => {
            if (rooms[room].players[player.uuid].currentGuess) {
                socket.emit('error', 'already guessed');
                return;
            }
            rooms[room].players[player.uuid].currentGuess = guess;
            let allGuessed = true;
            for (let player in rooms[room].players) {
                if (!rooms[room].players[player].currentGuess) {
                    allGuessed = false;
                }
            }
            if (allGuessed) {
                io.to(room).emit('finalGuesses', rooms[room].players);
                for (let player in rooms[room].players) {
                    rooms[room].players[player].currentGuess = undefined

                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`${player.uuid} disconnected`);

            if (!rooms[room]) return;


            if (rooms[room].isPrivate) {
                delete rooms[room].players[player.uuid];
                if (Object.keys(rooms[room].players).length === 0) {
                    delete rooms[room];
                } else {
                    io.to(room).emit('playerDisconnect');
                }
                return; 
            }
            const idx = openRooms.indexOf(room);
            if (idx > -1) {
                openRooms.splice(idx);
                delete rooms[room];
                return;
            }
            io.to(room).emit('playerDisconnect')
            openRooms.push(room);
            delete rooms[room].players[player.uuid];
        });
    });
});

app.get('/genRoomCode', (req, res) => {
    const roomCode = crypto.randomBytes(4).toString('hex');

    res.send({
        roomCode: roomCode
    })
})


server.listen(3001, () => {
    console.log('Listening on port 3001')
});




