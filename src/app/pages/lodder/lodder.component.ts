import { Component } from '@angular/core';
import { LodderService } from '../../Services/lodder.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lodder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lodder.component.html',
  styleUrl: './lodder.component.scss',
})
export class LodderComponent {
  loading$ = this.lodderService.loading$;

  constructor(private lodderService: LodderService) { }
}
