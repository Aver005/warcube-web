import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'; // Для разрешения кросс-доменных запросов (если клиент на другом порту)
import { PlayerMovementData, ShootData } from './types/Player';

interface Player
{
    id: string;
    x: number;
    y: number;
}

const app = express();
app.use(cors()); // Включаем CORS для разработки, в production настройте более безопасно
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Разрешить запросы с любого домена (для разработки)
        methods: ["GET", "POST"]
    }
});

const players: { [id: string]: Player } = {};

io.on('connection', (socket: Socket) =>
{
    console.log(`User connected: ${socket.id}`);

    // Создаем нового игрока при подключении
    players[socket.id] = {
        id: socket.id,
        x: 400, // Начальная позиция X
        y: 400 // Начальная позиция Y
    };

    // Отправляем информацию о текущих игроках новому игроку
    socket.emit('currentPlayers', players);

    // Сообщаем всем остальным клиентам о новом игроке
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
        socket.broadcast.emit('playerShoot', {
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
