package Utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class MyConfig {
  private static Connection connection;
  private static final String url = "jdbc:mysql://localhost:3306/athleticpulse";


  public static Connection getConnection() {
    if (connection == null) {
      try {
        connection = DriverManager.getConnection(url);
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
    return connection;
  }

  public static void closeConnection() {
    if (connection != null) {
      try {
        connection.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
  }
}
