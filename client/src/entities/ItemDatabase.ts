import { RangedWeapon, MeleeWeapon, ThrowableWeapon, DeployableItem, ActiveItem, PassiveItem, SpecialItem, Position, AnyItem, Item, SlotType, Rarity, ItemType, WearableItem } from "@/types/items";

export const ItemTemplate =
{
    slotType: SlotType.ACTIVE,
} as Item;

export const ItemDatabase: { [key: string]: AnyItem } =
{
    'medkit': {
        ...ItemTemplate,
        id: 1,
        label: 'Medkit',
        name: 'Аптечка',
        icon: 'mdi:medication',
        quantity: 1,
        rarity: Rarity.UNCOMMON,
        position: { x: 0, y: 0 },
        type: ItemType.Active,
        useTime: 3,
        cooldown: 10,
        effect: 'restore 50 health',
    } as ActiveItem,

    'ammo_pistol': {
        ...ItemTemplate,
        id: 2,
        label: 'Pistol Ammo',
        name: 'Патроны для пистолета',
        icon: 'game-icons:ammo-box',
        maxQuantity: 12,
        quantity: 0,
        rarity: Rarity.COMMON,
        slotType: SlotType.UTILITY,
        position: { x: 0, y: 0 },
        type: ItemType.Passive,
        effects: {
            'ammo': 12
        }
    } as PassiveItem,

    'pistol': {
        ...ItemTemplate,
        id: 3,
        label: 'Pistol',
        name: 'Пистолет',
        icon: 'mdi:pistol',
        durability: 100,
        maxDurability: 100,
        rarity: Rarity.UNCOMMON,
        position: { x: 0, y: 0 },
        type: ItemType.RangedWeapon,
        damage: 15,
        fireRate: 2,
        reloadTime: 1.5,
        magazineSize: 12,
        currentAmmo: 12,
        maxRange: 50,
        spreadAngle: 3,
        projectileSpeed: 70,
        ammoType: '9mm',
        isAutomatic: false
    } as RangedWeapon,

    'assault_rifle': {
        ...ItemTemplate,
        id: 4,
        label: 'Assault Rifle',
        name: 'Штурмовая винтовка',
        icon: 'mdi:gun',
        durability: 100,
        maxDurability: 100,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: ItemType.RangedWeapon,
        damage: 20,
        fireRate: 10,
        reloadTime: 2.5,
        magazineSize: 30,
        currentAmmo: 30,
        maxRange: 100,
        spreadAngle: 5,
        projectileSpeed: 100,
        ammoType: '5.56mm',
        isAutomatic: true
    } as RangedWeapon,

    'knife': {
        ...ItemTemplate,
        id: 5,
        label: 'Knife',
        name: 'Нож',
        icon: 'mdi:knife',
        durability: 200,
        maxDurability: 200,
        rarity: Rarity.COMMON,
        position: { x: 0, y: 0 },
        type: ItemType.MeleeWeapon,
        damage: 25,
        attackRate: 1.5,
        range: 1.5,
        arc: 90,
        staminaCost: 10
    } as MeleeWeapon,

    'katana': {
        ...ItemTemplate,
        id: 6,
        label: 'Katana',
        name: 'Катана',
        icon: 'mdi:sword',
        durability: 150,
        maxDurability: 150,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: ItemType.MeleeWeapon,
        damage: 40,
        attackRate: 1,
        range: 2,
        arc: 120,
        staminaCost: 15
    } as MeleeWeapon,

    'throwing_knife': {
        ...ItemTemplate,
        id: 7,
        label: 'Throwing Knife',
        name: 'Метательный нож',
        icon: 'mdi:knife-military',
        quantity: 3,
        rarity: Rarity.UNCOMMON,
        position: { x: 0, y: 0 },
        type: ItemType.Throwable,
        damage: 30,
        throwForce: 50,
    } as ThrowableWeapon,

    'molotov': {
        ...ItemTemplate,
        id: 8,
        label: 'Molotov Cocktail',
        name: 'Коктейль Молотова',
        icon: 'mdi:fire',
        quantity: 1,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: ItemType.Throwable,
        damage: 10,
        throwForce: 40,
        explosionRadius: 3,
        fuseTime: 2,
    } as ThrowableWeapon,

    'barricade': {
        ...ItemTemplate,
        id: 9,
        label: 'Barricade',
        name: 'Баррикада',
        icon: 'mdi:wall',
        durability: 200,
        maxDurability: 200,
        quantity: 0,
        maxQuantity: 4,
        rarity: Rarity.UNCOMMON,
        position: { x: 0, y: 0 },
        type: ItemType.Deployable,
        health: 300,
        deployTime: 3,
        isBlocking: true
    } as DeployableItem,

    'turret': {
        ...ItemTemplate,
        id: 10,
        label: 'Auto Turret',
        name: 'Авто-турель',
        icon: 'game-icons:tesla-turret',
        durability: 100,
        maxDurability: 100,
        quantity: 0,
        maxQuantity: 1,
        rarity: Rarity.EPIC,
        position: { x: 0, y: 0 },
        type: ItemType.Deployable,
        health: 150,
        deployTime: 5,
        activeTime: 60,
        isPassive: true,
        isBlocking: false
    } as DeployableItem,

    'kevlar_vest': {
        ...ItemTemplate,
        id: 11,
        label: 'Kevlar Vest',
        name: 'Кевларовый жилет',
        icon: 'mdi:shield',
        durability: 100,
        maxDurability: 100,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: ItemType.Wearable,
        slotType: SlotType.CHESTPLATE,
        effects:
        {
            'damageReduction': 0.3,
            'speed': -0.1
        }
    } as WearableItem,

    'tactical_helmet': {
        ...ItemTemplate,
        id: 12,
        label: 'Tactical Helmet',
        name: 'Тактический шлем',
        icon: 'mdi:hard-hat',
        durability: 80,
        maxDurability: 80,
        rarity: Rarity.UNCOMMON,
        position: { x: 0, y: 0 },
        type: ItemType.Wearable,
        slotType: SlotType.HELMET,
        effects:
        {
            'headshotProtection': 0.5
        }
    } as WearableItem,

    'adrenaline_injector': {
        ...ItemTemplate,
        id: 13,
        label: 'Adrenaline Injector',
        name: 'Адреналиновый инъектор',
        icon: 'mdi:needle',
        quantity: 1,
        rarity: Rarity.LEGENDARY,
        position: { x: 0, y: 0 },
        type: ItemType.Special,
        slotType: "special",
        restrictions:
        {
            'health': -20,
            'staminaRegen': -0.3
        },
        benefits:
        {
            'speed': 0.4,
            'damage': 0.25,
            'fireRate': 0.3
        },
        activated: false,
    } as SpecialItem,

    'stealth_module': {
        ...ItemTemplate,
        id: 14,
        label: 'Stealth Module',
        name: 'Модуль скрытности',
        icon: 'mdi:ghost',
        rarity: Rarity.EPIC,
        position: { x: 0, y: 0 },
        type: ItemType.Special,
        slotType: "special",
        restrictions:
        {
            'armor': -0.5,
            'noise': 0.2
        },
        benefits:
        {
            'visibility': -0.7,
            'moveSilently': 1
        },
        activated: false,
    } as SpecialItem,

    'storm_crossbow': {
        ...ItemTemplate,
        id: 15,
        label: "ranged_weapon",
        name: "Штормовой арбалет",
        icon: "game-icons:crossbow",
        quantity: 1,
        durability: 200,
        maxDurability: 200,
        rarity: Rarity.EPIC,
        position: { x: 0, y: 0 },
        type: "ranged_weapon",
        damage: 45,
        fireRate: 1.2,
        reloadTime: 2.5,
        magazineSize: 1,
        currentAmmo: 1,
        maxRange: 30,
        spreadAngle: 0,
        projectileSpeed: 70,
        ammoType: "bolts",
        isAutomatic: false
    } as RangedWeapon,

    'shadow_claws': {
        ...ItemTemplate,
        id: 16,
        label: "melee_weapon",
        name: "Когти тени",
        icon: "game-icons:bird-claw",
        quantity: 1,
        durability: 150,
        maxDurability: 150,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: "melee_weapon",
        damage: 30,
        attackRate: 2.5,
        range: 1.8,
        arc: 180,
        staminaCost: 10
    } as MeleeWeapon,

    'ancient_helmet': {
        ...ItemTemplate,
        id: 17,
        label: "armor",
        name: "Шлем древнего воина",
        icon: "game-icons:dwarf-helmet",
        durability: 120,
        maxDurability: 120,
        rarity: Rarity.LEGENDARY,
        position: { x: 0, y: 0 },
        type: ItemType.Wearable,
        slotType: "helmet",
        increments:
        {
            armor: 12 
        },
        effects: 
        {
            "defense": 15,
        }
    } as WearableItem,

    'spike_grenade': {
        ...ItemTemplate,
        id: 18,
        label: "throwable",
        name: "Граната с шипами",
        icon: "game-icons:bundle-grenade",
        quantity: 3,
        rarity: "uncommon",
        position: { x: 0, y: 0 },
        type: "throwable",
        damage: 40,
        throwForce: 18,
        explosionRadius: 4.5,
        fuseTime: 3,
    } as ThrowableWeapon,

    'speedster_boots': {
        ...ItemTemplate,
        id: 19,
        label: "armor",
        name: "Сапоги скорохода",
        icon: "game-icons:running-shoe",
        durability: 46,
        maxDurability: 46,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: ItemType.Wearable,
        slotType: "boots",
        increments:
        {
            armor: 8,
        },
        effects: 
        {
            "moveSpeed": 25,
            "dodgeChance": 10
        }
    } as WearableItem,

    'auto_turret': {
        ...ItemTemplate,
        id: 20,
        label: "deployable",
        name: "Мини-турель",
        icon: "game-icons:walking-turret",
        quantity: 0,
        maxQuantity: 1,
        durability: 100,
        maxDurability: 100,
        rarity: Rarity.EPIC,
        position: { x: 0, y: 0 },
        type: "deployable",
        health: 120,
        deployTime: 3,
        activeTime: 30,
        isBlocking: true
    } as DeployableItem,

    'fury_potion': {
        ...ItemTemplate,
        id: 21,
        label: "consumable",
        name: "Зелье ярости",
        icon: "hugeicons:potion",
        quantity: 1,
        rarity: Rarity.RARE,
        position: { x: 0, y: 0 },
        type: "active",
        useTime: 1,
        cooldown: 60,
        effect: "boost_damage",
    } as ActiveItem,

    'mammoth_plate': {
        ...ItemTemplate,
        id: 22,
        label: "armor",
        name: "Нагрудник мамонта",
        icon: "game-icons:leather-vest",
        durability: 180,
        maxDurability: 180,
        rarity: Rarity.EPIC,
        position: { x: 0, y: 0 },
        type: ItemType.Wearable,
        slotType: "chestplate",
        increments:
        {
            armor: 31,
        },
        effects: 
        {
            "defense": 30,
            "knockbackResist": 50
        }
    } as WearableItem,

    'vampire_dagger': {
        ...ItemTemplate,
        id: 23,
        label: "melee_weapon",
        name: "Кинжал вампира",
        icon: "game-icons:stiletto",
        quantity: 1,
        durability: 120,
        maxDurability: 120,
        rarity: Rarity.LEGENDARY,
        position: { x: 0, y: 0 },
        type: "melee_weapon",
        damage: 25,
        attackRate: 3,
        range: 1.5,
        arc: 90,
        staminaCost: 5
    } as MeleeWeapon,

    'revival_totem': {
        ...ItemTemplate,
        id: 24,
        label: "special",
        name: "Тотем возрождения",
        icon: "game-icons:totem-head",
        quantity: 1,
        rarity: Rarity.LEGENDARY,
        position: { x: 0, y: 0 },
        type: "special",
        slotType: "special",
        restrictions: {
            "maxHealth": -25
        },
        benefits: {
            "reviveChance": 100,
            "cooldownReduction": 20
        },
        activated: false,
    } as SpecialItem
};

export const getItemById = (id: number) =>
{
    return Object.values(ItemDatabase).find(item => item.id === id);
};

export const getItemByLabel = (label: string) =>
{
    return ItemDatabase[label];
};

export const createItemInstance = (label: string, position: Position) =>
{
    const template = ItemDatabase[label];
    if (!template) return null;

    return {
        ...template,
        position: { ...position },
        id: Date.now() + Math.floor(Math.random() * 1000)
    } as AnyItem;
};
