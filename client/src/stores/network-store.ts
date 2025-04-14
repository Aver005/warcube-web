import MainScene from "@/main-scene";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface NetworkData
{
    socket: Socket | null;
    setSocket: (socket: Socket) => void;
    scene: MainScene | null;
    setScene: (scene: MainScene) => void;
}

export const useNetworkStore = create<NetworkData>((set) => ({
    socket: null,
    setSocket: (socket: Socket) => set({ socket }),
    scene: null,
    setScene: (scene: MainScene) => set({ scene }),
}));
