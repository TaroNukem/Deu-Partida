package com.aluguel.aluguelcarros.controller;

import com.aluguel.aluguelcarros.dto.PedidoRequest;
import com.aluguel.aluguelcarros.dto.PedidoResponse;
import com.aluguel.aluguelcarros.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(
            @Valid @RequestBody PedidoRequest req) {

        PedidoResponse resposta = pedidoService.criar(req);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }
}