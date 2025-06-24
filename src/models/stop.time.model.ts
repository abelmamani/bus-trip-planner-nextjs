import { Stop } from "./stop.model";

export interface StopTime {
    id: string;
    distanceTraveled: number;
    arrivalTime: string;
    stop: Stop;
}