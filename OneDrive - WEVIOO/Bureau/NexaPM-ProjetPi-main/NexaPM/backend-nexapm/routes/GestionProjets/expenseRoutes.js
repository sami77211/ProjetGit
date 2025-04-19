const express = require('express');
const router = express.Router();
const expenseController = require("../../controller/GestionProjets/expenseController");
// 👉 Route pour total des dépenses
router.get('/total', expenseController.getTotalExpenses);
// Route for getting all expenses
router.get('/', expenseController.getExpenses);

// Route for creating a new expense
router.post('/', expenseController.createExpense);

// Route for updating an existing expense
router.put('/:id', expenseController.updateExpense);

// Route for deleting an expense
router.delete('/:id', expenseController.deleteExpense);

router.get("/anomaly-detection", expenseController.detectAnomalousExpenses);
router.get("/efficiency-suppliers", expenseController.getExpenseEfficiencyBySupplier);

module.exports = router;
