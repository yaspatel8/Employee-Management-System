import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { DashboardSummary } from '../models/DashboardSummary ';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  
  apiurl = `${environment.apiUrl}/GetDashboardSummary`;

  dashboardSummary: DashboardSummary | undefined;

  getDashboardSummary() {
    return this.http.get<DashboardSummary>(this.apiurl);
  }
}