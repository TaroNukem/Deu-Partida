package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.ContratoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoAluguelRepository extends JpaRepository<ContratoAluguel, Long> {
}