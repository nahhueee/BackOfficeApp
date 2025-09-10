import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: 'inicio',
        loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio)
    },
    {
        path: 'clientes',
        loadComponent: () => import('./components/clientes/clientes').then(m => m.Clientes)
    },
    {
        path: 'apps',
        loadComponent: () => import('./components/aplicaciones/aplicaciones').then(m => m.Aplicaciones)
    }
];
