import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './users/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './users/auth/auth.component';
import { RouterModule } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RoomCardComponent } from './rooms/room-card/room-card.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { RoomBookingComponent } from './booking/room-booking/room-booking.component';
import { ServiceFormComponent } from './rooms/service-form/service-form.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { AdminRoomsComponent } from './rooms/admin-rooms/admin-rooms.component';
import { AdminSerivcesComponent } from './rooms/admin-services/admin-services.component';
import { MyBookingListComponent } from './booking/my-booking-list/my-booking-list.component';
import { AdminBookingComponent } from './booking/admin-booking/admin-booking.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { HomepageComponent } from './homepage/homepage.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';

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
    AdminBookingComponent,
    UserProfileComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    NgOptimizedImage,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
