import Phaser from "phaser";
import { InputData } from "./types/Player";

export class InputManager
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyR!: Phaser.Input.Keyboard.Key;
    private keyI!: Phaser.Input.Keyboard.Key;
    private key1!: Phaser.Input.Keyboard.Key;
    private key2!: Phaser.Input.Keyboard.Key;
    private key3!: Phaser.Input.Keyboard.Key;
    private fireButton!: boolean;

    constructor(scene: Phaser.Scene)
    {
        this.initKeyboardControls(scene);
    }

    private initKeyboardControls(scene: Phaser.Scene)
    {
        if (!scene.input.keyboard) return;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyR = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyI = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.key1 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => 
        {
            if (pointer.leftButtonDown()) {
                this.fireButton = true;
            }
        });

        scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => 
        {
            if (!pointer.leftButtonDown()) {
                this.fireButton = false;
            }
        });
    }

    public getMovement(): InputData
    {
        let velocityX = 0;
        let velocityY = 0;

        if (this.keyA.isDown || this.cursors.left?.isDown) velocityX -= 1;
        if (this.keyD.isDown || this.cursors.right?.isDown) velocityX += 1;
        if (this.keyW.isDown || this.cursors.up?.isDown) velocityY -= 1;
        if (this.keyS.isDown || this.cursors.down?.isDown) velocityY += 1;

        return { 
            x: velocityX, y: velocityY, 
            fire: this.fireButton, reload: this.keyR.isDown, 
            inventory: this.keyI.isDown,
            slot1: this.key1.isDown,
            slot2: this.key2.isDown,
            slot3: this.key3.isDown,
        };
    }
}
