import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-booking',
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.css']
})
export class AdminBookingComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  protected readonly environment = environment;
  statusList = [
    'PENDING',
    'CONFIRMED',
    'CHECKED_IN',
    'CHECKED_OUT',
    'CANCELLED',
    'NO_SHOW'
  ];

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data.content.reverse();
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке бронирований:', error);
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    this.bookingService.cancelMyBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Ошибка при отмене бронирования:', err)
    });
  }

  payBooking(id: number): void {
    this.bookingService.payBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Ошибка при оплате бронирования:', err)
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  statusToText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Ожидает оплаты';
      case 'CONFIRMED': return 'Оплачено';
      case 'CHECKED_IN': return 'Заселен';
      case 'CHECKED_OUT': return 'Выселен';
      case 'CANCELLED': return 'Отменено';
      case 'NO_SHOW': return 'Не приехал';
      default: return status;
    }
  }

  changeStatus(id: number, newStatus: string): void {
    this.bookingService.updateBookingStatus(id, newStatus).subscribe({
      next: updated => {
        const i = this.bookings.findIndex(b => b.id === id);
        if (i !== -1) this.bookings[i] = updated;
      },
      error: err => alert('Не удалось обновить статус')
    });
  }
}
