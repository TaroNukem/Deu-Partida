package com.aluguel.aluguelcarros.controller;

import com.aluguel.aluguelcarros.dto.ClienteRequest;
import com.aluguel.aluguelcarros.dto.ClienteResponse;
import com.aluguel.aluguelcarros.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {
    private final ClienteService service;

    @GetMapping("/me")
    public ClienteResponse meuCadastro(){
        return service.buscarMeu();
    }

    @PutMapping("/me")
    public ClienteResponse atualizar(@Valid @RequestBody ClienteRequest req) {
        return service.atualizar(req);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> excluir(){
        service.excluir();
        return ResponseEntity.noContent().build();
    }
}
