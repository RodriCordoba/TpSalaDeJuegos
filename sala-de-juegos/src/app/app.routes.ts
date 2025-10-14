import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home').then(m => m.HomeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'quien-soy',
        loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoyComponent),
        canActivate: [authGuard]
    },
    {
        path: 'juego/ahorcado',
        loadComponent: () => import('./components/juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent),
        canActivate: [authGuard]
    },
    {
        path: 'juego/mayor-menor',
        loadComponent: () => import('./components/juegos/mayor-menor/mayor-menor').then(m => m.MayorMenorComponent),
        canActivate: [authGuard]
    },
    {
        path: 'juego/preguntados',
        loadComponent: () => import('./components/juegos/preguntados/preguntados').then(m => m.PreguntadosComponent),
        canActivate: [authGuard]
    },
    {
        path: 'juego/simon',
        loadComponent: () => import('./components/juegos/simon/simon').then(m => m.SimonComponent),
        canActivate: [authGuard]
    },
    {
        path: 'chat',
        loadComponent: () => import('./components/chat/chat').then(m => m.ChatComponent),
        canActivate: [authGuard]
    },
    {
        path: 'resultados',
        loadComponent: () => import('./components/resultados/resultados').then(m => m.ResultadosComponent),
        canActivate: [authGuard]
    },
    {
        path: 'encuesta',
        loadComponent: () => import('./components/encuesta/encuesta').then(m => m.EncuestaComponent),
        canActivate: [authGuard]
    },
    
    { path: '', redirectTo: '/login', pathMatch: 'full' }, 
    { path: '**', redirectTo: '/login' }, 
];