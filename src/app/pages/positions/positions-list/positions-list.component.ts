import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import {debounceTime, Subject, distinctUntilChanged } from 'rxjs';
import { Position } from '../../../models/position';
import { AuthService } from '../../../Services/auth.service';
import { PositionService } from '../../../Services/position.service';
import Swal from 'sweetalert2';
import { IconSetService,IconDirective } from '@coreui/icons-angular';
import { cilPencil, cilTrash} from '@coreui/icons';

@Component({
  selector: 'app-positions-list',
  imports: [CommonModule, RouterLink, MatPaginatorModule, MatSortModule,FormsModule, IconDirective],
  providers: [IconSetService],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.scss',
})
export class PositionsListComponent {
private searchSubject = new Subject<string>();
  SelectedPositionIds: number[] = []

  constructor(private iconSetService: IconSetService, private positionService: PositionService, private router: Router, private authService: AuthService) { 
    this.iconSetService.icons = { cilPencil, cilTrash };
  }

  Positions = signal<Position[]>([]);

  message!: string;

  searchText = '';
  pageNumber = 1;
  pageSize = 3;
  totalRecords = 0;
  SortColumn = '';
  SortOrder = '';

  ngOnInit() {

    this.getPositions();

    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {

        this.positionService
          .getPositions (searchText)
          .subscribe((d: any) => {

            this.Positions.set(d.data ?? []);

          });

      });

  }

  hasRole(...roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return roles.includes(userRole ?? '');
  }

  getPositions() {

    this.positionService
      .getPositions(
        this.searchText,
        this.pageNumber,
        this.pageSize,
        this.SortColumn,
        this.SortOrder
      )
      .subscribe((d: any) => {
        this.Positions.set(d.data ?? []);

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
    this.getPositions();
  }

  pageChanged(event: any) {

    this.pageNumber = event.pageIndex + 1;

    this.pageSize = event.pageSize;

    this.getPositions();

  }

  changeStatus(positionId: number, isActive: boolean) {

    const updatedBy = Number(this.authService.getUserId());

    this.positionService.updatePositionStatus(positionId, isActive, updatedBy).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: response.message
        });
        this.getPositions();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: err.error?.message || 'Something went wrong.'
        });
      }
    });

  }

  deletePosition(id: number) {
    Swal.fire({

      title: 'Are you sure?',

      text: 'This position will be deleted.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes Delete',

      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.isConfirmed) {
        this.positionService
          .deletePosition(id)
          .subscribe({

            next: (response: any) => {
              if (response.success) {
              Swal.fire({

                icon: 'success',

                title: response.message

              });

              this.getPositions();

            }
            else {
              Swal.fire({
                icon: 'error',
                title: response.message || 'Something went wrong.'
              });
            }
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
