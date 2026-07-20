import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Profile } from '../models/Profile';
import { HierarchyTree } from '../models/HierarchyTree';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  ApiUrl = `${environment.apiUrl}/GetProfile`;
  UpdateUrl = `${environment.apiUrl}/UpdateProfile`;
  treeUrl = `${environment.apiUrl}/GetHierarchyTree`;


  getProfile(id: number) {
    return this.http.post<Profile>(`${this.ApiUrl}/${id}`, { id });
  }

  updateProfile(profile: Profile) {
    return this.http.post<Profile>(this.UpdateUrl, profile);
  }

  getHierarchyTree() {
    return this.http.post<HierarchyTree[]>(`${this.treeUrl}`, {});
  }

}
