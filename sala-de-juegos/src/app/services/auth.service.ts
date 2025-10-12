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
  async registrarLog(userEmail: string, userId: string) {
    return await supabase
      .from('logs_ingreso')
      .insert({
        user_email: userEmail,
        user_id: userId,
        fecha_ingreso: new Date().toISOString()
      });
  }
}