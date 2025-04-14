import React from "react";
import Inventory from "@/ui/windows/inventory";
import PlayerList from "@/ui/windows/player-list";
import { create } from "zustand";
import PauseMenu from "@/ui/windows/pause-menu";

export enum OverlayType
{
    NONE = 'none',
    MAP = 'map',
    PLAYER_LIST = 'player-list',
    INVENTORY = 'inventory',
    PAUSE = 'pause'
}

export type OverlayWindowData = { type: OverlayType, component: React.FC<any>, hold: boolean, forceCloser?: boolean };
export const OverlayWindowByKey = new Map<number, OverlayWindowData>(
[
    [Phaser.Input.Keyboard.KeyCodes.TAB, 
    { 
        type: OverlayType.PLAYER_LIST, 
        component: PlayerList, 
        hold: true 
    }],
    [Phaser.Input.Keyboard.KeyCodes.I, 
    { 
        type: OverlayType.INVENTORY, 
        component: Inventory, 
        hold: false 
    }],
    [Phaser.Input.Keyboard.KeyCodes.ESC, 
    { 
        type: OverlayType.PAUSE, 
        component: PauseMenu, 
        hold: false,
        forceCloser: true
    }],
    [Phaser.Input.Keyboard.KeyCodes.M, 
    { 
        type: OverlayType.MAP, 
        component: PlayerList, 
        hold: true 
    }],
]);

interface UIStore
{
    overlayWindow: OverlayType;
    holdOverlay: boolean;
    setOverlayWindow: (value: OverlayType) => void;
    seyHoldOverlay: (value: boolean) => void;
    toggleOverlayHold: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    overlayWindow: OverlayType.NONE,
    holdOverlay: false,
    toggleOverlayHold: () => set({ holdOverlay: !useUIStore.getState().holdOverlay }),
    setOverlayWindow: (value) => set({ overlayWindow: value }),
    seyHoldOverlay: (value) => set({ holdOverlay: value })
}));
