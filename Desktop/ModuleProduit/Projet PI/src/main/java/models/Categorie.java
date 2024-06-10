  package models;

public class Categorie {
  private String ref_Categorie;
  private String nom;

  // Constructeur
  public Categorie(String ref_Categorie, String nom) {
    this.ref_Categorie = ref_Categorie;
    this.nom = nom;
  }

  // Getters
  public String getRef_Categorie() {
    return ref_Categorie;
  }

  public String getNom() {
    return nom;
  }

  // Setters
  public void setRef_Categorie(String ref_Categorie) {
    this.ref_Categorie = ref_Categorie;
  }

  public void setNom(String nom) {
    this.nom = nom;
  }
}
