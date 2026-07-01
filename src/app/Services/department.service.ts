import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) { }

  apiUrl = "https://localhost:7177/GetAllDepartment";

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
    return this.http.delete(`https://localhost:7177/DeleteDepartment/${id}`);
  }

  saveDepartment(department: Department) {
    return this.http.post("https://localhost:7177/api /Department", department);
  }

  getAllDepartments() {
    return this.http.get("https://localhost:7177/GetDepartment");
  }
}
