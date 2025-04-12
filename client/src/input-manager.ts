import Phaser from "phaser";
import { InputData } from "./types/Player";
import { OverlayType, OverlayWindowByKey, useUIStore } from "./stores/ui-store";

export function handleOverlayKeyDown(keyCode: number): void
{
    const overlaySetting = OverlayWindowByKey.get(keyCode);
    if (!overlaySetting) return;

    const { type, forceCloser } = overlaySetting;
    const { overlayWindow, setOverlayWindow, holdOverlay, toggleOverlayHold } = useUIStore.getState();

    if (overlayWindow === type || (overlayWindow !== OverlayType.NONE && forceCloser))
    {
        if (holdOverlay) toggleOverlayHold();
        setOverlayWindow(OverlayType.NONE);
        return
    }

    setOverlayWindow(type);
}

export function handleOverlayKeyUp(keyCode: number): void
{
    const overlaySetting = OverlayWindowByKey.get(keyCode);
    if (!overlaySetting) return;

    const { type, hold } = overlaySetting;
    const { overlayWindow, holdOverlay, setOverlayWindow } = useUIStore.getState();

    if (hold && overlayWindow === type && !holdOverlay)
    {
        setOverlayWindow(OverlayType.NONE);
    }
}

export class InputManager
{
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyR!: Phaser.Input.Keyboard.Key;
    private key1!: Phaser.Input.Keyboard.Key;
    private key2!: Phaser.Input.Keyboard.Key;
    private key3!: Phaser.Input.Keyboard.Key;
    private keyE!: Phaser.Input.Keyboard.Key;
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
        this.key1 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.keys = 
        {
            TAB: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB),
            ESC: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
            I: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            M: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
        };

        Object.entries(this.keys).forEach(([_, key]) =>
        {
            key.on('down', () => handleOverlayKeyDown(key.keyCode));
            key.on('up', () => handleOverlayKeyUp(key.keyCode));
        });

        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => 
        {
            if (pointer.leftButtonDown())
            {
                this.fireButton = true;
            }
        });

        scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => 
        {
            if (!pointer.leftButtonDown())
            {
                this.fireButton = false;
            }
        });
    }

    public getInputs(): InputData
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
            slot1: this.key1.isDown,
            slot2: this.key2.isDown,
            slot3: this.key3.isDown,
            pickup: this.keyE.isDown
        };
    }
}
