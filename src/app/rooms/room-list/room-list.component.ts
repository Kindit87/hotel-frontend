import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room';
import { RoomsService } from '../../services/rooms.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  allRooms: Room[] = [];
  filterForm: FormGroup;

  constructor(
    private roomsService: RoomsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      checkIn: [''],
      checkOut: [''],
      capacity: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let checkIn = params['checkIn'];
      let checkOut = params['checkOut'];
      const capacity = params['capacity'] || '';
      const maxPrice = params['maxPrice'] || '';

      if (!checkIn || !checkOut) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        checkIn = today.toISOString().split('T')[0];
        checkOut = tomorrow.toISOString().split('T')[0];

        // Обновляем URL с дефолтными датами
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ...params, checkIn, checkOut },
          queryParamsHandling: 'merge'
        });
        return;
      }

      this.roomsService.getAvailableRooms(checkIn, checkOut).subscribe(rooms => {
        this.allRooms = rooms;
        this.filterForm.patchValue({ checkIn, checkOut, capacity, maxPrice });
        this.applyFilters();
      });
    });
  }

  applyFilters(): void {
    const { checkIn, checkOut, capacity, maxPrice } = this.filterForm.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        checkIn,
        checkOut,
        capacity: capacity || null,
        maxPrice: maxPrice || null
      },
      queryParamsHandling: 'merge'
    });

    this.roomsService.getAvailableRooms(checkIn, checkOut).subscribe(rooms => {
      this.allRooms = rooms;

      this.rooms = this.allRooms.filter(room => {
        const matchCapacity = !capacity || room.capacity >= +capacity;
        const matchPrice = !maxPrice || room.pricePerNight <= +maxPrice;
        return matchCapacity && matchPrice;
      });
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
    this.rooms = [...this.allRooms];
  }
}
