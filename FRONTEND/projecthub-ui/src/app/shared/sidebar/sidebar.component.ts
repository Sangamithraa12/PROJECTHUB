import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string = '';
  userRole: string = '';

  constructor(
    private auth: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    this.userName = user?.user?.name || user?.name || '';
    this.userRole = this.auth.getUserRole();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.auth.logout();
  }
}

