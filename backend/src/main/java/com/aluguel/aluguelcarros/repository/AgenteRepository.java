package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.Agente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgenteRepository extends JpaRepository<Agente, Long> {
}
