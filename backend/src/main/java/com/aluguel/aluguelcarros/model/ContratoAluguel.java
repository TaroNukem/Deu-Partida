package com.aluguel.aluguelcarros.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "contrato_aluguel")
@Getter @Setter @NoArgsConstructor
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "pedido_id", unique = true)
    private PedidoAluguel pedido;

    // Opcional: nem todo aluguel tem crédito
    @ManyToOne(optional = true)
    @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;

    private LocalDate dataAssinatura = LocalDate.now();
}
