import MainScene from "@/main-scene";
import { GameObjects, Physics } from "phaser";

const { Arc } = GameObjects;
type Body = Physics.Arcade.Body;

export class Bullet extends Arc
{
    private ownerId!: string;
    private damage: number = 12;

    constructor(scene: MainScene, ownerId: string, x?: number, y?: number, rotation: number = 0)
    {
        super(scene, x, y, 5, 0, 360, false, 0xFFFF00);
        this.ownerId = ownerId;

        const velocity = scene.physics.velocityFromRotation(rotation, 1000);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Body;
        body.setVelocity(velocity.x, velocity.y);
        body.setCollideWorldBounds(true);
        body.onWorldBounds = true;

        scene.physics.world.on("worldbounds", 
            (collider: Body) => this.onWorldBounds(collider)
        );
    }

    onWorldBounds(collider: Body)
    {
        const body = this.body as Body;
        if (body !== collider) return
        this.destroy();
    }

    getOwnerId() 
    {
        return this.ownerId
    }

    getDamage() 
    {
        return this.damage
    }
}