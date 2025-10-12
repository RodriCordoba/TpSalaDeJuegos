import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home';
import { authGuard } from './guards/auth-guard'; 
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component'; 

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent }, 
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },

    { path: 'juego/ahorcado', component: AhorcadoComponent, canActivate: [authGuard] }, 

    { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: '**', redirectTo: '/home' },
];