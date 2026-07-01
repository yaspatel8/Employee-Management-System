import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DepartmentService } from '../../../Services/department.service';
import { Department } from '../../../models/department';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-department-list',
  imports: [CommonModule, RouterLink, FormsModule, MatPaginatorModule, MatSortModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent {

  private searchSubject = new Subject<string>();

  constructor(private departmentService: DepartmentService, private router: Router, private authService: AuthService) { }

  Departments = signal<Department[]>([]);

  message!: string;

  searchText = '';
  pageNumber = 1;
  pageSize = 3;
  totalRecords = 0;
  SortColumn = '';
  SortOrder = '';

  ngOnInit() {

    this.getDepartments();

    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {

        this.departmentService
          .getDepartments(searchText)
          .subscribe((d: any) => {

            this.Departments.set(d.data ?? []);

          });

      });

  }

  hasRole(...roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return roles.includes(userRole ?? '');
  }



  getDepartments() {

    this.departmentService
      .getDepartments(
        this.searchText,
        this.pageNumber,
        this.pageSize,
        this.SortColumn,
        this.SortOrder
      )
      .subscribe((d: any) => {
        this.Departments.set(d.data ?? []);

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
    this.getDepartments();
  }

  pageChanged(event: any) {

    this.pageNumber = event.pageIndex + 1;

    this.pageSize = event.pageSize;

    this.getDepartments();

  }

  deleteDepartment(id: number) {
    Swal.fire({

      title: 'Are you sure?',

      text: 'This department will be deleted.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes Delete',

      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.isConfirmed) {
        this.departmentService
          .deleteDepartment(id)
          .subscribe({

            next: (response:any) => {

              Swal.fire({

                icon: 'success',

                title:response.message

              });

              this.getDepartments();

            },

            error: (err:any) => {

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