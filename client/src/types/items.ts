export type Position = { x: number; y: number };

export interface Item
{
    id: number;
    label: string;
    name: string;
    icon: string;
    quantity?: number;
    durability?: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    position: Position;
}

export interface ItemOnGround extends Item
{
    object: Phaser.GameObjects.Rectangle
}