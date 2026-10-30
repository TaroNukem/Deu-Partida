package com.aluguel.aluguelcarros.dto;

import com.aluguel.aluguelcarros.model.Perfil;

public record AuthResponse(
        String token,
        Long id,
        String login,
        String nome,
        Perfil perfil
) {}