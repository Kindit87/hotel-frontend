import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  success = false;
  isFaild = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const { confirmPassword, ...formData } = this.registerForm.value;

    this.registerService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.success = true;
      },
      error: (error) => {
        if (error.status === 200) {
          this.success = true; this.success = true;
          return;
        }

        this.isFaild = true;
        console.error('Registration failed', error);
        this.errorMessage = 'Ошибка регистрации';
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.success = false;
    this.errorMessage = '';
    this.registerForm.reset();
  }
}
