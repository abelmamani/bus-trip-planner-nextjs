import { Stop } from '@/models/stop.model';
import {create} from 'zustand';

type StopState = {
    stops: Stop[] | null;
    origin: Stop | null; 
    transfer: Stop | null;
    destination: Stop | null;
    setOrigin: (origin: Stop) => void;
    setTransfer: (transfer: Stop) => void;
    clearTransfer: () => void;
    setDestination: (destination: Stop) => void;
    setStops: (stops: Stop[]) => void;
    clearStops: () => void;
}

export const useStopStore = create<StopState>((set) => ({
    stops: null,
    origin: null,
    transfer: null,
    destination: null,
    setOrigin: (origin) => set({origin}),
    setTransfer: (transfer) => set({transfer}),
    setDestination: (destination) => set({destination}),
    setStops: (stops) => set({stops}),
    clearStops: () => set({stops: null}),  
    clearTransfer: () => set({transfer: null}) 
}));