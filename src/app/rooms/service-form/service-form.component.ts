import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdditionalService } from '../../models/service';
import { AdditionalServiceService } from "../../services/additional-service.service";

@Component({
  selector: "app-service-form",
  templateUrl: "./service-form.component.html",
  styleUrls: ["./service-form.component.css"],
})
export class ServiceFormComponent implements OnInit {
  serviceForm!: FormGroup;
  isEditMode = false;
  serviceId?: number;

  constructor(
    private fb: FormBuilder,
    private serviceService: AdditionalServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.serviceId = +params["id"];
        this.loadService(this.serviceId);
      }
    });
  }

  initForm(): void {
    this.serviceForm = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadService(id: number): void {
    this.serviceService.getService(id).subscribe((service) => {
      if (service) {
        this.serviceForm.patchValue({
          name: service.name,
          description: service.description,
          price: service.price,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      return;
    }

    const serviceData: AdditionalService = {
      ...this.serviceForm.value,
    };

    const request$ = this.isEditMode && this.serviceId
      ? this.serviceService.updateService(this.serviceId, serviceData)
      : this.serviceService.createService(serviceData);

    request$.subscribe(() => {
      this.router.navigate(["/admin/room/services"]);
    });
  }
}
