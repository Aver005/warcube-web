import Phaser from 'phaser';

export default class InteractiveBlock extends Phaser.GameObjects.Rectangle
{
    id: number;
    item: any; // Replace with appropriate type
    position: { x: number, y: number };
    rotation: number;
    size: { width: number, height: number };

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number)
    {
        super(scene, x, y, width, height);
        scene.add.existing(this);

        this.id = -1; // Default ID
        this.item = null; // Default item
        this.position = { x, y };
        this.rotation = 0;
        this.size = { width, height };

        // Additional initialization code can be added here
    }

    // Example method to update the block's properties
    updateProperties(id: number, item: any)
    {
        this.id = id;
        this.item = item;
    }
}