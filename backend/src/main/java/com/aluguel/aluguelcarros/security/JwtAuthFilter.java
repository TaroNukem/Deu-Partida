
package com.aluguel.aluguelcarros.security;

import com.aluguel.aluguelcarros.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        System.out.println("\n===== DEBUG JWT =====");
        System.out.println("REQUISICAO: " + request.getMethod() + " " + request.getRequestURI());

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            if (jwtService.valido(token)) {

                System.out.println("TOKEN VALIDO");

                String login = jwtService.extrairLogin(token);
                System.out.println("LOGIN EXTRAIDO: " + login);

                usuarioRepository.findByLogin(login).ifPresentOrElse(u -> {

                    System.out.println("USUARIO ENCONTRADO: " + u.getLogin());
                    System.out.println("PERFIL: " + u.getPerfil());

                    var auth = new UsernamePasswordAuthenticationToken(
                            u,
                            null,
                            List.of(new SimpleGrantedAuthority(
                                    "ROLE_" + u.getPerfil().name()
                            ))
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("AUTENTICADO: " +
                            SecurityContextHolder.getContext().getAuthentication().isAuthenticated());

                    System.out.println("AUTHORITIES: " +
                            SecurityContextHolder.getContext().getAuthentication().getAuthorities());

                }, () -> System.out.println("USUARIO NAO ENCONTRADO NO BANCO"));

            } else {
                System.out.println("TOKEN INVALIDO");
            }

        } else {
            System.out.println("HEADER AUTHORIZATION AUSENTE OU INVALIDO");
        }

        chain.doFilter(request, response);
    }
}
