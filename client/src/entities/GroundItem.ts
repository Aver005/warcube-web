import { GameObjects } from "phaser";
import stringGenerator from "@/utils/string-generator";

export class GroundItem extends GameObjects.Sprite
{
    id!: number;

    constructor(scene: Phaser.Scene, id: number, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture, 0);
        this.id = id;
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}