import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  NgApexchartsModule
} from "ng-apexcharts";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgApexchartsModule,HttpClientModule]
})
export class DashboardComponent implements OnInit {
  totalBudget: number = 0;
  totalExpenses: number = 0;
  remainingBudget: number = 0;

  pieChartOptions!: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    responsive: ApexResponsive[];
  };
  
  lineChartOptions!: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    colors: string[];
    dataLabels: ApexDataLabels;
  };
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBudgetAndExpenses();
  }

  loadBudgetAndExpenses(): void {
    const budgetUrl = 'http://localhost:3000/budget';
    const expenseUrl = 'http://localhost:3000/expense';

    this.http.get<any[]>(budgetUrl).subscribe(budgets => {
      this.totalBudget = budgets.reduce((sum, budget) => sum + budget.montant_total, 0);

      this.http.get<any[]>(expenseUrl).subscribe(expenses => {
        this.totalExpenses = expenses.reduce((sum, expense) => sum + expense.montant, 0);
        this.remainingBudget = this.totalBudget - this.totalExpenses;

        // Mise à jour des graphiques après chargement des données
        this.setupPieChart(expenses);
        this.setupLineChart(expenses);
      });
    });
  }

  setupPieChart(expenses: any[]): void {
    // Catégoriser les dépenses par fournisseur (ou autre logique)
    const grouped: { [key: string]: number } = {};
    expenses.forEach(e => {
      const key = e.fournisseur || 'Autre';
      grouped[key] = (grouped[key] || 0) + e.montant;
    });

    this.pieChartOptions = {
      series: Object.values(grouped),
      chart: {
        type: "donut",
        height: 320
      },
      labels: Object.keys(grouped),
      colors: ["#2C3E50", "#3498DB", "#E74C3C", "#F1C40F"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  setupLineChart(expenses: any[]): void {
    const monthlyTotals = new Array(12).fill(0);
    expenses.forEach(e => {
      const date = new Date(e.date_depense);
      const month = date.getMonth();
      monthlyTotals[month] += e.montant;
    });

    this.lineChartOptions = {
      series: [{
        name: "Expenses",
        data: monthlyTotals.slice(0, 6) // Jan - Jun
      }],
      chart: {
        height: 320,
        type: "line",
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      colors: ["#3498DB"],
      dataLabels: {
        enabled: false
      }
    };
  }
}
