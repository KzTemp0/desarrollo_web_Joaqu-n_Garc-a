package com.tarea4.tarea4.controllers;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.tarea4.tarea4.models.LogEntry;
import com.tarea4.tarea4.models.LogEntryRepository;

@Controller
public class LogController {

    private final LogEntryRepository logRepository;

    public LogController(LogEntryRepository logRepository) {
        this.logRepository = logRepository;
    }

    @GetMapping("/mensajes-log")
    public String listarMensajes(Model model) {
        List<LogEntry> mensajes = logRepository.findAllByOrderByFechaDesc();
        model.addAttribute("mensajes", mensajes);
        return "mensajes-log";
    }
}
