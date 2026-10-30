
package com.aluguel.aluguelcarros.service;

import com.aluguel.aluguelcarros.dto.AutomovelDTO;
import com.aluguel.aluguelcarros.dto.PedidoResponse;
import com.aluguel.aluguelcarros.model.Automovel;
import com.aluguel.aluguelcarros.model.PedidoAluguel;
import com.aluguel.aluguelcarros.repository.PedidoAluguelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgenteService {

    private final PedidoAluguelRepository pedidoRepository;

    // 7.1 - listar todos os pedidos recebidos pelo agente
    public List<PedidoResponse> listarPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
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
