import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../../Services/department.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';


@Component({
  selector: 'app-add-department',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss',
})
export class AddDepartmentComponent {

  departmentForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private departmentService: DepartmentService, private route: ActivatedRoute, private authService: AuthService) {

    this.departmentForm = this.fb.group({
      departmentId: [0],
      departmentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  editMode = false;
  departmentId = 0;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.departmentId = Number(id);
      this.editMode = true;
      this.loadDepartmentById(this.departmentId);
    }
  }

  loadDepartmentById(id: number) {
    this.departmentService
      .getDepartments(id.toString())
      .subscribe((response: any) => {
        if (response.data && response.data.length > 0) {
          const dept = response.data[0];
          this.departmentForm.patchValue({
            departmentId: dept.departmentId,
            departmentName: dept.departmentName
          });
        }
      });
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      return;
    }

    this.departmentService
      .saveDepartment(this.departmentForm.value)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            Swal.fire('Success', response.message, 'success');
            this.authService.currentUser.set(response.data);
            this.router.navigate(['/departments/department-list']);
          } else {
            Swal.fire('Error', response.message, 'error');
          }
        },
        error: (error: any) => {
          Swal.fire(
            'Error',
            error.error?.message || 'Something went wrong.',
            'error'
          );
        }
      });
    
  }
}