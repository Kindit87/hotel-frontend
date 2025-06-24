import { AdditionalService } from "./service";

export interface Room {
  id: number;
  number: number;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imagePath: string;
  available: boolean;
  additionalServices: AdditionalService[];
}
