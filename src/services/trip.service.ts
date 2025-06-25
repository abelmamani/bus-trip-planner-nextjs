import { TripOption } from "@/models/trip.option.model";
import { api } from "./axios"

export const tripService = {
    tripPlanner: async (data: {origin: string, destination: string}): Promise<TripOption[]> => {
        const res = await api.post('/trips', data);
        return res.data;
    }
}