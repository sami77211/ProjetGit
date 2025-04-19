const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    montant_total: { type: Number, required: true },
    date_allocation: { type: Date, required: true },
    projet_associe: { type: String, required: true },     // <- modifié
    responsable: { type: String, required: true }         // <- modifié
},
{
    collection: "Budget",
    versionKey: false
});

// Transformer _id en id
budgetSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Budget", budgetSchema);
