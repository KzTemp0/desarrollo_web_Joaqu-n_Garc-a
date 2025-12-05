package com.tarea4.tarea4.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.tarea4.tarea4.models.Foto;
import com.tarea4.tarea4.models.FotoRepository;
import com.tarea4.tarea4.models.LogEntry;
import com.tarea4.tarea4.models.LogEntryRepository;

@Controller
public class AdminFotoController {

    private final FotoRepository fotoRepository;
    private final LogEntryRepository logRepository;

    public AdminFotoController(FotoRepository fotoRepository, LogEntryRepository logRepository) {
        this.fotoRepository = fotoRepository;
        this.logRepository = logRepository;
    }

    @GetMapping("/t5-admin-fotos")
    public String listarFotos(Model model) {
        List<Foto> fotos = fotoRepository.findActivasConAviso();
        model.addAttribute("fotos", fotos);
        return "t5-admin-fotos";
    }

    @PostMapping("/t5-admin-fotos/{id}/eliminar")
    public String eliminarFoto(
            @PathVariable("id") Long fotoId,
            @RequestParam("motivo") String motivo,
            RedirectAttributes redirectAttributes) {

        if (motivo == null || motivo.trim().length() < 5 || motivo.trim().length() > 200) {
            redirectAttributes.addFlashAttribute("error",
                    "El motivo es obligatorio y debe tener entre 5 y 200 caracteres.");
            return "redirect:/t5-admin-fotos";
        }

        Foto foto = fotoRepository.findById(fotoId)
                .orElseThrow(() -> new IllegalArgumentException("Foto no encontrada: " + fotoId));

        foto.setEliminada(true);
        fotoRepository.save(foto);

        LogEntry log = new LogEntry();
        log.setFecha(LocalDateTime.now());
        log.setMensaje("eliminado foto " + fotoId + " por usuario admin, motivo: " + motivo.trim());
        logRepository.save(log);

        redirectAttributes.addFlashAttribute("success", "Foto marcada como eliminada.");
        return "redirect:/t5-admin-fotos";
    }
}
