import { AdditionalService } from "./service";

export interface Room {
  id?: number;
  number: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  imagePath: string;
  isAvailable: boolean;
  roomServices: AdditionalService[];
}
