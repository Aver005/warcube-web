'use client'

import React from 'react';
import { HUD } from './hud';
import { OverlayWindowByKey, useUIStore } from '@/stores/ui-store';

const App: React.FC = () =>
{
    const { overlayWindow } = useUIStore();
    const overlays = [...OverlayWindowByKey.values()];

    return (
        <div>
            {overlays.map(
                ({ type, component: Component }) => 
                    overlayWindow === type && <Component key={type} />
            )}
            <HUD />
        </div>
    );
}

export default App;
