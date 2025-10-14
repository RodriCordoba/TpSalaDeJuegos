import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './encuesta.html',
  styleUrls: ['./encuesta.scss']
})
export class EncuestaComponent implements OnInit {
  encuestaForm: FormGroup;
  mensaje = '';
  enviadoConExito = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.encuestaForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
        apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
        edad: ['', [Validators.required, Validators.min(18), Validators.max(99), Validators.pattern(/^[0-9]+$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        juegoFavorito: ['', Validators.required],
        puntuacionApp: ['5', Validators.required],
        mejoraria: ['', Validators.required],
        acuerdoTerminos: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {}

  async enviarEncuesta() {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      return;
    }

    const exito = await this.authService.guardarEncuesta(this.encuestaForm.value);
    if (exito) {
      this.mensaje = '¡Gracias por tu opinión! Tu encuesta fue enviada con éxito.';
      this.enviadoConExito = true;
      this.encuestaForm.reset();
      setTimeout(() => this.router.navigate(['/home']), 3000);
    } else {
      this.mensaje = 'Hubo un error al enviar la encuesta. Por favor, intenta de nuevo.';
      this.enviadoConExito = false;
    }
    this.cdr.markForCheck();
  }
}