import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AuthComponent } from './auth/auth.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomBookingComponent } from './room-booking/room-booking.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { AdminRoomsComponent } from './admin-rooms/admin-rooms.component';
import { AdminSerivcesComponent } from './admin-services/admin-services.component';
import { MyBookingListComponent } from './my-booking-list/my-booking-list.component';
import { AdminBookingComponent } from './admin-booking/admin-booking.component';

const routes: Routes = [
  { path: '', redirectTo: '/rooms', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: AuthComponent },
  { path: 'admin/users', component: AdminUsersComponent },
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
