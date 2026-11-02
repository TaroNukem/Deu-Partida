package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.ClienteRequest;
import com.aluguel.aluguelcarros.dto.ClienteResponse;
import com.aluguel.aluguelcarros.dto.RendimentoDTO;
import com.aluguel.aluguelcarros.exception.RegraNegocioException;
import com.aluguel.aluguelcarros.model.Cliente;
import com.aluguel.aluguelcarros.model.PedidoAluguel;
import com.aluguel.aluguelcarros.model.Rendimento;
import com.aluguel.aluguelcarros.model.StatusPedido;
import com.aluguel.aluguelcarros.repository.ClienteRepository;
import com.aluguel.aluguelcarros.repository.PedidoAluguelRepository;
import com.aluguel.aluguelcarros.security.UsuarioLogado;
import com.aluguel.aluguelcarros.util.CpfValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PedidoAluguelRepository pedidoAluguelRepository;
    private final UsuarioLogado usuarioLogado;

    // 5.3 - consultar
    @Transactional(readOnly = true)
    public ClienteResponse buscarMeu() {
        return paraResponse(clienteLogado());
    }

    // 5.4 - atualizar
    @Transactional
    public ClienteResponse atualizar(ClienteRequest req) {
        Cliente c = clienteLogado();

        // RN04: no máximo 3 empregadores
        if (req.rendimentos() != null && req.rendimentos().size() > 3) {
            throw new RegraNegocioException("O cliente pode ter no máximo 3 rendimentos");
        }

        // RN03: CPF válido e único entre clientes
        String cpf = CpfValidator.normalizar(req.cpf());

        if (!CpfValidator.valido(cpf)) {
            throw new RegraNegocioException("CPF inválido");
        }

        if (!c.getCpf().equals(cpf)
                && clienteRepository.existsByCpfAndIdNot(cpf, c.getId())) {
            throw new RegraNegocioException("CPF já cadastrado em outro cliente");
        }

        c.setNome(req.nome());
        c.setRg(req.rg());
        c.setCpf(cpf);
        c.setEndereco(req.endereco());
        c.setProfissao(req.profissao());

        if (req.rendimentos() != null) {
            c.getRendimentos().clear();
            for (RendimentoDTO dto : req.rendimentos()) {
                Rendimento r = new Rendimento();
                r.setEntidadeEmpregadora(dto.entidadeEmpregadora());
                r.setValor(dto.valor());
                r.setCliente(c);
                c.getRendimentos().add(r);
            }
        }

        return paraResponse(clienteRepository.save(c));
    }

    // 5.5 - excluir
    // RN12: não pode excluir conta com pedido em andamento
    @Transactional
    public void excluir() {
        Cliente c = clienteLogado();

        boolean temEmAndamento = pedidoAluguelRepository.findByClienteId(c.getId()).stream()
                .map(PedidoAluguel::getStatus)
                .anyMatch(s -> s == StatusPedido.EM_ANALISE
                        || s == StatusPedido.APROVADO
                        || s == StatusPedido.CONTRATADO);

        if (temEmAndamento) {
            throw new RegraNegocioException(
                    "Não é possível excluir a conta: existem pedidos em andamento");
        }

        clienteRepository.delete(c);
    }

    private Cliente clienteLogado() {
        Long id = usuarioLogado.get().getId();
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Cliente não encontrado"));
    }

    private ClienteResponse paraResponse(Cliente c) {
        List<RendimentoDTO> rendimentos = c.getRendimentos().stream()
                .map(r -> new RendimentoDTO(r.getId(), r.getEntidadeEmpregadora(), r.getValor()))
                .toList();

        return new ClienteResponse(c.getId(), c.getLogin(), c.getNome(), c.getRg(), c.getCpf(),
                c.getEndereco(), c.getProfissao(), rendimentos);
    }
}