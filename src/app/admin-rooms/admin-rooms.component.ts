import { Component, OnInit } from "@angular/core";
import { RoomsService } from "../services/rooms.service";
import { Room } from "../models/room";
import {environment} from '../../environments/environment';

@Component({
  selector: "app-admin-rooms",
  templateUrl: "./admin-rooms.component.html",
  styleUrls: ["./admin-rooms.component.css"],
})
export class AdminRoomsComponent implements OnInit {
  rooms: Room[] = [];
  protected readonly environment = environment;

  constructor(private roomService: RoomsService) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
      console.log(rooms)
    });
  }

  getServiceNames(room: Room): string {
    console.log(room.additionalServices)
    return room.additionalServices?.length ? room.additionalServices.map(service => service.name).join(", ") : "—";
  }

  getTotalPrice(room: Room): number {
    const serviceSum = room.additionalServices?.reduce((acc, curr) => acc + curr.price, 0) ?? 0;
    return room.pricePerNight + serviceSum;
  }

  deleteRoom(id: number): void {
    if (confirm("Вы уверены, что хотите удалить этот номер?")) {
      this.roomService.deleteRoom(id).subscribe(() => this.loadRooms());
    }
  }
}
