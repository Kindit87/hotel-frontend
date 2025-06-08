import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {AuthService, User} from '../../services/auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userForm!: FormGroup;
  isEditMode = true;
  isUserEditMode = false;
  isAdmin = false;
  userId?: number;
  imagePreview: string | null = null;
  isImageUploaded = false;
  protected readonly environment = environment;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.isUserEditMode = true;
        this.userId = +params["id"];
        this.loadUser(this.userId);
      } else {
        this.loadMe();
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
      image: [""],
      role: ["USER", [Validators.required]],
    });
  }

  loadUser(id: number): void {
    this.userService.getUser(id).subscribe((user: User) => {
      this.userForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        image: user.image,
        role: user.role,
      });

      if (user.image) {
        this.imagePreview = environment.apiUrl + "/user/image/" + user.image;
      }
    });
  }

  loadMe(): void {
    this.userService.getMe().subscribe((user) => {
      if (user.role === "ADMIN") {
        this.isAdmin = true;
      }

      this.userForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        image: user.image,
        role: user.role,
      });

      if (user.image) {
        this.imagePreview = environment.apiUrl + "/user/image/" + user.image;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const userData = new FormData();

    userData.append("firstname", this.userForm.get("firstname")?.value);
    userData.append("lastname", this.userForm.get("lastname")?.value);
    userData.append("email", this.userForm.get("email")?.value);
    userData.append("role", this.userForm.get("role")?.value);

    const password = this.userForm.get("password")?.value;
    if (password) {
      userData.append("password", password);
    }

    if (this.userForm.value.image && !this.isBase64Image(this.userForm.value.image) && this.isImageUploaded) {
      userData.append("image", this.userForm.value.image, "");
    }

    const request = this.userService.updateMe(userData)

    request.subscribe(() => {
      this.authService.fetchUser();
      if (this.isUserEditMode) {
        this.router.navigate(["/admin/users"]);
      } else {
        this.router.navigate(["/"]);
      }
    });
  }
  isBase64Image(str: string): boolean {
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/=\s]+$/;
    return base64Regex.test(str);
  }

  onFileSelected(event: Event): void {
    this.isImageUploaded = true;

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userForm.patchValue({ image: file });
      this.userForm.get('image')?.updateValueAndValidity();

      // Для превью (если нужно показать)
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
