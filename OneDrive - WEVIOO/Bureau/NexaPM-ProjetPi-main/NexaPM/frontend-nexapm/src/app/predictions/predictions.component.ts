import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Chart, ChartConfiguration } from 'chart.js/auto';



interface PredictionData {
  month: string;
  actualExpense: number;
  predictedExpense: number;
  accuracy: number;
}

interface ChartInstances {
  prediction?: Chart;
  accuracy?: Chart;
}

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit {
  @ViewChild('predictionChart') predictionChart!: ElementRef;
  @ViewChild('accuracyChart') accuracyChart!: ElementRef;
  readonly Math: typeof Math = Math;
  predictions: PredictionData[] = [];
  selectedPeriod: '3months' | '6months' | '1year' = '3months';
  totalPredictedExpense: number = 0;
  averageAccuracy: number = 0;
  trendDirection: 'up' | 'down' | 'stable' = 'stable';
  anomalyDetected: boolean = false;
  isLoading: boolean = false;
  charts: ChartInstances = {};

  constructor() {
    this.generateMockData();
  }

  ngOnInit() {
   
    this.initializeCharts();
    this.calculateMetrics();
    this.updatePredictions();
  }

  ngOnDestroy() {
    // Nettoyer les instances de Chart
    if (this.charts.prediction) {
      this.charts.prediction.destroy();
    }
    if (this.charts.accuracy) {
      this.charts.accuracy.destroy();
    }
  }

  private generateMockData() {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];
    this.predictions = months.map(month => ({
      month,
      actualExpense: Math.random() * 10000 + 5000,
      predictedExpense: Math.random() * 10000 + 5000,
      accuracy: Math.random() * 20 + 80
    }));
  }

  private initializeCharts() {
    this.createPredictionChart();
    this.createAccuracyChart();
  }

  private createPredictionChart() {
    if (this.charts.prediction) {
      this.charts.prediction.destroy();
    }

    const ctx = this.predictionChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.predictions.map(p => p.month),
        datasets: [
          {
            label: 'Dépenses Réelles',
            data: this.predictions.map(p => p.actualExpense),
            borderColor: '#4361ee',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            fill: true
          },
          {
            label: 'Prédictions',
            data: this.predictions.map(p => p.predictedExpense),
            borderColor: '#f72585',
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Prédictions vs Réalité'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Montant (€)'
            }
          }
        }
      }
    };

    this.charts.prediction = new Chart(ctx, config);
  }

  private createAccuracyChart() {
    if (this.charts.accuracy) {
      this.charts.accuracy.destroy();
    }

    const ctx = this.accuracyChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.predictions.map(p => p.month),
        datasets: [{
          label: 'Précision du Modèle',
          data: this.predictions.map(p => p.accuracy),
          backgroundColor: this.predictions.map(p => 
            p.accuracy >= 90 ? '#4cc9f0' :
            p.accuracy >= 80 ? '#4895ef' : '#f72585'
          )
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Précision des Prédictions'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Précision (%)'
            }
          }
        }
      }
    };

    this.charts.accuracy = new Chart(ctx, config);
  }

  private calculateMetrics() {
    this.totalPredictedExpense = this.predictions.reduce(
      (sum, pred) => sum + pred.predictedExpense, 0
    );
    this.averageAccuracy = this.predictions.reduce(
      (sum, pred) => sum + pred.accuracy, 0
    ) / this.predictions.length;

    const recentPredictions = this.predictions.slice(-3);
    const trend = recentPredictions[recentPredictions.length - 1].predictedExpense - 
                 recentPredictions[0].predictedExpense;
    this.trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';

    this.anomalyDetected = this.predictions.some(
      pred => Math.abs(pred.actualExpense - pred.predictedExpense) / pred.actualExpense > 0.2
    );
  }

  updatePredictions() {
    this.isLoading = true;
    setTimeout(() => {
      this.generateMockData();
      this.initializeCharts();
      this.calculateMetrics();
      this.isLoading = false;
    }, 1500);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  }
}
