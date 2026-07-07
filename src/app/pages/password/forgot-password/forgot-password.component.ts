import { Component } from '@angular/core';
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
} from "@coreui/angular";
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  imports: [ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, FormControlDirective, InputGroupComponent, InputGroupTextDirective, ButtonDirective, IconDirective, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) { }

  forgotPasswordForm = this.formBuilder.group({
    Email: ['', [Validators.required, Validators.email]]
  });

  isSubmitted = false;

  onSubmit() {
    this.isSubmitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Saving...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (response: any) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Password reset request successful. Please check your email for further instructions.',
          }).then(() => {
            this.forgotPasswordForm.reset();
            this.router.navigate(['/login']);
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Failure',
            text: response.message || 'Failed to request password reset. Please try again later.',
          });
        }
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'An error occurred while requesting password reset. Please try again later.'
        });
      }
    });

  }

}
