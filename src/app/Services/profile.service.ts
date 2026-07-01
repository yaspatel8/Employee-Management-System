import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Profile } from '../models/Profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  ApiUrl = "https://localhost:7177/GetProfile";
  UpdateUrl = "https://localhost:7177/UpdateProfile";


  getProfile(id: number) {
    return this.http.post<Profile>(`${this.ApiUrl}/${id}`, { id });
  }

  updateProfile(profile: Profile) {
    return this.http.post<Profile>(this.UpdateUrl, profile);
  }

}
