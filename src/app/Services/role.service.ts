import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  constructor(private http: HttpClient) { }
  
  getRoles() {
    return this.http.get("https://localhost:7177/GetAllRoles");
  }
}
