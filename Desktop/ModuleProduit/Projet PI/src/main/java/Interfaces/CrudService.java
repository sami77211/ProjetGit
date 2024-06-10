package Interfaces;



import java.util.List;

  public interface CrudService<T> {
    T create(T entity);
    T retrieveById(String id);
    List<T> retrieveAll();
    T update(T entity);
    void deleteById(String id);
  }



