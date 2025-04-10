import { create } from "zustand";

interface GameStore
{
    score: number;
    playerHealth: number;
    setScore: (value: number) => void;
    setHealth: (value: number) => void;

    ammo: number;
    setAmmo: (value: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
    score: 0,
    playerHealth: 100,
    setScore: (value) => set({ score: value }),
    setHealth: (value) => set({ playerHealth: value }),

    ammo: 10,
    setAmmo: (value) => set({ ammo: value }),
}));
