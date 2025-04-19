import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseComponent } from './expense/expense.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { SideBarComponent } from './side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DashboardComponent,BudgetComponent,ExpenseComponent,PredictionsComponent,SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProjetPI';
}
