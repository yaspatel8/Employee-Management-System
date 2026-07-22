import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective, CardBodyComponent, CardComponent, ColComponent,
  ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent,
  InputGroupTextDirective, RowComponent
} from "@coreui/angular";
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [
    ContainerComponent, RowComponent, ColComponent, CardComponent,
    CardBodyComponent, FormDirective, FormControlDirective, InputGroupComponent,
    InputGroupTextDirective, ButtonDirective, IconDirective, RouterLink,
    ReactiveFormsModule, CommonModule
  ],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    
    this.forgotPasswordForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.forgotPasswordForm.markAllAsTouched();

    // Clear dynamic notFound errors explicitly on new submit attempts
    const emailControl = this.forgotPasswordForm.get('Email');
    if (emailControl?.hasError('notFound')) {
      emailControl.setErrors(null);
    }

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // Swal.fire({
    //   title: 'Sending Request...',
    //   text: 'Verifying user records, please wait.',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (response: any) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Reset Link Sent',
            text: response.message || 'Check your inbox for password recovery instructions.',
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            this.forgotPasswordForm.reset();
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            text: response.message || 'Unable to register your request at this moment.',
          });
        }
      },
      error: (error: any) => {
        // Automatically check if the backend returned an invalid user record error status
        if (error.status === 404 || error.error?.message?.includes('not found') || error.error?.message?.includes('exist')) {
          this.forgotPasswordForm.get('Email')?.setErrors({ notFound: true });
          Swal.close();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: error.error?.message || 'An error occurred while connecting to the system. Please try again later.'
          });
        }
      }
    });
  }
}
