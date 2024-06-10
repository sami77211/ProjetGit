package Services;

import Interfaces.CrudService;
import Utils.MyConfig;
import models.Categorie;
import models.Produit;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProduitService implements CrudService<Produit> {
  private Connection connection;

  private ProduitService() {
    // Private constructor to prevent instantiation outside this class.
  }

  private static class SingletonHelper {
    private static final ProduitService INSTANCE = new ProduitService();
  }

  public static ProduitService getInstance() {
    return SingletonHelper.INSTANCE;
  }

  private void connect() throws SQLException {
    connection = MyConfig.getConnection();
  }

  private void disconnect() throws SQLException {
    if (connection != null && !connection.isClosed()) {
      connection.close();
    }
  }

  @Override
  public Produit create(Produit entity) {
    try {
      connect();
      String query = "INSERT INTO produit(Nom, Prix, StockeRestant, Prix_Achat, Prix_Vente, Prix_Location, Details, Ref_Categorie) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, entity.getNom());
      statement.setDouble(2, entity.getPrix());
      statement.setInt(3, entity.getStockRestant());
      statement.setDouble(4, entity.getPrix_Achat());
      statement.setDouble(5, entity.getPrix_Vente());
      statement.setDouble(6, entity.getPrix_Location());
      statement.setString(7, entity.getDetails());
      statement.setString(8, entity.getRef_Categorie());
      statement.executeUpdate();
      ResultSet rs = statement.getGeneratedKeys();
      if (rs.next()) {
        entity.setRef_Prod(rs.getString(1));
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return entity;
  }

  @Override
  public Produit retrieveById(String id) {
    Produit produit = null;
    try {
      connect(); // Assurez-vous que cette méthode ouvre la connexion à la base de données

      String query = "SELECT * FROM produit WHERE Ref_Prod=?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setString(1, id);

      ResultSet resultSet = statement.executeQuery();

      if (resultSet.next()) {
        produit = new Produit(
          resultSet.getString("Ref_Prod"),
          resultSet.getString("Nom"),
          resultSet.getDouble("Prix"),
          resultSet.getInt("StockeRestant"),
          resultSet.getDouble("Prix_Achat"),
          resultSet.getDouble("Prix_Vente"),
          resultSet.getDouble("Prix_Location"),
          resultSet.getString("Details"),
          resultSet.getString("Ref_Categorie")
        );
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return produit;
  }


  @Override
  public List<Produit> retrieveAll() {
    List<Produit> produits = new ArrayList<>();
    try {
      connect();
      String query = "SELECT * FROM produit";
      Statement statement = connection.createStatement();
      ResultSet resultSet = statement.executeQuery(query);
      while (resultSet.next()) {
        Produit produit = new Produit(
          resultSet.getString("Ref_Prod"),
          resultSet.getString("Nom"),
          resultSet.getDouble("Prix"),
          resultSet.getInt("StockeRestant"),
          resultSet.getDouble("Prix_Achat"),
          resultSet.getDouble("Prix_Vente"),
          resultSet.getDouble("Prix_Location"),
          resultSet.getString("Details"),
          resultSet.getString("Ref_Categorie")
        );
        produits.add(produit);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return produits;
  }

  @Override
  public Produit update(Produit entity) {
    try {
      connect();
      String query = "UPDATE produit SET Nom = ?, Prix = ?, StockeRestant = ?, Prix_Achat = ?, Prix_Vente = ?, Prix_Location = ?, Details = ?, Ref_Categorie = ? WHERE Ref_Prod = ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setString(1, entity.getNom());
      statement.setDouble(2, entity.getPrix());
      statement.setInt(3, entity.getStockRestant());
      statement.setDouble(4, entity.getPrix_Achat());
      statement.setDouble(5, entity.getPrix_Vente());
      statement.setDouble(6, entity.getPrix_Location());
      statement.setString(7, entity.getDetails());
      statement.setString(8, entity.getRef_Categorie());
      statement.setString(9, entity.getRef_Prod());
      statement.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return entity;
  }

  @Override
  public void deleteById(String id) {
    try {
      connect();
      String query = "DELETE FROM produit WHERE Ref_Prod = ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setString(1, id);
      statement.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public List<Produit> filtrerProduitsParPrix(double prixMin, double prixMax) {
    List<Produit> produitsFiltres = new ArrayList<>();
    try {
      connect();
      String query = "SELECT * FROM produit WHERE Prix BETWEEN ? AND ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setDouble(1, prixMin);
      statement.setDouble(2, prixMax);
      ResultSet resultSet = statement.executeQuery();
      while (resultSet.next()) {
        Produit produit = new Produit(
          resultSet.getString("Ref_Prod"),
          resultSet.getString("Nom"),
          resultSet.getDouble("Prix"),
          resultSet.getInt("StockeRestant"),
          resultSet.getDouble("Prix_Achat"),
          resultSet.getDouble("Prix_Vente"),
          resultSet.getDouble("Prix_Location"),
          resultSet.getString("Details"),
          resultSet.getString("Ref_Categorie")
        );
        produitsFiltres.add(produit);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return produitsFiltres;
  }

  public List<Produit> rechercherProduits(String nom, String refCategorie, double prixMin, double prixMax) {
    List<Produit> produitsTrouves = new ArrayList<>();
    try {
      connect();
      StringBuilder queryBuilder = new StringBuilder("SELECT * FROM produit WHERE 1=1");
      if (nom != null && !nom.isEmpty()) {
        queryBuilder.append(" AND nom LIKE ?");
      }
      if (refCategorie != null && !refCategorie.isEmpty()) {
        queryBuilder.append(" AND Ref_Categorie = ?");
      }
      if (prixMin >= 0) {
        queryBuilder.append(" AND Prix >= ?");
      }
      if (prixMax >= 0) {
        queryBuilder.append(" AND Prix <= ?");
      }
      PreparedStatement statement = connection.prepareStatement(queryBuilder.toString());
      int parameterIndex = 1;
      if (nom != null && !nom.isEmpty()) {
        statement.setString(parameterIndex++, "%" + nom + "%");
      }
      if (refCategorie != null && !refCategorie.isEmpty()) {
        statement.setString(parameterIndex++, refCategorie);
      }
      if (prixMin >= 0) {
        statement.setDouble(parameterIndex++, prixMin);
      }
      if (prixMax >= 0) {
        statement.setDouble(parameterIndex++, prixMax);
      }
      ResultSet resultSet = statement.executeQuery();
      while (resultSet.next()) {
        Produit produit = new Produit(
          resultSet.getString("Ref_Prod"),
          resultSet.getString("Nom"),
          resultSet.getDouble("Prix"),
          resultSet.getInt("StockeRestant"),
          resultSet.getDouble("Prix_Achat"),
          resultSet.getDouble("Prix_Vente"),
          resultSet.getDouble("Prix_Location"),
          resultSet.getString("Details"),
          resultSet.getString("Ref_Categorie")
        );
        produitsTrouves.add(produit);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    } finally {
      try {
        disconnect();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
    return produitsTrouves;
  }

  public List<Produit> trierProduitsParBenefice(List<Produit> produits) {
    // Trie la liste de produits par bénéfice décroissant en utilisant un Comparator
    produits.sort((p1, p2) -> {
      double beneficeP1 = p1.getPrix_Vente() - p1.getPrix_Achat();
      double beneficeP2 = p2.getPrix_Vente() - p2.getPrix_Achat();
      return Double.compare(beneficeP2, beneficeP1);
    });
    return produits;
  }
  public List<Categorie> categoriesAvecStockLePlusEleve() {
    List<Categorie> categories = new ArrayList<>();
    try {
      connect();
      String query = "SELECT c.* FROM categories c " +
        "JOIN produit p ON c.Ref_Categorie = p.Ref_Categorie " +
        "GROUP BY c.Ref_Categorie " +
        "ORDER BY MAX(p.StockRestant) DESC";
      Statement statement = connection.createStatement();
      ResultSet resultSet = statement.executeQuery(query);
      while (resultSet.next()) {
        Categorie categorie = new Categorie(
          resultSet.getString("Ref_Categorie"),
          resultSet.getString("Nom")
        );
        categories.add(categorie);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    } finally {
      try {
        disconnect();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
    return categories;
  }

  public boolean estLocationPlusRentable(List<Produit> produits) {
    double beneficeStocksRestants = 0.0;
    double beneficeLocation = 0.0;

    // Calcul du bénéfice des stocks restants
    for (Produit produit : produits) {
      double beneficeProduit = (produit.getPrix_Vente() - produit.getPrix_Achat()) * produit.getStockRestant();
      beneficeStocksRestants += beneficeProduit;
    }

    // Calcul du bénéfice de la location sur une année
    for (Produit produit : produits) {
      double beneficeLocationProduit = produit.getPrix_Location() * 12;
      beneficeLocation += beneficeLocationProduit;
    }

    // Comparaison des bénéfices
    return beneficeLocation > beneficeStocksRestants;
  }


}
