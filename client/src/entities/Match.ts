import { Scene } from "phaser";
import { GameMap } from "./GameMap";
import { Bullet } from "./Bullet";
import { Player } from "./Player";
import { GroundItem } from "./GroundItem";

export class Match
{
    private scene!: Scene;
    private gameMap!: GameMap;

    constructor(scene: Scene)
    {
        this.scene = scene;
        this.gameMap = new GameMap(scene);
    }

    public getGameMap(): GameMap
    {
        return this.gameMap;
    }

    public destroy(): void
    {
        this.gameMap.destroy();
    }
}
