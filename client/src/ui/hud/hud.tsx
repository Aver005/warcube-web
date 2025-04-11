'use client'

import React from 'react';
import { MiniMap, ActionsBar, HealthBar, WeaponBar } from './index';

const HUD: React.FC = () =>
{
    return (
        <div className="fixed inset-0 pointer-events-none p-4 flex flex-col justify-between z-50">
            <div className="flex justify-between w-full">
                <MiniMap />
                <ActionsBar />
            </div>
            <div className="flex justify-between w-full items-end">
                <HealthBar />
                <WeaponBar />
            </div>
        </div>
    );
}

export default HUD;