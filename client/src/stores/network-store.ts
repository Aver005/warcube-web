import { Socket } from "socket.io-client";
import { create } from "zustand";

interface NetworkData
{
    socket: Socket | null;
    setSocket: (socket: Socket) => void;
}

export const useNetworkStore = create<NetworkData>((set) => ({
    socket: null,
    setSocket: (socket: Socket) => set({ socket }),
}));
