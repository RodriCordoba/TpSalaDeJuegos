import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.scss']
})
export class ResultadosComponent implements OnInit {
  resultados: any[] = [];
  isLoading = true;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  this.authService.obtenerResultados().then(res => {
    if (res) {
      this.resultados = res.sort((a: any, b: any) => b.puntaje - a.puntaje);
    }
    this.isLoading = false;
    this.cdr.markForCheck();
  });
}
}