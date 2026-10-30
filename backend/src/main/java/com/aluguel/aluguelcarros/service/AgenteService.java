
package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.AutomovelDTO;
import com.aluguel.aluguelcarros.dto.AvaliacaoRequest;
import com.aluguel.aluguelcarros.dto.PedidoRequest;
import com.aluguel.aluguelcarros.dto.PedidoResponse;
import com.aluguel.aluguelcarros.exception.RegraNegocioException;
import com.aluguel.aluguelcarros.model.*;
import com.aluguel.aluguelcarros.repository.AgenteRepository;
import com.aluguel.aluguelcarros.repository.AvaliacaoFinanceiraRepository;
import com.aluguel.aluguelcarros.repository.PedidoAluguelRepository;
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
}
