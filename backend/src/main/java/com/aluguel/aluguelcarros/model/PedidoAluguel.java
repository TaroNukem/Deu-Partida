package com.aluguel.aluguelcarros.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Entity
@Table(name = "pedido_aluguel")
@Getter @Setter @NoArgsConstructor
public class PedidoAluguel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(optional = false) @JoinColumn(name = "automovel_id")
    private Automovel automovel;

    private LocalDate dataInicio;
    private LocalDate dataFim;
    private LocalDate dataPedido = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.EM_ANALISE;
}
