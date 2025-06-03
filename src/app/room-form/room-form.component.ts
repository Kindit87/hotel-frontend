import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdditionalServiceService } from "../services/additional-service.service";
import { AdditionalService } from "../models/service";
import { Room } from "../models/room";
import { RoomsService } from "../services/rooms.service";
import {environment} from '../../environments/environment';

@Component({
  selector: "app-room-form",
  templateUrl: "./room-form.component.html",
  styleUrls: ["./room-form.component.css"],
})
export class RoomFormComponent implements OnInit {
  roomForm!: FormGroup;
  additionalServices: AdditionalService[] = [];
  isEditMode = false;
  roomId?: number;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomsService,
    private additionalService: AdditionalServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAdditionalServices();

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.roomId = +params["id"];
        this.loadRoom(this.roomId);
      }
    });
  }

  initForm(): void {
    this.roomForm = this.fb.group({
      number: ["", [Validators.required]],
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      imagePath: [""],
      roomServices: [[] as AdditionalService[]]
    });
  }

  loadAdditionalServices(): void {
    this.additionalService.getServices().subscribe((services) => {
      this.additionalServices = services;
    });
  }

  loadRoom(id: number): void {
    this.roomService.getRoom(id).subscribe((room) => {
      this.roomForm.patchValue({
        number: room.number,
        name: room.number,
        description: room.description,
        price: room.pricePerNight,
        capacity: room.capacity,
        imagePath: room.imagePath,
        roomServices: room.additionalServices
      });

      if (room.imagePath) {
        this.imagePreview = environment.apiUrl + "/room/image/" + room.imagePath;
      }
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid) return;

    const roomData: Room = {
      ...this.roomForm.value,
      id: this.roomId ?? 0,
      isAvailable: true,
      roomServices: this.roomForm.value.roomServices.map(
        (service: AdditionalService) => service.id
      )
    };

    console.log(roomData);

    const request = this.isEditMode && this.roomId
      ? this.roomService.updateRoom(this.roomId, roomData)
      : this.roomService.createRoom(roomData);

    request.subscribe(() => {
      this.router.navigate(["/admin/rooms"]);
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.roomForm.patchValue({ imagePath: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  isServiceSelected(serviceId: number): boolean {
    const selected = this.roomForm.get("roomServices")?.value as AdditionalService[];
    return selected.some((service) => service.id === serviceId);
  }

  toggleService(serviceId: number): void {
    const selected = this.roomForm.get("roomServices")?.value as AdditionalService[] || [];

    const existingService = selected.find(service => service.id === serviceId);

    if (existingService) {
      const index = selected.indexOf(existingService);
      selected.splice(index, 1);
    } else {
      const serviceToAdd = this.additionalServices.find(service => service.id === serviceId);
      if (serviceToAdd) selected.push(serviceToAdd);
    }

    this.roomForm.patchValue({ roomServices: selected });
  }
}
