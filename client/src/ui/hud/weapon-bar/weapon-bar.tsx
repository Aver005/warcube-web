'use client'
import { useGameStore } from '@/stores/game-store';
import { BombIcon, CrosshairIcon, RectangleEllipsisIcon, SwordIcon } from 'lucide-react';
import React from 'react';
import WeaponSlot from './weapon-slot';

const WeaponBar: React.FC = () =>
{
    const { ammo, kills, activeWeapon } = useGameStore();

    const renderWeaponSlots = (activeWeapon: number) =>
    {
        const slots: WeaponSlot[] = 
        [
            {
                id: 0,
                icon: <SwordIcon className="w-full h-full text-gray-300" />,
                type: 'secondary',
                active: activeWeapon === 0,
            },
            {
                id: 1,
                icon: <SwordIcon className="w-full h-full text-gray-300" />,
                type: 'primary',
                active: activeWeapon === 1,
            },
            {
                id: 2,
                icon: <BombIcon className="w-full h-full text-red-400" />,
                type: 'special',
                active: activeWeapon === 2,
            },
        ];

        return (
            <div className="flex space-x-3 h-16">
                {slots.map((slot) => (
                    <WeaponSlot key={slot.id} slot={slot} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-end space-y-4">
            {/* Панель счёта и патронов */}
            <div className="bg-gray-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-6">
                <div className="flex items-center">
                    <CrosshairIcon className="w-5 h-5 mr-2 text-yellow-400" />
                    <span className="font-bold">{kills} KILLS</span>
                </div>
                <div className="flex items-center">
                    <RectangleEllipsisIcon className="w-5 h-5 mr-2 text-gray-300" />
                    <span className="font-bold">{ammo} AMMO</span>
                </div>
            </div>

            {/* Слоты оружия */}
            <div className="flex space-x-3">
                { renderWeaponSlots(activeWeapon) }
            </div>
        </div>
    );
}

export default WeaponBar;