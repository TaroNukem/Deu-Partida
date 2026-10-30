
package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.ContratoCredito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContratoCreditoRepository
        extends JpaRepository<ContratoCredito, Long> {

    Optional<ContratoCredito> findByPedidoId(Long pedidoId);
}
