import { GameMap } from "./GameMap";
import MainScene from "@/main-scene";

export class Match
{
    private scene!: MainScene;
    private gameMap!: GameMap;

    constructor(scene: MainScene)
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
