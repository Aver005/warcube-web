import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { InputData, Player } from "./types/Player";
import { useGameStore } from "./stores/ui";

export class PlayerController
{
    private scene: Phaser.Scene;
    private socket: Socket;
    private player: Player;
    private speed: number = 3;
    private bullets: Phaser.GameObjects.Group;
    private lastFired: number = 0;
    private fireRate: number = 500;
    private ammo: number = 10;
    private maxAmmo: number = 10;
    private reloadTime: number = 2000;
    private isReloading: boolean = false;

    constructor(scene: Phaser.Scene, socket: Socket, playerObj: Phaser.GameObjects.Rectangle)
    {
        this.scene = scene;
        this.socket = socket;
        this.bullets = this.scene.add.group();

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
    }

    movement(input: InputData)
    {
        const player = this.player.player;
        if (input.x !== 0 || input.y !== 0)
        {
            const newX = player.x + input.x * this.speed;
            const newY = player.y + input.y * this.speed;
            player.setPosition(newX, newY);
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
        const player = this.player.player;
        this.lastFired = time;
        this.setAmmo(this.ammo - 1);

        const bullet = this.scene.add.circle(
            player.x,
            player.y,
            5,
            0xffff00
        );

        const velocity = this.scene.physics.velocityFromRotation(
            player.rotation,
            300
        );

        this.scene.physics.add.existing(bullet);
        (bullet.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);

        this.bullets.add(bullet);
        this.socket.emit('playerShoot', 
        {
            x: player.x,
            y: player.y,
            rotation: player.rotation,
            ammo: this.ammo
        });

        setTimeout(() => {bullet.destroy();}, 1500);
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
}
