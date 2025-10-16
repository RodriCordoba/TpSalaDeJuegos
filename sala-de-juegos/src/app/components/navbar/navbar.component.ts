import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase.service';
import type { Subscription } from '@supabase/supabase-js';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  public userEmail: string | null = null;
  authSubscription: Subscription | null = null; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      this.userEmail = session?.user?.email ?? null;
      this.cdr.detectChanges();
    });
    this.authSubscription = data.subscription;
    this.authService.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.userEmail = session.user.email ?? null;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}