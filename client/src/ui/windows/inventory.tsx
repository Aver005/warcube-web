'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnyItem, Item, ItemType, WearableItem, SpecialItem, isStackableItem, isConsumableItem } from '@/types/items';
import { usePlayerStore } from '@/stores/player-store';
import { useGameStore } from '@/stores/game-store';

interface PlayerStats
{
    health: number;
    maxHealth: number;
    armor: number;
    maxArmor: number;
    effects: 
    {
        name: string;
        icon: string;
        duration: number;
    }[];
}

const containerVariants =
{
    hidden: { opacity: 0, y: 20 },
    visible: 
    {
        opacity: 1,
        y: 0,
        transition: 
        {
            duration: 0.3,
            ease: "easeOut",
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    exit: { opacity: 0, y: 20 }
};

const itemVariants = 
{
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 0.95 },
    hover: { scale: 1, transition: { duration: 0.1 } },
    tap: { scale: 0.9 }
};

const statsVariants = 
{
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.3 } }
};

const slotVariants = 
{
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => 
    ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 + i * 0.05, duration: 0.3 }
    })
};

const Inventory: React.FC = () =>
{
    const { inventory, updateInventory } = usePlayerStore();
    const { health, armor } = useGameStore();

    const [selectedItem, setSelectedItem] = useState<AnyItem | null>(null);
    const [inventorySize, setInventorySize] = useState(6);

    const playerStats: PlayerStats =
    {
        health,
        maxHealth: 100,
        armor,
        maxArmor: 100,
        effects:
        [
            { name: 'Regeneration', icon: '❤️', duration: 12 },
            { name: 'Speed Boost', icon: '⚡', duration: 8 }
        ]
    };

    const selectItem = (item: Item) =>
    {
        setSelectedItem(item);
    };

    const onSuccessEquip = (replaceItem: AnyItem | null = null) =>
    {
        if (!selectedItem) return;

        const items = inventory.items
        inventory.items = replaceItem ? items.map((item) => 
        {
            if (item.id === replaceItem.id) return selectedItem; 
            if (item.id === selectedItem.id) return replaceItem;
            return item
        }) : items.filter(i => i.id !== selectedItem.id);

        setSelectedItem(null);
        updateInventory();
    }

    const equipArmor = (index: number) =>
    {
        if (!selectedItem) return;
        console.log(selectedItem)
        if (selectedItem.type !== ItemType.Wearable) return
        if (inventory.armorSlots[index]) return

        inventory.armorSlots[index] = selectedItem as WearableItem;
        onSuccessEquip();
    }

    const equipHotbar = (slot: 'active' | 'special' | string, index: number) =>
    {
        if (!selectedItem) return;
        if (selectedItem.slotType !== slot) return;

        let replaceItem = null;
        if (slot === 'active')
        {
            if (inventory.hotbar[index]) return
            inventory.hotbar[index] = selectedItem;
        }
        else
        {
            if (inventory.specialSlot)
            {
                if (inventory.specialSlot.activated) return
                replaceItem = {...inventory.specialSlot};
            }
            inventory.specialSlot = selectedItem as SpecialItem;
        }

        onSuccessEquip(replaceItem);
    }

    return (
        <div className="fixed bottom-4 right-4 z-100 pointer-events-auto">
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-900 bg-opacity-90 rounded-xl p-6 w-full max-w-7xl h-[80vh] flex"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        {/* Блок статистики игрока */}
                        <motion.div
                            className="w-1/4 pr-4 flex flex-col"
                            variants={statsVariants}
                        >
                            <div className="bg-gray-800 rounded-lg p-4 mb-4">
                                <h3 className="text-xl font-bold text-white mb-4">Player Stats</h3>

                                {/* Здоровье */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-white mb-1">
                                        <span>Health</span>
                                        <span>{playerStats.health}/{playerStats.maxHealth}</span>
                                    </div>
                                    <motion.div
                                        className="h-2 bg-red-900 rounded-full overflow-hidden"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(playerStats.health / playerStats.maxHealth) * 100}%` }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    >
                                        <div className="h-full bg-red-500 rounded-full" />
                                    </motion.div>
                                </div>

                                {/* Броня */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-white mb-1">
                                        <span>Armor</span>
                                        <span>{playerStats.armor}/{playerStats.maxArmor}</span>
                                    </div>
                                    <motion.div
                                        className="h-2 bg-blue-900 rounded-full overflow-hidden"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(playerStats.armor / playerStats.maxArmor) * 100}%` }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    >
                                        <div className="h-full bg-blue-400 rounded-full" />
                                    </motion.div>
                                </div>

                                {/* Эффекты */}
                                <div className="mt-4">
                                    <h4 className="text-white mb-2">Effects</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {playerStats.effects.map((effect, i) => (
                                            <motion.div
                                                key={i}
                                                className="bg-gray-700 rounded-full p-2 flex items-center"
                                                variants={itemVariants}
                                                custom={i}
                                            >
                                                <span className="mr-1">{effect.icon}</span>
                                                <span className="text-xs text-white">{effect.duration}s</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Броня */}
                            <div className="bg-gray-800 rounded-lg p-4 flex-1">
                                <h3 className="text-xl font-bold text-white mb-4">Armor</h3>
                                <div className="space-y-3">
                                    {['helmet', 'chestplate', 'boots'].map((slot, i) => (
                                        <motion.div
                                            key={slot}
                                            className="bg-gray-700 rounded-lg p-4 h-16 flex align-baseline items-center justify-start gap-4"
                                            variants={slotVariants}
                                            custom={i}
                                        >
                                            {inventory.armorSlots[i] ? (
                                                <>
                                                    <img 
                                                        className='size-8'
                                                        src={`./icons/items/${inventory.armorSlots[i].icon.replace(':', '_')}.svg`} 
                                                    />
                                                    <div className="text-sm text-gray-300">
                                                        {inventory.armorSlots[i].name}
                                                    </div>
                                                    <span className='text-xs text-black p-2 bg-amber-500 rounded-full'>
                                                        {inventory.armorSlots[i].durability}
                                                    </span>
                                                </>
                                            ) : (
                                                <span 
                                                    className={`${selectedItem && selectedItem.slotType && selectedItem.slotType === slot ? 'text-white cursor-pointer' : 'text-gray-500'}`}
                                                    onClick={() => equipArmor(i)}
                                                >
                                                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Основной инвентарь */}
                        <div className="w-2/4 px-4">
                            <h3 className="text-xl font-bold text-white mb-4">Inventory ({inventory.items.length}/{inventorySize})</h3>
                            <motion.div
                                className="grid grid-cols-6 gap-3"
                                variants={containerVariants}
                            >
                                {Array.from({ length: inventorySize }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`relative aspect-square rounded-lg flex items-center justify-center ${i < inventory.items.length ? 'bg-gray-700 cursor-pointer' : 'bg-gray-800 border border-dashed border-gray-600'}`}
                                        variants={itemVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => i < inventory.items.length && selectItem(inventory.items[i])}
                                    >
                                        {i < inventory.items.length ? (
                                            <div className="text-center">
                                                <img 
                                                    className='size-8'
                                                    src={`./icons/items/${inventory.items[i].icon.replace(':', '_')}.svg`} 
                                                />
                                                {isStackableItem(inventory.items[i]) && (
                                                    <div className="text-xs text-gray-300 bg-black/20 rounded-full size-6 flex items-center justify-center absolute bottom-1 right-1">
                                                        {inventory.items[i].quantity}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Активные слоты и информация о предмете */}
                        <div className="w-1/4 pl-4 flex flex-col">
                            {/* Активные слоты */}
                            <div className="bg-gray-800 rounded-lg p-4 mb-4">
                                <h3 className="text-xl font-bold text-white mb-4">Active Slots</h3>
                                <div className="space-y-3">
                                    {[
                                        { slot: 'active', item: inventory.hotbar[0], label: 'Primary' },
                                        { slot: 'active', item: inventory.hotbar[1], label: 'Secondary' },
                                        { slot: 'special', item: inventory.specialSlot, label: 'Special' }
                                    ].map(({ slot, item, label }, i) => (
                                        <motion.div
                                            key={label}
                                            className="bg-gray-700 rounded-lg p-4 h-16 flex align-baseline items-center justify-start gap-4"
                                            variants={slotVariants}
                                            custom={i + 3}
                                        >
                                            {item ? (
                                                <>
                                                    <img 
                                                        className='size-8'
                                                        src={`./icons/items/${item.icon.replace(':', '_')}.svg`} 
                                                    />
                                                    <div className="text-xs text-gray-300">{item.name}</div>
                                                </>
                                            ) : (
                                                <span 
                                                    className={`${selectedItem && (selectedItem.slotType && selectedItem.slotType === slot) ? 'text-white cursor-pointer' : 'text-gray-500'}`}
                                                    onClick={() => equipHotbar(slot, i)}
                                                >
                                                    {label}
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Информация о предмете */}
                            {selectedItem && (
                                <motion.div
                                    className="bg-gray-800 rounded-lg p-4 flex-1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-2">{selectedItem.name}</h3>
                                    <div className="text-4xl text-center my-4">
                                        <img 
                                            className='size-24'
                                            src={`./icons/items/${selectedItem.icon.replace(':', '_')}.svg`} 
                                        />
                                    </div>
                                    <div className="text-gray-300 text-sm mb-4">
                                        {isStackableItem(selectedItem) && <div>Quantity: {selectedItem.quantity}</div>}
                                        {isConsumableItem(selectedItem) && <div>Durability: {selectedItem.durability}%</div>}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <motion.button
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Use
                                        </motion.button>
                                        <motion.button
                                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Drop
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
