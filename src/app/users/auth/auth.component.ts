import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  authForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() { return this.authForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    this.authService.login(this.authForm.value).subscribe({
      next: (responce) => {
        this.router.navigate(['/rooms']);
      },
      error: () => {
        this.errorMessage = 'Неверный email или пароль';
      }
    });
  }
}
