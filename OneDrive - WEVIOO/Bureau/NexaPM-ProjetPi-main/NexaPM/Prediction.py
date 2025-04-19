from flask import Flask, request, jsonify
import numpy as np
import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

# Initialisation de Flask
app = Flask(__name__)

# Fonction pour récupérer et préparer les données depuis l'API
def get_expenses_data():
    response = requests.get("http://localhost:3000/expense")
    if response.status_code == 200:
        return response.json()
    else:
        return []

# Fonction pour entraîner un modèle de régression linéaire
def train_model(expenses_data):
    # Convertir les données en DataFrame
    df = pd.DataFrame(expenses_data)
    
    # Assurer que les colonnes nécessaires existent
    if 'fournisseur' not in df or 'date_depense' not in df or 'montant' not in df:
        return None
    
    # Extraire les mois et fournisseurs
    df['month'] = pd.to_datetime(df['date_depense']).dt.month
    df['fournisseur'] = LabelEncoder().fit_transform(df['fournisseur'])
    
    # Features: fournisseur, month (mois)
    X = df[['fournisseur', 'month']]
    
    # Target: montant (dépenses)
    y = df['montant']
    
    # Créer et entraîner le modèle
    model = LinearRegression()
    model.fit(X, y)
    
    return model

# Fonction pour prédire les dépenses totales
def predict_total_expenses(expenses_data):
    model = train_model(expenses_data)
    if model is None:
        return "Erreur dans l'entraînement du modèle. Vérifiez les données."
    
    # Préparer les nouvelles données pour la prédiction
    df = pd.DataFrame(expenses_data)
    df['month'] = pd.to_datetime(df['date_depense']).dt.month
    df['fournisseur'] = LabelEncoder().fit_transform(df['fournisseur'])
    
    X_new = df[['fournisseur', 'month']]
    
    # Prédire les dépenses
    predictions = model.predict(X_new)
    
    # Retourner la somme des prédictions comme dépenses totales
    return sum(predictions)

# Définir une route pour la prédiction
@app.route('/predict_expenses', methods=['GET'])
def predict_expenses():
    expenses_data = get_expenses_data()
    
    if expenses_data:
        total_expenses = predict_total_expenses(expenses_data)
        return jsonify({"total_predicted_expenses": total_expenses})
    else:
        return jsonify({"error": "Erreur lors de la récupération des données des dépenses"}), 400

# Lancer l'application Flask
if __name__ == '__main__':
    app.run(debug=True)
