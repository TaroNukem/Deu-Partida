package com.aluguel.aluguelcarros.dto;

import com.aluguel.aluguelcarros.model.StatusPedido;

import java.time.LocalDate;

public record PedidoResponse(Long id, AutomovelDTO automovel, LocalDate dataInicio,
                             LocalDate dataFim, LocalDate dataPedido, StatusPedido status,
                             String clienteNome) {}