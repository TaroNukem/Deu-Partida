package com.aluguel.aluguelcarros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AutomovelDTO(Long id, @NotBlank String matricula, @NotNull Integer ano,
                           @NotBlank String marca, @NotBlank String modelo, @NotBlank String placa) {
}