import { Routes } from '@angular/router';
import { authGuard } from '../../guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: {
      title: $localize`Dashboard`,
      Role: ['admin', 'manager', 'employee']
    },
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
  }
];

