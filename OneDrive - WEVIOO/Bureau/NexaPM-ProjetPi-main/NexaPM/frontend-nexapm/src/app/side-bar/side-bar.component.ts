import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  isExpanded = true;
  activeRoute: string = '';

  menuItems: MenuItem[] = [
    {
      icon: 'fas fa-chart-line',
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      icon: 'fas fa-wallet',
      label: 'Budgets',
      route: '/budget',
      badge: 3
    },
    {
      icon: 'fas fa-receipt',
      label: 'Dépenses',
      route: '/expense',
      badge: 5
    },
    {
      icon: 'fas fa-brain',
      label: 'Prédictions',
      route: '/predictions'
    }
  ];

  constructor(private router: Router) {
    this.activeRoute = this.router.url;
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  onMenuItemClick(route: string): void {
    this.activeRoute = route;
  }
}
