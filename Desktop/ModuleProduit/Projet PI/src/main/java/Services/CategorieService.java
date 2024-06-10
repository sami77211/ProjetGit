package Services;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import Interfaces.CrudService;
import Utils.MyConfig;
import models.Categorie;

public class CategorieService implements CrudService<Categorie> {
  private Connection connection;
  private static CategorieService instance;

  private CategorieService() {
    // Private constructor to prevent instantiation outside this class.
  }

  public static CategorieService getInstance() {
    if (instance == null) {
      instance = new CategorieService();
    }
    return instance;
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
  public Categorie create(Categorie entity) {
    try {
      connect();
      String query = "INSERT INTO categories(Nom) VALUES (?)";
      PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
      statement.setString(1, entity.getNom());
      statement.executeUpdate();
      ResultSet rs = statement.getGeneratedKeys();
      if (rs.next()) {
        entity.setRef_Categorie(rs.getString(1));
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
    return entity;
  }

  @Override
  public Categorie retrieveById(String id) {
    Categorie categorie = null;
    try {
      connect();
      String query = "SELECT * FROM categories WHERE Ref_Categorie = ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setInt(1, Integer.parseInt(id));
      ResultSet resultSet = statement.executeQuery();
      if (resultSet.next()) {
        categorie = new Categorie(
          resultSet.getString("Ref_Categorie"),
          resultSet.getString("Nom")
        );
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
    return categorie;
  }

  @Override
  public List<Categorie> retrieveAll() {
    List<Categorie> categories = new ArrayList<>();
    try {
      connect();
      String query = "SELECT * FROM categories";
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

  @Override
  public Categorie update(Categorie entity) {
    try {
      connect();
      String query = "UPDATE categories SET Nom = ? WHERE Ref_Categorie = ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setString(1, entity.getNom());
      statement.setString(2, entity.getRef_Categorie());
      statement.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    } finally {
      try {
        disconnect();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
    return entity;
  }

  @Override
  public void deleteById(String id) {
    try {
      connect();
      String query = "DELETE FROM categories WHERE Ref_Categorie = ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setInt(1, Integer.parseInt(id));
      statement.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    } finally {
      try {
        disconnect();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
  }
}
