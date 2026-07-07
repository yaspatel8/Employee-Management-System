import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../../models/department';
import { DepartmentService } from '../../../Services/department.service';
import { EmployeeService } from '../../../Services/employee.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { RoleService } from '../../../Services/role.service';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent {
  employeeForm!: FormGroup;
  editMode = false;
  employeeId = 0;
  title = '';

  selectedFile: File | null = null;
  imagePreview = signal('');
  defaultImage = "/assets/images/default-image.jpg";

  departments?: Department[] = [];
  roles?: any[] = [];

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private departmentService: DepartmentService, private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, private authService: AuthService, private roleService: RoleService
  ) {
    this.employeeForm = this.fb.group({
      employeeId: [0],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(?:\+91|91|0)?[6-9]\d{9}$/)]],
      salary: [''],
      departmentId: [''],
      roleId: ['', Validators.required],
      userId: [0],
      ProfileImage: [''],
      updatedby: [null],
      createdBy: Number(authService.getUserId())
    });
  }

  ngOnInit() {
    this.loadDepartments();
    this.loadRoles();

    const id = this.route.snapshot.paramMap.get('id');

    if (this.router.url.includes('/profile/edit-profile')) {
      this.title = 'Edit Profile';
    } else if (this.router.url.includes('/employees/edit-employee')) {
      this.title = 'Edit Employee';
    } else {
      this.title = 'Add Employee';
    }


    if (id) {
      this.employeeId = Number(id);
      this.editMode = true;

      this.loadEmployeeById(this.employeeId);
    }
  }

  hasRole(...roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return roles.includes(userRole ?? '');
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((d: any) => {
      this.departments = d.data;
      this.cdr.detectChanges();
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe((d: any) => {
      this.roles = d.data;
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    try {
      const input = event.target as HTMLInputElement;

      if (!input.files || input.files.length === 0) {
        return;
      }

      const file = input.files[0];

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Only JPG, JPEG and PNG files are allowed.'
        });

        input.value = '';
        this.selectedFile = null;
        this.imagePreview.set('');

        return;
      }

      // Validate size (2 MB)
      const maxSize = 2 * 1024 * 1024;

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Image size should be less than 2 MB.'
        });

        input.value = '';
        this.selectedFile = null;
        this.imagePreview.set('');

        return;
      }

      this.selectedFile = file;

      //Generate preview
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        this.imagePreview.set(result);
        this.cdr.detectChanges();
      };

      reader.onerror = (error) => {
        console.error('FileReader Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to read the selected image.'
        });
      };

      reader.readAsDataURL(file);
    }
    catch (error) {
      console.error('onFileSelected Error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while selecting the image.'
      });
    }
  }


  onSubmit(event: any) {
    if (this.employeeForm.invalid) {
      return;
    }

    const formData = new FormData();

    Object.keys(this.employeeForm.controls)
      .forEach(key => {

        const value = this.employeeForm.get(key)?.value;

        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });

    if (this.selectedFile) {
      formData.append(
        'ProfilePicture',
        this.selectedFile
      );
    }
    else {
      // send old image name if no new file
      formData.append(
        'OldFileName',
        this.employeeForm.get('ProfileImage')?.value || ''
      );
    }

    Swal.fire({
      title: 'Saving...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.employeeService.saveEmployee(formData)
      .subscribe({
        next: (response: any) => {

          if (response.success) {
            // this.authService.currentUser.set(response.data);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.message
            });

            if (this.router.url.includes('/profile/edit-profile')) {
              this.router.navigate(['/profile']);
            } else {
              this.router.navigate(['/employees']);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message
            });
          }
        },

        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Something went wrong.'
          });
        }
      });
  }

  resetForm() {

    this.employeeForm.reset();

    this.selectedFile = null;

    this.imagePreview.set('');

  }

  loadEmployeeById(id: number) {

    this.employeeService
      .getEmployees(id.toString())
      .subscribe((employee: any) => {

        if (employee.data && employee.data.length > 0) {

          const emps = employee.data[0];

          this.employeeForm.patchValue({
            employeeId: emps.employeeId,
            userId: emps.userId,
            fullName: emps.fullName,
            email: emps.email,
            phoneNumber: emps.phoneNumber,
            salary: emps.salary,
            departmentId: emps.departmentId,
            roleId: emps.roleId,
            ProfileImage: emps.profileImage,
            updatedby: Number(this.authService.getUserId())
          });
          if (emps.profileImage) {
            const imageUrl = `https://localhost:7177/Documents/ProfileImage/${emps.profileImage}`;
            this.imagePreview.set(imageUrl);
            this.employeeForm.patchValue({
              ProfileImage: emps.profileImage
            });
          }
        }
      });
  }
}