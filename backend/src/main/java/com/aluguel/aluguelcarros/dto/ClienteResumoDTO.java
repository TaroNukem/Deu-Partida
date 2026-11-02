package com.aluguel.aluguelcarros.dto;

import java.util.List;

public record ClienteResumoDTO(
        Long id,
        String nome,
        String cpf,
        String profissao,
        List<RendimentoDTO> rendimentos
) {
}