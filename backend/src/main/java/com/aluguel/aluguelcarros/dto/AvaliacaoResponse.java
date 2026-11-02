package com.aluguel.aluguelcarros.dto;

import java.time.LocalDate;

public record AvaliacaoResponse(
        String observacao,
        boolean parecerPositivo,
        LocalDate data,
        String agenteNome
) {
}