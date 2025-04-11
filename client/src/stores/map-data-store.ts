import { ReactNode } from "react";
import { create } from "zustand";

export interface Action
{
    id: number,
    text: string,
    color: string,
    icon?: ReactNode
}

interface MapData
{
    actions: Action[];
    setActions: (actions: Action[]) => void
    newAction: (text: string, color?: string, icon?: ReactNode) => Action;
}

let actionsCount = 1; 
export const useMapDataStore = create<MapData>((set) => ({
    actions: [],
    setActions: (value) => set({ actions: value }),
    newAction: (text, color = 'text-red-600', icon) => 
    {
        const newAction: Action = 
        {
            id: actionsCount++,
            text,
            color,
            icon,
        };
        set((state) => ({ actions: [...state.actions, newAction] }));
        return newAction;
    },
}));
