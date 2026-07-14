import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Profile } from '../models/Profile';
import { HierarchyTree } from '../models/HierarchyTree';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  ApiUrl = "https://localhost:7177/GetProfile";
  UpdateUrl = "https://localhost:7177/UpdateProfile";
  treeUrl = "https://localhost:7177/GetHierarchyTree";


  getProfile(id: number) {
    return this.http.post<Profile>(`${this.ApiUrl}/${id}`, { id });
  }

  updateProfile(profile: Profile) {
    return this.http.post<Profile>(this.UpdateUrl, profile);
  }

  getHierarchyTree(departmentId: number = 0) {
    return this.http.post<HierarchyTree[]>(`${this.treeUrl}/${departmentId}`, { departmentId });
  }

}
