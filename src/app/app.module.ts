import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomCardComponent } from './room-card/room-card.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomBookingComponent } from './room-booking/room-booking.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { AdminRoomsComponent } from './admin-rooms/admin-rooms.component';
import { AdminSerivcesComponent } from './admin-services/admin-services.component';
import { MyBookingListComponent } from './my-booking-list/my-booking-list.component';
import { AdminBookingComponent } from './admin-booking/admin-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    AdminUsersComponent,
    HeaderComponent, 
    AuthComponent,
    RoomCardComponent,
    RoomListComponent,
    RoomBookingComponent,
    RoomFormComponent,
    ServiceFormComponent,
    AdminRoomsComponent,
    AdminSerivcesComponent,
    MyBookingListComponent,
    AdminBookingComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
