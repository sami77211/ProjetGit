import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Budget {
  id: string;  // Remplacer id par id
  nom: string;
  montant_total: number;
  date_allocation: Date;
  projet_associe: string;
  responsable: string;
}


@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule], // Ajout de HttpClientModule
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  isModalOpen = false;
  selectedBudget: Budget | null = null;
  modalMode: 'create' | 'edit' = 'create';
  budgetForm!: FormGroup;
  apiUrl = 'http://localhost:3000/budget'; // Remplace par l'URL de ton API

  // Statistiques
  totalBudget = 0;
  nombreProjets = 0;
  moyenneBudget = 0;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.loadBudgets();
    this.initForm();
  
  }

  private initForm(): void {
    this.budgetForm = this.formBuilder.group({
      nom: ['', Validators.required],
      montant_total: ['', [Validators.required, Validators.min(0)]],
      date_allocation: ['', Validators.required],
      projet_associe: ['', Validators.required],
      responsable: ['', Validators.required]
    });
  }
  private loadBudgets(): void {
    this.http.get<Budget[]>(this.apiUrl).subscribe(
      (data) => {
        // Assure-toi de renommer le champ `id` en `id` si nécessaire
        this.budgets = data.map(budget => ({
          id: budget.id,  // Remplacer id par id
          nom: budget.nom,
          montant_total: budget.montant_total,
          date_allocation: new Date(budget.date_allocation),
          projet_associe: budget.projet_associe,
          responsable: budget.responsable
        }));
  
        console.log('Budgets:', this.budgets);
        this.calculateStats();
      },
      (error) => console.error('Erreur lors du chargement des budgets:', error)
    );
  }
  
  

  calculateStats() {
    this.totalBudget = this.budgets.reduce((acc, curr) => acc + curr.montant_total, 0);
    this.nombreProjets = new Set(this.budgets.map(b => b.projet_associe)).size;
    this.moyenneBudget = this.totalBudget / this.budgets.length || 0;
  }

  openModal(mode: 'create' | 'edit', budget?: Budget) {
    this.modalMode = mode;
    this.selectedBudget = budget || null;

    if (mode === 'edit' && budget) {
      this.budgetForm.patchValue({
        nom: budget.nom,
        montant_total: budget.montant_total,
        date_allocation: new Date(budget.date_allocation).toISOString().split('T')[0],
        projet_associe: budget.projet_associe,
        responsable: budget.responsable
      });
    } else {
      this.budgetForm.reset();
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBudget = null;
    this.budgetForm.reset();
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      const formData = this.budgetForm.value;
      formData.date_allocation = new Date(formData.date_allocation);

      if (this.modalMode === 'create') {
        this.http.post<Budget>(this.apiUrl, formData).subscribe((newBudget) => {
          this.budgets.push(newBudget);
          this.calculateStats();
          this.closeModal();
        });
      } else if (this.selectedBudget) {
        console.log(this.selectedBudget)
        this.http.put<Budget>(`${this.apiUrl}/${this.selectedBudget.id}`, formData).subscribe((updatedBudget) => {
          const index = this.budgets.findIndex(b => b.id === this.selectedBudget!.id);
          this.budgets[index] = updatedBudget;
          this.calculateStats();
          this.closeModal();
        });
      }
    }
  }

  deleteBudget(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.budgets = this.budgets.filter(b => b.id !== id);
        this.calculateStats();
      });
    }
  }
}
