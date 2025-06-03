import { Component, OnInit } from '@angular/core';
import { Room } from '../models/room';
import { RoomsService } from '../services/rooms.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private roomsService: RoomsService) { }

  ngOnInit(): void {
    this.roomsService.getAvailableRooms().subscribe(rooms => {
      this.rooms = rooms;
      console.log(this.rooms);
    });
  }
}
