package com.aluguel.aluguelcarros.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "avaliacao_financeira")
@Getter @Setter @NoArgsConstructor
public class AvaliacaoFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "pedido_id", unique = true)
    private PedidoAluguel pedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "agente_id")
    private Agente agente;

    @Column(nullable = false)
    private boolean parecerPositivo;

    private String observacao;

    private LocalDate data = LocalDate.now();
}
