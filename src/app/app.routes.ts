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
        loadComponent: () => import('./components/clientes/main-clientes/main-clientes').then(m => m.Clientes)
    },
    {
        path: 'clientes/detalles/:dni',
        loadComponent: () => import('./components/clientes/detalle-clientes/detalle-clientes').then(m => m.DetalleClientes)
    },
    {
        path: 'apps',
        loadComponent: () => import('./components/aplicaciones/main-aplicaciones/main-aplicaciones').then(m => m.Aplicaciones)
    },
    {
        path: 'apps/detalles/:idApp',
        loadComponent: () => import('./components/aplicaciones/detalle-aplicacion/detalle-aplicacion').then(m => m.DetalleAplicacion)
    },
    {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full'
    }
];
