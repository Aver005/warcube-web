import { Item } from "@/types/items";
import { GameObjects } from "phaser";

export class GroundItem extends GameObjects.Sprite
{
    id!: number;
    item!: Item;

    constructor(scene: Phaser.Scene, item: Item)
    {
        super(scene, item.position.x, item.position.y, item.icon, 0);
        this.id = item.id;
        this.item = { ...item };
        this.setOrigin(0.5, 0.5);
        this.setRotation(item.position.rotation || 0);
        this.setSize(24, 24);
        this.setDisplaySize(24, 24);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}