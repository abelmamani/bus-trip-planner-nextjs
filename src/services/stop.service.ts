import { Stop } from "@/models/stop.model";
import { api } from "./axios"

export const stopService = {
    getAllStops: async (): Promise<Stop[]> => {
        const res = await api.get('/stops');
        return res.data;
    }
}