package com.aluguel.aluguelcarros.dto;

import com.aluguel.aluguelcarros.model.StatusPedido;

import java.time.LocalDate;

public record PedidoResponse(
        Long id,
        AutomovelDTO automovel,
        LocalDate dataInicio,
        LocalDate dataFim,
        LocalDate dataPedido,
        StatusPedido status,
        String clienteNome,
        AvaliacaoResponse avaliacao,
        ClienteResumoDTO cliente
) {

    // Mantém a assinatura antiga, para quem não precisa dos dados do cliente
    public PedidoResponse(
            Long id,
            AutomovelDTO automovel,
            LocalDate dataInicio,
            LocalDate dataFim,
            LocalDate dataPedido,
            StatusPedido status,
            String clienteNome,
            AvaliacaoResponse avaliacao
    ) {
        this(id, automovel, dataInicio, dataFim, dataPedido, status,
                clienteNome, avaliacao, null);
    }
}