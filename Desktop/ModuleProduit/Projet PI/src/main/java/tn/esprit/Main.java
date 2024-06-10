package tn.esprit;/*package tn.esprit;

import Services.ProduitService;
import models.Produit;

import java.util.List;

public class Main {
  public static void main(String[] args) {
    // Création d'une instance de ProduitService
    ProduitService produitService = ProduitService.getInstance();

    // Test de la méthode create()
    Produit newProduit = new Produit("1", "Nouveau Produit", 10.99, 100, 9.99, 19.99, 5.99, "Détails du produit", "001");
    produitService.create(newProduit);
    System.out.println("Nouveau produit créé: " + newProduit);
    //done
    // Test de la méthode retrieveById()
    Produit retrievedProduit = produitService.retrieveById("1");
    System.out.println("Produit récupéré par ID: " + retrievedProduit);


    // Test de la méthode retrieveAll()
    List<Produit> allProduits = produitService.retrieveAll();
    System.out.println("Tous les produits:");
    for (Produit produit : allProduits) {
      System.out.println(produit);
    }

    //   Test de la méthode update()
    //retrievedProduit.setNom("Nouveau nom de produit");
    //produitService.update(retrievedProduit);
    //System.out.println("Produit mis à jour: " + retrievedProduit);

    // Test de la méthode deleteById()
    //produitService.deleteById("1");
    //System.out.println("Produit supprimé avec succès.");

    // Test de la méthode filtrerProduitsParPrix()
    List<Produit> produitsFiltres = produitService.filtrerProduitsParPrix(5.0, 15.0);
    System.out.println("Produits filtrés par prix:");
    for (Produit produit : produitsFiltres) {
      System.out.println(produit);
    }

    // Test de la méthode rechercherProduits()
    List<Produit> produitsTrouves = produitService.rechercherProduits("Nouveau", null, 5.0, 0.0);
    System.out.println("Produits trouvés par recherche multicritère:");
    for (Produit produit : produitsTrouves) {
      System.out.println(produit);
    }
  }
  }

*/



import Services.ProduitService;
import models.Categorie;
import models.Produit;

import java.util.ArrayList;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    // Création d'une instance de ProduitService
    ProduitService produitService = ProduitService.getInstance();

    // Test de la méthode create()
    Produit newProduit = new Produit("1", "Nouveau Produit", 10.99, 100, 9.99, 19.99, 5.99, "Détails du produit", "001");
    produitService.create(newProduit);
    System.out.println("Nouveau produit créé: " + newProduit);

    // Test de la méthode retrieveById()
    Produit retrievedProduit = produitService.retrieveById("1");
    System.out.println("Produit récupéré par ID: " + retrievedProduit);

    // Test de la méthode retrieveAll()
    List<Produit> allProduits = produitService.retrieveAll();
    System.out.println("Tous les produits:");
    for (Produit produit : allProduits) {
      System.out.println(produit);
    }

    // Test de la méthode filtrerProduitsParPrix()
    List<Produit> produitsFiltres = produitService.filtrerProduitsParPrix(5.0, 15.0);
    System.out.println("Produits filtrés par prix:");
    for (Produit produit : produitsFiltres) {
      System.out.println(produit);
    }

    // Test de la méthode rechercherProduits()
    List<Produit> produitsTrouves = produitService.rechercherProduits("Nouveau", null, 5.0, 0.0);
    System.out.println("Produits trouvés par recherche multicritère:");
    for (Produit produit : produitsTrouves) {
      System.out.println(produit);
    }

    // Test de la méthode pour récupérer les catégories avec les produits ayant le stock restant le plus élevé
    List<Categorie> categoriesWithHighestStock = produitService.categoriesAvecStockLePlusEleve();
    System.out.println("Catégories avec les produits ayant le stock restant le plus élevé :");
    for (Categorie categorie : categoriesWithHighestStock) {
      System.out.println(categorie);
    }
    List<Produit> produits = new ArrayList<>();
    // Test de la méthode pour calculer si la location est plus rentable que la vente des stocks restants
    boolean locationMoreProfitable = produitService.estLocationPlusRentable(produits);
    if (locationMoreProfitable) {
      System.out.println("La location est plus rentable que la vente des stocks restants.");
    } else {
      System.out.println("La vente des stocks restants est plus rentable que la location.");
    }
  }
}

