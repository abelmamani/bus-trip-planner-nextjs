import { Stop } from "./stop.model";

export interface TransferOption {
  tripId: string;
  routeName: string;
  fromShape: number;
  toShape: number;
  transferStop: Stop;
  arrivalTime: string;
  departureTime: string;
  waitDuration: string;
}