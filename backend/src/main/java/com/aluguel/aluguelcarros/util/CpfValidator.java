package com.aluguel.aluguelcarros.util;

public final class CpfValidator {

    private CpfValidator() {}

    // Deixa só os dígitos: "165.727.076-95" vira "16572707695"
    public static String normalizar(String cpf) {
        return cpf == null ? null : cpf.replaceAll("\\D", "");
    }

    // Confere tamanho, sequências repetidas e os dois dígitos verificadores
    public static boolean valido(String cpf) {
        String n = normalizar(cpf);
        if (n == null || n.length() != 11) return false;
        if (n.chars().distinct().count() == 1) return false;

        int d1 = digito(n, 9);
        int d2 = digito(n, 10);
        return d1 == n.charAt(9) - '0' && d2 == n.charAt(10) - '0';
    }

    private static int digito(String n, int tamanho) {
        int soma = 0;
        for (int i = 0; i < tamanho; i++) {
            soma += (n.charAt(i) - '0') * (tamanho + 1 - i);
        }
        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }
}