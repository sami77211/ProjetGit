import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseComponent } from './expense/expense.component';
import { PredictionsComponent } from './predictions/predictions.component';

export const routes: Routes = [
  // Redirection par défaut
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  
  // Routes principales
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard'
  },
  {
    path: 'budget',
    component: BudgetComponent,
    title: 'Gestion des Budgets'
  },
  {
    path: 'expense',
    component: ExpenseComponent,
    title: 'Gestion des Dépenses'
  },
  {
    path: 'predictions',
    component: PredictionsComponent,
    title: 'Prédictions IA'
  },
  
  // Route 404 - doit être la dernière
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
