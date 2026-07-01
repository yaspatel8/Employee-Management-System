import { Component, signal } from '@angular/core';
import { Employee } from '../../../models/employee';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { EmployeeService } from '../../../Services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterLink, FormsModule, MatPaginatorModule, MatSortModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  private searchSubject = new Subject<string>();

  constructor(private employeeService: EmployeeService, private authService: AuthService) { }

  Employees = signal<Employee[]>([]);

  message!: string;

  searchText = '';
  pageNumber = 1;
  pageSize = 3;
  totalRecords = 0;
  SortColumn = '';
  SortOrder = '';

  ngOnInit() {
    this.getEmployees();

    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {
        this.employeeService
          .getEmployees(searchText)
          .subscribe((d: any) => {
            this.Employees.set(d.data ?? []);
          });
      });

  }

  hasRole(...roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return roles.includes(userRole ?? '');
  }

  getEmployees() {
    this.employeeService.getEmployees(
      this.searchText,
      this.pageNumber,
      this.pageSize,
      this.SortColumn,
      this.SortOrder
    ).subscribe((d: any) => {
      this.Employees.set(d.data ?? []);

      this.totalRecords =
        d.data?.length > 0
          ? d.data[0].totalRecords
          : 0;
    });
  }

  onSearch() {
    this.pageNumber = 1;
    this.searchSubject.next(this.searchText);
  }

    sortData(event: any) {

    this.SortColumn = event.active;
    this.SortOrder = event.direction;
    this.getEmployees();
  }

  pageChanged(event: any) {

    this.pageNumber = event.pageIndex + 1;

    this.pageSize = event.pageSize;

    this.getEmployees();

  }


  deleteEmployee(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This employee will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService
          .deleteEmployee(id)
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                icon: 'success',
                title: response.message
              });
              this.getEmployees();
            },
            error: (err: any) => {
              Swal.fire({
                icon: 'error',
                title: err.error?.message || 'Something went wrong.'
              });
            }
          });
      }
    });
  }

}
