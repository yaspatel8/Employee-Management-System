import { Component } from '@angular/core';
import { LodderService } from '../../Services/lodder.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-lodder',
  imports: [CommonModule],
  templateUrl: './lodder.component.html',
  styleUrl: './lodder.component.scss',
})
export class LodderComponent {
  constructor(private lodderService: LodderService) { }
  loading$ = this.lodderService.loading$;
}
