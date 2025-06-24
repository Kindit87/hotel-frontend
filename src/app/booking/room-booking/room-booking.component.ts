import { Component, Input, OnInit } from "@angular/core";
import { RoomsService } from "../../services/rooms.service";
import { Room } from "../../models/room";
import {ActivatedRoute, Router} from "@angular/router";
import { BookingService } from "../../services/booking.service";
import { BookingRequest } from "../../models/booking";
import {environment} from '../../../environments/environment';

@Component({
  selector: "app-room-booking",
  templateUrl: "./room-booking.component.html",
  styleUrls: ["./room-booking.component.css"]
})
export class RoomBookingComponent implements OnInit {
  @Input() roomId: number = 1;
  room: Room | null = null;
  checkInDate: string = this.getTodayDate();
  checkOutDate: string = this.getTomorrowDate();
  dateError = "";
  selectedServices: number[] = [];
  protected readonly environment = environment;

  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['checkIn']) {
        this.checkInDate = params['checkIn'];
      }
      if (params['checkOut']) {
        this.checkOutDate = params['checkOut'];
      }

      this.onDateChange(); // сразу проверь корректность
    });

    this.loadRoomData();
  }

  loadRoomData(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.roomsService.getRoom(id).subscribe({
        next: (room) => (this.room = room),
        error: (err) => {
          console.error('Не удалось загрузить комнату', err);
        },
      });
    }
  }

  toggleService(serviceId: number): void {
    const index = this.selectedServices.indexOf(serviceId);
    if (index === -1) {
      this.selectedServices.push(serviceId);
    } else {
      this.selectedServices.splice(index, 1);
    }
  }

  isServiceSelected(serviceId: number): boolean {
    return this.selectedServices.includes(serviceId);
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  onDateChange(): void {
    if (this.checkInDate && this.checkOutDate) {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);

      if (checkOut <= checkIn) {
        this.dateError = "Дата выезда должна быть позже даты заезда";
        this.checkOutDate = this.getDateAfter(this.checkInDate, 1);
      } else {
        this.dateError = "";
      }
    }
  }

  getDateAfter(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  }

  getNights(): number {
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysText(days: number): string {
    if (days === 1) return "день";
    if (days >= 2 && days <= 4) return "дня";
    return "дней";
  }

  getTotalPrice(): number {
    const nights = this.getNights();
    let total = this.room ? this.room.pricePerNight * nights : 0;

    this.selectedServices.forEach((serviceId) => {
      const service = this.room?.additionalServices.find((s) => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });

    return total;
  }

  getFormattedPriceLine(): string {
    const nights = this.getNights();
    const price = this.room?.pricePerNight || 0;
    const daysText = this.getDaysText(nights);
    return `${price * nights} ₽ × ${nights} ${daysText} = ${price * nights} ₽`;
  }

  bookRoom(): void {
    if (!this.room) {
      alert("Номер не найден.");
      return;
    }

    if (!this.checkInDate || !this.checkOutDate) {
      alert("Пожалуйста, выберите даты заезда и выезда.");
      return;
    }

    if (new Date(this.checkInDate) >= new Date(this.checkOutDate)) {
      alert("Дата выезда должна быть позже даты заезда.");
      return;
    }

    const roomId = this.room.id;
    if (roomId === undefined) {
      alert("ID номера недоступен.");
      return;
    }

    const bookingRequest: BookingRequest = {
      roomId: roomId,
      checkInDate: new Date(this.checkInDate).toISOString(),
      checkOutDate: new Date(this.checkOutDate).toISOString(),
      additionalServiceIds: this.selectedServices ?? []
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (response) => {
        console.log("Бронирование успешно:", response);
        this.router.navigate(['/booking/list/my']);
      },
      error: (err) => {
        console.error("Ошибка бронирования:", err);
        alert(err.error?.message || "Не удалось забронировать номер.");
      },
    });
  }
}
