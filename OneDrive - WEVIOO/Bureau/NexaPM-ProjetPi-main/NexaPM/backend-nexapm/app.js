const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");  // Update the path if needed
const budgetRoutes = require("./routes/GestionProjets/budgetRoutes");  // Update the path if needed
const expenseRoutes = require("./routes/GestionProjets/expenseRoutes");  // Update the path if needed
const cors = require('cors');  // Importer cors

const app = express();

// Activer CORS pour toutes les requêtes
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(mongoconnect.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log("Erreur de connexion MongoDB", err));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the routes
app.use("/budget", budgetRoutes);
app.use('/expense', expenseRoutes); 

// Start the server
app.listen(3000, () => {
  console.log("Serveur en écoute sur le port 3000");
});

module.exports = app;
