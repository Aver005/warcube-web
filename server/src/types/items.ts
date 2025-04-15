export type Position = { x: number; y: number, rotation?: number };
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ArmorSlot = (PassiveItem & { slotType: "armor"; }) | null;
export type Hotbar = [AnyItem | null, AnyItem | null];

export type ItemType =
    'item' |
    'ranged_weapon' |
    'melee_weapon' |
    'active' |
    'consumable' |
    'throwable' |
    'deployable' |
    'passive' |
    'special';

export interface Item
{
    id: number;
    label: string;
    name: string;
    icon: string;
    quantity?: number;
    durability?: number;
    rarity: Rarity;
    position: Position;
    type: ItemType;
    slotType?: string;
}

export interface RangedWeapon extends Item
{
    type: 'ranged_weapon';
    damage: number;
    fireRate: number; 
    reloadTime: number; 
    magazineSize: number;
    currentAmmo: number;
    maxRange: number;
    spreadAngle: number;
    projectileSpeed: number;
    ammoType: string; 
    isAutomatic?: boolean;
}

export interface MeleeWeapon extends Item
{
    type: 'melee_weapon';
    damage: number;
    attackRate: number;
    range: number; 
    arc: number;
    staminaCost?: number;
}

export interface ThrowableWeapon extends Item
{
    type: 'throwable';
    damage: number;
    throwForce: number;
    explosionRadius?: number;
    fuseTime?: number;
    isConsumable: boolean; 
}

export interface DeployableItem extends Item
{
    type: 'deployable';
    health: number;
    deployTime: number; 
    activeTime?: number;
    isPassive?: boolean; 
    isBlocking: boolean; 
}

export interface ActiveItem extends Item
{
    type: 'active';
    useTime: number; 
    cooldown: number; 
    effect: string; 
    isConsumable: boolean;
}

export interface PassiveItem extends Item
{
    type: 'passive';
    slotType?: 'helmet' | 'chestplate' | 'boots' | 'utility'; 
    effects: 
    {
        [key: string]: number;
    };
}

export interface SpecialItem extends Item
{
    type: 'special';
    restrictions: 
    {
        [key: string]: number;
    };
    benefits: 
    {
        [key: string]: number;
    };
}

export type AnyItem =
    | Item
    | RangedWeapon
    | MeleeWeapon
    | ThrowableWeapon
    | DeployableItem
    | ActiveItem
    | PassiveItem
    | SpecialItem;


export type ArmorSlots =
[
    (PassiveItem & { slotType: "helmet"; }) | null, 
    (PassiveItem & { slotType: "chestplate"; }) | null, 
    (PassiveItem & { slotType: "boots"; }) | null
];

export interface IInventory
{
    items: AnyItem[];
    hotbar: Hotbar; 
    specialSlot: SpecialItem | null;
    armorSlots: ArmorSlots;
    maxSize: number;
}
