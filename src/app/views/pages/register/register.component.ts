import { Component } from '@angular/core'; 
import { IconDirective } from '@coreui/icons-angular'; 
import { 
  ButtonDirective, CardBodyComponent, CardComponent, ColComponent, 
  ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, 
  InputGroupTextDirective, RowComponent 
} from '@coreui/angular'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AuthService } from '../../../Services/auth.service'; 
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2'; 
import { passwordValidator } from '../../../Validator/password.validator'; 

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    //ContainerComponent, RowComponent, ColComponent, 
    CardComponent, 
    CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, 
    IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule, 
    CommonModule, RouterLink
  ]
})
export class RegisterComponent {
  RegisterForm!: FormGroup;
  errorMessage: string = '';
  passwordErrors: string = '';
  isSubmitted = false;

  // Visual toggle parameters
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.RegisterForm = this.fb.group({
      Fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: ['', [Validators.required, passwordValidator()]],
      ConfirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.passwordErrors = '';
    this.errorMessage = ''; 

    // Reset standard email errors explicitly before parsing pipeline
    const emailControl = this.RegisterForm.get('Email');
    if (emailControl?.hasError('duplicate')) {
      emailControl.setErrors(null);
    }
    
    this.RegisterForm.markAllAsTouched();

    if (this.RegisterForm.invalid) {
      return;
    }

    if (this.RegisterForm.value.PasswordHash !== this.RegisterForm.value.ConfirmPassword) {
      this.RegisterForm.get('ConfirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    this.authService.register(this.RegisterForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.RegisterForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: res.message || 'Account created successfully!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.RegisterForm.get('Email')?.setErrors({ duplicate: true });
        }
      },
      error: (err) => {
        if (err.error?.message === 'Email already exists') {
          this.RegisterForm.get('Email')?.setErrors({ duplicate: true });
        } else {
          this.errorMessage = err.error?.message || 'An error occurred during registration.';
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: this.errorMessage,
          });
        }
      }
    });
  }
}
