import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { passwordValidator } from '../../../Validator/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule, CommonModule, RouterLink]
})
export class RegisterComponent {
  RegisterForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.RegisterForm = this.fb.group({
      Fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: [
        '',
        [
          Validators.required,
          passwordValidator()
        ]
      ],
      ConfirmPassword: ['', [Validators.required]]
    });
  }

  errorMessage: string = '';
  passwordErrors: string = '';
  isSubmitted = false;

  onSubmit() {
    this.isSubmitted = true;
    this.passwordErrors = '';
    this.errorMessage = '';

    // Purana duplicate error hata do
    this.RegisterForm.get('Email')?.setErrors(null);

    this.RegisterForm.markAllAsTouched();

    if (this.RegisterForm.invalid) {
      return;
    }

    if (
      this.RegisterForm.value.PasswordHash !==
      this.RegisterForm.value.ConfirmPassword
    ) {
      this.RegisterForm
        .get('ConfirmPassword')
        ?.setErrors({ mismatch: true });

      return;
    }

    this.authService.register(this.RegisterForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.RegisterForm.reset();

          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: res.message,
          });

          this.router.navigate(['/login']);
        } else {
          this.RegisterForm
            .get('Email')
            ?.setErrors({ duplicate: true });
        }
      },
      error: (err) => {
        if (err.error?.message === 'Email already exists') {
          this.RegisterForm
            .get('Email')
            ?.setErrors({ duplicate: true });
        } else {
          this.errorMessage =
            err.error?.message ||
            'An error occurred during registration.';
        }
      }
    });
  }

}
