const express = require("express");
const router = express.Router();
const budgetController = require("../../controller/GestionProjets/budgetController");

// 👉 Route pour calculer la somme des budgets
router.get('/total', budgetController.getTotalBudget);
router.get("/", budgetController.getBudgets);
router.post("/", budgetController.createBudget);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);
// 🔍 Nouveaux endpoints analytiques
router.get('/efficiency-index', budgetController.getResponsableEfficiencyIndex);
router.get('/audit-priority', budgetController.getBudgetsAuditPriority);
router.get("/budget-performance", budgetController.getBudgetExecutionPerformance);


module.exports = router;
