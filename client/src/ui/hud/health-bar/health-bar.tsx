'use client'
import { useGameStore } from '@/stores/game-store';
import { HeartIcon, ShieldIcon } from 'lucide-react';
import React from 'react';

const HealthBar: React.FC = () =>
{
    const health = useGameStore((state) => state.health);
    const armor = useGameStore((state) => state.armor);

    return (
        <div className="space-y-4 w-64">
            {/* Полоса брони */}
            <div className="relative">
                <div className="flex items-center mb-2">
                    <ShieldIcon className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-white font-bold text-sm">ARMOR</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-md overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse transition-all duration-300 ease-out"
                        style={{ width: `${armor}%` }}
                    />
                </div>
            </div>

            {/* Полоса здоровья */}
            <div className="relative">
                <div className="flex items-center mb-2">
                    <HeartIcon className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-white font-bold text-sm">HEALTH</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-md overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse transition-all duration-300 ease-out"
                        style={{ width: `${health}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default HealthBar;