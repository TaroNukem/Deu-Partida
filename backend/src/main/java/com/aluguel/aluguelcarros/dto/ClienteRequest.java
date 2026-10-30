package com.aluguel.aluguelcarros.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClienteRequest(@NotBlank String nome, @NotBlank String rg, @NotBlank String cpf, String endereco, String profissao, @Size(max = 3, message = "Máximo de 3 rendimentos")
                             List<@Valid RendimentoDTO> rendimentos) {
}
