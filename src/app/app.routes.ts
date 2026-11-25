import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { DemoSession } from './data/demo-session';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Masuk · Ruang Tim',
    canActivate: [() => !inject(DemoSession).signedIn() || inject(Router).parseUrl('/employees')],
    loadComponent: () => import('./pages/login').then((page) => page.LoginPage),
  },
  {
    path: 'employees',
    canActivate: [(_, state) => inject(DemoSession).signedIn() ||
      inject(Router).createUrlTree(['/login'], { queryParams: { returnTo: state.url } })],
    loadComponent: () => import('./pages/directory-shell').then((page) => page.DirectoryShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Daftar karyawan · Ruang Tim',
        loadComponent: () => import('./pages/employee-list').then((page) => page.EmployeeListPage),
      },
      {
        path: 'new',
        title: 'Tambah karyawan · Ruang Tim',
        loadComponent: () => import('./pages/employee-form').then((page) => page.EmployeeFormPage),
      },
      {
        path: ':id',
        title: 'Detail karyawan · Ruang Tim',
        loadComponent: () => import('./pages/employee-detail').then((page) => page.EmployeeDetailPage),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  { path: '**', redirectTo: 'employees' },
];
