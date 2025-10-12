import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';   
import { supabase } from '../../services/supabase.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent { 
  
   public userEmail: string | null = null; 

   constructor(private authService: AuthService, private router: Router) {
     supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          this.userEmail = session.user.email ?? null; 
        } else {
          this.router.navigate(['/login']);
        }
     });
   }

   async logout() {
     await this.authService.logout(); 
     this.userEmail = null; 
     this.router.navigate(['/login']); 
   }
}