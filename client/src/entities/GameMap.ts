import { ObjectMap } from "../utils/object-map";
import { Bullet } from "./Bullet";
import { Player } from "./Player";
import { GroundItem } from "./GroundItem";
import { Item } from "../types/items";
import { PlayerData, PlayerMovementData, PlayerShootEvent } from "../types/Player";
import MainScene from "../main-scene";

export class GameMap
{
    private scene!: MainScene;
    private bullets: ObjectMap<Bullet>;
    private players: ObjectMap<Player>;
    private itemsOnGround: ObjectMap<GroundItem>;

    constructor(scene: MainScene)
    {
        this.scene = scene;
        this.bullets = new ObjectMap<Bullet>(scene);
        this.players = new ObjectMap<Player>(scene);
        this.itemsOnGround = new ObjectMap<GroundItem>(scene);
        this.setupPhysics();
    }

    private setupPhysics(): void
    {
        this.scene.physics.add.overlap(
            this.getBullets().getGroup(),
            this.getPlayers().getGroup(),
            (bullet, player) => 
            {
                if (!(bullet instanceof Bullet)) return;
                if (!(player instanceof Player)) return;
                if (bullet.getOwnerId() === player.id) return;
                player.onCollideWithBullet(bullet);
            }
        );

        this.scene.physics.add.overlap(
            this.getItemsOnGround().getGroup(),
            this.getPlayers().getGroup(),
            (item, player) => 
            {
                if (!(item instanceof GroundItem)) return;
                if (!(player instanceof Player)) return;
                player.onCollideWithItem(item);
            }
        );
    }

    public getBullets(): ObjectMap<Bullet>
    {
        return this.bullets;
    }

    public getPlayers(): ObjectMap<Player>
    {
        return this.players;
    }

    public getItemsOnGround(): ObjectMap<GroundItem>
    {
        return this.itemsOnGround;
    }

    public clear(): void
    {
        this.bullets.clear();
        this.players.clear();
        this.itemsOnGround.clear();
    }

    public destroy(): void
    {
        this.clear();
    }

    public spawnItem(item: Item): void
    {
        this.itemsOnGround.add(
            item.id,
            new GroundItem(this.scene, item)
        );
    }

    public addPlayer(playerData: PlayerData): Player
    {
        const player = new Player(this.scene, playerData.id, 'player', playerData.x, playerData.y);
        this.players.add(playerData.id, player);
        return player;
    }

    public removePlayer(playerId: string): void
    {
        const player = this.players.get(playerId);
        if (!player) return;
        player.destroy();
        this.players.remove(playerId);
    }

    public updatePlayerPosition(data: PlayerMovementData): void
    {
        const player = this.players.get(data.id);
        if (!player) return;
        player.setPosition(data.x, data.y);
        player.rotation = data.rotation;
    }

    public addBullet(data: PlayerShootEvent): void
    {
        const bullet = new Bullet(this.scene, data.id, data.x, data.y, data.rotation);
        this.bullets.add(data.id, bullet);
    }

    public setPlayerReloading(playerId: string, reloading: boolean): void
    {
        const player = this.players.get(playerId);
        if (!player) return;
        player.setReloadTextVisible(reloading);
    }

    public removeItem(itemId: number): void
    {
        const item = this.itemsOnGround.get(itemId);
        if (!item) return;
        item.destroy();
        this.itemsOnGround.remove(itemId);
    }
}
