import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee';
import { BulkUpdateEmployee } from '../models/bulkUpdateEmployee';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = `${environment.apiUrl}/GetAllEmployees`;

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
    return this.http.get(`${environment.apiUrl}/GetEmployeesWithDepartment`);
  }

  // addEmployee(employee: Employee) {
  //   return this.http.post(`${environment.apiUrl}/CreateEmployee`, employee);
  // }
  deleteEmployee(id: number) {
    return this.http.delete(`${environment.apiUrl}/DeleteEmployee/${id}`);
  }

  saveEmployee(employee: FormData) {
    return this.http.post(`${environment.apiUrl}/SaveEmployee`, employee);
  }

  // getEmployeeById(id: number) {
  //   return this.http.get(`${environment.apiUrl}/GetEmployeeById/${id}`);
  // }

  BulkUploadEmployees(employees: Employee[]) {
    return this.http.post(`${environment.apiUrl}/BulkSaveEmployees`, employees);
  }

  BulkDeleteEmployees(employeeIds: number[], deletedBy: number) {
    return this.http.post(`${environment.apiUrl}/BulkDeleteEmployees`, { employeeIds, deletedBy });
  }

  ChangeEmployeeStatus(employeeId: number, isActive: boolean, updatedBy: number) {
    return this.http.post(`${environment.apiUrl}/ChangeEmployeeStatus?employeeId=${employeeId}&isActive=${isActive}&updatedBy=${updatedBy}`,
      {});
  }

  BulkUpdateEmployees(employees: BulkUpdateEmployee[]) {
    return this.http.post(`${environment.apiUrl}/BulkUpdateEmployees`, employees);
  }

  ExportEmployees(ids: number[]) {
    return this.http.post(`${environment.apiUrl}/ExportEmployees`, ids, { responseType: 'blob' });
  }
  getManagers(departmentId: number, positionId: number) {
    return this.http.get(`${environment.apiUrl}/Managers?departmentId=${departmentId}&positionId=${positionId}`);
  }

}
