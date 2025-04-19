const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    id_budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget", required: true },  // Lien avec Budget
    description: { type: String, required: true },
    montant: { type: Number, required: true },
    date_depense: { type: Date, required: true },
    fournisseur: { type: String, required: true },
    justificatif: { type: String, required: true }
}, 
{ 
    collection: "Expense", 
    versionKey: false 
});

// Transformer _id en id et supprimer _id et __v
expenseSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Expense", expenseSchema);
