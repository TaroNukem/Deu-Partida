package com.aluguel.aluguelcarros.dto;

import java.time.LocalDate;

public record ContratoAluguelResponse(
        Long id,
        Long pedidoId,
        Long contratoCreditoId,
        LocalDate dataAssinatura
) {}