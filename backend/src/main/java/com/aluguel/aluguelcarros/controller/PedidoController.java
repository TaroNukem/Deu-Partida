package com.aluguel.aluguelcarros.controller;

import com.aluguel.aluguelcarros.dto.PedidoRequest;
import com.aluguel.aluguelcarros.dto.PedidoResponse;
import com.aluguel.aluguelcarros.model.StatusPedido;
import com.aluguel.aluguelcarros.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    // Criar pedido
    @PostMapping
    public ResponseEntity<PedidoResponse> criar(
            @Valid @RequestBody PedidoRequest req) {

        PedidoResponse resposta = pedidoService.criar(req);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    // Listar pedidos do cliente logado
    @GetMapping
    public List<PedidoResponse> listar(
            @RequestParam(required = false) StatusPedido status) {

        return pedidoService.listarMeus(status);
    }

    // Buscar pedido específico do cliente logado
    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id) {
        return pedidoService.buscarMeu(id);
    }
}