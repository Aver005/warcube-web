import { Scene } from "phaser";
import { ObjectMap } from "../utils/object-map";
import { Bullet } from "./Bullet";
import { Player } from "./Player";
import { GroundItem } from "./GroundItem";

export class GameMap
{
    private scene!: Scene;
    private bullets: ObjectMap<Bullet>;
    private players: ObjectMap<Player>;
    private itemsOnGround: ObjectMap<GroundItem>;

    constructor(scene: Scene)
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
}
