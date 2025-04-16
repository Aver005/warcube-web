'use client'

import React from 'react';
import { HUD } from './hud';
import Overlays from './windows/overlays';

const App: React.FC = () =>
{

    return (
        <div>
            <Overlays />
            <HUD />
        </div>
    );
}

export default App;
