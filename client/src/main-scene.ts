import io, { Socket } from "socket.io-client";
import { InputManager } from "./input-manager";
import { InputData, PlayerData, PlayerMovementData, PlayerShootEvent } from "./types/Player";
import { useGameStore } from "./stores/game-store";
import { useMapDataStore } from "./stores/map-data-store";
import { Bullet } from "./entities/Bullet";
import { PlayerDeadEvent } from "./types/events/player-events";
import { useNetworkStore } from "./stores/network-store";
import { InitEvent } from "./types/events/server-events";
import { Item } from "./types/items";
import { Player } from "./entities/Player";
import { GroundItem } from "./entities/GroundItem";
import { ObjectMap } from "./utils/object-map";
import { ItemDatabase } from "./entities/ItemDatabase";

///@ts-ignore
const SERVER_IP = import.meta.env.VITE_SERVER_IP;

class MainScene extends Phaser.Scene
{
    socket!: Socket;
    player: Player | null = null;

    private inputManager!: InputManager;
    private camera!: Phaser.Cameras.Scene2D.Camera;

    bullets!: ObjectMap<Bullet>;
    players!: ObjectMap<Player>;
    itemsOnGround!: ObjectMap<GroundItem>;


    constructor()
    {
        super({ key: 'GameScene' });
    }

    preload()
    {
        this.load.image('player', './player.png');
        this.load.image('item', './item.png');
        Object.entries(ItemDatabase).forEach(([key, item]) => 
            this.load.image(item.icon, `./icons/items/${item.icon.replace(':', '_')}.svg`)
        );
    }

    create()
    {
        this.inputManager = new InputManager(this);
        useNetworkStore.getState().setScene(this);
        this.connect();

        // console.log(JSON.stringify(ItemDatabase))
    }

    connect(forceIP?: string)
    {
        const IP = forceIP || SERVER_IP;
        this.socket = io(IP);

        this.bullets = new ObjectMap<Bullet>(this);
        this.players = new ObjectMap<Player>(this);
        this.itemsOnGround = new ObjectMap<GroundItem>(this);

        this.physics.add.overlap(
            this.bullets.getGroup(),
            this.players.getGroup(),
            (bullet, player) => 
            {
                if (!(bullet instanceof Bullet)) return;
                if (!(player instanceof Player)) return;
                if (bullet.getOwnerId() === player.id) return;
                player.onCollideWithBullet(bullet);
            }
        );

        this.physics.add.overlap(
            this.itemsOnGround.getGroup(),
            this.players.getGroup(),
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
        if (this.socket)
        {
            this.socket.disconnect();
            this.socket.close();
        }
        
        this.clenup();
    }

    clenup()
    {
        this.bullets.destroy();
        this.players.destroy();
        this.itemsOnGround.destroy();
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
            this.players.map((player) =>
            {
                if (!(player instanceof Player)) return;
                if (player.id !== playerId) return
                player.destroy();
            });
        });

        this.socket.on('playerMoved', (data: PlayerMovementData) => 
        {
            const player = this.players.get(data.id);
            if (!player) return
            player.setPosition(data.x, data.y);
            player.rotation = data.rotation;
        });

        this.socket.on('playerShoot', (data: PlayerShootEvent) => 
        {
            const bullet = new Bullet(this, data.id, data.x, data.y, data.rotation);
            this.bullets.add(data.id, bullet);
        });

        this.socket.on('playerReload', (playerId: string) => 
        {
            const player = this.players.get(playerId);
            if (!player) return
            player.setReloadTextVisible(true);
        });

        this.socket.on('playerReloadComplete', (playerId: string) => 
        {
            const player = this.players.get(playerId);
            if (!player) return
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
            const item = this.itemsOnGround.get(itemId);
            if (!item) return
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
        this.players.add(playerData.id, newPlayer)
        return newPlayer;
    }

    spawnItem(item: Item)
    {
        this.itemsOnGround.add(
            item.id,
            new GroundItem(this, item)
        );
    }

    getInput(): InputData { return this.inputManager.getInputs(); }
}

export default MainScene