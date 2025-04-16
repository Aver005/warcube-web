export const ItemType =
{
    Item: 'item',
    RangedWeapon: 'ranged_weapon',
    MeleeWeapon: 'melee_weapon',
    Active: 'active',
    Consumable: 'consumable',
    Throwable: 'throwable',
    Deployable: 'deployable',
    Passive: 'passive',
    Wearable: 'wearable',
    Special: 'special'
};

export const SlotType =
{
    SPECIAL: 'special',
    HELMET: 'helmet',
    CHESTPLATE: 'chestplate',
    BOOTS: 'boots',
    UTILITY: 'utility',
    ACTIVE: 'active',
    BAG: 'bag'
};

export const Rarity = 
{
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

export type ItemType = typeof ItemType[keyof typeof ItemType];
export type SlotType = typeof SlotType[keyof typeof SlotType];
export type Rarity = typeof Rarity[keyof typeof Rarity];
export type Position = { x: number; y: number, rotation?: number };

export interface Item
{
    id: number;
    label: string;
    name: string;
    icon: string;
    rarity: Rarity;
    position: Position;
    type: ItemType;
    slotType: SlotType;
}

export interface StackableItem extends Item
{
    quantity: number;
    maxQuantity: number;
}

export interface ConsumableItem extends Item
{
    durability: number;
    maxDurability: number;
}

export interface RangedWeapon extends ConsumableItem
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

export interface MeleeWeapon extends ConsumableItem
{
    type: 'melee_weapon';
    damage: number;
    attackRate: number;
    range: number;
    arc: number;
    staminaCost?: number;
}

export interface ThrowableWeapon extends StackableItem, ConsumableItem
{
    type: 'throwable';
    damage: number;
    throwForce: number;
    explosionRadius?: number;
    fuseTime?: number;
}

export interface DeployableItem extends StackableItem, ConsumableItem
{
    type: 'deployable';
    health: number;
    deployTime: number;
    activeTime?: number;
    isPassive?: boolean;
    isBlocking: boolean;
}

export interface ActiveItem extends StackableItem, ConsumableItem
{
    type: 'active';
    useTime: number;
    cooldown: number;
    effect: string;
}

export interface PassiveItem extends StackableItem
{
    type: 'passive';
    slotType: 'utility';
    effects:
    {
        [key: string]: number;
    };
}

export interface WearableItem extends ConsumableItem
{
    type: 'wearable',
    slotType: 'helmet' | 'chestplate' | 'boots',
    increments?:
    {
        health?: number;
        armor?: number;
    },
    effects:
    {
        [key: string]: number;
    };
}

export interface SpecialItem extends Item
{
    type: 'special';
    slotType: 'special',
    restrictions:
    {
        [key: string]: number;
    };
    benefits:
    {
        [key: string]: number;
    };
    activated: boolean,
}

export type AnyItem =
    | Item
    | RangedWeapon
    | MeleeWeapon
    | ThrowableWeapon
    | DeployableItem
    | ActiveItem
    | PassiveItem
    | WearableItem
    | SpecialItem;


export type Hotbar = [AnyItem | null, AnyItem | null];
export type ArmorSlots =
[
    WearableItem | null,
    WearableItem | null,
    WearableItem | null
];

export interface IInventory
{
    readonly items: AnyItem[];
    hotbar: Hotbar;
    specialSlot: SpecialItem | null;
    armorSlots: ArmorSlots;
    maxSize: number;
}



export function isStackableItem(item: Item): item is StackableItem {
    return 'quantity' in item && 'maxQuantity' in item;
}

export function isConsumableItem(item: Item): item is ConsumableItem {
    return 'durability' in item && 'maxDurability' in item;
}