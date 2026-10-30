package com.aluguel.aluguelcarros.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contrato_credito")
@Getter @Setter @NoArgsConstructor
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "banco_id")
    private Agente banco;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal taxaJuros;   // em %, por exemplo 1.99

    private LocalDate data = LocalDate.now();
}
