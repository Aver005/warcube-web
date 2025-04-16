'use client'
import { OverlayWindowByKey, useUIStore } from '@/stores/ui-store';
import React from 'react';

const Overlays: React.FC = () =>
{
    const { overlayWindow } = useUIStore();
    const overlays = [...OverlayWindowByKey.values()];

    return (
        <>
            {overlays.map(
                ({ type, component: Component }) => 
                    overlayWindow === type && <Component key={type} />
            )}
        </>
    );
}

export default Overlays;