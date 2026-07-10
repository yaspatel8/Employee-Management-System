import { Routes } from "@angular/router";
import { authGuard } from "../../guard/auth.guard";

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        data: {
            title: 'Positions'
        },
        children: [
            {
                path: '',
                redirectTo: 'positions-list',
                pathMatch: 'full'
            },
            {
                path: 'positions-list',
                canActivate: [authGuard],
                data: {
                    title: 'Positions List',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./positions-list/positions-list.component').then(m => m.PositionsListComponent),
            },
            {
                path: 'add-positions',
                canActivate: [authGuard],
                data: {
                    title: 'Add Positions',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./add-positions/add-positions.component').then(m => m.AddPositionsComponent)
            },
            {
                path: 'edit-positions/:id',
                canActivate: [authGuard],
                data: {
                    title: 'Edit Positions',
                    Role: ['admin', 'manager']
                },
                loadComponent: () => import('./add-positions/add-positions.component').then(m => m.AddPositionsComponent),
            }
        ]
    }
];