import { Shape } from "@/models/shape.model";
import { api } from "./axios"

export const shapeService = {
    getShapes: async (name: string, from: number, to: number): Promise<Shape[]> => {
        const res = await api.get(`/shapes?name=${name}&distanceFrom=${from}&distanceTo=${to}`);
        return res.data;
    }
}