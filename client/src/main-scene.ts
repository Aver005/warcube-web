import io, { Socket } from "socket.io-client";
import { InputManager } from "./input-manager";
import { Player, PlayerData, PlayerMovementData, Players, PlayerShootEvent } from "./types/Player";
import { PlayerController } from "./player-controller";
import { useGameStore } from "./stores/game-store";
import { useMapDataStore } from "./stores/map-data-store";
import { Bullet } from "./entities/Bullet";
import { PlayerDeadEvent } from "./types/events/player-events";

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

    bullets!: Bullet[];

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

        this.socket.on('currentPlayers', (players: Record<string, PlayerData>) =>
        {
            Object.entries(players).forEach(([id, playerData]) =>
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
    }

    update(time: number)
    {
        if (!this.player || !this.socket) return;

        const input = this.inputManager.getMovement();
        this.playerController.update(input, this.pointer, time);
    }

    addPlayer(playerData: PlayerData)
    {
        this.player = this.add.rectangle(playerData.x, playerData.y, 32, 32, 0x00ff00).setOrigin(0.5);
        this.playerController = new PlayerController(this, this.socket, this.player);
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
}

export default MainScene