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
    socket.emit('uuid', crypto.randomBytes(16).toString('hex'));

    socket.on('join', (player) => {
        console.log(openRooms);
        if (!player) return;
        console.log(`${player.uuid} : ${player.username} is starting a game`);
        let room: string = '';
        let start = false;
        if (openRooms.length > 0) {
            room = openRooms.shift()!;
            start = true;
        } else {
            room = crypto.randomBytes(16).toString('hex');
            openRooms.push(room);
            rooms[room] = {
                roomId: room,
                players: {}
            };
        }

        rooms[room].players[player.uuid] = {
            player: player,
        };
        socket.join(room);
        socket.emit('joinedRoom', room);
        if (start) {
            console.log('starting game');
            const players = [];
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
            console.log(rooms[room].players);
            for (let player in rooms[room].players) {
                if (!rooms[room].players[player].currentGuess) {
                    allGuessed = false;
                }
            }
            if (allGuessed) {
                console.log('Sending Guesses');
                io.to(room).emit('finalGuesses', rooms[room].players);
                for (let player in rooms[room].players) {
                    rooms[room].players[player].currentGuess = undefined

                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`${player.uuid} disconnected`);


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



server.listen(3001, () => {
    console.log('Listening on port 3001')
});




