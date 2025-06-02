import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { BookingResponse } from '../models/booking';

@Component({
  selector: 'app-my-booking-list',
  templateUrl: './my-booking-list.component.html',
  styleUrls: ['./my-booking-list.component.css']
})
export class MyBookingListComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке бронирований:', error);
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    if (confirm('Точно отменить бронирование?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => this.loadBookings(),
        error: (err) => console.error('Ошибка при отмене бронирования:', err)
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
