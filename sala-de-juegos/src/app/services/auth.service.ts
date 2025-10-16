import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async registrar(email: string, password: string) {
    return await supabase.auth.signUp({
      email: email,
      password: password,
    });
  }

  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  }

  async logout() {
    return await supabase.auth.signOut();
  }

  async getSession() {
    return await supabase.auth.getSession();
  }

  async registrarLog(userEmail: string, userId: string) {
    return await supabase
      .from('logs_ingreso')
      .insert({
        user_email: userEmail,
        user_id: userId,
        fecha_ingreso: new Date().toISOString()
      });
  }

  async guardarResultado(juego: string, puntaje: number, gano: boolean) {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data, error } = await supabase
        .from('resultados')
        .insert({
          user_id: session.user.id,
          email_usuario: session.user.email,
          juego: juego,
          puntaje: puntaje,
          victoria: gano,
          fecha_juego: new Date().toISOString()
        });
      if (error) {
        console.error('Error al guardar resultado:', error);
        return { data: null, error };
      }
      return { data, error: null };
    }
    return null;
  }

  async obtenerResultados() {
    const { data, error } = await supabase
      .from('resultados')
      .select('*');

    if (error) {
      console.error('Error al obtener resultados:', error);
      return [];
    }
    return data;
  }

  async guardarEncuesta(formData: any) {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data, error } = await supabase
        .from('encuestas')
        .insert({
          user_id: session.user.id,
          email_usuario: session.user.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          edad: formData.edad,
          telefono: formData.telefono,
          juego_favorito: formData.juegoFavorito,
          puntuacion_app: formData.puntuacionApp,
          mejoraria: formData.mejoraria,
          fecha_encuesta: new Date().toISOString()
        });

      if (error) {
        console.error('Error al guardar la encuesta:', error);
        return false;
      }
      return true;
    }
    return false;
  }

  obtenerMensajes() {
    return supabase
      .from('mensajes')
      .select('*')
      .order('created_at', { ascending: true });
  }

  async enviarMensaje(texto: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return await supabase
        .from('mensajes')
        .insert({
          texto: texto,
          user_id: session.user.id,
          user_email: session.user.email 
        });
    }
    return null;
  }
}