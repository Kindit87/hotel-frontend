import { AdditionalService } from "./service";

export interface Room {
  id: number;
  number: number; // был string — теперь число
  description: string;
  pricePerNight: number;
  capacity: number | null;
  imagePath: string;
  available: boolean;
  additionalServices: AdditionalService[];
}
