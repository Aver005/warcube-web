import { create } from "zustand";

interface GameStore
{
    score: number;
    health: number;
    armor: number;
    kills: number;
    deaths: number;
    ammo: number;
    activeWeapon: number;

    setScore: (value: number) => void;
    setHealth: (value: number) => void;
    setAmmo: (value: number) => void;
    setActiveWeapon: (value: number) => void;
    setKills: (value: number) => void;
    setDeaths: (value: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
    health: 100,
    armor: 33,
    score: 0,
    ammo: 10,
    kills: 0,
    deaths: 0,
    activeWeapon: 1,

    setScore: (value) => set({ score: value }),
    setHealth: (value) => set({ health: value }),
    setAmmo: (value) => set({ ammo: value }),
    setActiveWeapon: (value) => set({ activeWeapon: value }),
    setKills: (value) => set({ kills: value }),
    setDeaths: (value) => set({ deaths: value }),
}));
