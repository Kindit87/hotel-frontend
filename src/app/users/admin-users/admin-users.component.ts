import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { UserService } from "../../services/user.service"
import { lastValueFrom } from "rxjs"
import { User } from '../../services/auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: "app-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.css"],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = []
  loading = false
  selectedUser: User | null = null
  searchTerm = ""
  editForm: FormGroup
  showEditModal = false
  imagePreview: string | null = null;

  constructor(
    private readonly userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.editForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
      image: [""],
      role: ["", Validators.required],
    })
  }

  async ngOnInit(): Promise<void> {
    await this.loadUsers()
  }

  async loadUsers(): Promise<void> {
    try {
      this.loading = true
      this.users = await lastValueFrom(this.userService.getUsers());

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  get filteredUsers(): User[] {
    return this.users.filter(
      (user) =>
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }

  openEditModal(id: User): void {

  }

  closeEditModal(): void {
    this.showEditModal = false
    this.selectedUser = null
  }

  async saveUser(): Promise<void> {
    if (!this.selectedUser || !this.editForm.valid) return;

    const updatedUser = new FormData();
    updatedUser.append("id", this.selectedUser.id.toString());
    updatedUser.append("firstname", this.editForm.value.firstname);
    updatedUser.append("lastname", this.editForm.value.lastname);
    updatedUser.append("email", this.editForm.value.email);
    updatedUser.append("role", this.editForm.value.role);

    const password = this.editForm.value.password;
    if (password && password.trim() !== "") {
      updatedUser.append("password", password);
    }

    console.log(updatedUser);

    this.userService.updateUser(this.selectedUser.id, updatedUser).subscribe({
      next: (response) => {
        console.log(response)
        this.loadUsers();
        this.closeEditModal();
      },
      error: (error) => {
        if (error.status === 200) {
          return;
        }
        console.error(error);
      }
    });
  }

  async deleteUser(userId: number): Promise<void> {
    if (!confirm("Are you sure you want to delete this user?")) return

    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (error) => {
        if (error.status === 200) {
          return;
        }
        console.error(error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Патчим file в форму
      this.editForm.patchValue({ image: file });
      this.editForm.get('image')?.updateValueAndValidity();

      // Отображаем превью
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  protected readonly environment = environment;
}

