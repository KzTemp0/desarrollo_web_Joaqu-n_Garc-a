package com.tarea4.tarea4.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tarea4.tarea4.models.AvisoAdopcion;
import com.tarea4.tarea4.models.AvisoAdopcionRepository;
import com.tarea4.tarea4.models.NotaRepository;

@Service
public class AvisoService {

    private final AvisoAdopcionRepository avisoRepository;
    private final NotaRepository notaRepository;

    public AvisoService(AvisoAdopcionRepository avisoRepository, NotaRepository notaRepository) {
        this.avisoRepository = avisoRepository;
        this.notaRepository = notaRepository;
    }

    @Transactional(readOnly = true)
    public List<AvisoAdopcion> obtenerAvisosConPromedio() {
        List<AvisoAdopcion> avisos = avisoRepository.findAllByOrderByFechaPublicacionDesc();
        for (AvisoAdopcion aviso : avisos) {
            Double promedio = notaRepository.obtenerPromedioPorAviso(aviso.getId());
            aviso.setPromedioNota(promedio);
        }
        return avisos;
    }

    @Transactional(readOnly = true)
    public Double obtenerPromedio(Long avisoId) {
        return notaRepository.obtenerPromedioPorAviso(avisoId);
    }
}
