import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private totalPersonajes = 151;
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) { }

  obtenerPersonajes(): Observable<any[]> {
    const ids = new Set<number>();
    while (ids.size < 4) {
      const id = Math.floor(Math.random() * this.totalPersonajes) + 1;
      ids.add(id);
    }
    const idArray = Array.from(ids);
    const requests = idArray.map(id => this.http.get<any>(`${this.apiUrl}${id}`));
    return forkJoin(requests).pipe(
      map(pokemons => {
        return pokemons.map(pokemon => ({
          name: this.capitalizar(pokemon.name), 
          image: pokemon.sprites.front_default 
        }));
      })
    );
  }
  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}