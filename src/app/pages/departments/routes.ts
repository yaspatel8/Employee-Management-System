import { Routes } from '@angular/router';
import { authGuard } from '../../guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        data: {
            title: 'Departments'
        },
        children: [
            {
                path: '',
                redirectTo: 'department-list',
                pathMatch: 'full'
            },
            {
                path: 'department-list',
                canActivate: [authGuard],
                data: {
                    title: 'Department List',
                    Role: ['admin', 'manager', 'employee']
                },
                loadComponent: () => import('./department-list/department-list.component').then(m => m.DepartmentListComponent),

            },
            {
                path: 'add-department',
                canActivate: [authGuard],
                data: {
                    title: 'Add Department',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./add-department/add-department.component').then(m => m.AddDepartmentComponent),

            },
            {
                path: 'edit-department/:id',
                canActivate: [authGuard],
                data: {
                    title: 'Edit Department',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./add-department/add-department.component').then(m => m.AddDepartmentComponent),
            }
        ]
    }
];
