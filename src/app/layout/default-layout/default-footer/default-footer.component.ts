import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
  standalone: true,
  imports: [FooterComponent] // Added explicitly to enable structural compiling
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}
