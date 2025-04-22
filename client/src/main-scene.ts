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

///@ts-ignore
const SERVER_IP = import.meta.env.VITE_SERVER_IP;

class MainScene extends Phaser.Scene
{
    networkManager!: NetworkManager;
    player: Player | null = null;

    private inputManager!: InputManager;
    private camera!: Phaser.Cameras.Scene2D.Camera;

    private match!: Match;


    constructor()
    {
        super({ key: 'GameScene' });
    }

    preload()
    {
        this.load.image('player', './player.png');
        this.load.image('pistol-hands', './pistol-hands.png');
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
        this.match = new Match(this);
        this.networkManager = new NetworkManager(this, this.match);
        this.networkManager.connect(IP);
    }

    disconnect()
    {
        this.networkManager.disconnect();
        this.match.destroy();
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
        this.match.getGameMap().getPlayers().add(playerData.id, newPlayer)
        return newPlayer;
    }

    spawnItem(item: Item)
    {
        this.match.getGameMap().getItemsOnGround().add(
            item.id,
            new GroundItem(this, item)
        );
    }

    getInput(): InputData { return this.inputManager.getInputs(); }
}

export default MainScene
