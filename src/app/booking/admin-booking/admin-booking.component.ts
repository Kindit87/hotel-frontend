import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-booking',
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.css']
})
export class AdminBookingComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = false;
  searchTerm = '';

  constructor(private readonly bookingService: BookingService) { }

  async ngOnInit(): Promise<void> {
    await this.loadBookings();
  }

  async loadBookings(): Promise<void> {
    try {
      this.loading = true;
      this.bookings = await lastValueFrom(this.bookingService.getBookings());
      console.log(this.bookings)
    } catch (error) {
      alert('Ошибка загрузки бронирований');
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async cancelBooking(bookingId: number): Promise<void> {
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;

    console.log(bookingId);

    try {
      await lastValueFrom(this.bookingService.cancelBooking(bookingId));
      await this.loadBookings();
    } catch (error) {
      alert('Не удалось отменить бронирование');
      console.error(error);
    }
  }

  get filteredBookings(): BookingResponse[] {
    return this.bookings.filter(b =>
      b.room.number.toString().includes(this.searchTerm)
    );
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
