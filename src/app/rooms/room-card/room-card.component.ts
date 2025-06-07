import { Component, Input } from '@angular/core';
import { Room } from '../../models/room';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.css']
})
export class RoomCardComponent {
  @Input() room!: Room;
  protected readonly environment = environment;
}
