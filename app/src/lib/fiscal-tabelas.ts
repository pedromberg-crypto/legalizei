/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🤖 ARQUIVO GERADO — NÃO EDITAR À MÃO.
 * ═══════════════════════════════════════════════════════════════════════════
 * Fonte: `execucao/motor-fiscal/_tabelas.mjs`
 * Gerador: `node execucao/motor-fiscal/gerar-tabelas-app.mjs`
 *
 * Editar aqui não muda o cálculo — o motor lê a fonte, não este arquivo — e
 * some na próxima rodada do gerador. Mexa em `_tabelas.mjs`.
 *
 * 🔑 Só CONSTANTES atravessam. Lógica fiscal mora no `apurador.mjs`.
 * Gerado em 2026-09-18.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const FISCAL = {
  /** Piso do pró-labore. Decreto 12.797/2025 + tabela do INSS. **Muda todo janeiro.** */
  SALARIO_MIN: 1621,
  /** Portaria Interministerial MPS/MF nº 13 de 09/01/2026, art. 2º. */
  TETO_INSS: 8475.55,
  /** Retenção do sócio contribuinte individual no Simples III/V (IN RFB 2.110/2022 art. 43 I). */
  INSS_ALIQ: 0.11,
  /** A LEI: folha ÷ receita ≥ 28% puxa do Anexo V pro III (LC 123 art. 18 §5º-J). */
  FATOR_R_LIMIAR: 0.28,
  /** RECOMENDAÇÃO NOSSA (UX-39), não lei: cravar 28% deixa a empresa a um mês ruim de cair. */
  FATOR_R_MARGEM: 0.3,
  /** Alíquota de entrada, 1ª faixa. */
  ANEXO_III: 0.06,
  ANEXO_V: 0.155,

  /**
   * 🔴 O REDUTOR DO IRRF — e o nome antigo estava errado.
   *
   * Até 14/09 este número vivia aqui como `IRRF_ISENCAO: 5000`, descrito como
   * "isenção efetiva/mês". **Não é isenção.** A Lei 15.270/2025 não criou
   * faixa isenta: ela criou um REDUTOR (Lei 9.250/1995 art. 3º-A) aplicado
   * depois da tabela. Até este teto ele zera o imposto; acima, decai em rampa
   * até R$ 7350. Quem lesse o nome antigo implementaria uma faixa
   * isenta que a lei não criou.
   */
  IRRF_REDUTOR_TETO: 5000,
  IRRF_REDUTOR_RAMPA: 7350,
} as const;
