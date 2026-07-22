import { CommonModule, NgTemplateOutlet } from '@angular/common'; 
import { Component, inject, input } from '@angular/core'; 
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { 
  AvatarComponent, 
  BadgeComponent, 
  BreadcrumbRouterComponent, 
  ColorModeService, 
  ContainerComponent, 
  DropdownComponent, 
  DropdownDividerDirective, 
  DropdownHeaderDirective, 
  DropdownItemDirective, 
  DropdownMenuDirective, 
  DropdownToggleDirective, 
  HeaderComponent, 
  HeaderNavComponent, 
  HeaderTogglerDirective, 
  NavItemComponent, 
  NavLinkDirective, 
  SidebarToggleDirective 
} from '@coreui/angular'; 
import { IconDirective } from '@coreui/icons-angular'; 
import { AuthService } from '../../../Services/auth.service'; 

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.scss', // Ensure scss binding is connected
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ContainerComponent, 
    HeaderTogglerDirective, 
    SidebarToggleDirective, 
    IconDirective, 
    HeaderNavComponent, 
    NavItemComponent, 
    NavLinkDirective, 
    RouterLink, 
    RouterLinkActive, 
    NgTemplateOutlet, 
    BreadcrumbRouterComponent, 
    DropdownComponent, 
    DropdownToggleDirective, 
    AvatarComponent, 
    DropdownMenuDirective, 
    DropdownHeaderDirective, 
    DropdownItemDirective, 
    BadgeComponent, 
    DropdownDividerDirective
  ]
})
export class DefaultHeaderComponent extends HeaderComponent {
  defaultImage = "/assets/images/default-image.jpg";
  sidebarId = input('sidebar1');

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  constructor(public authService: AuthService) {
    super();
  }

  logout(): void {
    this.authService.logout();
  }
}
