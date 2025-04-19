import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient ,HttpClientModule  } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { Console } from 'console';

interface Expense {
  _id: string;
  id_budget: string;
  description: string;
  montant: number;
  date_depense: Date;
  fournisseur: string;
  justificatif: string;
}

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  isModalOpen = false;
  selectedExpense: Expense | null = null;
  modalMode: 'create' | 'edit' = 'create';
  expenseForm!: FormGroup;
  expenseChart: Chart | null = null;
  

  // Statistiques
  totalExpenses = 0;
  monthlyExpenses = 0;
  averageExpense = 0;
  expensesBySupplier: { [key: string]: number } = {};

  private API_URL = 'http://localhost:3000/expense'; // Remplace par ton URL réelle

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.loadExpenses();
    this.initForm();
    console.log(this.expenses);
 
  }

  ngOnDestroy() {
    if (this.expenseChart) {
      this.expenseChart.destroy();
    }
  }

  private initForm(): void {
    this.expenseForm = this.formBuilder.group({
      id_budget: ['', Validators.required],
      description: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      date_depense: ['', Validators.required],
      fournisseur: ['', Validators.required],
      justificatif: ['']
    });
  }
  private loadExpenses(): void {
    this.http.get<any[]>(this.API_URL).subscribe(
      (data) => {
        // Mapper les données pour qu'elles correspondent à l'interface Expense
        this.expenses = data.map(expense => ({
          _id: expense._id || expense.id,// L'ID est déjà correct
          id_budget: expense.id_budget, // Id du budget
          description: expense.description, // Description de la dépense
          montant: expense.montant, // Montant de la dépense
          date_depense: new Date(expense.date_depense), // Conversion de la date en objet Date
          fournisseur: expense.fournisseur, // Fournisseur
          justificatif: expense.justificatif // Justificatif
        }));
  
        // Calcul des statistiques
        this.calculateStats();
        // Initialisation des graphiques
        this.initCharts();
      },
      (error) => console.error('Erreur lors du chargement des dépenses:', error)
    );
  }

  calculateStats(): void {
    this.totalExpenses = this.expenses.reduce((acc, curr) => acc + curr.montant, 0);

    const currentMonth = new Date().getMonth();
    this.monthlyExpenses = this.expenses
      .filter(exp => new Date(exp.date_depense).getMonth() === currentMonth)
      .reduce((acc, curr) => acc + curr.montant, 0);

    this.averageExpense = this.totalExpenses / this.expenses.length || 0;

    this.expensesBySupplier = this.expenses.reduce((acc, curr) => {
      acc[curr.fournisseur] = (acc[curr.fournisseur] || 0) + curr.montant;
      return acc;
    }, {} as { [key: string]: number });
  }

  initCharts(): void {
    const ctx = document.getElementById('expenseChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.expenseChart) {
        this.expenseChart.destroy();
      }
      this.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.expensesBySupplier),
          datasets: [{
            data: Object.values(this.expensesBySupplier),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }

  openModal(mode: 'create' | 'edit', expense?: Expense): void {
    this.modalMode = mode;
    this.isModalOpen = true;
    this.selectedExpense = expense || null;
  

    if (mode === 'edit' && expense) {
      this.expenseForm.patchValue({
        
        id_budget: expense.id_budget,
        description: expense.description,
        montant: expense.montant,
        date_depense: new Date(expense.date_depense).toISOString().split('T')[0],
        fournisseur: expense.fournisseur
      });
    } else {
      this.expenseForm.reset();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedExpense = null;
    this.expenseForm.reset();
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.value;
      formData.date_depense = new Date(formData.date_depense);

      if (this.modalMode === 'create') {
        this.http.post<Expense>(this.API_URL, formData).subscribe(
          (newExpense) => {
            this.expenses.push(newExpense);
            this.calculateStats();
            this.initCharts();
            this.closeModal();
          },
          (error) => console.error('Erreur lors de l’ajout de la dépense:', error)
        );
      } else if (this.selectedExpense) {
        const updatedExpense = { ...this.selectedExpense, ...formData };
        console.log(this.selectedExpense?._id);
        this.http.put(`${this.API_URL}/${this.selectedExpense._id}`, updatedExpense).subscribe(
          () => {
            const index = this.expenses.findIndex(e => e._id === this.selectedExpense!._id);
            this.expenses[index] = updatedExpense;
            this.calculateStats();
            this.initCharts();
            this.closeModal();
          },
          (error) => console.error('Erreur lors de la mise à jour de la dépense:', error)
        );
      }
    }
  }

  deleteExpense(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.http.delete(`${this.API_URL}/${id}`).subscribe(
        () => {
          this.expenses = this.expenses.filter(e => e._id !== id);
          this.calculateStats();
          this.initCharts();
        },
        (error) => console.error('Erreur lors de la suppression de la dépense:', error)
      );
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}
