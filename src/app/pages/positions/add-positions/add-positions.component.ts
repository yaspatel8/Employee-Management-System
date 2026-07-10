import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '../../../Services/position.service';
import { AuthService } from '../../../Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-positions',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-positions.component.html',
  styleUrl: './add-positions.component.scss',
})
export class AddPositionsComponent {
    positionForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private positionService: PositionService, private route: ActivatedRoute, private authService: AuthService) {

    this.positionForm = this.fb.group({
      positionId: [0],
      positionName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      updatedby: [null],
      level: [null, [Validators.required, Validators.min(1), Validators.max(20)]],
      createdBy: Number(authService.getUserId())
    });
  }

  editMode = false;
  positionId = 0;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    

    if (id) {
      this.positionId = Number(id);
      this.editMode = true;
      this.loadPositionById(this.positionId);
      
    }
  }

  loadPositionById(id: number) {
    this.positionService
      .getPositions(id.toString())
      .subscribe((response: any) => {
        
        if (response.data && response.data.length > 0) {
          const pos = response.data[0];
        
          this.positionForm.patchValue({
            
            positionId: pos.positionId,
            positionName: pos.positionName,
            level: pos.level,
            updatedby: Number(this.authService.getUserId())
          });
         
        }
      });
  }

  onSubmit() {
    if (this.positionForm.invalid) {
      return;
    }

    this.positionService
      .savePosition(this.positionForm.value)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            Swal.fire('Success', response.message, 'success');
            this.router.navigate(['/positions/positions-list']);
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
