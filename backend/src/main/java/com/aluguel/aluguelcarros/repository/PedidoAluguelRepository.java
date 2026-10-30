package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.PedidoAluguel;
import com.aluguel.aluguelcarros.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
    List<PedidoAluguel> findByClienteId(Long clienteId);
    List<PedidoAluguel> findByClienteIdAndStatus(Long clienteId, StatusPedido status);   // filtro do 6.4
}