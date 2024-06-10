package models;

public class Produit {
  private String ref_Prod;
  private String nom;
  private double prix;
  private int stockRestant;
  private double prix_Achat;
  private double prix_Vente;
  private double prix_Location;
  private String details;
  private String ref_Categorie;

  // Constructeur
  public Produit(String ref_Prod, String nom, double prix, int stockRestant, double prix_Achat, double prix_Vente, double prix_Location, String details, String ref_Categorie) {
    this.ref_Prod = ref_Prod;
    this.nom = nom;
    this.prix = prix;
    this.stockRestant = stockRestant;
    this.prix_Achat = prix_Achat;
    this.prix_Vente = prix_Vente;
    this.prix_Location = prix_Location;
    this.details = details;
    this.ref_Categorie = ref_Categorie;
  }

  // Getters
  public String getRef_Prod() {
    return ref_Prod;
  }

  public String getNom() {
    return nom;
  }

  public double getPrix() {
    return prix;
  }

  public int getStockRestant() {
    return stockRestant;
  }

  public double getPrix_Achat() {
    return prix_Achat;
  }

  public double getPrix_Vente() {
    return prix_Vente;
  }

  public double getPrix_Location() {
    return prix_Location;
  }

  public String getDetails() {
    return details;
  }

  @Override
  public String toString() {
    return "Produit{" +
      "ref_Prod='" + ref_Prod + '\'' +
      ", nom='" + nom + '\'' +
      ", prix=" + prix +
      ", stockRestant=" + stockRestant +
      ", prix_Achat=" + prix_Achat +
      ", prix_Vente=" + prix_Vente +
      ", prix_Location=" + prix_Location +
      ", details='" + details + '\'' +
      ", ref_Categorie='" + ref_Categorie + '\'' +
      '}';
  }

  public String getRef_Categorie() {
    return ref_Categorie;
  }

  // Setters
  public void setRef_Prod(String ref_Prod) {
    this.ref_Prod = ref_Prod;
  }

  public void setNom(String nom) {
    this.nom = nom;
  }

  public void setPrix(double prix) {
    this.prix = prix;
  }

  public void setStockRestant(int stockRestant) {
    this.stockRestant = stockRestant;
  }

  public void setPrix_Achat(double prix_Achat) {
    this.prix_Achat = prix_Achat;
  }

  public void setPrix_Vente(double prix_Vente) {
    this.prix_Vente = prix_Vente;
  }

  public void setPrix_Location(double prix_Location) {
    this.prix_Location = prix_Location;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public void setRef_Categorie(String ref_Categorie) {
    this.ref_Categorie = ref_Categorie;
  }
}
