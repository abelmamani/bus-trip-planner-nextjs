import { TransferOption } from "./transfer.option.model";
import { TripOptionType } from "./trip.option.enum";

export interface TripOption {
    type: TripOptionType;
    tripId: string;
    routeName: string;
    fromShape: number;
    toShape: number;
    departureStop: string;
    departureTime: string;
    arrivalStop: string;
    arrivalTime: string;
    totalDuration: string;
    transferOption: TransferOption | null;
  }