import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { AdminUserService } from "../services/admin-user.service"
import { lastValueFrom } from "rxjs"
import { User } from "../services/admin-user.service";

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

  constructor(
    private readonly userService: AdminUserService,
    private formBuilder: FormBuilder,
  ) {
    this.editForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
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

  openEditModal(user: User): void {
    this.selectedUser = user;

    this.editForm.patchValue({
      firstName: this.selectedUser.firstName,
      lastName: this.selectedUser.lastName,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
    })
    this.showEditModal = true
  }

  closeEditModal(): void {
    this.showEditModal = false
    this.selectedUser = null
  }

  async saveUser(): Promise<void> {
    if (!this.selectedUser || !this.editForm.valid) return;

    const updatedUser = { id: this.selectedUser.id, ...this.editForm.value };

    if (!updatedUser.password) {
      delete updatedUser.password;
    }

    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
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


  async deleteUser(userId: string): Promise<void> {
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
}

