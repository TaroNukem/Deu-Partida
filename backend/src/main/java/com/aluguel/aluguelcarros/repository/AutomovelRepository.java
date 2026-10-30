package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
    Optional<Automovel> findByPlaca(String placa);   // usado no 6.2 (reaproveitar pela placa)
}
