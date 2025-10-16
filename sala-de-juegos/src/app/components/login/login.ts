import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { FormsModule } from '@angular/forms';     
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  
  email: string = '';
  password: string = '';
  mensajeError: string = ''; 
  constructor(private authService: AuthService, private router: Router) {}
  async handleLogin() {
    this.mensajeError = '';

    if (!this.email || !this.password) {
        this.mensajeError = 'Debe ingresar un email y una contraseña.';
        return;
    }
    const { data, error } = await this.authService.login(this.email, this.password);

    if (error) {
      this.mensajeError = 'Credenciales inválidas. Verifique su email y contraseña.';
    } else if (data.user) {
      await this.authService.registrarLog(data.user.email!, data.user.id);
      this.router.navigate(['/home']);
    }
  }

   accesoRapido(tipo: 'admin' | 'jugador' | 'invitado') {
    switch (tipo) {
      case 'admin':
        this.email = 'admin@sala.com';
        this.password = '123456';
        break;
      case 'jugador':
        this.email = 'jugador@sala.com';
        this.password = '123456';
        break;
      case 'invitado':
        this.email = 'rodri@sala.com';
        this.password = 'rodri123';
        break;
    }
    this.handleLogin(); 
  }
}