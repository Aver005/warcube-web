import MainScene from "@/main-scene";

export class Bullet
{
    private _object!: Phaser.GameObjects.Arc;
    private _ownerId!: string; 

    constructor(scene: MainScene, ownerId: string, x?: number, y?: number, rotation: number = 0)
    {
        this._ownerId = ownerId;
        this._object = scene.add.circle(x, y, 5, 0xffff00);
        const velocity = scene.physics.velocityFromRotation(rotation, 1000);
        scene.physics.add.existing(this._object);
        (this._object.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);
    }

    destroy()
    {
        this._object.destroy()
    }

    getObject()
    {
        return this._object;
    }

    getOwnerId() 
    {
        return this._ownerId
    }
}