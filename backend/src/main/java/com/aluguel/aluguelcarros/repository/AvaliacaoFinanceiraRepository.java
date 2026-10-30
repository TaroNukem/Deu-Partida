package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.AvaliacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoFinanceiraRepository
        extends JpaRepository<AvaliacaoFinanceira, Long> {

    boolean existsByPedidoId(Long pedidoId);
}