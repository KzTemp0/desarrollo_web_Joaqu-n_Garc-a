package com.tarea4.tarea4.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double obtenerPromedioPorAviso(@Param("avisoId") Long avisoId);
}
