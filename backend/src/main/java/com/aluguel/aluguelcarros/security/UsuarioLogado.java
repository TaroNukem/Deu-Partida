package com.aluguel.aluguelcarros.security;

import com.aluguel.aluguelcarros.model.Usuario;
import org.springframework.security.core.context.SecurityContextHolder;

public class UsuarioLogado {
    public Usuario get(){
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
