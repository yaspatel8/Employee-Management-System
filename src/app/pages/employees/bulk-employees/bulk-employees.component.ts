import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../Services/department.service';
import { Department } from '../../../models/department';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { EmployeeService } from '../../../Services/employee.service';
import { Employee } from '../../../models/employee';
import { Router } from '@angular/router';
import { Position } from '../../../models/position';
import { PositionService } from '../../../Services/position.service';

@Component({
  selector: 'app-bulk-employees',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bulk-employees.component.html',
  styleUrl: './bulk-employees.component.scss',
})
export class BulkEmployeesComponent {
  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private router: Router,
  ) {}

  departments?: Department[] = [];
  Positions?: Position[] = [];
  managers?: any[] = [];
  managerLists: any[][] = [];
  bulkForm!: FormGroup;

  get employees(): FormArray {
    return this.bulkForm.get('employees') as FormArray;
  }

  uniqueEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent || !control.parent.parent) {
        return null;
      }
      const currentEmail = control.value?.trim()?.toLowerCase();
      if (!currentEmail) {
        return null;
      }
      const employees = control.parent.parent as FormArray;
      let count = 0;
      employees.controls.forEach((group) => {
        const email = group.get('email')?.value?.trim()?.toLowerCase();
        if (email === currentEmail) {
          count++;
        }
      });

      return count > 1 ? { duplicateEmail: true } : null;
    };
  }

  // updateEmailValidation() {

  //   this.employees.controls.forEach(control => {

  //     control.get('email')?.updateValueAndValidity();

  //   });

  // }

  ngOnInit() {
    this.bulkForm = this.fb.group({
      employees: this.fb.array([]),
    });
    // First Row
    this.addRow();
    this.loadDepartments();
    this.loadPositions();
    this.loadManagers(0);
  }

  createEmployee(): FormGroup {
    return this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.minLength(2),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.uniqueEmailValidator(),
          Validators.maxLength(100),
          Validators.minLength(5),
        ],
      ],
      salary: [0],
      departmentId: [0, [Validators.required]],
      positionId: ['', [Validators.required]],
      reportsToEmployeePositionId: ['', [Validators.required]],
      createdBy: Number(this.authService.getUserId()),
    });
  }

  // addRow() {
  //   this.employees.push(this.createEmployee());
  //   // this.updateEmailValidation();
  // }

  addRow(){

    const group=this.createEmployee();

    this.employees.push(group);

    const index=this.employees.length-1;

    group.get('departmentId')?.valueChanges.subscribe(()=>{

        this.loadManagers(index);

    });

    group.get('positionId')?.valueChanges.subscribe(()=>{

        this.loadManagers(index);

    });

}

  deleteRow(index: number) {
    console.log('Deleting Row:', index);
    if (this.employees.length === 1) return;
    this.employees.removeAt(index);
    //this.updateEmailValidation();
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((d: any) => {
      this.departments = d.data;
      this.cdr.detectChanges();
    });
  }

  loadPositions() {
    this.positionService.getAllActivePositions().subscribe((d: any) => {
      this.Positions = d.data;
      this.cdr.detectChanges();
    });
  }

  // loadManagers() {
  //   const departmentId = this.bulkForm.value.departmentId;
  //   const positionId = this.bulkForm.value.position;
  //   if (!departmentId || !positionId)
  //     return;

  //   this.employeeService
  //     .getManagers(departmentId, positionId)
  //     .subscribe((res: any) => {

  //       this.managers = res.data;
  //      this.cdr.detectChanges();
  //     });

  // }
  loadManagers(index: number) {
    const row = this.employees.at(index);

    const departmentId = row.get('departmentId')?.value;
    const positionId = row.get('positionId')?.value;

    if (!departmentId || !positionId) {
      this.managerLists[index] = [];
      return;
    }

    this.employeeService
      .getManagers(departmentId, positionId)
      .subscribe((res: any) => {
        this.managerLists[index] = res.data;
      });
  }

  saveAll() {
    if (this.bulkForm.invalid) {
      this.bulkForm.markAllAsTouched();
      return;
    }

    const totalEmployees = this.employees.length;

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to save ${totalEmployees} employees.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const employees = this.bulkForm.value.employees as Employee[];

      // Swal.fire({
      //   title: 'Saving...',
      //   text: 'Please wait',
      //   allowOutsideClick: false,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   }
      // });

      this.employeeService.BulkUploadEmployees(employees).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.removeInsertedEmployees(res.duplicateEmails);

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res.message,
            });
          }
        },

        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.',
          });
        },
      });
    });
  }

  removeInsertedEmployees(duplicateEmails: string) {
    if (!duplicateEmails) {
      this.resetForm();
      this.router.navigate(['/employees']);
      return;
    }

    const duplicateList = duplicateEmails
      .split(',')
      .map((x: string) => x.trim().toLowerCase());

    for (let i = this.employees.length - 1; i >= 0; i--) {
      const email = this.employees.at(i).get('email')?.value?.toLowerCase();

      if (!duplicateList.includes(email)) {
        this.employees.removeAt(i);
      }
    }
  }

  resetForm() {
    this.bulkForm.reset();
    this.employees.clear();
    this.addRow();
  }
}
