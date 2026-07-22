import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '../../models/Profile';
import { AuthService } from '../../Services/auth.service';
import { ProfileService } from '../../Services/profile.service';
import { IconSetService,IconDirective } from '@coreui/icons-angular';
import { cilPencil } from '@coreui/icons';


@Component({
  selector: 'app-profile',
  imports: [CommonModule,RouterLink,IconDirective],
  providers: [IconSetService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  constructor(private profileService: ProfileService, private authService: AuthService, private iconSetService: IconSetService) { 
    this.iconSetService.icons = { cilPencil };
  }

  defaultImage = "/assets/images/default-image.jpg";

  employee = signal<Profile | null>(null);

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    const userId = this.authService.getUserId();

    if (userId) {
      this.profileService.getProfile(Number(userId)).subscribe({
        next: (profileRes: any) => {
          if (profileRes.success && profileRes.data) {
            this.employee.set(profileRes.data);
            this.authService.currentUser.set(profileRes.data);
            console.log('Profile fetched successfully:', profileRes.data);
          } else {
            console.error('Failed to fetch profile:', profileRes.message);
          }
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
          console.error(err);
        }
      });
    }
  }
}