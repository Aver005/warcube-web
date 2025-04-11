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

export type Position = 
{
    x: number;
    y: number;
};