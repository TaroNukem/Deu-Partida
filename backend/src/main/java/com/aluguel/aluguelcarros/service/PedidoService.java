package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.AutomovelDTO;
import com.aluguel.aluguelcarros.dto.PedidoRequest;
import com.aluguel.aluguelcarros.dto.PedidoResponse;
import com.aluguel.aluguelcarros.exception.RegraNegocioException;
import com.aluguel.aluguelcarros.model.Automovel;
import com.aluguel.aluguelcarros.model.Cliente;
import com.aluguel.aluguelcarros.model.PedidoAluguel;
import com.aluguel.aluguelcarros.model.StatusPedido;
import com.aluguel.aluguelcarros.repository.AutomovelRepository;
import com.aluguel.aluguelcarros.repository.ClienteRepository;
import com.aluguel.aluguelcarros.repository.PedidoAluguelRepository;
import com.aluguel.aluguelcarros.security.UsuarioLogado;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioLogado usuarioLogado;

    // 6.2 - criar
    @Transactional
    public PedidoResponse criar(PedidoRequest req) {
        Cliente cliente = clienteLogado();
        validarDatas(req.dataInicio(), req.dataFim());

        Automovel automovel = obterOuCriarAutomovel(req.automovel(), cliente);

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());
        pedido.setStatus(StatusPedido.EM_ANALISE);

        return paraResponse(pedidoRepository.save(pedido));
    }

    private Cliente clienteLogado() {
        Long id = usuarioLogado.get().getId();
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Cliente não encontrado"));
    }

    private void validarDatas(LocalDate inicio, LocalDate fim) {
        if (!fim.isAfter(inicio)) {
            throw new RegraNegocioException("A data final deve ser depois da data inicial");
        }
    }

    private Automovel obterOuCriarAutomovel(AutomovelDTO dto, Cliente cliente) {
        return automovelRepository.findByPlaca(dto.placa()).orElseGet(() -> {
            Automovel a = new Automovel();
            a.setMatricula(dto.matricula());
            a.setAno(dto.ano());
            a.setMarca(dto.marca());
            a.setModelo(dto.modelo());
            a.setPlaca(dto.placa());
            a.setProprietario(cliente);
            return automovelRepository.save(a);
        });
    }

    private PedidoResponse paraResponse(PedidoAluguel p) {
        Automovel a = p.getAutomovel();
        AutomovelDTO autoDto = new AutomovelDTO(a.getId(), a.getMatricula(), a.getAno(),
                a.getMarca(), a.getModelo(), a.getPlaca());

        return new PedidoResponse(p.getId(), autoDto, p.getDataInicio(), p.getDataFim(),
                p.getDataPedido(), p.getStatus(), p.getCliente().getNome());
    }
}