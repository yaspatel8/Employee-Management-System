import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee';
import { BulkUpdateEmployee } from '../models/bulkUpdateEmployee';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = "https://localhost:7177/GetAllEmployees";

  constructor(private http: HttpClient,private authService: AuthService) { }

  getEmployees( searchText: string = '', pageNumber: number = 0, pageSize: number = 0, SortColumn: string = '', SortOrder: string = '') {
    return this.http.post(
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

  getEmployeeWithDepartment() {
    return this.http.get("https://localhost:7177/GetEmployeesWithDepartment");
  }

  // addEmployee(employee: Employee) {
  //   return this.http.post("https://localhost:7177/CreateEmployee", employee);
  // }
  deleteEmployee(id: number) {
    return this.http.delete(`https://localhost:7177/DeleteEmployee/${id}`);
  }

  saveEmployee(employee: FormData) {
    return this.http.post("https://localhost:7177/SaveEmployee", employee);
  }

  // getEmployeeById(id: number) {
  //   return this.http.get(`https://localhost:7177/GetEmployeeById/${id}`);
  // }

  BulkUploadEmployees(employees: Employee[]) {
    return this.http.post("https://localhost:7177/BulkSaveEmployees", employees);
  }

  BulkDeleteEmployees(employeeIds: number[], deletedBy: number) {
    return this.http.post("https://localhost:7177/BulkDeleteEmployees", { employeeIds, deletedBy });
  }

  ChangeEmployeeStatus(employeeId: number, isActive: boolean, updatedBy: number) {
    return this.http.post(`https://localhost:7177/ChangeEmployeeStatus?employeeId=${employeeId}&isActive=${isActive}&updatedBy=${updatedBy}`,
      {});
  }

  BulkUpdateEmployees(employees: BulkUpdateEmployee[]) {
    return this.http.post("https://localhost:7177/BulkUpdateEmployees", employees);
  }

  ExportEmployees(ids: number[]) {
    return this.http.post("https://localhost:7177/ExportEmployees", ids, { responseType: 'blob' });
  }
  getManagers(departmentId: number, positionId: number) {
    return this.http.get(`https://localhost:7177/Managers?departmentId=${departmentId}&positionId=${positionId}`);
  }

}
