import { Component, OnInit } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective, CardBodyComponent, CardComponent, ColComponent,
  ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent,
  InputGroupTextDirective, RowComponent
} from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { passwordValidator } from '../../../Validator/password.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  imports: [
    //ContainerComponent, RowComponent, ColComponent, 
    CardComponent,
    CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective,
    IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule,
    CommonModule, RouterLink
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  errorMessage: string = '';
  passwordErrors: string = '';
  isSubmitted = false;
  token: string = '';
  fistlogin: boolean = false;

  // Form input type visibility parameters
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      NewPassword: ['', [Validators.required, passwordValidator()]],
      ConfirmPassword: ['', [Validators.required]],
      token: ['']
    }, { validators: [this.passwordMatchValidator] });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.fistlogin = params['isFistLogin'] === 'true' || params['isFirstLogin'] === 'true';

      if (this.token) {
        this.resetPasswordForm.patchValue({ token: this.token });
        console.log('Verification access token registered successfully.');
        return;
      }

      // Allow flow progression if it's the first time login credential step
      if (this.fistlogin) {
        console.log('First login flow activated.');
        return;
      }

      // Secure Fallback: kick to login if query params are completely blank/missing
      this.router.navigate(['/login']);
    });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('NewPassword')?.value;
    const confirm = group.get('ConfirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.passwordErrors = '';
    this.errorMessage = '';
    this.resetPasswordForm.markAllAsTouched();

    if (this.resetPasswordForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Updating Password...',
      text: 'Applying security adjustments. Please wait.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.resetPasswordForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message || 'Password modified successfully. Proceeding to Login.',
            timer: 2500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else if (res.code === -1) {
          Swal.fire({
            icon: 'error',
            title: 'Link Expired',
            text: res.message || 'Your verification token is no longer valid.',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Submission Declined',
            text: res.message || 'Could not reset password. Please review inputs.',
          });
        }
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'System Error',
          text: err.error?.message || 'A network error occurred. Please test your configuration later.'
        });
      }
    });
  }
}
