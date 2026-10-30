package com.aluguel.aluguelcarros.dto;

import java.util.List;

public record ClienteResponse(Long id, String login, String nome, String rg, String cpf, String endereco, String profissao, List<RendimentoDTO> rendimentos) {
}
