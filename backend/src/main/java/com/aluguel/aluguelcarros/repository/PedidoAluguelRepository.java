package com.aluguel.aluguelcarros.repository;

import com.aluguel.aluguelcarros.model.PedidoAluguel;
import com.aluguel.aluguelcarros.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {

    List<PedidoAluguel> findByClienteId(Long clienteId);

    List<PedidoAluguel> findByClienteIdAndStatus(Long clienteId, StatusPedido status);

    // RN15: existe pedido ativo do mesmo automóvel com período sobreposto?
    // excluirId permite ignorar o próprio pedido ao modificar
    @Query("""
            select count(p) > 0 from PedidoAluguel p
            where p.automovel.id = :automovelId
              and p.status in :status
              and p.dataInicio < :fim
              and p.dataFim > :inicio
              and (:excluirId is null or p.id <> :excluirId)
            """)
    boolean existeSobreposicao(
            @Param("automovelId") Long automovelId,
            @Param("status") Collection<StatusPedido> status,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            @Param("excluirId") Long excluirId);
}