import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  constructor(private http: HttpClient) { }
  
  getRoles() {
    return this.http.get(`${environment.apiUrl}/GetAllRoles`);
  }
}
