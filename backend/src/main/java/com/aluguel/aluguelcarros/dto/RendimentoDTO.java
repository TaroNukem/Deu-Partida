package com.aluguel.aluguelcarros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record RendimentoDTO(Long id, @NotBlank String entidadeEmpregadora, @NotNull @Positive BigDecimal valor) {
}
