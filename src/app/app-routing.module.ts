import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './users/register/register.component';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';
import { AuthComponent } from './users/auth/auth.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { RoomBookingComponent } from './booking/room-booking/room-booking.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { ServiceFormComponent } from './rooms/service-form/service-form.component';
import { AdminRoomsComponent } from './rooms/admin-rooms/admin-rooms.component';
import { AdminSerivcesComponent } from './rooms/admin-services/admin-services.component';
import { MyBookingListComponent } from './booking/my-booking-list/my-booking-list.component';
import { AdminBookingComponent } from './booking/admin-booking/admin-booking.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/rooms', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: AuthComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/user/:id', component: UserProfileComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'room/book/:id', component: RoomBookingComponent },
  { path: 'admin/rooms', component: AdminRoomsComponent },
  { path: 'admin/rooms/new', component: RoomFormComponent },
  { path: 'admin/rooms/new/:id', component: RoomFormComponent },
  { path: 'admin/room/services', component: AdminSerivcesComponent },
  { path: 'admin/room/services/new', component: ServiceFormComponent },
  { path: 'admin/room/services/new/:id', component: ServiceFormComponent },
  { path: 'booking/list/my', component: MyBookingListComponent },
  { path: 'admin/booking/list', component: AdminBookingComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
