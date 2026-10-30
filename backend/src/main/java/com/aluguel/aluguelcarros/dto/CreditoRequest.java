package com.aluguel.aluguelcarros.dto;

import java.math.BigDecimal;

public record CreditoRequest(
        BigDecimal valor,
        BigDecimal taxaJuros
) {}