'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';

interface Item
{
    id: string;
    name: string;
    icon: string;
    quantity?: number;
    durability?: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface PlayerStats
{
    health: number;
    maxHealth: number;
    armor: number;
    maxArmor: number;
    effects: {
        name: string;
        icon: string;
        duration: number;
    }[];
}

const Inventory: React.FC = () =>
{
    const { toggleOverlayHold } = useUIStore();

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [activeWeapon1, setActiveWeapon1] = useState<Item | null>(null);
    const [activeWeapon2, setActiveWeapon2] = useState<Item | null>(null);
    const [activeSpecial, setActiveSpecial] = useState<Item | null>(null);
    const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
    const [inventorySize, setInventorySize] = useState(6);
    const [helmet, setHelmet] = useState<Item | null>(null);
    const [chestplate, setChestplate] = useState<Item | null>(null);
    const [boots, setBoots] = useState<Item | null>(null);

    const playerStats: PlayerStats = {
        health: 75,
        maxHealth: 100,
        armor: 45,
        maxArmor: 100,
        effects: [
            { name: 'Regeneration', icon: '❤️', duration: 12 },
            { name: 'Speed Boost', icon: '⚡', duration: 8 }
        ]
    };

    // Анимации
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
        exit: { opacity: 0, y: 20 }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.1 } },
        tap: { scale: 0.95 }
    };

    const statsVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.3 } }
    };

    const slotVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.1 + i * 0.05, duration: 0.3 }
        })
    };

    const selectItem = (item: Item) =>
    {
        setSelectedItem(item);
    };

    const equipItem = (slot: 'weapon1' | 'weapon2' | 'special' | 'helmet' | 'chestplate' | 'boots') =>
    {
        if (!selectedItem) return;

        // Логика экипировки
        // ...
    };

    return (
        <div className="fixed bottom-4 right-4 z-100">
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-900 bg-opacity-90 rounded-xl p-6 w-full max-w-4xl h-[80vh] flex"
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
                                            className="bg-gray-700 rounded-lg p-3 h-16 flex items-center justify-center"
                                            variants={slotVariants}
                                            custom={i}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            {slot === 'helmet' && helmet ? (
                                                <div className="text-center">
                                                    <div className="text-lg">{helmet.icon}</div>
                                                    <div className="text-xs text-gray-300">{helmet.name}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">{slot.charAt(0).toUpperCase() + slot.slice(1)}</span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Основной инвентарь */}
                        <div className="w-2/4 px-4">
                            <h3 className="text-xl font-bold text-white mb-4">Inventory ({inventoryItems.length}/{inventorySize})</h3>
                            <motion.div
                                className="grid grid-cols-4 gap-3"
                                variants={containerVariants}
                            >
                                {Array.from({ length: inventorySize }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`aspect-square rounded-lg flex items-center justify-center ${i < inventoryItems.length ? 'bg-gray-700 cursor-pointer' : 'bg-gray-800 border border-dashed border-gray-600'}`}
                                        variants={itemVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => i < inventoryItems.length && selectItem(inventoryItems[i])}
                                    >
                                        {i < inventoryItems.length ? (
                                            <div className="text-center">
                                                <div className="text-2xl">{inventoryItems[i].icon}</div>
                                                {inventoryItems[i].quantity && (
                                                    <div className="text-xs bg-black bg-opacity-50 rounded-full px-1 absolute bottom-1 right-1">
                                                        {inventoryItems[i].quantity}
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
                                        { slot: 'weapon1', item: activeWeapon1, label: 'Primary' },
                                        { slot: 'weapon2', item: activeWeapon2, label: 'Secondary' },
                                        { slot: 'special', item: activeSpecial, label: 'Special' }
                                    ].map(({ slot, item, label }, i) => (
                                        <motion.div
                                            key={slot}
                                            className="bg-gray-700 rounded-lg p-3 h-16 flex items-center justify-center"
                                            variants={slotVariants}
                                            custom={i + 3}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            {item ? (
                                                <div className="text-center">
                                                    <div className="text-lg">{item.icon}</div>
                                                    <div className="text-xs text-gray-300">{item.name}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">{label}</span>
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
                                    <div className="text-4xl text-center my-4">{selectedItem.icon}</div>
                                    <div className="text-gray-300 text-sm mb-4">
                                        {selectedItem.quantity && <div>Quantity: {selectedItem.quantity}</div>}
                                        {selectedItem.durability && <div>Durability: {selectedItem.durability}%</div>}
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
