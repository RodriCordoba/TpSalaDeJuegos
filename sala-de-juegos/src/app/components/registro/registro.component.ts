import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { FormsModule } from '@angular/forms';     
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-registro',
  standalone: true, 
  imports: [FormsModule, CommonModule], 
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
    // ...
  email: string = '';
  password: string = '';
  mensajeError: string = ''; 
  constructor(private authService: AuthService, private router: Router) { }

  async handleRegistro() {
    this.mensajeError = ''; 
    if (!this.email || !this.password) {
        this.mensajeError = 'Debe ingresar un email y una contraseña.';
        return;
    }

    const { data, error } = await this.authService.registrar(this.email, this.password);

    if (error) {
      this.mensajeError = error.message;
    } else if (data.user) {
      await this.authService.registrarLog(data.user.email!, data.user.id);
      
      this.router.navigate(['/home']);
    }
  }
}