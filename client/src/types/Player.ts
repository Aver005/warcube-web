import { Player } from '@/entities/Player';
import { GameObjects } from 'phaser';

export interface PlayerData
{
    id: string;
    x: number;
    y: number;
    rotation?: number;
    isReloading?: boolean;
    ammo?: number;
}

export interface PlayerMovementData extends PlayerData 
{
    rotation: number;
    isReloading: boolean;
}

export interface ShootData 
{
    x: number;
    y: number;
    rotation: number;
    ammo: number;
}

export interface ReloadData 
{
    startTime: number;
    endTime: number;
}

// export interface Player
// {
//     player: GameObjects.Image
//     reloadText?: Phaser.GameObjects.Text
// }

export type Players = 
{
    [id: string]: {
        player: GameObjects.Image
        reloadText?: Phaser.GameObjects.Text
    };
};


export interface PlayerShootEvent
{
    id: string, 
    x: number, 
    y: number, 
    rotation: number, 
    ammo: number
}

export interface InputData
{ 
    x: number; 
    y: number; 
    fire: boolean;
    reload: boolean;
    slot1: boolean;
    slot2: boolean;
    slot3: boolean;
    pickup: boolean
}