import io, { Socket } from "socket.io-client";
import { InputManager } from "./input-manager";
import { InputData, PlayerData, PlayerMovementData, PlayerShootEvent } from "./types/Player";
import { useGameStore } from "./stores/game-store";
import { useMapDataStore } from "./stores/map-data-store";
import { Bullet } from "./entities/Bullet";
import { PlayerDeadEvent } from "./types/events/player-events";
import { useNetworkStore } from "./stores/network-store";
import { InitEvent } from "./types/events/server-events";
import { Item, ItemOnGround } from "./types/items";
import { Player } from "./entities/Player";
import { GroundItem } from "./entities/GroundItem";

///@ts-ignore
const SERVER_IP = import.meta.env.VITE_SERVER_IP;

class MainScene extends Phaser.Scene
{
    socket!: Socket;
    player: Player | null = null;

    private inputManager!: InputManager;
    private camera!: Phaser.Cameras.Scene2D.Camera;

    bullets!: Phaser.GameObjects.Group;
    players!: Phaser.GameObjects.Group;
    itemsOnGround!: Phaser.GameObjects.Group;


    constructor()
    {
        super({ key: 'GameScene' });
    }

    preload()
    {
        this.load.image('player', './player.png');
        this.load.image('item', './item.png');
    }

    create()
    {
        this.inputManager = new InputManager(this);
        useNetworkStore.getState().setScene(this);
        this.connect();
    }

    connect(forceIP?: string)
    {
        const IP = forceIP || SERVER_IP;
        this.socket = io(IP);

        this.bullets = this.add.group();
        this.players = this.add.group();
        this.itemsOnGround = this.add.group();

        this.physics.add.overlap(
            this.bullets,
            this.players,
            (bullet, player) => 
            {
                if (!(bullet instanceof Bullet)) return;
                if (!(player instanceof Player)) return;
                if (bullet.getOwnerId() === player.id) return;
                player.onCollideWithBullet(bullet);
            }
        );

        this.physics.add.overlap(
            this.itemsOnGround,
            this.players,
            (item, player) => 
            {
                if (!(item instanceof GroundItem)) return;
                if (!(player instanceof Player)) return;
                player.onCollideWithItem(item);
            }
        );

        this.listeners();
    }

    disconnect()
    {
        if (this.socket) this.socket.disconnect();
        this.clenup();
    }

    clenup()
    {
        this.bullets.destroy(true, true);
        this.players.destroy(true, true);
        this.itemsOnGround.destroy(true, true);
    }

    listeners()
    {
        this.socket.on('connect', () => useNetworkStore.getState().setSocket(this.socket));
        this.socket.on('init', (data: InitEvent) =>
        {
            data.itemsOnGround.map((item) => this.spawnItem(item));
            Object.entries(data.players).forEach(([id, playerData]) =>
            {
                if (!this.socket || this.socket === null) return;
                const newPlayer = this.addPlayer(playerData);
                if (id !== this.socket.id) return;
                this.player = newPlayer;
                this.setupCamera();
            });
        });

        this.socket.on('newPlayer', (playerData: PlayerData) =>
        {
            this.addPlayer(playerData);
        });

        this.socket.on('playerDisconnected', (playerId: string) =>
        {
            this.players.children.entries.map((player) =>
            {
                if (!(player instanceof Player)) return;
                if (player.id !== playerId) return
                player.destroy();
            });
        });

        this.socket.on('playerMoved', (data: PlayerMovementData) => 
        {
            const players = this.players.getMatching('id', data.id);
            if (players.length === 0) return
            const player = players[0] as Player;
            player.setPosition(data.x, data.y);
            player.rotation = data.rotation;
        });

        this.socket.on('playerShoot', (data: PlayerShootEvent) => 
        {
            const bullet = new Bullet(this, data.id, data.x, data.y, data.rotation);
            this.bullets.add(bullet);
        });

        this.socket.on('playerReload', (playerId: string) => 
        {
            const players = this.players.getMatching('id', playerId);
            if (players.length === 0) return
            const player = players[0] as Player;
            player.setReloadTextVisible(true);
        });

        this.socket.on('playerReloadComplete', (playerId: string) => 
        {
            const players = this.players.getMatching('id', playerId);
            if (players.length === 0) return
            const player = players[0] as Player;
            player.setReloadTextVisible(false);
        });

        this.socket.on('playerDead', (data: PlayerDeadEvent) => 
        {
            const state = useGameStore.getState();
            useMapDataStore.getState().newAction(
                `${data.name} was killed by ${data.killerName}`
            );

            if (data.killerId === this.socket.id)
            {
                state.setKills(state.kills + 1);
                return
            }

            if (!this.player) return;
            this.player.respawn(data.x, data.y);
            state.setDeaths(state.deaths + 1);
        });

        this.socket.on('playerPickupItem', (itemId: number) => 
        {
            const items = this.itemsOnGround.getMatching('id', itemId);
            if (items.length === 0) return
            const item = items[0] as Player;
            item.destroy();
        });

        this.socket.on('disconnect', () => this.clenup());
    }

    setupCamera()
    {
        if (!this.player) return
        // Настройка камеры
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 4000, 4000); // Границы камеры = размер карты
        this.camera.startFollow(this.player); // Камера следует за игроком
        
        // Дополнительные настройки камеры (опционально)
        this.camera.setZoom(1); // Увеличение
        this.camera.setDeadzone(100, 100); // Зона, при выходе за которую камера начинает двигаться
        this.camera.setLerp(0.1, 0.1); // Плавность движения камеры
        this.camera.followOffset.set(0, -50); // Смещение камеры относительно игрока
    }

    addPlayer(playerData: PlayerData) 
    {
        const newPlayer = new Player(this, playerData.id, 'player', playerData.x, playerData.y);
        this.players.add(newPlayer)
        return newPlayer;
    }

    spawnItem(item: Item)
    {
        this.itemsOnGround.add(
            new GroundItem(this, item.id, item.position.x, item.position.y, 'item')
        );
    }

    getInput(): InputData { return this.inputManager.getInputs(); }
}

export default MainScene