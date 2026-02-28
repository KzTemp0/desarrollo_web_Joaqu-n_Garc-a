package com.tarea4.tarea4.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tarea4.tarea4.models.AvisoAdopcion;
import com.tarea4.tarea4.models.AvisoAdopcionRepository;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.NotaRepository;

@Service
public class NotaService {

    private final NotaRepository notaRepository;
    private final AvisoAdopcionRepository avisoRepository;

    public NotaService(NotaRepository notaRepository, AvisoAdopcionRepository avisoRepository) {
        this.notaRepository = notaRepository;
        this.avisoRepository = avisoRepository;
    }

    @Transactional
    public double agregarNota(Long avisoId, int valor) {
        if (valor < 1 || valor > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7.");
        }

        AvisoAdopcion aviso = avisoRepository.findById(avisoId)
                .orElseThrow(() -> new IllegalArgumentException("Aviso no encontrado"));

        Nota nota = new Nota();
        nota.setValor(valor);
        nota.setAviso(aviso);
        nota.setFecha(LocalDateTime.now());

        notaRepository.save(nota);

        Double promedio = notaRepository.obtenerPromedioPorAviso(avisoId);
        return promedio != null ? promedio : Double.NaN;
    }
}

