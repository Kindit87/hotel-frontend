import { Room } from "./room";
import { AdditionalService } from "./service";
import {User} from '../services/auth.service';

export interface BookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  additionalServiceIds: number[];
}

export interface BookingResponse {
  id: number;
  room: Room;
  user: User;
  checkInDate: string;
  checkOutDate: string;
  additionalServices: AdditionalService[];
  status: string;
  totalPrice: number;
}
