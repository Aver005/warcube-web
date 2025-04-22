import { GameObjects } from "phaser";
import { Inventory } from "./Inventory";
import { InputData } from "@/types/Player";
import { useGameStore } from "@/stores/game-store";
import MainScene from "@/main-scene";
import { Bullet } from "./Bullet";
import { Socket } from "socket.io-client";
import { usePlayerStore } from "@/stores/player-store";
import { GroundItem } from "./GroundItem";
import { ItemType } from "@/types/items";

export class Player extends GameObjects.Sprite
{
    id: string = '';
    declare scene: MainScene;
    private socket!: Socket;

    private speed: number = 1.8;

    private ammo: number = 10;
    private maxAmmo: number = 10;
    private lastFired: number = 0;
    private fireRate: number = 300;
    private reloadTime: number = 2000;
    private activeWeapon: number = 0;
    private isReloading: boolean = false;

    private reloadText!: Phaser.GameObjects.Text;
    private hands!: Phaser.GameObjects.Sprite;

    private health: number = 100;
    private armor: number = 0;
    private isDead: boolean = false;

    private inventory!: Inventory;

    private kills: number = 0;
    private deaths: number = 0;
    private score: number = 0;

    constructor(scene: MainScene, id: string, spriteName: string, x: number, y: number)
    {
        super(scene, x, y, spriteName, 0);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.id = id;
        this.name = `Player ${id}`;
        this.inventory = usePlayerStore.getState().inventory;
        this.socket = scene.socket;
        this.reloadText = scene.add.text(0, 0, 'Reloading...').setOrigin(0.5);
        this.reloadText.setVisible(false);

        this.hands = scene.add.sprite(0, 0, 'pistol-hands').setOrigin(0.5);
        this.hands.setVisible(false);

        this.scene.events.on('update', 
            (time: number, delta: number) => { this.update(time, delta) } 
        );
    }

    update(time: number, delta: number) 
    {
        this.updateReloadText();
        if (this.socket.id !== this.id) return;

        const input = this.scene.getInput();
        this.movement(input);
        this.shooting(input, time);
        this.switchingWeapons(input);
        this.updateRotation();
        this.updateItemInHand();
    }

    movement(input: InputData)
    {
        if (input.x !== 0 || input.y !== 0)
        {
            const newX = this.x + input.x * this.speed;
            const newY = this.y + input.y * this.speed;
            this.setPosition(newX, newY);
            usePlayerStore.getState().setPosition(newX, newY);
        }

        this.socket.emit('playerMovement',
        {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            isReloading: this.isReloading
        });
    }

    shooting(input: InputData, time: number)
    {
        if (this.isReloading) return

        if (input.reload && this.ammo < this.maxAmmo) 
        {
            this.startReload(time);
            return;
        }

        if (input.fire && this.ammo > 0 && time > this.lastFired + this.fireRate) 
        {
            this.fire(time);
        }
    }

    switchingWeapons(input: InputData)
    {
        const oldSlot = this.activeWeapon;
        if (input.slot1) this.activeWeapon = 0;
        if (input.slot2) this.activeWeapon = 1;
        if (input.slot3) this.activeWeapon = 2;

        if (oldSlot === this.activeWeapon) return
        useGameStore.getState().setActiveWeapon(this.activeWeapon);

        const inventory = usePlayerStore.getState().inventory;
        const itemInHand = inventory.hotbar[this.activeWeapon];
        this.hands.setVisible(!!itemInHand && itemInHand.type === ItemType.RangedWeapon);
    }

    onCollideWithBullet(bullet: Bullet)
    {
        if (this.id === bullet.getOwnerId()) return
        bullet.destroy();

        if (this.id !== this.socket.id) return
        if (this.isDead) return

        const health = useGameStore.getState().health;
        const setHealth = useGameStore.getState().setHealth;
        const newHp = health - bullet.getDamage();

        if (newHp > 0)
        {
            setHealth(newHp);
            return
        }

        this.isDead = true;
        this.socket.emit('playerDead', { killerId: bullet.getOwnerId() });
    }

    onCollideWithItem(groundItem: GroundItem)
    {
        if (this.id !== this.socket.id) return
        const input = this.scene.getInput();
        if (!input.pickup) return;
        if (this.inventory.items.length >= this.inventory.maxSize) return;

        this.socket.emit('playerPickupItem', groundItem.id);
        this.inventory.items.push(groundItem.item);
    }

    setReloadTextVisible(visible: boolean)
    {
        this.reloadText.setVisible(visible);
    }

    updateReloadText()
    {
        if (!this.reloadText.visible) return;
        this.reloadText.setPosition(this.x, this.y - 64);
    }

    updateItemInHand()
    {
        if (!this.hands.visible) return;
        this.hands.setPosition(this.x, this.y);
        this.hands.rotation = this.rotation;
    }

    private updateRotation()
    {
        const pointer = this.scene.input.activePointer;
        if (!pointer.active) return;

        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            pointer.worldX, pointer.worldY
        );

        this.rotation = angle;
    }

    rotatePoint(x: number, y: number, rotation: number): { x: number, y: number } 
    {
        const pointer = this.scene.input.activePointer;
        const angle = Math.atan2(pointer.worldY - y, pointer.worldX - x);
        const barrelOffsetX = 84;
        const barrelOffsetY = 0;

        // Вычисляем координаты дуло с учетом угла
        const bulletX = x + barrelOffsetX * Math.cos(angle);
        const bulletY = y + barrelOffsetY * Math.sin(angle);
    
        return { x: bulletX, y: bulletY };
    }

    private fire(time: number)
    {
        if (!this.socket.id) return

        this.lastFired = time;
        this.setAmmo(this.ammo - 1);

        this.socket.emit('playerShoot', 
        {
            ...this.rotatePoint(this.x, this.y, this.rotation),
            rotation: this.rotation,
            ammo: this.ammo
        });
    }

    private startReload(time: number)
    {
        this.isReloading = true;
        this.reloadText?.setVisible(true);

        this.socket.emit('playerReload', {
            startTime: time,
            endTime: time + this.reloadTime
        });

        this.scene.time.delayedCall(this.reloadTime, () =>
        {
            this.setAmmo(this.maxAmmo);
            this.isReloading = false;
            this.reloadText?.setVisible(false);

            this.socket.emit('playerReloadComplete');
        });
    }

    setAmmo(ammo: number) 
    { 
        this.ammo = ammo; 
        useGameStore.getState().setAmmo(ammo);
    }

    respawn(x: number, y: number)
    {
        this.setPosition(x, y)
        useGameStore.getState().setHealth(100);
        this.isDead = false;
    }

    destroy(fromScene?: boolean): void 
    {
        this.inventory.clear();
        this.reloadText.destroy(fromScene);
        super.destroy(fromScene);
    }

    getSocket() { return this.socket; }
}