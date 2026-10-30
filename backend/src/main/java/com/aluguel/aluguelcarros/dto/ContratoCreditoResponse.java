package com.aluguel.aluguelcarros.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratoCreditoResponse(
        Long id,
        Long pedidoId,
        String bancoNome,
        BigDecimal valor,
        BigDecimal taxaJuros,
        LocalDate data
) {}