import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-my-booking-list',
  templateUrl: './my-booking-list.component.html',
  styleUrls: ['./my-booking-list.component.css']
})
export class MyBookingListComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  selectedStatus = '';
  checkInFrom: string = '';
  checkInTo: string = '';
  statusList = [
    'PENDING',
    'CONFIRMED',
    'CHECKED_IN',
    'CHECKED_OUT',
    'CANCELLED',
    'NO_SHOW'
  ];
  protected readonly environment = environment;

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;

    this.bookingService
      .getMyBookings(this.currentPage, this.pageSize, this.selectedStatus, this.checkInFrom, this.checkInTo)
      .subscribe({
        next: (data) => {
          this.bookings = data.content;
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка при загрузке моих бронирований:', err);
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

  resetFilters(): void {
    this.selectedStatus = '';
    this.checkInFrom = '';
    this.checkInTo = '';
    this.loadBookings();
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

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}
