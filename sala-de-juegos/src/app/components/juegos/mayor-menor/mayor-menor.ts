import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface Carta {
  image: string;
  value: string;
  suit: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './mayor-menor.html',
  styleUrls: ['./mayor-menor.scss']
})
export class MayorMenorComponent implements OnInit {
  deckId: string = '';
  cartaActual: Carta | null = null;
  cartaSiguiente: Carta | null = null;
  puntaje: number = 0;
  mensaje: string = '';
  juegoTerminado: boolean = false;
  isLoading: boolean = true;
  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.isLoading = true;
    this.juegoTerminado = false;
    this.puntaje = 0;
    this.mensaje = 'Barajando...';
    this.cartaActual = null;

    this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .subscribe(res => {
        this.deckId = res.deck_id;
        this.sacarCarta();
      });
  }

  sacarCarta() {
    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
      .subscribe(res => {
        if (res.cards && res.cards.length > 0) {
          this.cartaActual = res.cards[0];
          this.mensaje = '¿La próxima carta será mayor o menor?';
        }
        this.isLoading = false;
        this.cdr.markForCheck(); 
      });
  }

  apostar(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado || !this.cartaActual) return;

    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
      .subscribe(res => {
        const proximaCarta = res.cards?.[0];
        if (proximaCarta && this.cartaActual) {
          this.cartaSiguiente = proximaCarta;
          const valorActual = this.getValorCarta(this.cartaActual.value);
          const valorSiguiente = this.getValorCarta(proximaCarta.value);
          const acierto = (eleccion === 'mayor' && valorSiguiente >= valorActual) ||
                        (eleccion === 'menor' && valorSiguiente <= valorActual);

          if (acierto) {
            this.puntaje++;
            this.mensaje = `¡Correcto! Salió un ${proximaCarta.value}.`;
            this.cartaActual = proximaCarta;
          } else {
            this.mensaje = `¡Perdiste! Salió un ${proximaCarta.value}. Puntaje final: ${this.puntaje}`;
            this.terminarJuego();
          }
        } else {
          this.mensaje = '¡Se acabaron las cartas! Puntaje final: ' + this.puntaje;
          this.terminarJuego();
        }
        this.cdr.markForCheck();
      });
  }

  terminarJuego() {
    this.juegoTerminado = true;
    if (this.puntaje > 0) {
      this.authService.guardarResultado('Mayor o Menor', this.puntaje, true);
    }
  }

  getValorCarta(valor: string): number {
    const valores: { [key: string]: number } = { 'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11 };
    return valores[valor] || parseInt(valor, 10);
  }
}