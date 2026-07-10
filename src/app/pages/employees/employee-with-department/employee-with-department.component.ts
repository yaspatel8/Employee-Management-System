import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Employee } from '../../../models/employee';
import { EmployeeService } from '../../../Services/employee.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-employee-with-department',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './employee-with-department.component.html',
  styleUrl: './employee-with-department.component.scss',
})
export class EmployeeWithDepartmentComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource<Employee>();

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setDisplayedColumns();
  }

  ngAfterViewInit(): void {
    this.getEmployeesWithDepartment();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setDisplayedColumns(): void {
    this.displayedColumns = [
      'employeeId',
      'fullName',
      'email',
      'phoneNumber',
      'departmentName',
      'positionName',
    ];

    if (this.hasRole('admin')) {
      this.displayedColumns.push('salary');
    }
  }

  hasRole(...roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return roles.includes(userRole ?? '');
  }

  getEmployeesWithDepartment() {
    this.employeeService.getEmployeeWithDepartment().subscribe((d: any) => {
      this.dataSource.data = d.data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
