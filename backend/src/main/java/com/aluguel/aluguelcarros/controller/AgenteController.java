
package com.aluguel.aluguelcarros.controller;

import com.aluguel.aluguelcarros.dto.*;
import com.aluguel.aluguelcarros.model.ContratoAluguel;
import com.aluguel.aluguelcarros.service.AgenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agente")
@RequiredArgsConstructor
public class AgenteController {

    private final AgenteService agenteService;

    // GET /agente/pedidos
    @GetMapping("/pedidos")
    public List<PedidoResponse> listarPedidos() {
        return agenteService.listarPedidos();
    }

    // PUT /agente/pedidos/{id}
    @PutMapping("/pedidos/{id}")
    public PedidoResponse modificarPedido(
            @PathVariable Long id,
            @RequestBody PedidoRequest req) {

        return agenteService.modificarPedido(id, req);
    }

    // POST /agente/pedidos/{id}/avaliacao
    @PostMapping("/pedidos/{id}/avaliacao")
    public void avaliar(
            @PathVariable Long id,
            @RequestBody AvaliacaoRequest req) {

        agenteService.avaliar(id, req);
    }

    // POST /agente/pedidos/{id}/credito
    @PostMapping("/pedidos/{id}/credito")
    public ContratoCreditoResponse concederCredito(
            @PathVariable Long id,
            @RequestBody CreditoRequest req) {

        return agenteService.concederCredito(id, req);
    }

    // POST /agente/pedidos/{id}/contrato
    @PostMapping("/pedidos/{id}/contrato")
    public ContratoAluguelResponse executarContrato(
            @PathVariable Long id) {

        return agenteService.executarContrato(id);
    }
}
