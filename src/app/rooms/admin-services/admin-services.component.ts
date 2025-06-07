import { Component, OnInit } from "@angular/core"
import { AdditionalServiceService } from "../../services/additional-service.service";
import { AdditionalService } from "../../models/service";

@Component({
  selector: "app-admin-services",
  templateUrl: "./admin-services.component.html",
  styleUrls: ["./admin-services.component.css"],
})
export class AdminSerivcesComponent implements OnInit {
  services: AdditionalService[] = [];

  constructor(private additionalServiceService: AdditionalServiceService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.additionalServiceService.getServices().subscribe((services) => {
      this.services = services;
    });
  }

  deleteService(id: number): void {
    if (confirm("Вы уверены, что хотите удалить эту услугу? Она также будет удалена из всех номеров.")) {
      this.additionalServiceService.deleteService(id).subscribe(() => this.loadServices());
    }
  }
}
