'use client'
import React from 'react';
import { useGameStore } from '../stores/ui';

const App: React.FC = () =>
{
    const { score, playerHealth, ammo } = useGameStore();

    return (
        <div className="p-2">
            {/* Панель счёта */}
            <div className="bg-gray-800/80 text-white px-4 py-2 rounded-lg mb-2">
                <span className="font-bold">Ammo:</span> {ammo}
            </div>

            {/* Полоска здоровья */}
            <div className="bg-red-500/80 h-6 rounded-full" style={{ width: `${playerHealth}%` }} />
        </div>
    );
}

export default App;