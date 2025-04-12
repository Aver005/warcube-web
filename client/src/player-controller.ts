import Phaser, { GameObjects } from "phaser";
import { Socket } from "socket.io-client";
import { InputData, Player } from "./types/Player";
import { useGameStore } from "./stores/game-store";
import MainScene from "./main-scene";
import { Bullet } from "./entities/Bullet";
import { usePlayerStore } from "./stores/player-store";

export class PlayerController
{
    private scene: MainScene;
    private socket: Socket;
    private player: Player;
    private speed: number = 1.8;
    private lastFired: number = 0;
    private fireRate: number = 300;
    private ammo: number = 10;
    private maxAmmo: number = 10;
    private reloadTime: number = 2000;
    private isReloading: boolean = false;
    private activeWeapon: number = 0;
    private isDead: boolean = false;

    constructor(scene: MainScene, socket: Socket, playerObj: Phaser.GameObjects.Rectangle)
    {
        this.scene = scene;
        this.socket = socket;

        this.player = { player: playerObj, reloadText: undefined };
        this.player.reloadText = this.scene.add.text(
            0, -40, 
            'Reloading...', 
            { fontSize: '12px', color: '#ffffff' }
        ).setOrigin(0.5);
        this.player.reloadText.setVisible(false);

        this.player.player.on('destroy', () =>
        {
            this.player.reloadText?.destroy();
        });

        this.setAmmo(10);
    }

    update(input: InputData, pointer: Phaser.Input.Pointer, time: number)
    {
        this.updateRotation(pointer);
        this.movement(input)
        this.shooting(input, time)
        this.switchingWeapons(input)
        this.collisions(input)
    }

    movement(input: InputData)
    {
        const player = this.player.player;
        if (input.x !== 0 || input.y !== 0)
        {
            const newX = player.x + input.x * this.speed;
            const newY = player.y + input.y * this.speed;
            player.setPosition(newX, newY);
            usePlayerStore.getState().setPosition(newX, newY);
        }

        this.socket.emit('playerMovement',
        {
            x: player.x,
            y: player.y,
            rotation: player.rotation,
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
        if (input.slot1) this.activeWeapon = 0;
        if (input.slot2) this.activeWeapon = 1;
        if (input.slot3) this.activeWeapon = 2;
        useGameStore.getState().setActiveWeapon(this.activeWeapon);
    }

    collisions(input: InputData)
    {
        this.scene.bullets.map((bullet) =>
        {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                bullet.getObject().getBounds(),
                this.player.player.getBounds(),
            )) {
                this.onCollideWithBullet(bullet);
            }
        })

        if (input.pickup)
        {
            this.scene.itemsOnGround.map((item) =>
            {
                if (!Phaser.Geom.Intersects.RectangleToRectangle(
                    item.object.getBounds(),
                    this.player.player.getBounds(),
                )) 
                return

                this.scene.itemsOnGround.splice(this.scene.itemsOnGround.indexOf(item), 1);
                item.object.destroy();
                this.socket.emit('playerPickupItem', item.id);
            })
        }
    }

    private onCollideWithBullet(bullet: Bullet)
    {
        if (this.isDead) return
        if (this.socket.id === bullet.getOwnerId()) return

        const health = useGameStore.getState().health;
        const setHealth = useGameStore.getState().setHealth;

        if (health - 5 > 0)
        {
            setHealth(health - 5);
            return
        }

        this.isDead = true;
        this.socket.emit('playerDead', { killerId: bullet.getOwnerId() });
    }

    private updateRotation(pointer: Phaser.Input.Pointer)
    {
        if (!pointer.active) return;

        const player = this.player.player;
        const angle = Phaser.Math.Angle.Between(
            player.x, player.y,
            pointer.worldX, pointer.worldY
        );

        player.rotation = angle;
        this.player.reloadText?.setPosition(
            this.player.player.x, 
            this.player.player.y - 40
        );
    }

    private fire(time: number)
    {
        if (!this.socket.id) return

        const player = this.player.player;
        this.lastFired = time;
        this.setAmmo(this.ammo - 1);

        this.socket.emit('playerShoot', 
        {
            x: player.x,
            y: player.y,
            rotation: player.rotation,
            ammo: this.ammo
        });
    }

    private startReload(time: number)
    {
        this.isReloading = true;
        this.player.reloadText?.setVisible(true);

        this.socket.emit('playerReload', {
            startTime: time,
            endTime: time + this.reloadTime
        });

        this.scene.time.delayedCall(this.reloadTime, () =>
        {
            this.setAmmo(this.maxAmmo);
            this.isReloading = false;
            this.player.reloadText?.setVisible(false);

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
        this.player.player.setPosition(x, y)
        useGameStore.getState().setHealth(100);
        this.isDead = false;
    }
}
