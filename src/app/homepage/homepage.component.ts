import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Room} from '../models/room';
import {RoomsService} from '../services/rooms.service';
import {environment} from '../../environments/environment';
import * as L from 'leaflet';
import {Router} from '@angular/router';
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  bookingForm: FormGroup
  contactForm: FormGroup
  isMenuOpen = false
  rooms: Room[] = []

  amenities = [
    { icon: "📶", title: "Бесплатный Wi-Fi", description: "Высокоскоростной интернет во всех номерах" },
    { icon: "🚗", title: "Парковка", description: "Бесплатная охраняемая парковка" },
    { icon: "🍽️", title: "Ресторан", description: "Изысканная кухня и завтраки" },
    { icon: "🏊", title: "Бассейн", description: "Крытый бассейн с подогревом" },
    { icon: "💪", title: "Фитнес-центр", description: "Современное спортивное оборудование" },
    { icon: "☕", title: "Кафе-бар", description: "Напитки и закуски 24/7" },
    { icon: "🛎️", title: "Консьерж", description: "Круглосуточная поддержка гостей" },
    { icon: "📍", title: "Центр города", description: "В 5 минутах от главных достопримечательностей" },
  ]

  reviews = [
    {
      name: "Анна Смирнова",
      avatar: "АС",
      rating: 5,
      comment:
        "Превосходный отель! Персонал очень дружелюбный, номера чистые и комфортные. Завтраки просто великолепные. Обязательно вернемся сюда снова!",
    },
    {
      name: "Михаил Петров",
      avatar: "МП",
      rating: 5,
      comment:
        "Отличное расположение в центре города. Все достопримечательности в пешей доступности. Бассейн и фитнес-центр на высшем уровне.",
    },
    {
      name: "Елена Козлова",
      avatar: "ЕК",
      rating: 5,
      comment:
        "Роскошные номера с прекрасным видом. Ресторан отеля предлагает изысканные блюда. Сервис безупречный, чувствуешь себя как дома.",
    },
  ]

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      checkin: ["", Validators.required],
      checkout: ["", Validators.required],
      guests: ["", Validators.required],
    })

    this.contactForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      message: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const checkIn = today.toISOString().split('T')[0];
    const checkOut = tomorrow.toISOString().split('T')[0];

    this.roomsService.getAvailableRooms(checkIn, checkOut).subscribe({
      next: (data) => this.rooms = data.slice(0, 6),
      error: (err) => console.error("Ошибка загрузки комнат:", err)
    });
  }


  ngAfterViewInit(): void {
    const map = L.map('map').setView([55.7558, 37.6173], 15); // Москва

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([55.7558, 37.6173])
      .addTo(map)
      .bindPopup('Здесь находится наш отель!')
      .openPopup();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  onBookingSubmit() {
    if (this.bookingForm.valid) {
      const { checkin, checkout, guests } = this.bookingForm.value;

      this.router.navigate(['/rooms'], {
        queryParams: {
          checkIn: checkin,
          checkOut: checkout,
          capacity: guests
        }
      });
    }
  }

  onContactSubmit() {
    if (this.contactForm.valid) {
      console.log("Contact form submitted:", this.contactForm.value)
      // Здесь будет логика отправки сообщения
    }
  }

  bookRoom(roomId: number) {
    console.log("Booking room:", roomId)
    // Логика бронирования конкретного номера
  }

  getStars(rating: number): string[] {
    return Array(rating).fill("⭐")
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    this.isMenuOpen = false
  }

  protected readonly environment = environment;
}
