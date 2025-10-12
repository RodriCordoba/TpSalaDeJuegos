import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreguntadosService } from '../../../services/preguntados.services';
import { AuthService } from '../../../services/auth.service';

interface Personaje {
  name: string;
  image: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [PreguntadosService],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.scss']
})
export class PreguntadosComponent implements OnInit {
  personajeCorrecto: Personaje | null = null;
  opciones: string[] = [];
  puntaje: number = 0;
  mensaje: string = '';
  juegoTerminado: boolean = false;
  respuestaEnviada: boolean = false;
  isLoading: boolean = true;

  constructor(
    private preguntadosService: PreguntadosService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.puntaje = 0;
    this.cargarPregunta();
  }

  cargarPregunta() {
    this.isLoading = true;
    this.respuestaEnviada = false;
    this.mensaje = 'Cargando personaje...';
    this.personajeCorrecto = null;
    this.cdr.markForCheck(); 

    this.preguntadosService.obtenerPersonajes().subscribe({
      next: (personajes) => {
        const personajeCorrecto = personajes[Math.floor(Math.random() * personajes.length)];
        this.personajeCorrecto = personajeCorrecto;
        this.opciones = personajes.map(p => p.name).sort(() => 0.5 - Math.random());
        this.mensaje = '¿Quién es este personaje?';
        this.isLoading = false;
        this.cdr.markForCheck(); 
      },
      error: (err) => {
        this.mensaje = 'Error al cargar los personajes. Intente más tarde.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  seleccionarRespuesta(opcion: string) {
    if (this.respuestaEnviada) return;
    this.respuestaEnviada = true;

    if (opcion === this.personajeCorrecto?.name) {
      this.puntaje++;
      this.mensaje = '¡Correcto!';
      this.cdr.markForCheck(); 
      setTimeout(() => this.cargarPregunta(), 1500);
    } else {
      this.mensaje = `¡Incorrecto! Era ${this.personajeCorrecto?.name}. Puntaje final: ${this.puntaje}`;
      this.terminarJuego();
      this.cdr.markForCheck(); 
    }
  }

  terminarJuego() {
    this.juegoTerminado = true;
    if (this.puntaje > 0) {
      this.authService.guardarResultado('Preguntados', this.puntaje, true);
    }
  }
}