import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/department';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) { }

  apiUrl = `${environment.apiUrl}/GetAllDepartment`;

  getDepartments(
    searchText: string = '', pageNumber: number = 0, pageSize: number = 0, SortColumn: string = '', SortOrder: string = '') {
    return this.http.post<any>(
      this.apiUrl,
      {
        searchText,
        pageNumber,
        pageSize,
        SortColumn,
        SortOrder
      }
    );
  }


  deleteDepartment(id: number) {
    return this.http.delete(`${environment.apiUrl}/DeleteDepartment/${id}`);
  }

  saveDepartment(department: Department) {
    return this.http.post(`${environment.apiUrl}/api/Department`, department);
  }

  getAllDepartments() {
    return this.http.get(`${environment.apiUrl}/GetDepartment`);
  }
  updateDepartmentStatus(departmentId: number, isActive: boolean, updatedBy: number) {
    return this.http.post(`${environment.apiUrl}/UpdateDepartmentStatus?departmentId=${departmentId}&isActive=${isActive}&updatedBy=${updatedBy}`, {});
    
  }
  ExportDepartments(ids: number[]) {
    return this.http.post(`${environment.apiUrl}/ExportDepartment`,  ids, { responseType: 'blob' });
  }
}
