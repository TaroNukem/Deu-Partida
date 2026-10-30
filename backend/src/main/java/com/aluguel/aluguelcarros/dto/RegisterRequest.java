package com.aluguel.aluguelcarros.dto;

import com.aluguel.aluguelcarros.model.Perfil;
import com.aluguel.aluguelcarros.model.TipoAgente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String login,
        @NotBlank @Size(min = 6) String senha,
        @NotNull Perfil perfil,
        @NotBlank String nome,
        // campos de CLIENTE (obrigatórios só se perfil = CLIENTE)
        String cpf,
        String rg,
        String endereco,
        String profissao,
        // campo de AGENTE (obrigatório só se perfil = AGENTE)
        TipoAgente tipoAgente
) {}