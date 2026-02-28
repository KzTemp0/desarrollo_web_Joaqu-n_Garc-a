package com.tarea4.tarea4.controllers;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.tarea4.tarea4.models.AvisoAdopcion;
import com.tarea4.tarea4.services.AvisoService;

@Controller
public class AppController {

    private final AvisoService avisoService;

    public AppController(AvisoService avisoService) {
        this.avisoService = avisoService;
    }

    @GetMapping("/")
    public String listarAvisos(Model model) {
        List<AvisoAdopcion> avisos = avisoService.obtenerAvisosConPromedio();
        model.addAttribute("avisos", avisos);
        return "avisos";
    }
}
