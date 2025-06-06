import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdditionalServiceService } from "../../services/additional-service.service";
import { AdditionalService } from "../../models/service";
import { RoomsService } from "../../services/rooms.service";
import {environment} from '../../../environments/environment';

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

    const roomData = new FormData;

    roomData.append("number", this.roomForm.value.number);
    roomData.append("description", this.roomForm.value.description);
    roomData.append("pricePerNight", this.roomForm.value.price);
    roomData.append("capacity", this.roomForm.value.capacity);

    if (this.isBase64Image(this.roomForm.value.imagePath)) {
      roomData.append("image", this.base64ToFile(this.roomForm.value.imagePath, ""));
    }

    roomData.append("additionalServiceIds",
      this.roomForm.value.roomServices.map(
      (service: AdditionalService) => service.id
    ));

    const request = this.isEditMode && this.roomId
      ? this.roomService.updateRoom(this.roomId, roomData)
      : this.roomService.createRoom(roomData);

    request.subscribe(() => {
      this.router.navigate(["/admin/rooms"]);
    });
  }

  base64ToFile(base64String: string, filename: string): File {
    console.log(base64String)

    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  isBase64Image(str: string): boolean {
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/=\s]+$/;
    return base64Regex.test(str.trim());
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
