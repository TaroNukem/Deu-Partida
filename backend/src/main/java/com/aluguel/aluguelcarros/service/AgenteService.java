
package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.*;
import com.aluguel.aluguelcarros.exception.RegraNegocioException;
import com.aluguel.aluguelcarros.model.*;
import com.aluguel.aluguelcarros.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgenteService {

    private final PedidoAluguelRepository pedidoRepository;
    private final AgenteRepository agenteRepository;
    private final AvaliacaoFinanceiraRepository avaliacaoRepository;
    private final ContratoCreditoRepository contratoCreditoRepository;
    private final ContratoAluguelRepository contratoAluguelRepository;

    // 7.1 - listar todos os pedidos recebidos pelo agente
    public List<PedidoResponse> listarPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    // 7.2 - registrar avaliação financeira
    @Transactional
    public void avaliar(Long pedidoId, AvaliacaoRequest req) {

        // Busca o pedido
        PedidoAluguel pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() ->
                        new RegraNegocioException("Pedido não encontrado"));

        // Verifica se o pedido ainda está em análise
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new RegraNegocioException(
                    "Só é possível avaliar pedidos em análise");
        }

        // Recupera o usuário autenticado
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof Agente agenteLogado)) {
            throw new RegraNegocioException(
                    "Apenas agentes podem realizar avaliações");
        }

        // Busca o agente no banco
        Agente agente = agenteRepository.findById(agenteLogado.getId())
                .orElseThrow(() ->
                        new RegraNegocioException("Agente não encontrado"));

        // Impede avaliações duplicadas
        if (avaliacaoRepository.existsByPedidoId(pedidoId)) {
            throw new RegraNegocioException(
                    "Este pedido já possui uma avaliação financeira");
        }

        // Cria a avaliação
        AvaliacaoFinanceira avaliacao = new AvaliacaoFinanceira();

        avaliacao.setPedido(pedido);
        avaliacao.setAgente(agente);
        avaliacao.setParecerPositivo(req.parecerPositivo());
        avaliacao.setObservacao(req.observacao());

        // Atualiza o status do pedido
        if (req.parecerPositivo()) {
            pedido.setStatus(StatusPedido.APROVADO);
        } else {
            pedido.setStatus(StatusPedido.REPROVADO);
        }

        // Salva a avaliação
        avaliacaoRepository.save(avaliacao);
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

    @Transactional
    public PedidoResponse modificarPedido(Long id, PedidoRequest req) {

        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() ->
                        new RegraNegocioException("Pedido não encontrado"));

        // O agente só pode modificar pedidos em análise ou aprovados.
        if (pedido.getStatus() != StatusPedido.EM_ANALISE &&
                pedido.getStatus() != StatusPedido.APROVADO) {

            throw new RegraNegocioException(
                    "Só é possível modificar pedidos em análise ou aprovados"
            );
        }

        // Valida as datas.
        if (!req.dataFim().isAfter(req.dataInicio())) {
            throw new RegraNegocioException(
                    "A data final deve ser posterior à data inicial"
            );
        }

        // Atualiza as datas do pedido.
        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());

        // Atualiza os dados do automóvel.
        Automovel automovel = pedido.getAutomovel();
        AutomovelDTO dados = req.automovel();

        automovel.setMatricula(dados.matricula());
        automovel.setAno(dados.ano());
        automovel.setMarca(dados.marca());
        automovel.setModelo(dados.modelo());
        automovel.setPlaca(dados.placa());

        pedidoRepository.save(pedido);

        return paraResponse(pedido);
    }

    @Transactional
    public ContratoCredito concederCredito(Long pedidoId, CreditoRequest req) {

        // Busca o pedido.
        PedidoAluguel pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() ->
                        new RegraNegocioException("Pedido não encontrado"));

        // O pedido precisa estar aprovado.
        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new RegraNegocioException(
                    "Só é possível conceder crédito para pedidos aprovados"
            );
        }

        // Recupera o agente autenticado.
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof Usuario usuarioLogado)) {
            throw new RegraNegocioException(
                    "Apenas agentes podem conceder crédito"
            );
        }

        Agente agente = agenteRepository.findById(usuarioLogado.getId())
                .orElseThrow(() ->
                        new RegraNegocioException("Agente não encontrado"));

        // Verifica se o agente é de um banco.
        if (agente.getTipo() != TipoAgente.BANCO) {
            throw new RegraNegocioException(
                    "Somente agentes de banco podem conceder crédito"
            );
        }

        // Cria o contrato de crédito.
        ContratoCredito contrato = new ContratoCredito();

        contrato.setBanco(agente);
        contrato.setPedido(pedido);
        contrato.setValor(req.valor());
        contrato.setTaxaJuros(req.taxaJuros());

// Registra o banco responsável pelo pedido.
        pedido.setBancoCredito(agente);

        pedidoRepository.save(pedido);

        return contratoCreditoRepository.save(contrato);
    }

    // 7.5 - executar contrato de pedido aprovado
    @Transactional
    public ContratoAluguel executarContrato(Long pedidoId) {

        // Busca o pedido.
        PedidoAluguel pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() ->
                        new RegraNegocioException("Pedido não encontrado"));

        // Verifica se o pedido está aprovado.
        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new RegraNegocioException(
                    "Só é possível executar contratos de pedidos aprovados"
            );
        }

        // Verifica se o pedido já possui contrato de aluguel.
        if (contratoAluguelRepository.existsByPedidoId(pedidoId)) {
            throw new RegraNegocioException(
                    "Este pedido já possui um contrato de aluguel"
            );
        }

        // Busca o contrato de crédito, caso exista.
        ContratoCredito credito = contratoCreditoRepository
                .findByPedidoId(pedidoId)
                .orElse(null);

        // Cria o contrato de aluguel.
        ContratoAluguel contrato = new ContratoAluguel();

        contrato.setPedido(pedido);
        contrato.setContratoCredito(credito);

        // Atualiza o status do pedido.
        pedido.setStatus(StatusPedido.CONTRATATO);

        pedidoRepository.save(pedido);

        return contratoAluguelRepository.save(contrato);
    }
}
