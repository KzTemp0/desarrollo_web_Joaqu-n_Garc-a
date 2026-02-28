package com.tarea4.tarea4.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tarea4.tarea4.services.NotaService;

@RestController
@RequestMapping("/api/avisos")
public class NotaApiController {

    private final NotaService notaService;

    public NotaApiController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping("/{id}/notas")
    public ResponseEntity<NotaResponse> agregarNota(
            @PathVariable("id") Long avisoId,
            @RequestBody CrearNotaRequest request) {

        try {
            double promedio = notaService.agregarNota(avisoId, request.getValor());
            NotaResponse response = new NotaResponse();
            response.setPromedio(promedio);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    public static class CrearNotaRequest {
        private int valor;

        public int getValor() {
            return valor;
        }

        public void setValor(int valor) {
            this.valor = valor;
        }
    }

    public static class NotaResponse {
        private double promedio;

        public double getPromedio() {
            return promedio;
        }

        public void setPromedio(double promedio) {
            this.promedio = promedio;
        }
    }
}
