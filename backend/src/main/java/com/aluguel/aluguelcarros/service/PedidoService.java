
package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.AutomovelDTO;
import com.aluguel.aluguelcarros.dto.PedidoRequest;
import com.aluguel.aluguelcarros.dto.PedidoResponse;
import com.aluguel.aluguelcarros.exception.RegraNegocioException;
import com.aluguel.aluguelcarros.model.Agente;
import com.aluguel.aluguelcarros.model.Automovel;
import com.aluguel.aluguelcarros.model.Cliente;
import com.aluguel.aluguelcarros.model.PedidoAluguel;
import com.aluguel.aluguelcarros.model.StatusPedido;
import com.aluguel.aluguelcarros.model.TipoAgente;
import com.aluguel.aluguelcarros.repository.AgenteRepository;
import com.aluguel.aluguelcarros.repository.AutomovelRepository;
import com.aluguel.aluguelcarros.repository.ClienteRepository;
import com.aluguel.aluguelcarros.repository.PedidoAluguelRepository;
import com.aluguel.aluguelcarros.security.UsuarioLogado;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final UsuarioLogado usuarioLogado;

    // 6.2 e 6.3 - criar pedido
    @Transactional
    public PedidoResponse criar(PedidoRequest req) {
        Cliente cliente = clienteLogado();

        validarDatas(req.dataInicio(), req.dataFim());

        Automovel automovel = obterOuCriarAutomovel(
                req.automovel(), cliente);

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());
        pedido.setStatus(StatusPedido.EM_ANALISE);

        // 6.3 - associar banco de crédito, se informado
        if (req.bancoId() != null) {
            Agente banco = buscarBanco(req.bancoId());
            pedido.setBancoCredito(banco);
        }

        return paraResponse(pedidoRepository.save(pedido));
    }

    // 6.4 - listar pedidos do cliente logado
    public List<PedidoResponse> listarMeus(StatusPedido status) {
        Cliente cliente = clienteLogado();

        List<PedidoAluguel> pedidos;

        if (status == null) {
            pedidos = pedidoRepository.findByClienteId(cliente.getId());
        } else {
            pedidos = pedidoRepository.findByClienteIdAndStatus(
                    cliente.getId(), status);
        }

        return pedidos.stream()
                .map(this::paraResponse)
                .toList();
    }

    // 6.4 - buscar pedido específico do cliente logado
    public PedidoResponse buscarMeu(Long id) {
        Cliente cliente = clienteLogado();

        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Pedido não encontrado"));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new AccessDeniedException(
                    "Você não tem permissão para acessar este pedido");
        }

        return paraResponse(pedido);
    }

    // 6.5 - modificar pedido somente em análise
    @Transactional
    public PedidoResponse modificar(Long id, PedidoRequest req) {
        Cliente cliente = clienteLogado();

        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Pedido não encontrado"));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new AccessDeniedException(
                    "Você não tem permissão para modificar este pedido");
        }

        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new RegraNegocioException(
                    "Só é possível modificar pedidos em análise");
        }

        validarDatas(req.dataInicio(), req.dataFim());

        Automovel automovel = obterOuCriarAutomovel(
                req.automovel(), cliente);

        pedido.setAutomovel(automovel);
        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());

        if (req.bancoId() != null) {
            Agente banco = buscarBanco(req.bancoId());
            pedido.setBancoCredito(banco);
        } else {
            pedido.setBancoCredito(null);
        }

        return paraResponse(pedidoRepository.save(pedido));
    }

    // 6.6 - cancelar pedido até a execução do contrato
    @Transactional
    public PedidoResponse cancelar(Long id) {
        Cliente cliente = clienteLogado();

        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Pedido não encontrado"));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new AccessDeniedException(
                    "Você não tem permissão para cancelar este pedido");
        }

        if (pedido.getStatus() == StatusPedido.CONTRATATO
                || pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RegraNegocioException(
                    "Não é possível cancelar um pedido contratado ou já cancelado");
        }

        pedido.setStatus(StatusPedido.CANCELADO);

        return paraResponse(pedidoRepository.save(pedido));
    }

    // Identifica o cliente autenticado
    private Cliente clienteLogado() {
        Long id = usuarioLogado.get().getId();

        return clienteRepository.findById(id)
                .orElseThrow(() ->
                        new RegraNegocioException("Cliente não encontrado"));
    }

    // Valida as datas do pedido
    private void validarDatas(LocalDate inicio, LocalDate fim) {
        if (!fim.isAfter(inicio)) {
            throw new RegraNegocioException(
                    "A data final deve ser depois da data inicial");
        }
    }

    // Busca e valida o banco de crédito
    private Agente buscarBanco(Long bancoId) {
        Agente banco = agenteRepository.findById(bancoId)
                .orElseThrow(() ->
                        new RegraNegocioException("Banco não encontrado"));

        if (banco.getTipo() != TipoAgente.BANCO) {
            throw new RegraNegocioException(
                    "O agente informado não é um banco");
        }

        return banco;
    }

    // Busca um automóvel pela placa ou cria um novo
    private Automovel obterOuCriarAutomovel(
            AutomovelDTO dto, Cliente cliente) {

        return automovelRepository.findByPlaca(dto.placa())
                .orElseGet(() -> {
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

    // Converte a entidade para DTO de resposta
    private PedidoResponse paraResponse(PedidoAluguel p) {
        Automovel a = p.getAutomovel();

        AutomovelDTO autoDto = new AutomovelDTO(
                a.getId(),
                a.getMatricula(),
                a.getAno(),
                a.getMarca(),
                a.getModelo(),
                a.getPlaca()
        );

        return new PedidoResponse(
                p.getId(),
                autoDto,
                p.getDataInicio(),
                p.getDataFim(),
                p.getDataPedido(),
                p.getStatus(),
                p.getCliente().getNome()
        );
    }
}
