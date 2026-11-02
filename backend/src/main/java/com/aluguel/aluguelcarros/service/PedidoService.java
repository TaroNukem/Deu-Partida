package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.AutomovelDTO;
import com.aluguel.aluguelcarros.dto.AvaliacaoResponse;
import com.aluguel.aluguelcarros.dto.ContratoCreditoResponse;
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
import com.aluguel.aluguelcarros.repository.AvaliacaoFinanceiraRepository;
import com.aluguel.aluguelcarros.repository.ClienteRepository;
import com.aluguel.aluguelcarros.repository.ContratoCreditoRepository;
import com.aluguel.aluguelcarros.repository.PedidoAluguelRepository;
import com.aluguel.aluguelcarros.security.UsuarioLogado;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoService {

    // RN15: pedidos ativos que reservam o automóvel no período
    private static final List<StatusPedido> STATUS_QUE_RESERVAM =
            List.of(StatusPedido.EM_ANALISE, StatusPedido.APROVADO, StatusPedido.CONTRATADO);

    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final UsuarioLogado usuarioLogado;
    private final AvaliacaoFinanceiraRepository avaliacaoRepository;
    private final ContratoCreditoRepository contratoCreditoRepository;

    // 6.7 - crédito concedido ao pedido (somente do dono)
    public Optional<ContratoCreditoResponse> buscarCreditoMeu(Long id) {
        Cliente cliente = clienteLogado();

        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Pedido não encontrado"));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new AccessDeniedException(
                    "Você não tem permissão para acessar este pedido");
        }

        return contratoCreditoRepository.findByPedidoId(id)
                .map(c -> new ContratoCreditoResponse(
                        c.getId(),
                        pedido.getId(),
                        c.getBanco().getNome(),
                        c.getValor(),
                        c.getTaxaJuros(),
                        c.getData()
                ));
    }

    // 6.2 e 6.3 - criar pedido
    @Transactional
    public PedidoResponse criar(PedidoRequest req) {
        Cliente cliente = clienteLogado();

        validarDatas(req.dataInicio(), req.dataFim());

        // RN05: dados de identificação completos
        validarDadosIdentificacao(cliente);

        Automovel automovel = obterOuCriarAutomovel(req.automovel(), cliente);

        // RN15: o automóvel não pode ter outro pedido ativo no mesmo período
        validarSobreposicao(automovel.getId(), req.dataInicio(), req.dataFim(), null);

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

        Automovel automovel = pedido.getAutomovel();
        AutomovelDTO dto = req.automovel();

        // RN15: ignora o próprio pedido ao checar sobreposição
        validarSobreposicao(automovel.getId(), req.dataInicio(), req.dataFim(), pedido.getId());

        // RN11: placa e matrícula não podem pertencer a outro automóvel
        validarUnicidadeAoAtualizar(automovel, dto);

        automovel.setMatricula(dto.matricula());
        automovel.setAno(dto.ano());
        automovel.setMarca(dto.marca());
        automovel.setModelo(dto.modelo());
        automovel.setPlaca(dto.placa());
        automovelRepository.save(automovel);

        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());

        if (req.bancoId() != null) {
            pedido.setBancoCredito(buscarBanco(req.bancoId()));
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

        if (pedido.getStatus() == StatusPedido.CONTRATADO
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

    // RN05: o cliente precisa ter os dados de identificação preenchidos
    private void validarDadosIdentificacao(Cliente c) {
        if (vazio(c.getNome()) || vazio(c.getRg())
                || vazio(c.getCpf()) || vazio(c.getEndereco())) {
            throw new RegraNegocioException(
                    "Complete seus dados de cliente (nome, RG, CPF e endereço) antes de criar um pedido");
        }
    }

    // RN15: impede dois pedidos ativos do mesmo automóvel com datas que se sobrepõem
    private void validarSobreposicao(Long automovelId, LocalDate inicio, LocalDate fim, Long excluirPedidoId) {
        boolean sobrepoe = pedidoRepository.existeSobreposicao(
                automovelId, STATUS_QUE_RESERVAM, inicio, fim, excluirPedidoId);

        if (sobrepoe) {
            throw new RegraNegocioException(
                    "Este automóvel já está reservado em um período que se sobrepõe às datas informadas");
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

    // RN11: matrícula e placa são únicas. Reutiliza o automóvel só se os dados baterem.
    private Automovel obterOuCriarAutomovel(AutomovelDTO dto, Cliente cliente) {
        Optional<Automovel> porPlaca = automovelRepository.findByPlaca(dto.placa());
        Optional<Automovel> porMatricula = automovelRepository.findByMatricula(dto.matricula());

        if (porPlaca.isPresent() && porMatricula.isPresent()
                && !porPlaca.get().getId().equals(porMatricula.get().getId())) {
            throw new RegraNegocioException(
                    "Matrícula e placa pertencem a automóveis diferentes");
        }

        if (porPlaca.isPresent()) {
            Automovel existente = porPlaca.get();
            if (!existente.getMatricula().equals(dto.matricula())) {
                throw new RegraNegocioException(
                        "Esta placa já está cadastrada com outra matrícula");
            }
            return existente;
        }

        if (porMatricula.isPresent()) {
            throw new RegraNegocioException(
                    "Esta matrícula já está cadastrada com outra placa");
        }

        Automovel a = new Automovel();
        a.setMatricula(dto.matricula());
        a.setAno(dto.ano());
        a.setMarca(dto.marca());
        a.setModelo(dto.modelo());
        a.setPlaca(dto.placa());
        a.setProprietario(cliente);

        return automovelRepository.save(a);
    }

    // RN11 na modificação: a nova placa ou matrícula não pode pertencer a outro automóvel
    private void validarUnicidadeAoAtualizar(Automovel atual, AutomovelDTO dto) {
        automovelRepository.findByPlaca(dto.placa())
                .filter(a -> !a.getId().equals(atual.getId()))
                .ifPresent(a -> {
                    throw new RegraNegocioException(
                            "Esta placa já pertence a outro automóvel");
                });

        automovelRepository.findByMatricula(dto.matricula())
                .filter(a -> !a.getId().equals(atual.getId()))
                .ifPresent(a -> {
                    throw new RegraNegocioException(
                            "Esta matrícula já pertence a outro automóvel");
                });
    }

    // Converte a entidade para DTO de resposta, incluindo a avaliação financeira
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

        AvaliacaoResponse avaliacao = avaliacaoRepository
                .findByPedidoId(p.getId())
                .map(av -> new AvaliacaoResponse(
                        av.getObservacao(),
                        av.isParecerPositivo(),
                        av.getData(),
                        av.getAgente().getNome()
                ))
                .orElse(null);

        return new PedidoResponse(
                p.getId(),
                autoDto,
                p.getDataInicio(),
                p.getDataFim(),
                p.getDataPedido(),
                p.getStatus(),
                p.getCliente().getNome(),
                avaliacao
        );
    }

    private boolean vazio(String s) {
        return s == null || s.isBlank();
    }
}