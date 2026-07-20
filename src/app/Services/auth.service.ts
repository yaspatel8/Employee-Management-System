import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { CurrentProfile } from '../models/CurrentProfile';
import { ProfileService } from './profile.service';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private profileService: ProfileService) {

    const token = this.getToken();

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userRole.set(decodedToken.Role || null);
    }

  }

  loginURL = `${environment.apiUrl}/Login`;
  registerURL = `${environment.apiUrl}/RegisterUser`;
  forgotPasswordURL = `${environment.apiUrl}/api/Login/ForgotPassword`;
  resetPasswordURL = `${environment.apiUrl}/api/Login/ResetPassword`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  login(data: any) {
    return this.http.post(this.loginURL, data);
  }

  currentUser = signal<CurrentProfile | null>(null);
  userRole = signal<string | null>(null);

  setprofile(profile: CurrentProfile) {
    this.currentUser.set(profile);
  }

  clearProfile() {
    this.currentUser.set(null);
  }

  savetoken(token: string) {
    localStorage.setItem('token', token);
    this.userRole.set(this.getUserRole());
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.currentUser.set(null);
    this.userRole.set(null);
    if(localStorage.getItem('token') === null){
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');

  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  register(data: any) {
    return this.http.post(this.registerURL, data);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.Role || null;
    }
    return null;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.UserId || null;
    }
    return null;
  }

  loadCurrentUser() {

    const userId = this.getUserId();

    if (!userId) {
      return;
    }

    this.profileService.getProfile(Number(userId)).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.currentUser.set(res.data);
        }
      }
    });
  }

  forgotPassword(data: any) {
    return this.http.post(this.forgotPasswordURL, data);
  }

  resetPassword(data: any) {
    return this.http.post(this.resetPasswordURL, data);
  }
}