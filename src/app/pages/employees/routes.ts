import { Routes } from '@angular/router';
import { authGuard } from '../../guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Employees'
        },
        children: [
            {
                path: '',
                redirectTo: 'employee-list',
                pathMatch: 'full'
            },
            {
                path: 'employee-list',
                canActivate: [authGuard],
                data: {
                    title: 'Employee List',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent),
            },
            {
                path: 'employee-with-department',
                canActivate: [authGuard],
                data: {
                    title: 'Employee with Department',
                    Role: ['admin', 'manager', 'employee']
                },
                loadComponent: () => import('./employee-with-department/employee-with-department.component').then(m => m.EmployeeWithDepartmentComponent),

            },
            {
                path: 'add-employee',
                canActivate: [authGuard],
                data: {
                    title: 'Add Employee',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./add-employee/add-employee.component').then(m => m.AddEmployeeComponent),
            },
            {
                path: 'edit-employee/:id',
                canActivate: [authGuard],
                data: {
                    title: 'Edit Employee',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./add-employee/add-employee.component').then(m => m.AddEmployeeComponent),
            },
            {
                path: 'bulk-employees',
                canActivate: [authGuard],
                data: {
                    title: 'Bulk Employees',
                    Role: ['admin']
                },
                loadComponent: () => import('./bulk-employees/bulk-employees.component').then(m => m.BulkEmployeesComponent),
            }
        ]
    }
];
