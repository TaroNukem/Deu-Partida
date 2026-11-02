package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.AvaliacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AvaliacaoFinanceiraRepository
        extends JpaRepository<AvaliacaoFinanceira, Long> {

    boolean existsByPedidoId(Long pedidoId);

    Optional<AvaliacaoFinanceira> findByPedidoId(Long pedidoId);
}