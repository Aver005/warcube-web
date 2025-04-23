import io, { Socket } from "socket.io-client";
import { SocketEvent } from "../types/SocketEvents";
import MainScene from "../main-scene";
import { PlayerData, PlayerMovementData, PlayerShootEvent } from "../types/Player";
import { PlayerDeadEvent } from "../types/events/player-events";
import { InitEvent } from "../types/events/server-events";
import { Match } from "../entities/Match";
import { useNetworkStore } from "../stores/network-store";
import { useGameStore } from "../stores/game-store";
import { useMapDataStore } from "../stores/map-data-store";

export class NetworkManager
{
    private socket!: Socket;
    private scene: MainScene;
    private match: Match;

    constructor(scene: MainScene, match: Match)
    {
        this.scene = scene;
        this.match = match;
    }

    connect(serverIP: string)
    {
        this.socket = io(serverIP);
        this.setupListeners();
    }

    disconnect()
    {
        if (this.socket)
        {
            this.socket.disconnect();
            this.socket.close();
        }
    }

    emit(event: string, data?: any) { this.socket.emit(event, data); }

    getID() { return this.socket.id; }

    private setupListeners()
    {
this.socket.on(SocketEvent.CONNECT, () => useNetworkStore.getState().setSocket(this.socket));

this.socket.on(SocketEvent.INIT, (data: InitEvent) =>
{
    // Delegate item spawning to GameMap
    data.itemsOnGround.forEach(item => this.match.getGameMap().spawnItem(item));

    // Delegate player creation to GameMap
    Object.entries(data.players).forEach(([id, playerData]) =>
    {
        const player = this.match.getGameMap().addPlayer(playerData);
        if (id === this.socket.id)
        {
            this.scene.setupCamera();
        }
    });
});

this.socket.on(SocketEvent.NEW_PLAYER, (playerData: PlayerData) =>
{
    this.match.getGameMap().addPlayer(playerData);
});

this.socket.on(SocketEvent.PLAYER_DISCONNECTED, (playerId: string) =>
{
    this.match.getGameMap().removePlayer(playerId);
});

this.socket.on(SocketEvent.PLAYER_MOVED, (data: PlayerMovementData) =>
{
    this.match.getGameMap().updatePlayerPosition(data);
});

this.socket.on(SocketEvent.PLAYER_SHOOT, (data: PlayerShootEvent) =>
{
    this.match.getGameMap().addBullet(data);
});

this.socket.on(SocketEvent.PLAYER_RELOAD, (playerId: string) =>
{
    this.match.getGameMap().setPlayerReloading(playerId, true);
});

this.socket.on(SocketEvent.PLAYER_RELOAD_COMPLETE, (playerId: string) =>
{
    this.match.getGameMap().setPlayerReloading(playerId, false);
});

this.socket.on(SocketEvent.PLAYER_DEAD, (data: PlayerDeadEvent) =>
{
    useMapDataStore.getState().newAction(
        `${data.name} was killed by ${data.killerName}`
    );

    if (data.killerId === this.socket.id)
    {
        useGameStore.getState().setKills(useGameStore.getState().kills + 1);
    } 
    else
    {
        useGameStore.getState().setDeaths(useGameStore.getState().deaths + 1);
    }
});

this.socket.on(SocketEvent.PLAYER_PICKUP_ITEM, (itemId: number) =>
{
    this.match.getGameMap().removeItem(itemId);
});

this.socket.on(SocketEvent.DISCONNECT, () =>
{
    this.match.destroy();
});
    }
}
