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
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { passwordValidator } from '../../../Validator/password.validator';

@Component({
  selector: 'app-reset-password',
  imports: [ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      NewPassword: [
        '',
        [
          Validators.required,
          passwordValidator()
        ]
      ],
      ConfirmPassword: ['', [Validators.required]],
      token: ['']
    },
      {
        validators: [this.passwordMatchValidator.bind(this)]
      }
    );
  }

  errorMessage: string = '';
  passwordErrors: string = '';
  isSubmitted = false;
  token: string = '';
  fistlogin: boolean = false;


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {

      this.token = params['token'] || '';

      this.fistlogin = params['isFistLogin'] === 'true';

      if (this.token) {
        this.resetPasswordForm.patchValue({
          token: this.token
        });
        console.log('Token received:', this.token);
        return;
      }

      // First login flow
      if (this.fistlogin) {
        return;
      }

      // Invalid access
      this.router.navigate(['/login']);

      if (!this.token) {
        this.router.navigate(['/forgot-password']);
      }

    });
  }


  onSubmit() {
    this.isSubmitted = true;
    this.passwordErrors = '';
    this.errorMessage = '';

    this.resetPasswordForm.markAllAsTouched();

    if (this.resetPasswordForm.invalid) {
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

    this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.resetPasswordForm.reset();

          Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful',
            text: res.message,
          }).then(() => {

            this.router.navigate(['/login']);

          });;

        } else if (res.code === -1) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Token',
            text: res.message,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }

        else {
          Swal.fire({
            icon: 'error',
            title: 'Password Reset Failed',
            text: res.message,
          });
        }
      }
    });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {

    const password = group.get('NewPassword')?.value;
    const confirm = group.get('ConfirmPassword')?.value;

    return password === confirm ? null : { mismatch: true };

  }

}
