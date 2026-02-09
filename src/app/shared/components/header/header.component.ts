import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { ThemeService } from '../../../core/service/theme.service';
import { UserService, UserProfile } from '../../../core/service/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  today = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  profileOpen = false;
  isDarkMode = false;
  user: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
      },
      error: (err) => {
        console.error('Error cargando perfil en header', err);
      },
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
