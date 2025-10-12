import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.puntaje = 0;
    this.mensaje = '¿La próxima carta será mayor o menor?';
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
        }
      });
  }

  apostar(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado || !this.cartaActual) return;

    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
      .subscribe(res => {
        const proximaCarta = res.cards && res.cards.length > 0 ? res.cards[0] : null;

        if (proximaCarta && this.cartaActual) {
            this.cartaSiguiente = proximaCarta;
            const valorActual = this.getValorCarta(this.cartaActual.value);
            const valorSiguiente = this.getValorCarta(proximaCarta.value);

            let acierto = false;
            if (eleccion === 'mayor' && valorSiguiente > valorActual) {
              acierto = true;
            } else if (eleccion === 'menor' && valorSiguiente < valorActual) {
              acierto = true;
            } else if (valorSiguiente === valorActual) {
              acierto = true;
            }

            if (acierto) {
              this.puntaje++;
              this.mensaje = `¡Correcto! La carta era ${proximaCarta.value}. Adivina la siguiente.`;
              this.cartaActual = proximaCarta;
              this.cartaSiguiente = null;
            } else {
              this.mensaje = `¡Perdiste! La carta era ${proximaCarta.value}. Tu puntaje final: ${this.puntaje}`;
              this.terminarJuego();
            }
        } else {
            this.mensaje = '¡Se acabaron las cartas! Tu puntaje final: ' + this.puntaje;
            this.terminarJuego();
        }
      });
  }

  terminarJuego() {
    this.juegoTerminado = true;
    this.authService.guardarResultado('Mayor o Menor', this.puntaje, this.puntaje > 0);
  }

  getValorCarta(valor: string): number {
    switch (valor) {
      case 'ACE': return 14;
      case 'KING': return 13;
      case 'QUEEN': return 12;
      case 'JACK': return 11;
      default: return parseInt(valor, 10);
    }
  }
}