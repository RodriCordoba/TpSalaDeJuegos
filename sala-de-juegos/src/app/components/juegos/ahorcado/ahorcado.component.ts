import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.scss']
})
export class AhorcadoComponent {

  abecedario: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  palabras: string[] = ['ANGULAR', 'SUPABASE', 'TYPESCRIPT', 'UTN', 'JUEGO'];
  palabraSecreta: string = '';
  palabraMostrada: string[] = [];
  letrasUsadas: string[] = [];
  intentosRestantes: number = 6;
  mensaje: string = '';
  juegoTerminado: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.palabraSecreta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.palabraMostrada = Array(this.palabraSecreta.length).fill('_');
    this.letrasUsadas = [];
    this.intentosRestantes = 6;
    this.mensaje = '¡Adivina la palabra!';
  }

  adivinarLetra(letra: string) {
    if (this.letrasUsadas.includes(letra) || this.juegoTerminado) {
      return;
    }

    this.letrasUsadas.push(letra);
    let acierto = false;

    for (let i = 0; i < this.palabraSecreta.length; i++) {
      if (this.palabraSecreta[i] === letra) {
        this.palabraMostrada[i] = letra;
        acierto = true;
      }
    }

    if (!acierto) {
      this.intentosRestantes--;
    }

    this.verificarEstadoJuego();
  }

  verificarEstadoJuego() {
    const gano = this.palabraMostrada.join('') === this.palabraSecreta;
    const perdio = this.intentosRestantes <= 0;

    if (gano) {
      this.mensaje = '¡Felicidades, Ganaste!';
      this.juegoTerminado = true;
      this.authService.guardarResultado('Ahorcado', this.intentosRestantes, true);
    } else if (perdio) {
      this.mensaje = `¡Perdiste! La palabra era: ${this.palabraSecreta}`;
      this.juegoTerminado = true;
      this.authService.guardarResultado('Ahorcado', 0, false);
    }
  }

  getImagenAhorcado() {
    return `assets/ahorcado/hangman-${6 - this.intentosRestantes}.svg`;
  }
}