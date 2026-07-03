import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
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


@Component({
  selector: 'app-bulk-employees',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bulk-employees.component.html',
  styleUrl: './bulk-employees.component.scss',
})
export class BulkEmployeesComponent {

  constructor(private fb: FormBuilder, private departmentService: DepartmentService, private cdr: ChangeDetectorRef, private authService: AuthService, private employeeService: EmployeeService, private router: Router) { }

  departments?: Department[] = [];
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
      employees.controls.forEach(group => {
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
      employees: this.fb.array([])
    });
    // First Row
    this.addRow();
    this.loadDepartments();
  }

  createEmployee(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]+$/), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, this.uniqueEmailValidator(), Validators.maxLength(100), Validators.minLength(5)]],
      salary: [0],
      departmentId: [0],
      createdBy: Number(this.authService.getUserId())
    });
  }

  addRow() {
    this.employees.push(this.createEmployee());
    // this.updateEmailValidation();

  }

  deleteRow(index: number) {
    console.log('Deleting Row:', index);
    if (this.employees.length === 1)
      return;
    this.employees.removeAt(index);
    //this.updateEmailValidation();
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((d: any) => {
      this.departments = d.data;
      this.cdr.detectChanges();
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
      confirmButtonText: 'Yes, Save'
    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      const employees = this.bulkForm.value.employees as Employee[];
      console.log('Employees to be saved:', employees);
      this.employeeService.BulkUploadEmployees(employees).subscribe({

        next: (res: any) => {

          if (res.success) {

            this.removeInsertedEmployees(res.duplicateEmails);

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res.message
            });

          }

        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.'
          });

        }

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

      const email = this.employees.at(i).get('email')?.value
        ?.toLowerCase();

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
