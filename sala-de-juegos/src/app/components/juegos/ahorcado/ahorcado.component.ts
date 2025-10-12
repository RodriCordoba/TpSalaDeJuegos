import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.scss']
})
export class AhorcadoComponent {
  
  palabras: string[] = ['ANGULAR', 'SUPABASE', 'TYPESCRIPT', 'UTN'];
  palabraSecreta: string = '';
  palabraMostrada: string[] = []; 
  letrasUsadas: string[] = [];
  intentosRestantes: number = 6;
  mensaje: string = '';

  constructor(private router: Router) {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.palabraSecreta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.palabraMostrada = Array(this.palabraSecreta.length).fill('_');
    this.letrasUsadas = [];
    this.intentosRestantes = 6;
    this.mensaje = '¡Adivina la palabra!';
  }

  adivinarLetra(letra: string) {
    if (this.letrasUsadas.includes(letra) || this.intentosRestantes <= 0 || this.mensaje.includes('Ganaste')) {
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
    if (this.palabraMostrada.join('') === this.palabraSecreta) {
      this.mensaje = 'Felicidades, Ganaste!';
    } 
    else if (this.intentosRestantes <= 0) {
      this.mensaje = `Perdiste! La palabra era: ${this.palabraSecreta}`;
    }
  }

  get abecedario(): string[] {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }
}