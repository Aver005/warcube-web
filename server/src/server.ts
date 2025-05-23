import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { PlayerMovementData, ShootData } from './types/Player';
import { getRandomInt, getRandomPositions } from './utils';
import { PlayerDeadEvent } from './types/events/player-events';
import { AnyItem, Item } from './types/items';
import { createItemInstance, ItemDatabase } from './ItemDatabase';

interface Player
{
    id: string;
    x: number;
    y: number;
    name: string;

    kills: number;
    deaths: number;
}

interface Position
{
    x: number;
    y: number;
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

const players: Map<string, Player> = new Map<string, Player>();
const itemsOnGround = new Array<AnyItem>();

const spawnGroundItems = (minItems: number, maxItems: number, mapWidth: number, mapHeight: number) =>
{
    const itemCount = getRandomInt(minItems, maxItems);
    const keys = Object.keys(ItemDatabase);

    for (let i = 0; i < itemCount; i++)
    {
        const randomPosition = 
        {
            x: getRandomInt(0, mapWidth),
            y: getRandomInt(0, mapHeight),
            rotation: getRandomInt(0, 360)
        };

        const randomItem = createItemInstance(
            keys[getRandomInt(0, keys.length - 1)], 
            randomPosition
        );

        if (!randomItem) return;
        itemsOnGround.push(randomItem);
    }
};

spawnGroundItems(64, 128, 4000, 4000)

io.on('connection', (socket: Socket) =>
{
    console.log(`User connected: ${socket.id}`);

    players.set(socket.id,
    {
        id: socket.id,
        name: `Игрок ${socket.id}`,
        kills: 0,
        deaths: 0,
        ...getRandomPositions(),
    });

    socket.emit('init', { players: Object.fromEntries(players), itemsOnGround });
    socket.broadcast.emit('newPlayer', players.get(socket.id));

    socket.on('playerMovement', (movementData: PlayerMovementData) => 
    {
        const player = players.get(socket.id);
        if (!player) return
        players.set(socket.id, { ...player, ...movementData });
        socket.broadcast.emit('playerMoved', players.get(socket.id));
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
        const player = players.get(socket.id);
        if (!player) return

        const { deaths } = player;
        players.set(socket.id, { ...player, deaths: deaths + 1, ...getRandomPositions() });

        const killerId = data.killerId;
        const killer = players.get(killerId);
        if (!killer) return
        players.set(killerId, { ...killer, kills: killer.kills + 1 });

        io.emit('playerDead',
        {
            killerId,
            ...players.get(socket.id),
            killerName: killer.name,
        });
    });

    socket.on('playerRename', (newName, callback) => 
    {
        if (!newName.trim())
        {
            callback({ success: false, message: 'Имя не может быть пустым' });
            return;
        }

        players.forEach((player) => 
        {
            if (player.name === newName)
            {
                callback({ success: false, message: 'Имя занято' });
                return;
            }
        });

        const player = players.get(socket.id);
        if (!player)
        {
            callback({ success: false, message: 'Игрок не найден' });
            return

        }
        players.set(socket.id, { ...player, name: newName });
        callback({ success: true })
    })

    socket.on('playerPickupItem', (itemId: number) => 
    {
        const player = players.get(socket.id);
        if (!player) return

        const item = itemsOnGround.find((item) => item.id === itemId);
        if (!item) return

        itemsOnGround.splice(itemsOnGround.indexOf(item), 1);
        io.emit('playerPickupItem', itemId);
    });

    socket.on('disconnect', () =>
    {
        console.log(`User disconnected: ${socket.id}`);
        players.delete(socket.id);
        socket.broadcast.emit('playerDisconnected', socket.id);
    });
});

const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port='));
const PORT = portArg ? parseInt(portArg.split('=')[1]) : process.env.PORT || 3000;

server.listen(PORT, () =>
{
    console.log(`Server listening on port ${PORT}`);
});
