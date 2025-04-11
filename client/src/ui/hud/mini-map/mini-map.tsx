'use client'
import { MapIcon } from 'lucide-react';
import React from 'react';

const MiniMap: React.FC = () =>
{

    return (
        <div className='space-y-2'>
            {/* Мини-карта (слева сверху) */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 w-60 h-60 flex items-center justify-center border border-gray-600">
                <MapIcon className="text-gray-400 w-8 h-8" />
                <div className="absolute top-3 left-3 text-white text-xs font-bold bg-gray-900/80 px-2 py-1 rounded">
                    DE_DUST2
                </div>
            </div>

            {/* Информация о матче */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-2">
                <div className="flex justify-between text-xs text-gray-300">
                    <span className='text-gray-200'>DEATHMATCH</span>
                    <span className="font-mono">12:45</span>
                </div>
            </div>
        </div>
    );
}

export default MiniMap;