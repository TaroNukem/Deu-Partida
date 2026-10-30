package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.ContratoCredito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoCreditoRepository
        extends JpaRepository<ContratoCredito, Long> {
}