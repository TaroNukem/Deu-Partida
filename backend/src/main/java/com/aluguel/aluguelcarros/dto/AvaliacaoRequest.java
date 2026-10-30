package com.aluguel.aluguelcarros.dto;

public record AvaliacaoRequest(
        boolean parecerPositivo,
        String observacao
) {
}