package com.aluguel.aluguelcarros.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PedidoRequest(@NotNull @Valid AutomovelDTO automovel,
                            @NotNull LocalDate dataInicio, @NotNull LocalDate dataFim,
                            Long bancoId /* opcional: crédito */) {
}
