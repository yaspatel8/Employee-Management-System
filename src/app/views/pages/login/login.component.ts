import { Component } from '@angular/core'; 
import { IconDirective } from '@coreui/icons-angular'; 
import { 
  ButtonDirective, CardBodyComponent, CardComponent, CardGroupComponent, 
  ColComponent, ContainerComponent, FormControlDirective, FormDirective, 
  InputGroupComponent, InputGroupTextDirective, RowComponent 
} from '@coreui/angular'; 
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { AuthService } from '../../../Services/auth.service'; 
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2'; 
import { ProfileService } from '../../../Services/profile.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ContainerComponent, RowComponent, ColComponent, CardGroupComponent, 
    CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, 
    InputGroupTextDirective, IconDirective, FormControlDirective, 
    ButtonDirective, ReactiveFormsModule, CommonModule, RouterLink
  ]
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isSubmitted = false;
  
  // Password visibility indicator toggle parameter
  passwordVisible = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private profileService: ProfileService
  ) {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        // Option 1: Handles First-Time Registration Credentials Reset Routing
        if (res.isFistLogin) {
          console.log('First login token:', res.tokenLogin);
          this.router.navigate(['/reset-password'], { 
            queryParams: { isFistLogin: res.isFistLogin, token: res.tokenLogin } 
          });
          return;
        }

        // Option 2: Successful authentication context mapping -> advances to verification
        if (res.success && res.userId) {
          sessionStorage.setItem('userId', res.userId.toString());
          
          Swal.fire({
            icon: 'success',
            title: 'Welcome Back',
            text: res.message || 'Verification token dispatched to your email.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/verify-otp']);
          });
          return;
        } 
        
        // Option 3: Backend operational errors handling boundary
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: res.message || 'Invalid email address or matching password combo.',
        });
        this.errorMessage = res.message;
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'System Connection Error',
          text: error.error?.message || 'Something went wrong. Please check your network connection.',
        });
        this.errorMessage = error.error?.message || 'Something went wrong.';
      }
    });
  }
}
