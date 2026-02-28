package com.tarea4.tarea4.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FotoRepository extends JpaRepository<Foto, Long> {

    @Query("SELECT f FROM Foto f " +
           "JOIN FETCH f.aviso a " +
           "JOIN FETCH a.comuna c " +
           "WHERE f.eliminada = false " +
           "ORDER BY a.fechaPublicacion DESC")
    List<Foto> findActivasConAviso();
}

