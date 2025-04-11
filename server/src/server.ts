import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'; 
import { PlayerMovementData, ShootData } from './types/Player';
import { getRandomPositions } from './utils';
import { PlayerDeadEvent } from './types/events/player-events';

interface Player
{
    id: string;
    x: number;
    y: number;
    name: string;

    kills: number;
    deaths: number;
}

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, 
{
    cors: 
    {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const players: { [id: string]: Player } = {};

io.on('connection', (socket: Socket) =>
{
    console.log(`User connected: ${socket.id}`);

    players[socket.id] = 
    {
        id: socket.id,
        name: `Игрок ${socket.id}`,
        kills: 0,
        deaths: 0,
        ...getRandomPositions(),
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMovement', (movementData: PlayerMovementData) => 
    {
        if (players[socket.id]) 
        {
            players[socket.id] =
            {
                ...players[socket.id],
                ...movementData
            };
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('playerShoot', (data: ShootData) => 
    {
        io.emit('playerShoot', 
        {
            ...data,
            id: socket.id
        });
    });

    socket.on('playerReload', () => 
    {
        io.emit('playerReload', socket.id);
    });

    socket.on('playerReloadComplete', () => 
    {
        io.emit('playerReloadComplete', socket.id);
    });

    socket.on('playerDead', (data: PlayerDeadEvent) => 
    {
        players[socket.id].deaths++;
        players[socket.id] = 
        {
            ...players[socket.id],
            ...getRandomPositions(),
        };

        const killerId = data.killerId;
        players[killerId].kills += 1

        io.emit('playerDead', 
        { 
            killerId,
            ...players[socket.id],
            killerName: players[killerId].name,
        });
    });

    socket.on('disconnect', () =>
    {
        console.log(`User disconnected: ${socket.id}`);
        delete players[socket.id];
        socket.broadcast.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
{
    console.log(`Server listening on port ${PORT}`);
});
