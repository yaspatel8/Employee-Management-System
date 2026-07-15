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
import { DepartmentService } from '../../../Services/department.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterLink, FormsModule, MatPaginatorModule, MatSortModule, ReactiveFormsModule,],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  private searchSubject = new Subject<string>();
  selectedEmployeeIds: number[] = [];

  constructor(private employeeService: EmployeeService, private authService: AuthService, private departmentService: DepartmentService, private fb: FormBuilder,) { }

  Employees = signal<Employee[]>([]);
  Departments = signal<any[]>([]);
  message!: string;
  employeeForm!: FormGroup;

  searchText = '';
  pageNumber = 1;
  pageSize = 3;
  totalRecords = 0;
  SortColumn = '';
  SortOrder = '';

  ngOnInit() {
    this.getEmployees();
    this.loadDepartments();
    this.employeeForm = this.fb.group({
      employees: this.fb.array([])
    });

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

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((d: any) => {
      this.Departments.set(d.data);
    });
  }


  hasRole(...roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return roles.includes(userRole ?? '');
  }

  getEmployees() {

    this.selectedEmployeeIds = [];

    this.employeeService.getEmployees(
      this.searchText,
      this.pageNumber,
      this.pageSize,
      this.SortColumn,
      this.SortOrder
    ).subscribe((d: any) => {

      const employees = d.data ?? [];

      this.Employees.set(employees);
      console.log('Employees:', employees);
      this.selectedEmployeeIds = [];

      // Clear previous FormArray
      this.employeeArray.clear();

      // Populate FormArray
      employees.forEach((emp: Employee) => {

        this.employeeArray.push(
          this.fb.group({

            employeeId: [emp.employeeId],

            fullName: [
              emp.fullName,
            ],

            email: [
              emp.email,
              [
                Validators.required,
                Validators.email
              ]
            ],

            salary: [
              emp.salary,
            ],

            departmentId: [
              emp.departmentId,
            ],

            isActive: [
              emp.isActive
            ],
            updatedby: [
              Number(this.authService.getUserId())
            ]
          })
        );

      });

      this.totalRecords =
        employees.length > 0
          ? employees[0].totalRecords
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

  toggleSelection(employeeId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {

      if (!this.selectedEmployeeIds.includes(employeeId)) {
        this.selectedEmployeeIds.push(employeeId);
      }
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(id => id !== employeeId);
    }

  }
//here no employee select so download all employee data other wise download selected employee data
exportSelected() {  
  if (this.selectedEmployeeIds.length === 0) {
    this.employeeService.ExportEmployees([]).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  } else {
    this.employeeService.ExportEmployees(this.selectedEmployeeIds).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected_employees.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedEmployeeIds =
        this.Employees().map(x => x.employeeId);
    } else {
      this.selectedEmployeeIds = [];
    }
  }

  isSelected(employeeId: number): boolean {

    return this.selectedEmployeeIds.includes(employeeId);

  }

  //edit bulk
  get employeeArray(): FormArray {
    return this.employeeForm.get('employees') as FormArray;
  }
  isBulkEditMode(): boolean {
    return this.selectedEmployeeIds.length > 0;
  }
  isRowEditable(employeeId: number): boolean {
    return this.selectedEmployeeIds.includes(employeeId);
  }

  bulkUpdate() {

    const selectedControls = this.employeeArray.controls.filter(control =>
      this.selectedEmployeeIds.includes(control.value.employeeId)
    );

    for (const control of selectedControls) {

      control.markAllAsTouched();

      if (control.invalid) {

        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please correct all selected employee details.'
        });

        return;
      }
    }

    const data = selectedControls.map(control => control.value);

    console.log(data);

    // Bulk Update API
    this.employeeService
      .BulkUpdateEmployees(data)
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

  bulkDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will delete ${this.selectedEmployeeIds.length} selected employees.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService
          .BulkDeleteEmployees(this.selectedEmployeeIds, Number(this.authService.getUserId()))
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

  changeStatus(employeeId: number, isActive: boolean) {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will ${isActive ? 'activate' : 'deactivate'} the employee.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService
          .ChangeEmployeeStatus(employeeId, isActive, Number(this.authService.getUserId()))
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                icon: 'success',
                title: response.message
              });
              this.getEmployees();
            }
            ,
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
