import { Room } from "./room";
import { AdditionalService } from "./service";

export interface BookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  additionalServiceIds: number[];
}

export interface BookingResponse {
  id: number;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  additionalService: AdditionalService[];
}
