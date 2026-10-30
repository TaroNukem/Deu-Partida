package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.AuthResponse;
import com.aluguel.aluguelcarros.dto.LoginRequest;
import com.aluguel.aluguelcarros.dto.RegisterRequest;
import com.aluguel.aluguelcarros.exception.RegraNegocioException;
import com.aluguel.aluguelcarros.model.Agente;
import com.aluguel.aluguelcarros.model.Cliente;
import com.aluguel.aluguelcarros.model.Perfil;
import com.aluguel.aluguelcarros.model.Usuario;
import com.aluguel.aluguelcarros.repository.AgenteRepository;
import com.aluguel.aluguelcarros.repository.ClienteRepository;
import com.aluguel.aluguelcarros.repository.UsuarioRepository;
import com.aluguel.aluguelcarros.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (usuarioRepository.existsByLogin(req.login())) {
            throw new RegraNegocioException("Login já existe");
        }

        Usuario salvo;

        if (req.perfil() == Perfil.CLIENTE) {
            if (vazio(req.cpf()) || vazio(req.rg())) {
                throw new RegraNegocioException("CPF e RG são obrigatórios para cliente");
            }
            if (clienteRepository.existsByCpf(req.cpf())) {
                throw new RegraNegocioException("CPF já cadastrado");
            }
            Cliente cliente = new Cliente();
            cliente.setNome(req.nome());
            cliente.setCpf(req.cpf());
            cliente.setRg(req.rg());
            cliente.setEndereco(req.endereco());
            cliente.setProfissao(req.profissao());
            preencherUsuario(cliente, req);
            salvo = clienteRepository.save(cliente);
        } else {
            if (req.tipoAgente() == null) {
                throw new RegraNegocioException("Tipo do agente é obrigatório (EMPRESA ou BANCO)");
            }
            Agente agente = new Agente();
            agente.setNome(req.nome());
            agente.setTipo(req.tipoAgente());
            preencherUsuario(agente, req);
            salvo = agenteRepository.save(agente);
        }

        String token = jwtService.gerarToken(salvo);
        return new AuthResponse(token, salvo.getId(), salvo.getLogin(), req.nome(), salvo.getPerfil());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Usuario u = usuarioRepository.findByLogin(req.login())
                .orElseThrow(() -> new BadCredentialsException("Login ou senha inválidos"));

        if (!passwordEncoder.matches(req.senha(), u.getSenha())) {
            throw new BadCredentialsException("Login ou senha inválidos");
        }

        String token = jwtService.gerarToken(u);
        return new AuthResponse(token, u.getId(), u.getLogin(), nomeDe(u), u.getPerfil());
    }

    private void preencherUsuario(Usuario u, RegisterRequest req) {
        u.setLogin(req.login());
        u.setSenha(passwordEncoder.encode(req.senha()));
        u.setPerfil(req.perfil());
    }

    private String nomeDe(Usuario u) {
        if (u instanceof Cliente c) return c.getNome();
        if (u instanceof Agente a) return a.getNome();
        return u.getLogin();
    }

    private boolean vazio(String s) {
        return s == null || s.isBlank();
    }
}