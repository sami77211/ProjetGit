const Budget = require("../../model/GestionProjets/budgetModel");

// Calcul de la somme totale des budgets
exports.getTotalBudget = async (req, res, next) => {
    try {
        const result = await Budget.aggregate([
            {
                $group: {
                    _id: null,
                    totalBudget: { $sum: "$montant_total" }
                }
            }
        ]);

        const total = result.length > 0 ? result[0].totalBudget : 0;

        res.json({ totalBudget: total });
    } catch (error) {
        next(error);
    }
};

// Obtenir tous les budgets
exports.getBudgets = async (req, res, next) => {
    try {
        const budgets = await Budget.find();
        console.log("📊 Budgets récupérés :", budgets);
        res.json(budgets);
    } catch (error) {
        next(error);
    }
};

exports.createBudget = async (req, res, next) => {
    try {
        const { nom, montant_total, date_allocation, projet_associe, responsable } = req.body;

        // Validation manuelle
        if (!nom || typeof nom !== "string") {
            return res.status(400).json({ error: "Le nom est requis et doit être une chaîne de caractères." });
        }

        if (montant_total == null || typeof montant_total !== "number" || montant_total <= 0) {
            return res.status(400).json({ error: "Le montant total est requis, doit être un nombre et supérieur à zéro." });
        }
        

        if (!date_allocation || isNaN(Date.parse(date_allocation))) {
            return res.status(400).json({ error: "La date d'allocation est invalide ou manquante." });
        }

        if (!projet_associe || typeof projet_associe !== "string") {
            return res.status(400).json({ error: "Le projet associé est requis et doit être une chaîne de caractères." });
        }

        if (!responsable || typeof responsable !== "string") {
            return res.status(400).json({ error: "Le responsable est requis et doit être une chaîne de caractères." });
        }

        // Création du budget
        const newBudget = new Budget({
            nom,
            montant_total,
            date_allocation: new Date(date_allocation),
            projet_associe,
            responsable
        });

        await newBudget.save();
        res.status(201).json(newBudget);

    } catch (error) {
        console.error("Erreur lors de la création du budget :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

// Modifier un budget
exports.updateBudget = async (req, res, next) => {
    try {
        const { id } = req.params;
        const budgetExist = await Budget.findById(id);

        if (!budgetExist) {
            return res.status(404).json({ message: "Budget introuvable" });
        }

        const budget = await Budget.findByIdAndUpdate(id, req.body, { new: true });
        res.json(budget);
    } catch (error) {
        next(error);
    }
};

// Supprimer un budget
exports.deleteBudget = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const deletedBudget = await Budget.findByIdAndDelete(id);
        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget introuvable" });
        }

        res.json({ message: "Budget supprimé avec succès" });
    } catch (error) {
        next(error);
    }
};
// 🔍 Méthode 1 : Calcul de l’indice de fiabilité des responsables
exports.getResponsableEfficiencyIndex = async (req, res, next) => {
    try {
        const data = await Budget.aggregate([
            {
                $group: {
                    _id: "$responsable",
                    montants: { $push: "$montant_total" },
                    totalBudgets: { $sum: 1 }
                }
            }
        ]);

        const result = data.map(entry => {
            const mean = entry.montants.reduce((a, b) => a + b, 0) / entry.montants.length;
            const variance = entry.montants.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / entry.montants.length;
            const stdDev = Math.sqrt(variance);
            const indiceFiabilite = 1 / (stdDev + 1);

            return {
                responsable: entry._id,
                totalBudgets: entry.totalBudgets,
                ecartType: stdDev,
                indiceFiabilite: Number(indiceFiabilite.toFixed(3))
            };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// 📊 Méthode 2 : Calcul d’un indice de priorité d’audit des budgets
exports.getBudgetsAuditPriority = async (req, res, next) => {
    try {
        const budgets = await Budget.find();
        const today = new Date();

        const maxMontant = Math.max(...budgets.map(b => b.montant_total));
        const maxAnciennete = Math.max(...budgets.map(b => {
            const diff = today - new Date(b.date_allocation);
            return Math.floor(diff / (1000 * 60 * 60 * 24)); // en jours
        }));

        const result = budgets.map(budget => {
            const anciennete = Math.floor((today - new Date(budget.date_allocation)) / (1000 * 60 * 60 * 24));
            const score = (
                (budget.montant_total / maxMontant) * 0.4 +
                (anciennete / maxAnciennete) * 0.3 +
                0.3 // simulate: 1 - fiabilité (ici, on ne la calcule pas encore, mais peut être intégré)
            );

            return {
                id: budget.id,
                nom: budget.nom,
                montant_total: budget.montant_total,
                responsable: budget.responsable,
                date_allocation: budget.date_allocation,
                projet_associe: budget.projet_associe,
                scoreAudit: Number(score.toFixed(2)),
                priorite: score >= 0.7 ? "Haute 🔴" : score >= 0.4 ? "Moyenne 🟡" : "Basse 🟢"
            };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const Expense = require("../../model/GestionProjets/expenseModel");

// ⚡ Évaluation des performances budgétaires des responsables
exports.getBudgetExecutionPerformance = async (req, res, next) => {
    try {
        // Étape 1 : Récupérer les budgets avec leur responsable
        const budgets = await Budget.find().lean();
        const budgetIds = budgets.map(b => b._id);

        // Étape 2 : Grouper les dépenses par id_budget
        const expenses = await Expense.aggregate([
            {
                $match: { id_budget: { $in: budgetIds } }
            },
            {
                $group: {
                    _id: "$id_budget",
                    totalDepenses: { $sum: "$montant" }
                }
            }
        ]);

        // Créer un dictionnaire pour accéder rapidement aux dépenses par budget
        const depensesMap = {};
        expenses.forEach(e => {
            depensesMap[e._id.toString()] = e.totalDepenses;
        });

        // Étape 3 : Calcul du taux d'exécution pour chaque responsable
        const performanceMap = {};

        budgets.forEach(budget => {
            const depense = depensesMap[budget._id.toString()] || 0;
            const tauxExecution = (depense / budget.montant_total) * 100;

            if (!performanceMap[budget.responsable]) {
                performanceMap[budget.responsable] = {
                    responsable: budget.responsable,
                    totalBudgets: 0,
                    totalMontant: 0,
                    totalDepenses: 0,
                };
            }

            performanceMap[budget.responsable].totalBudgets += 1;
            performanceMap[budget.responsable].totalMontant += budget.montant_total;
            performanceMap[budget.responsable].totalDepenses += depense;
        });

        // Préparer le résultat final
        const result = Object.values(performanceMap).map(entry => {
            const tauxGlobal = (entry.totalDepenses / entry.totalMontant) * 100;
            return {
                responsable: entry.responsable,
                totalBudgets: entry.totalBudgets,
                montantTotalAlloue: entry.totalMontant,
                montantTotalDepense: entry.totalDepenses,
                tauxExecutionGlobal: Number(tauxGlobal.toFixed(2)) + " %"
            };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};
