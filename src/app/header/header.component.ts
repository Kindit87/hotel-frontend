import { Component } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user: User | null = null;
  isMenuOpen = false;
  isUserMenuOpen = false;
  protected readonly environment = environment;

  navItems = [{ label: 'Комнаты', route: '/rooms' }];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;

      if (this.user?.role == 'ADMIN') {
        this.navItems.push(
          { label: 'Мои бронирования', route: '/booking/list/my' },
          { label: 'Бронирования', route: '/admin/booking/list' },
          { label: 'Пользователи', route: '/admin/users' },
          { label: 'Управление комнатами', route: '/admin/rooms' },
          { label: 'Доп услуги', route: '/admin/room/services' }
        )
      } else if (this.user?.role == 'MANAGER') {
        this.navItems.push(
          { label: 'Мои бронирования', route: '/booking/list/my' },
          { label: 'Бронирования', route: '/admin/booking/list' },
          { label: 'Управление комнатами', route: '/admin/rooms' },
          { label: 'Доп услуги', route: '/admin/room/services' }
        )
      } else if (this.user?.role == 'USER') {
        this.navItems.push(
          { label: 'Мои бронирования', route: '/booking/list/my' }
        )
      }
      else {
        this.navItems = [
          { label: 'Комнаты', route: '/rooms' }
        ];
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
