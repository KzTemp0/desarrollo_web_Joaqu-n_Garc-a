package com.tarea4.tarea4.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Long> {

    List<AvisoAdopcion> findAllByOrderByFechaPublicacionDesc();
}
