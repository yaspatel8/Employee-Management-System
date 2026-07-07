import { Component, signal } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProfileService } from '../../../Services/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule, CommonModule, RouterLink]
})
export class LoginComponent {

  loginForm!: FormGroup;
  errorMessage: string = '';
  isSubmitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private profileService: ProfileService) {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // userRole = signal<string | null>(null);

  onSubmit() {

    this.isSubmitted = true;

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {

        if (res.success && res.token) {
          this.authService.savetoken(res.token);
          if (res.isFistLogin) {
            console.log(res.tokenLogin);
            this.router.navigate(['/reset-password'], { queryParams: { isFistLogin: res.isFistLogin, token: res.tokenLogin } });

            return;
          }
          //this.userRole.set(this.authService.getUserRole());
          // localStorage.setItem('userRole', userRole ?? '');

          this.profileService.getProfile(Number(this.authService.getUserId())).subscribe({
            next: (profileRes: any) => {
              if (profileRes.success && profileRes.data) {
                this.authService.setprofile(profileRes.data);
                console.log('Profile fetched successfully:', profileRes.data);
              }
            },
            error: (err) => {
              console.error('Error fetching profile:', err);
            }
          });

          this.errorMessage = '';
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: res.message,
          });

          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: res.message,
          });
          this.errorMessage = res.message;
        }
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.error.message,
        });
        this.errorMessage = err.error.message;
      }
    });
  }

}
