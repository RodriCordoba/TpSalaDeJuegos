import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

type Color = 'verde' | 'rojo' | 'amarillo' | 'azul';

@Component({
  selector: 'app-simon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './simon.html',
  styleUrls: ['./simon.scss']
})
export class SimonComponent implements OnInit {
  secuencia: Color[] = [];
  secuenciaJugador: Color[] = [];
  nivel = 0;
  mensaje = '¡Presiona "Empezar" para jugar!';
  juegoIniciado = false;
  juegoTerminado = false;
  turnoJugador = false;
  colorActivo: Color | null = null;

  tiempoRestante = 5; 
  timerId: any = null; 
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  iniciarJuego() {
    this.juegoIniciado = true;
    this.juegoTerminado = false;
    this.secuencia = [];
    this.nivel = 0;
    this.siguienteNivel();
  }

  siguienteNivel() {
    this.nivel++;
    this.secuenciaJugador = [];
    this.turnoJugador = false;

    const colores: Color[] = ['verde', 'rojo', 'amarillo', 'azul'];
    const nuevoColor = colores[Math.floor(Math.random() * 4)];
    this.secuencia.push(nuevoColor);

    this.mostrarSecuencia();
  }

  async mostrarSecuencia() {
    this.mensaje = `Nivel ${this.nivel}`;
    for (const color of this.secuencia) {
      this.colorActivo = color;
      this.cdr.markForCheck();
      await this.delay(500);
      this.colorActivo = null;
      this.cdr.markForCheck();
      await this.delay(250);
    }
    this.turnoJugador = true;
    this.iniciarTimer(); 
  }

  manejarClick(color: Color) {
    if (!this.turnoJugador) return;

    this.secuenciaJugador.push(color);
    this.iluminarBoton(color);

    const indiceActual = this.secuenciaJugador.length - 1;
    if (this.secuenciaJugador[indiceActual] !== this.secuencia[indiceActual]) {
      this.terminarJuego('¡Error! Secuencia incorrecta.');
      return;
    }

    if (this.secuenciaJugador.length === this.secuencia.length) {
      this.mensaje = '¡Bien hecho!';
      this.turnoJugador = false;
      this.detenerTimer(); 
      setTimeout(() => this.siguienteNivel(), 1000);
    } else {
      this.iniciarTimer(); 
    }
  }

  iniciarTimer() {
    this.detenerTimer(); 
    this.tiempoRestante = 5;
    this.mensaje = `Tu turno... (${this.tiempoRestante}s)`;
    this.cdr.markForCheck();

    this.timerId = setInterval(() => {
      this.tiempoRestante--;
      this.mensaje = `Tu turno... (${this.tiempoRestante}s)`;
      if (this.tiempoRestante <= 0) {
        this.terminarJuego('¡Se acabó el tiempo!');
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  detenerTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  async iluminarBoton(color: Color) {
    this.colorActivo = color;
    this.cdr.markForCheck();
    await this.delay(200);
    this.colorActivo = null;
    this.cdr.markForCheck();
  }

  terminarJuego(razon: string) {
    this.detenerTimer(); 
    this.juegoTerminado = true;
    this.mensaje = `${razon} Alcanzaste el nivel ${this.nivel}.`;
    if (this.nivel > 1) {
      this.authService.guardarResultado('Simon', this.nivel - 1, true);
    }
    this.cdr.markForCheck();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}