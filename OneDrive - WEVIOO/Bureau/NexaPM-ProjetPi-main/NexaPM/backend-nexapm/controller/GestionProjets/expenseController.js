const Expense = require("../../model/GestionProjets/expenseModel");  // Adjust path if necessary
const mongoose = require("mongoose");

// 👉 API pour calculer le total des dépenses
exports.getTotalExpenses = async (req, res, next) => {
    try {
      const result = await Expense.aggregate([
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: "$montant" }
          }
        }
      ]);
  
      const total = result.length > 0 ? result[0].totalExpenses : 0;
  
      res.json({ totalExpenses: total });
    } catch (error) {
      next(error);
    }
  };
// Obtenir toutes les dépenses
exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find();
        console.log("💸 Dépenses récupérées :", expenses);
        res.json(expenses);
    } catch (error) {
        next(error);
    }
};


exports.createExpense = async (req, res, next) => {
    try {
        const { description, montant, date_depense, fournisseur, justificatif, id_budget } = req.body;

        // Vérifie si l'ID du budget est valide
        if (!mongoose.Types.ObjectId.isValid(id_budget)) {
            return res.status(400).json({ error: "id_budget invalide" });
        }

        // Vérifie les champs obligatoires
        if (!description || typeof description !== "string") {
            return res.status(400).json({ error: "La description est requise et doit être une chaîne de caractères." });
        }

        if (typeof montant !== "number" || montant <= 0) {
            return res.status(400).json({ error: "Le montant est requis et doit être un nombre positif." });
        }

        if (!date_depense || isNaN(Date.parse(date_depense))) {
            return res.status(400).json({ error: "La date de dépense est requise et doit être une date valide." });
        }

        if (!fournisseur || typeof fournisseur !== "string") {
            return res.status(400).json({ error: "Le fournisseur est requis et doit être une chaîne de caractères." });
        }

        if (!justificatif || typeof justificatif !== "string") {
            return res.status(400).json({ error: "Le justificatif est requis et doit être une chaîne de caractères." });
        }

        // Création de la dépense
        const newExpense = new Expense({
            description: description.trim(),
            montant,
            date_depense: new Date(date_depense),
            fournisseur: fournisseur.trim(),
            justificatif: justificatif.trim(),
            id_budget: new mongoose.Types.ObjectId(id_budget),
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        next(error);
    }
};


// Modifier une dépense
exports.updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expenseExist = await Expense.findById(id);

        if (!expenseExist) {
            return res.status(404).json({ message: "Dépense introuvable" });
        }

        const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
        res.json(expense);
    } catch (error) {
        next(error);
    }
};

// Supprimer une dépense
exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ message: "Dépense introuvable" });
        }

        res.json({ message: "Dépense supprimée avec succès" });
    } catch (error) {
        next(error);
    }
};

// 🔍 Détection des anomalies de dépenses (montants trop élevés)
exports.detectAnomalousExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find();
        if (expenses.length === 0) return res.json([]);

        const montants = expenses.map(e => e.montant);
        const mean = montants.reduce((a, b) => a + b, 0) / montants.length;
        const variance = montants.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / montants.length;
        const stdDev = Math.sqrt(variance);

        const seuil = mean + 2 * stdDev; // Dépense anormale si > moyenne + 2 écart-types

        const anomalies = expenses
            .filter(e => e.montant > seuil)
            .map(e => ({
                ...e.toObject(),
                seuil_montant: seuil,
                ecart_type: stdDev,
                moyenne_globale: mean,
                type: "Anomalie ⚠️"
            }));

        res.json(anomalies);
    } catch (error) {
        next(error);
    }
};

// 🧠 Classement des fournisseurs par efficacité économique
exports.getExpenseEfficiencyBySupplier = async (req, res, next) => {
    try {
        const result = await Expense.aggregate([
            {
                $group: {
                    _id: "$fournisseur",
                    totalMontant: { $sum: "$montant" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    fournisseur: "$_id",
                    moyenne_depense: { $divide: ["$totalMontant", "$count"] },
                    total_depenses: "$count",
                    totalMontant: 1,
                    _id: 0
                }
            },
            {
                $sort: { moyenne_depense: 1 } // Du plus économe au plus cher
            }
        ]);

        res.json(result);
    } catch (error) {
        next(error);
    }
};
