import io, { Socket } from "socket.io-client";
import { InputManager } from "./input-manager";
import { Player, PlayerData, PlayerMovementData, Players, PlayerShootEvent } from "./types/Player";
import { PlayerController } from "./player-controller";
import { useGameStore } from "./stores/game-store";
import { useMapDataStore } from "./stores/map-data-store";
import { Bullet } from "./entities/Bullet";
import { PlayerDeadEvent } from "./types/events/player-events";
import { useNetworkStore } from "./stores/network-store";
import { InitEvent } from "./types/events/server-events";
import { Item, ItemOnGround } from "./types/items";

///@ts-ignore
const SERVER_IP = import.meta.env.VITE_SERVER_IP;

class MainScene extends Phaser.Scene
{
    socket!: Socket;
    player: Phaser.GameObjects.Rectangle | null = null;
    otherPlayers: Players = {};

    private inputManager!: InputManager;
    private playerController!: PlayerController;
    private pointer!: Phaser.Input.Pointer;
    private camera!: Phaser.Cameras.Scene2D.Camera;

    bullets!: Bullet[];
    itemsOnGround: ItemOnGround[] = [];

    constructor()
    {
        super({ key: 'GameScene' });
    }

    preload()
    {

    }

    create()
    {
        this.socket = io(SERVER_IP);
        this.inputManager = new InputManager(this);
        this.pointer = this.input.activePointer;
        this.bullets = [];

        this.socket.on('connect', () => useNetworkStore.getState().setSocket(this.socket));

        this.socket.on('init', (data: InitEvent) =>
        {
            data.itemsOnGround.map((item) => this.spawnItem(item));
            Object.entries(data.players).forEach(([id, playerData]) =>
            {
                if (!this.socket || this.socket === null) return;

                if (id === this.socket.id)
                {
                    this.addPlayer(playerData);
                    return
                } 

                this.addOtherPlayers(playerData);
            });

        });

        this.socket.on('newPlayer', (playerData: PlayerData) =>
        {
            this.addOtherPlayers(playerData);
        });

        this.socket.on('playerDisconnected', (playerId: string) =>
        {
            if (this.otherPlayers[playerId])
            {
                this.otherPlayers[playerId].player.destroy();
                this.otherPlayers[playerId].reloadText?.destroy();
                delete this.otherPlayers[playerId];
            }
        });

        this.socket.on('playerMoved', (data: PlayerMovementData) => 
        {
            const player = this.otherPlayers[data.id];
            if (player) 
            {
                player.player.setPosition(data.x, data.y);
                player.player.rotation = data.rotation;

                if (player.reloadText) 
                {
                    player.reloadText.setVisible(data.isReloading || false);
                    player.reloadText.setPosition(data.x, data.y - 40);
                }
            }
        });

        this.socket.on('playerShoot', (data: PlayerShootEvent) => 
        {
            const bullet = new Bullet(this, data.id, data.x, data.y, data.rotation);
            this.bullets.push(bullet);

            setTimeout(() => 
            {
                this.bullets = this.bullets.filter(b => b != bullet)
                bullet.destroy();
            }, 1500);
        });

        this.socket.on('playerReload', (playerId: string) => 
        {
            const player = this.otherPlayers[playerId];
            if (!player) return
            
            if (!player.reloadText)
                player.reloadText = this.add.text(0, -40, 'Reloading...', { fontSize: '12px', color: '#ffffff' })
                    .setOrigin(0.5);
            
            player.reloadText.setVisible(true);
        });

        this.socket.on('playerReloadComplete', (playerId: string) => 
        {
            const player = this.otherPlayers[playerId];
            if (player && player.reloadText) player.reloadText.setVisible(false);
        });

        this.socket.on('playerDead', (data: PlayerDeadEvent) => 
        {
            console.log(data);
            const state = useGameStore.getState();
            useMapDataStore.getState().newAction(
                `${data.name} was killed by ${data.killerName}`
            );

            
            if (data.killerId === this.socket.id)
            {
                state.setKills(state.kills + 1);
                return
            }

            this.playerController.respawn(data.x, data.y);
            state.setDeaths(state.deaths + 1);
        });

        this.socket.on('playerPickupItem', (itemId: number) => 
        {
            const item = this.itemsOnGround.find((i) => i.id === itemId);
            console.log(itemId, this.itemsOnGround, item)
            if (!item) return

            this.itemsOnGround.splice(this.itemsOnGround.indexOf(item), 1);
            item.object.destroy();
        });
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

    update(time: number)
    {
        if (!this.player || !this.socket) return;

        const input = this.inputManager.getInputs();
        this.playerController.update(input, this.pointer, time);
    }

    addPlayer(playerData: PlayerData)
    {
        this.player = this.add.rectangle(playerData.x, playerData.y, 32, 32, 0x00ff00).setOrigin(0.5);
        this.playerController = new PlayerController(this, this.socket, this.player);
        this.setupCamera();
    }

    addOtherPlayers(playerData: PlayerData) 
    {
        const otherPlayer = { player: undefined, reloadText: undefined } as any;
        otherPlayer.player = this.add.rectangle(
            playerData.x, 
            playerData.y, 
            32, 32, 0xff0000
        ).setOrigin(0.5);
        otherPlayer.reloadText = this.add.text(
            playerData.x, playerData.y - 40, 
            'Reloading...', 
            { fontSize: '12px', color: '#ff0000' }
        ).setOrigin(0.5);
        this.otherPlayers[playerData.id] = otherPlayer;
    }

    spawnItem(item: Item)
    {
        const object = this.add.rectangle(
            item.position.x, item.position.y, 16, 16, 0xffffff
        ).setOrigin(0.5);
        this.itemsOnGround.push({ ...item, object });
    }
}

export default MainScene