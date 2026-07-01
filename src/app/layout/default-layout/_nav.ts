import { INavData } from '@coreui/angular';

export interface AppNavItem extends INavData {
  roles?: string[];
  children?: AppNavItem[];
}

export const navItems: AppNavItem[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Departments',
    title: true,
    roles: ['admin','manager','employee']
  },
  {
    name: 'Department',
    url: '/departments',
    iconComponent: { name: 'cil-list' },
    roles: ['admin','manager','employee'],
    children: [
      {
        name: 'Department List',
        url: '/departments/department-list',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Employees',
    title: true
  },
  {
    name: 'Employees',
    url: '/employees',
    iconComponent: { name: 'cil-list' },
    children: [
      {
        name: 'Employee List',
        url: '/employees/employee-list',
        icon: 'nav-icon-bullet',
        roles: ['admin', 'manager']
      },
      {
        name: 'Employee With Department',
        url: '/employees/employee-with-department',
        icon: 'nav-icon-bullet',
        roles: ['admin', 'manager','employee']
      }
    ]
  }
];