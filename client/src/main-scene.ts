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
import { Match } from "./entities/Match";
import { ItemDatabase } from "./entities/ItemDatabase";
import { NetworkManager } from "./network/NetworkManager";

// Import the new InteractiveBlock class
import InteractiveBlock from './entities/InteractiveBlock';

///@ts-ignore
const SERVER_IP = import.meta.env.VITE_SERVER_IP;

class MainScene extends Phaser.Scene {
    networkManager!: NetworkManager;
    player: Player | null = null;

    private inputManager!: InputManager;
    private camera!: Phaser.Cameras.Scene2D.Camera;

    private match!: Match;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        this.load.image('player', './player.png');
        this.load.image('pistol-hands', './pistol-hands.png');
        this.load.image('item', './item.png');
        Object.entries(ItemDatabase).forEach(([key, item]) =>
            this.load.image(item.icon, `./icons/items/${item.icon.replace(':', '_')}.svg`)
        );
    }

    create(): void {
        this.inputManager = new InputManager(this);
        useNetworkStore.getState().setScene(this);
        this.connect();
    }

    connect(forceIP?: string): void {
        const IP = forceIP || SERVER_IP;
        this.match = new Match(this);
        this.networkManager = new NetworkManager(this, this.match);
        this.networkManager.connect(IP);
    }

    disconnect(): void {
        this.networkManager.disconnect();
        this.match.destroy();
    }

    setupCamera(): void {
        if (!this.player) return;

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

    addPlayer(playerData: PlayerData): Player {
        const newPlayer = new Player(this, playerData.id, 'player', playerData.x, playerData.y);
        this.match.getGameMap().getPlayers().add(playerData.id, newPlayer);
        return newPlayer;
    }

    spawnItem(item: Item): void {
        this.match.getGameMap().getItemsOnGround().add(
            item.id,
            new GroundItem(this, item)
        );
    }

    // New method to handle instantiation of InteractiveBlock instances
    spawnInteractiveBlock(x: number, y: number, width: number, height: number): InteractiveBlock {
        const interactiveBlock = new InteractiveBlock(this, x, y, width, height);
        this.add.existing(interactiveBlock);
        return interactiveBlock;
    }

    getInput(): InputData { return this.inputManager.getInputs(); }
}

export default MainScene;
