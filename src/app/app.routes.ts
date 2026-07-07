import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        data: {
          Role: ['admin', 'manager', 'employee']
        },
        canActivate: [authGuard],
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      // {
      //   path: 'theme',
      //   canActivate: [authGuard],
      //   loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      // },
      {
        path: 'departments',
        canActivate: [authGuard],
        data: {
          Role: ['admin', 'manager', 'employee']
        },
        loadChildren: () => import('./pages/departments/routes').then((m) => m.routes)
      },
      {
        path: 'employees',
        canActivate: [authGuard],
        data: {
          Role: ['admin', 'manager', 'employee']
        },
        loadChildren: () => import('./pages/employees/routes').then((m) => m.routes)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        data: {
          Role: ['admin', 'manager', 'employee']
        },
        loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
      },
      {
        path: 'profile/edit-profile/:id',
        canActivate: [authGuard],
        data: {
          Role: ['admin', 'manager', 'employee']
        },
        loadComponent: () => import('./pages/employees/add-employee/add-employee.component').then((m) => m.AddEmployeeComponent)
      },

    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/password/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    data: {
      title: 'Forgot Password'
    }
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/password/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    data: {
      title: 'Reset Password'
    }
  },
  { path: '**', redirectTo: '404' }
];
