import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardGroupComponent,
  ColComponent, ContainerComponent, FormControlDirective, FormDirective,
  InputGroupComponent, InputGroupTextDirective, RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { ProfileService } from '../../../Services/profile.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    //ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
    CardComponent, CardBodyComponent, 
    //FormDirective, InputGroupComponent,FormControlDirective,RouterLink,InputGroupTextDirective, 
    IconDirective, ButtonDirective, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  isSubmitted = false;
  resendCountdown = 0;
  otpTimeout = 0;

  // Array hook definition to track loop templates
  otpInputs = new Array(6);
  private timerSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      userId: [sessionStorage.getItem('userId') || '', Validators.required],
      OtpCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    this.initializeTimers(false);

    // Set auto-focus on the first digit box on page mount load
    setTimeout(() => this.focusInput(0), 100);
  }

  // Auto-focus utility helper
  focusInput(index: number): void {
    const el = document.getElementById(`otp-${index}`) as HTMLInputElement;
    if (el) el.focus();
  }

  // Handles Typing and Forward Navigation Flow
  onInputChange(event: any, index: number): void {
    const val = event.target.value;

    // Scrub clean anything that isn't a plain integer
    if (!/^[0-9]$/.test(val)) {
      event.target.value = '';
      this.updateFormValue();
      return;
    }

    this.updateFormValue();

    // Auto-advance cursor selection hook to next block input 
    if (val && index < 5) {
      this.focusInput(index + 1);
    }
  }

  // Handles Backspace and Backward Navigation Flow
  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const target = event.target as HTMLInputElement;

      if (!target.value && index > 0) {
        // If current box is empty, jump to previous box and clear it
        this.focusInput(index - 1);
        setTimeout(() => {
          const prevTarget = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
          if (prevTarget) prevTarget.value = '';
          this.updateFormValue();
        }, 0);
      } else {
        // Clear current value
        target.value = '';
        this.updateFormValue();
      }
    }
  }

  // Handles Standard Clipboard Multi-box Paste Parsing Action
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';

    if (!/^[0-9]{6}$/.test(pasteData)) return; // Reject if not a 6-digit number

    for (let i = 0; i < 6; i++) {
      const inputEl = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (inputEl) {
        inputEl.value = pasteData[i];
      }
    }

    this.updateFormValue();
    this.focusInput(5); // Focus last element box directly
  }

  // Compiles discrete digit fragments back into the Form control pipeline
  updateFormValue(): void {
    let combinedStr = '';
    for (let i = 0; i < 6; i++) {
      const inputEl = document.getElementById(`otp-${i}`) as HTMLInputElement;
      combinedStr += inputEl ? inputEl.value : '';
    }
    this.otpForm.get('OtpCode')?.setValue(combinedStr);
    this.otpForm.get('OtpCode')?.markAsDirty();
  }

  getCombinedOtpLength(): number {
    return this.otpForm.get('OtpCode')?.value?.length || 0;
  }

  initializeTimers(isResend: boolean = false): void {
    const now = Date.now();
    if (isResend) {
      localStorage.setItem('otp_timeout_deadline', (now + (120 * 1000)).toString());
      localStorage.setItem('otp_resend_deadline', (now + (25 * 1000)).toString());
    } else {
      if (!localStorage.getItem('otp_timeout_deadline')) {
        localStorage.setItem('otp_timeout_deadline', (now + (120 * 1000)).toString());
      }
      if (!localStorage.getItem('otp_resend_deadline')) {
        localStorage.setItem('otp_resend_deadline', (now + (25 * 1000)).toString());
      }
    }
    this.startTimers();
  }

  startTimers(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      const now = Date.now();
      const timeoutDeadline = parseInt(localStorage.getItem('otp_timeout_deadline') || '0', 10);
      const resendDeadline = parseInt(localStorage.getItem('otp_resend_deadline') || '0', 10);

      this.otpTimeout = Math.max(0, Math.round((timeoutDeadline - now) / 1000));
      this.resendCountdown = Math.max(0, Math.round((resendDeadline - now) / 1000));

      if (this.otpTimeout <= 0) {
        this.timerSubscription.unsubscribe();
        this.clearTimerStorage();
      }
      this.cdr.detectChanges();
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  onVerifyOtp() {
    this.isSubmitted = true;
    this.updateFormValue(); // Verify latest compiled structure status

    if (this.otpForm.invalid || this.otpTimeout <= 0) {
      return;
    }

    const payload = this.otpForm.getRawValue();

    this.authService.verifyOtp(payload).subscribe({
      next: (res: any) => {
        if (res.success && res.token) {
          this.authService.savetoken(res.token);

          this.profileService.getProfile(Number(this.authService.getUserId())).subscribe({
            next: (profileRes: any) => {
              if (profileRes.success && profileRes.data) {
                this.authService.setprofile(profileRes.data);
              }
            },
            error: (err) => console.error('Error fetching profile:', err)
          });

          this.clearTimerStorage();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message || 'Identity confirmed successfully.',
          }).then(() => {
            sessionStorage.removeItem('userId');
            this.router.navigate(['/dashboard']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: res.message || 'The OTP entered is incorrect.',
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Connection lost. Please try again.',
        });
      }
    });
  }

  onResendOtp() {
    if (this.resendCountdown > 0) return;

    const userId = Number(sessionStorage.getItem('userId'));

    this.authService.resendOtp({ userId }).subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Code Sent',
            text: res.message || 'A fresh code has been dispatched to your email.',
          });

          this.isSubmitted = false;

          // Clear physical text values inside input boxes
          for (let i = 0; i < 6; i++) {
            const inputEl = document.getElementById(`otp-${i}`) as HTMLInputElement;
            if (inputEl) inputEl.value = '';
          }

          this.otpForm.get('OtpCode')?.setValue('');
          this.initializeTimers(true);
          setTimeout(() => this.focusInput(0), 100);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: res.message || 'Could not resend code. Please try again later.',
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Unable to contact server. Try again.',
        });
      }
    });
  }

  clearTimerStorage(): void {
    localStorage.removeItem('otp_timeout_deadline');
    localStorage.removeItem('otp_resend_deadline');
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
