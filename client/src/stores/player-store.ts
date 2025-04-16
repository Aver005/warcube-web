import { Inventory } from "@/entities/Inventory";
import { create } from "zustand";

interface PlayerData
{
    x: number;
    y: number;
    inventory: Inventory;
    lastInventoryUpdate: number;
    setX: (x: number) => void;
    setY: (y: number) => void;
    setPosition: (x: number, y: number) => void;
    updateInventory: () => void,
}

export const usePlayerStore = create<PlayerData>((set) => ({
    x: 0,
    y: 0,
    inventory: new Inventory(),
    lastInventoryUpdate: 0,
    setX: (x) => set({ x }), 
    setY: (y) => set({ y }),
    setPosition: (x, y) => set({ x, y }),
    updateInventory: () => set(
        state => ({ 
            lastInventoryUpdate: state.lastInventoryUpdate + 1
        })
    )
}));
