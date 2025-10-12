import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Mensaje {
  user_email: string;
  texto: string;
  created_at: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatBox') private chatContainer!: ElementRef;

  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  currentUserEmail: string | null = null;
  private intervalId: any = null; 

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const { data: { session } } = await this.authService.getSession();
    if (session?.user) {
      this.currentUserEmail = session.user.email ?? null;
    }

    await this.cargarMensajes();
    this.iniciarRefrescoDeMensajes();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async cargarMensajes() {
    const { data } = await this.authService.obtenerMensajes();
    if (data) {
      this.mensajes = data as Mensaje[];
    }
  }

  iniciarRefrescoDeMensajes() {
    this.intervalId = setInterval(() => {
      this.cargarMensajes();
    }, 5000); 
  }

  async enviarMensaje() {
    if (this.nuevoMensaje.trim() === '') return;

    await this.authService.enviarMensaje(this.nuevoMensaje);
    this.nuevoMensaje = '';
    await this.cargarMensajes();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}