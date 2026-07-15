// flow-schema.js — o fluxo de abertura como DADOS (derivado de spec-telas-entrada-b1-b2.md + blocos-fluxo-abertura.md).
// Node puro, zero dependência. Cobertura desta versão: Entrada + B1 + B2 (completo) + B3 + B4 + B4.5.
//
// Cada passo é declarativo:
//   id        chave global do passo (aparece na trilha e no livro-caixa)
//   bloco     ENTRADA | B1 | B2 | B3 | B4 | B4.5 | FIM (mapa em mapa-telas-mobile.md)
//   tela      nº da tela na spec
//   tipo      escolha | input | ia-dublada | decisao | gate | acao | toggle | simulador | pausa
//   nome      rótulo humano
//   pula_se   (ctx) => bool   — condicional mutuamente exclusiva não roda (ex: desambiguação só se ambíguo)
//   valida    (ctx) => null | "mensagem de erro"  — barra e para o fluxo
//   deriva    (ctx) => { resultado, dados?, veredito_b1?, termina? }  — lógica de negócio
//
// IMPORTANTE: a IA de mapeamento CNAE NÃO roda aqui. Vem "dublada" pela persona
// (persona entrega cnae + confiança). Motor testa a LÓGICA do fluxo, sem gastar token.
//
// Números fiscais aterrados em pesquisa/fiscal-simples-bh-2026.md (bloco CONSOLIDADO, 2026).
// 🟡 pendentes Larissa (ver perguntas-larissa-fiscal.md): mecânica meses 2-12 · CPP-no-DAS no
// numerador · FS12 regime de caixa. Por isso a saída do simulador é "estimativa".

const FISCAL = {
  SALARIO_MIN: 1621,      // = pró-labore mínimo (2026)
  TETO_INSS: 8475.55,     // teto contribuição INSS 2026
  INSS_MAX: 932.31,       // 11% do teto
  INSS_ALIQ: 0.11,        // INSS do sócio sobre pró-labore (direto, não 11%×20%)
  IRRF_ISENCAO: 5000,     // isenção efetiva de IRRF/mês (Lei 15.270/2025)
  FATOR_R_LIMIAR: 0.28,   // ≥28% → Anexo III · <28% → Anexo V
  ANEXO_III: 0.06,
  ANEXO_V: 0.155,
};

// faixa guiada → ponto médio p/ simulação (nunca campo aberto; spec 2.8)
const FAIXA_MEDIA = {
  'ate 10k': 7000, 'ate-10k': 7000, 'ate10k': 7000,
  '10-20k': 15000, '20-30k': 25000, '30k+': 40000, '30k': 40000,
};
function faturamentoMedio(faixa) {
  return FAIXA_MEDIA[String(faixa || '').trim()] ?? null;
}

// pró-labore ótimo = o menor que cruza 28% (vira Anexo III). Mostra se fica ≤ R$5k (IRRF zero).
// MVP: folha ≈ pró-labore (solo sem funcionário). 🟡 ponto B (CPP-no-DAS) pode mudar o alvo.
function proLaboreOtimo(fat) {
  if (!fat) return null;
  return Math.round(Math.max(FISCAL.SALARIO_MIN, FISCAL.FATOR_R_LIMIAR * fat));
}

// INSS do pró-labore com FOLGA do teto (duplo vínculo): incide sobre (teto − salário CLT).
// Zera só se o CLT já ≥ teto. Não é binário (fiscal-simples-bh-2026 #6).
function inssComFolga(cltRemun) {
  const clt = Number(cltRemun || 0);
  const folga = Math.max(0, FISCAL.TETO_INSS - clt);
  return { folga, zera: folga <= 0 };
}

function validaCPF(cpf) {
  cpf = String(cpf || '').replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(cpf[i], 10) * (10 - i);
  let d1 = 11 - (s % 11); if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(cpf[9], 10)) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(cpf[i], 10) * (11 - i);
  let d2 = 11 - (s % 11); if (d2 >= 10) d2 = 0;
  return d2 === parseInt(cpf[10], 10);
}

module.exports = {
  id: 'abertura',
  flow_num: 1,
  versao: '0.2.2',
  cobertura: 'Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)',

  passos: [
    // ── ENTRADA ──────────────────────────────────────────────────────────
    {
      id: 'entrada.fork', bloco: 'ENTRADA', tela: '3', tipo: 'escolha',
      nome: 'Fork: abrir CNPJ × já sou cliente',
      deriva: (ctx) => {
        const abrir = ctx.respostas.entrada_escolha === 'abrir_cnpj';
        return {
          resultado: abrir ? 'rota: abertura de CNPJ' : 'rota: login (fora do fluxo de abertura)',
          termina: abrir ? null : 'saiu-fluxo',
        };
      },
    },

    // ── B1 — Gate-CNAE + Login ───────────────────────────────────────────
    {
      id: 'b1.descricao', bloco: 'B1', tela: '4', tipo: 'input',
      nome: 'Gate-CNAE: descrição da atividade',
      valida: (ctx) => {
        const t = (ctx.respostas.atividade_descricao || '').trim();
        return t.length >= 10 ? null : 'conta um pouco mais do que você faz';
      },
      deriva: () => ({ resultado: 'descrição aceita' }),
    },
    {
      id: 'b1.mapeamento', bloco: 'B1', tela: '4', tipo: 'ia-dublada',
      nome: 'Mapeamento CNAE (IA dublada pela persona)',
      deriva: (ctx) => {
        const r = ctx.respostas;
        return {
          resultado: `CNAE ${r.cnae} · confiança ${r.cnae_confianca}` +
                     (r.cnae_ambiguo ? ' · AMBÍGUO' : ' · sem fork'),
          dados: { cnae: r.cnae, confianca: r.cnae_confianca, ambiguo: !!r.cnae_ambiguo },
        };
      },
    },
    {
      id: 'b1.desambiguacao', bloco: 'B1', tela: '4', tipo: 'decisao',
      nome: 'Mini-loop de desambiguação (só se ambíguo / baixa confiança)',
      pula_se: (ctx) => ctx.dados.confianca === 'alta' && !ctx.dados.ambiguo,
      deriva: (ctx) => ({ resultado: 'desambiguou: ' + (ctx.respostas.desambiguacao_ramo || '?') }),
    },
    {
      id: 'b1.filtro', bloco: 'B1', tela: '4', tipo: 'decisao',
      nome: 'Filtro de regime (serviço? Simples? regulada?)',
      deriva: (ctx) => {
        const r = ctx.respostas;
        return {
          resultado: `serviço ${r.filtro_servico ? '✓' : '✗'} · ` +
                     `Simples ${r.filtro_simples ? '✓' : '✗'} · ` +
                     `${r.filtro_regulada ? 'REGULADA' : 'não-regulada ✓'}`,
          dados: { servico: !!r.filtro_servico, simples: !!r.filtro_simples, regulada: !!r.filtro_regulada },
        };
      },
    },
    {
      id: 'b1.veredito', bloco: 'B1', tela: '4', tipo: 'gate',
      nome: 'Veredito 🟢/🟡/🔴 (regra de ouro: regulada nunca vira 🟢 automático)',
      deriva: (ctx) => {
        const d = ctx.dados;
        let v, termina = null;
        if (d.servico && d.simples && !d.regulada) v = '🟢 atende';
        else if (d.regulada) { v = '🟡 waitlist'; termina = 'waitlist'; }
        else { v = '🔴 não atende'; termina = 'comercial-mauro'; }
        return { resultado: v, veredito_b1: v, termina };
      },
    },
    {
      id: 'b1.conta', bloco: 'B1', tela: '5', tipo: 'acao',
      nome: 'Criar conta (só pós-🟢)',
      deriva: () => ({ resultado: 'conta criada · entra no B2' }),
    },

    // ── B2 — Coleta + Enquadramento ──────────────────────────────────────
    {
      id: 'b2.socio', bloco: 'B2', tela: '6', tipo: 'input',
      nome: '2.1 Dados do sócio',
      valida: (ctx) => {
        const r = ctx.respostas;
        if (!validaCPF(r.socio_cpf)) return 'CPF inválido (dígito verificador)';
        if (r.socio_cpf_situacao !== 'regular') return `CPF ${r.socio_cpf_situacao} na Receita`;
        if (r.socio_exterior) return 'sócio no exterior: bloqueia opção Simples (LC 123 art.17 II) → rota humana';
        return null;
      },
      deriva: (ctx) => {
        const r = ctx.respostas;
        const casado = /casad/i.test(r.socio_estado_civil || '');
        return {
          resultado: casado
            ? `sócio ok · casado (regime: ${r.socio_regime_bens || '?'})`
            : `sócio ok · ${r.socio_estado_civil} (sem regime de bens)`,
        };
      },
    },
    {
      id: 'b2.clt', bloco: 'B2', tela: '7', tipo: 'toggle',
      nome: '2.2 Duplo vínculo CLT (INSS com folga do teto)',
      // UX-43: querer ser CLT da própria empresa é confusão conceitual, não bloqueio fatal.
      // Educa (sócio se remunera por pró-labore) e SEGUE — não termina o flow.
      deriva: (ctx) => {
        const r = ctx.respostas;
        if (r.socio_clt_propria) {
          return { resultado: 'CLT da própria não existe (duplo vínculo) · corrigido p/ pró-labore · segue', dados: { clt_propria_corrigido: true } };
        }
        if (!r.duplo_vinculo_clt) return { resultado: 'sem duplo vínculo · pró-labore normal' };
        const { folga, zera } = inssComFolga(r.clt_remuneracao);
        return {
          resultado: zera
            ? `tem CLT (R$${r.clt_remuneracao}) ≥ teto · zera INSS do pró-labore`
            : `tem CLT (R$${r.clt_remuneracao}) · recolhe 11% sobre folga R$${folga.toFixed(2)}`,
        };
      },
    },
    {
      id: 'b2.socios', bloco: 'B2', tela: '8', tipo: 'input',
      nome: '2.3 +Sócios (limite 2)',
      valida: (ctx) => {
        const n = Number(ctx.respostas.num_socios || 1);
        return n > 2 ? 'acima de 2 sócios: atendimento humano' : null;
      },
      deriva: (ctx) => {
        const n = Number(ctx.respostas.num_socios || 1);
        return {
          resultado: n <= 1 ? 'solo (sem +sócios)' : `${n} sócios · participação soma 100%`,
          dados: { num_socios: n },
        };
      },
    },
    {
      id: 'b2.empresa', bloco: 'B2', tela: '9', tipo: 'input',
      nome: '2.4 Dados da empresa (+ upsell endereço fiscal)',
      valida: (ctx) => (Number(ctx.respostas.empresa_capital || 0) > 0 ? null : 'capital social deve ser > 0'),
      deriva: (ctx) => {
        const r = ctx.respostas;
        const up = r.quer_endereco_fiscal ? ' · +endereço fiscal (upsell→plano)' : '';
        return {
          resultado: `empresa ok · capital R$${r.empresa_capital} · endereço ${r.empresa_endereco_tipo || 'próprio'}${up}`,
          dados: { endereco_fiscal: !!r.quer_endereco_fiscal },
        };
      },
    },
    {
      id: 'b2.cnae_sec', bloco: 'B2', tela: '10', tipo: 'input',
      nome: '2.5 CNAE secundários',
      deriva: (ctx) => {
        const s = ctx.respostas.cnae_secundarios || [];
        return { resultado: s.length ? `${s.length} secundário(s): ${s.join(', ')}` : 'sem secundários' };
      },
    },
    {
      id: 'b2.natureza', bloco: 'B2', tela: '11', tipo: 'decisao',
      nome: '2.6 Natureza jurídica (guard-rail SLU×LTDA)',
      valida: (ctx) => {
        const r = ctx.respostas;
        const n = Number(r.num_socios || 1);
        if (r.natureza === 'SLU' && n > 1) return 'SLU não admite 2+ sócios (use LTDA)';
        if (r.natureza === 'LTDA' && n < 2) return 'LTDA precisa 2+ sócios (solo = SLU)';
        return null;
      },
      deriva: (ctx) => ({ resultado: `natureza ${ctx.respostas.natureza} (coerente com nº de sócios)` }),
    },
    {
      id: 'b2.nome', bloco: 'B2', tela: '12', tipo: 'input',
      nome: '2.7 Razão social + nome fantasia (viabilidade prévia)',
      deriva: (ctx) => ({
        resultado: ctx.respostas.nome_viavel !== false
          ? 'razão social + fantasia · nome disponível (viabilidade prévia)'
          : 'nome em uso · sugere variação',
      }),
    },
    {
      id: 'b2.cnae_otimo', bloco: 'B2', tela: '13', tipo: 'simulador',
      nome: '2.8a CNAE fiscalmente ótimo (entre equivalentes que cobrem a atividade)',
      // 🚧 recomenda o CNAE de menor carga ENTRE os que cobrem a atividade real.
      // A família (cnae_equivalentes) vem dublada; na vida real = dado validado pela Larissa.
      // Ver execucao/cnae-fiscalmente-otimo.md. Sem família → enquadramento único (no-op).
      deriva: (ctx) => {
        const r = ctx.respostas;
        const fam = r.cnae_equivalentes;
        if (!Array.isArray(fam) || fam.length <= 1) {
          return { resultado: 'enquadramento único (sem CNAE alternativo)' };
        }
        const fat = faturamentoMedio(r.faturamento_faixa) || 0;
        const ord = [...fam].sort((a, b) => a.aliquota - b.aliquota);
        const otimo = ord[0];
        const pior = ord[ord.length - 1];
        const economia = Math.round(((pior.aliquota - otimo.aliquota) / 100) * fat);
        return {
          resultado: `CNAE ótimo: ${otimo.cnae} (Anexo ${otimo.anexo}, ${otimo.aliquota}%) vs ${pior.cnae} (${pior.aliquota}%) · economia ~R$${economia}/mês`,
          dados: { cnae_otimo: otimo.cnae },
        };
      },
    },
    {
      id: 'b2.simulador', bloco: 'B2', tela: '13', tipo: 'simulador',
      nome: '2.8 Simulador Fator R + pró-labore ótimo (estimativa)',
      deriva: (ctx) => {
        const r = ctx.respostas;
        const fat = faturamentoMedio(r.faturamento_faixa);
        const folhaPct = r.fator_r_folha_pct != null ? Number(r.fator_r_folha_pct) / 100 : 0;
        const anexo = folhaPct >= FISCAL.FATOR_R_LIMIAR ? 'III (6%)' : 'V (15,5%)';
        const otimo = proLaboreOtimo(fat);
        const irrf = otimo != null && otimo <= FISCAL.IRRF_ISENCAO ? 'IRRF zero' : 'IRRF s/ excedente';
        const jaOtimo = folhaPct >= FISCAL.FATOR_R_LIMIAR;
        const tail = otimo != null
          ? (jaOtimo ? ' · já otimizado' : ` · ótimo R$${otimo} → Anexo III (${irrf})`)
          : '';
        return {
          resultado: `est. Fator R ${Math.round(folhaPct * 100)}% → Anexo ${anexo}${tail}`,
          dados: { anexo, pro_labore_otimo: otimo },
        };
      },
    },
    {
      id: 'b2.revisao', bloco: 'B2', tela: '14', tipo: 'acao',
      nome: '2.9 Revisão do dossiê → handoff B3',
      deriva: () => ({ resultado: 'dossiê completo · handoff B3' }),
    },

    // ── B3 — Cobrança (gateway Asaas) ────────────────────────────────────
    {
      id: 'b3.recap', bloco: 'B3', tela: '15', tipo: 'acao',
      nome: 'Recap do valor (economia do Fator R)',
      deriva: () => ({ resultado: 'recap: economia do Fator R + escopo (abertura grátis + mensal)' }),
    },
    {
      id: 'b3.plano', bloco: 'B3', tela: '16', tipo: 'escolha',
      nome: 'Escolha do plano (tier por faixa)',
      deriva: (ctx) => {
        const r = ctx.respostas;
        return { resultado: `plano ${r.b3_plano || 'base'} (faixa ${r.faturamento_faixa || '?'})` };
      },
    },
    {
      id: 'b3.aceite', bloco: 'B3', tela: '17', tipo: 'gate',
      nome: 'Aceite do contrato + termo de início (pausa assinatura)',
      valida: (ctx) => (ctx.respostas.b3_aceite === false ? 'contrato/termo não aceito → não avança' : null),
      deriva: () => ({ resultado: 'contrato + termo de início aceitos (assinatura)' }),
    },
    {
      id: 'b3.pagamento', bloco: 'B3', tela: '18', tipo: 'pausa',
      nome: 'Pagamento (Asaas) — só `pago` destrava B4',
      deriva: (ctx) => {
        const r = ctx.respostas;
        const st = r.b3_pagamento_status || 'pago';
        if (st !== 'pago') {
          return {
            resultado: `pagamento ${st} (${r.b3_metodo}) · dunning · NÃO destrava B4`,
            termina: 'aguardando-pagamento',
          };
        }
        return { resultado: `pagamento confirmado (${r.b3_metodo}) · destrava B4` };
      },
    },

    // ── B4 — Constituição (Redesim/JUCEMG/BH) ────────────────────────────
    {
      id: 'b4.viabilidade', bloco: 'B4', tela: '19', tipo: 'decisao',
      nome: 'Viabilidade (JUCEMG+municipal unificada)',
      deriva: () => ({ resultado: 'viabilidade deferida (nome+endereço+CNAE) — JUCEMG unificada' }),
    },
    {
      id: 'b4.dbe', bloco: 'B4', tela: '20', tipo: 'acao',
      nome: 'DBE / Coleta Web (Receita)',
      deriva: () => ({ resultado: 'DBE gerado (Coleta Web/Receita)' }),
    },
    {
      id: 'b4.registro', bloco: 'B4', tela: '21', tipo: 'acao',
      nome: 'Registro JUCEMG (contrato pronto) + assinatura GOV.BR',
      deriva: () => ({ resultado: 'contrato pronto (JUCEMG) + assinado GOV.BR prata/ouro' }),
    },
    {
      id: 'b4.taxa', bloco: 'B4', tela: '21', tipo: 'acao',
      nome: 'Taxa DAE JUCEMG (repasse)',
      deriva: () => ({ resultado: 'DAE JUCEMG paga (repasse ~R$268,51)' }),
    },
    {
      id: 'b4.cnpj', bloco: 'B4', tela: '22', tipo: 'gate',
      nome: 'CNPJ emitido + opção Simples automática + CRC',
      deriva: () => ({ resultado: 'CNPJ emitido + opção Simples automática + CRC assina' }),
    },
    {
      id: 'b4.certificado', bloco: 'B4', tela: '23', tipo: 'acao',
      nome: 'Certificado digital A1 (pós-CNPJ)',
      deriva: () => ({ resultado: 'certificado A1 emitido (pós-CNPJ)' }),
    },
    {
      id: 'b4.municipal', bloco: 'B4', tela: '24', tipo: 'acao',
      nome: 'Inscrição municipal + credenciamento NFS-e (DES-BH)',
      deriva: () => ({ resultado: 'inscrição municipal + credenciamento NFS-e (DES-BH)' }),
    },

    // ── B4.5 — Ativação fiscal (API Serpro) ──────────────────────────────
    {
      id: 'b45.ativacao', bloco: 'B4.5', tela: '25', tipo: 'acao',
      nome: 'Ativação fiscal: procuração e-CAC → API Serpro',
      deriva: () => ({ resultado: 'procuração e-CAC → API Serpro (PGDAS-D/DAS automatizado)' }),
    },
    {
      id: 'fim.ativa', bloco: 'FIM', tela: '—', tipo: 'gate',
      nome: 'Empresa ativa e operando',
      deriva: () => ({ resultado: 'empresa ativa e operando ✅', termina: 'ativa' }),
    },
  ],

  FISCAL,
  faturamentoMedio,
  proLaboreOtimo,
  inssComFolga,
  validaCPF,
};
