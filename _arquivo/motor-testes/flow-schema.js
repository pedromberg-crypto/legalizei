// flow-schema.js — o fluxo de abertura como DADOS.
// Node puro, zero dependência.
//
// ⚠️ v0.3.0 — REORDENAÇÃO (2026-07-16): a cobrança SUBIU.
// Ordem de execução agora é ENTRADA → B1 → **B3** → **B2** → B4 → B4.5.
// Os nomes dos blocos são os mesmos do vault (B1 gate · B2 dossiê · B3 cobrança · B4 constituição);
// o que mudou foi a ORDEM. Ver a tabela B3 antes de B2 no relatório: é o ponto, não um bug.
// Spec: execucao/reordenacao-flow-cobranca-cedo.md (telas N1–N25).
//
// ⚠️ v0.5.0 — ENCAIXE (2026-07-21): o cluster fiscal foi reordenado.
// A escolha do CNAE saiu do B2 (N17 tardio) e virou o ENCAIXE, no B1, logo após o
// veredito 🟢 e ANTES da triagem — pré-pago. Trava o CNAE (nome/objeto/Junta dependem
// dele desde o 1º preenchimento, confirmado pelo Pedro). O teaser (N5) virou o N5'
// RESUMO (opção B: vende segurança, não promete economia) → sem número prometido, sem
// promessa a quebrar. O N17 (b2.cnae_otimo) foi REMOVIDO.
// Spec: execucao/reordenacao-cluster-fiscal-encaixe.md.
//
// Por que: o flow antigo cobrava no T16, depois de 15 telas de esforço e 7 pontos de
// abandono sem compromisso, e entregava o dossiê exportável antes de cobrar. Confrontado
// com o funil real do líder (cobra na 3ª tela, 6 campos rasos), a ordem antiga morreu.
//
// Cada passo é declarativo:
//   id        chave global do passo (aparece na trilha e no livro-caixa)
//   bloco     ENTRADA | B1 | B2 | B3 | B4 | B4.5 | FIM
//   tela      nº da tela na spec da reordenação (N1–N25)
//   tipo      escolha | input | ia-dublada | decisao | gate | acao | toggle | simulador | pausa
//   pula_se   (ctx) => bool   — condicional mutuamente exclusiva não roda
//   valida    (ctx) => null | "mensagem de erro"  — barra e para o fluxo
//   deriva    (ctx) => { resultado, dados?, veredito_b1?, termina? }
//
// IMPORTANTE: a IA de mapeamento CNAE NÃO roda aqui. Vem "dublada" pela persona.
// Motor testa a LÓGICA do fluxo, sem gastar token.
//
// Números fiscais aterrados em pesquisa/fiscal-simples-bh-2026.md (bloco CONSOLIDADO, 2026).
// 🟡 pendentes Larissa: mecânica meses 2-12 · CPP-no-DAS no numerador · FS12 regime de caixa.

const FISCAL = {
  SALARIO_MIN: 1621,      // = pró-labore mínimo (2026)
  TETO_INSS: 8475.55,     // teto contribuição INSS 2026
  INSS_MAX: 932.31,       // 11% do teto
  INSS_ALIQ: 0.11,        // INSS do sócio sobre pró-labore (direto, não 11%×20%)
  IRRF_ISENCAO: 5000,     // isenção efetiva de IRRF/mês (Lei 15.270/2025)
  FATOR_R_LIMIAR: 0.28,   // ≥28% → Anexo III · <28% → Anexo V (a LEI)
  // UX-39 (auditoria 16/07): a spec manda **não cravar 28%** — um mês de folha menor ou atrasada
  // joga pro Anexo V no ano INTEIRO. O alvo recomendado é ~30%, com colchão. O motor recomendava
  // 28% exato, ou seja, dava justamente o conselho que a spec proíbe. Item ✅ na spec desde a
  // rodada #3 e NUNCA implementado.
  FATOR_R_MARGEM: 0.30,   // alvo recomendado (colchão sobre o limiar legal)
  ANEXO_III: 0.06,
  ANEXO_V: 0.155,
};

// faixa guiada → ponto médio p/ simulação (nunca campo aberto)
const FAIXA_MEDIA = {
  'ate 10k': 7000, 'ate-10k': 7000, 'ate10k': 7000,
  '10-20k': 15000, '20-30k': 25000, '30k+': 40000, '30k': 40000,
};
function faturamentoMedio(faixa) {
  return FAIXA_MEDIA[String(faixa || '').trim()] ?? null;
}

// pró-labore ótimo = o que cruza o Fator R COM COLCHÃO (UX-39: mira 30%, não crava 28%).
// MVP: folha ≈ pró-labore (solo sem funcionário). 🟡 ponto B (CPP-no-DAS) pode mudar o alvo.
function proLaboreOtimo(fat) {
  if (!fat) return null;
  return Math.round(Math.max(FISCAL.SALARIO_MIN, FISCAL.FATOR_R_MARGEM * fat));
}

// UX-39: a zona entre o limiar legal (28%) e a margem recomendada (30%) é "encostado na borda":
// tecnicamente Anexo III, mas um mês ruim derruba pro V no ano inteiro.
function naBorda(folhaPct) {
  return folhaPct >= FISCAL.FATOR_R_LIMIAR && folhaPct < FISCAL.FATOR_R_MARGEM;
}

// UX-24 (auditoria 16/07) — "as duas telas NÃO podem ser ilhas".
// A spec é explícita: o pró-labore ótimo tem que CONSUMIR o dado do CLT declarado no b2.clt.
// Sócio com CLT ≥ teto zera o INSS do pró-labore; com CLT parcial, recolhe só sobre a folga.
// O simulador não tinha UMA referência a CLT — calculava o custo como se ninguém tivesse
// vínculo. Item ✅ na spec desde a rodada #2 e NUNCA implementado.
function custoProLabore(proLabore, cltRemun) {
  const { folga, zera } = inssComFolga(cltRemun);
  if (zera) return { inss: 0, nota: 'INSS zero (CLT já ≥ teto)' };
  const base = Math.min(proLabore || 0, folga);
  const inss = Math.round(base * FISCAL.INSS_ALIQ);
  const parcial = folga < FISCAL.TETO_INSS;
  return {
    inss,
    nota: parcial
      ? `INSS R$${inss} (11% sobre a folga de R$${Math.round(folga)}, já descontado o CLT)`
      : `INSS R$${inss} (11%)`,
  };
}

// INSS do pró-labore com FOLGA do teto (duplo vínculo): incide sobre (teto − salário CLT).
// Zera só se o CLT já ≥ teto. Não é binário (fiscal-simples-bh-2026 #6).
function inssComFolga(cltRemun) {
  const clt = Number(cltRemun || 0);
  const folga = Math.max(0, FISCAL.TETO_INSS - clt);
  return { folga, zera: folga <= 0 };
}

// economia do swap de CNAE = pior × melhor alíquota da família que cobre a MESMA atividade.
function economiaSwap(fam, fat) {
  if (!Array.isArray(fam) || fam.length <= 1 || !fat) return 0;
  const ord = [...fam].sort((a, b) => a.aliquota - b.aliquota);
  return ((ord[ord.length - 1].aliquota - ord[0].aliquota) / 100) * fat;
}

// TEASER removido em v0.5.0: a prova de economia migrou pro ENCAIXE (b1.encaixe), e o
// que sobrou virou o N5' RESUMO (b1.resumo, opção B — vende segurança, não promete
// economia). Sem número prometido, a `promessa-quebrada` deixa de ter piso a violar.
// `economiaSwap` segue viva, usada agora no ENCAIXE e no simulador.

// UX-49 (rodada #5) — o teaser NÃO pode ser monotemático em economia.
// A rodada #5 expôs: CNAE Anexo III direto (8593-7/00, 8599-6/04) não tem Fator R pra ganhar
// nem família de swap → o motor corretamente não estimava nada → a pessoa via "seu CNAE é
// atendido" e caía direto no "pague R$195", SEM UM ÚNICO ARGUMENTO. E são justamente a `cida`
// e a `govbr-bronze`: as duas leigas totais, o nicho declarado do produto. O teaser funcionava
// bem pro `knife`/`monstro` — quem menos precisa ser convencido.
// Fix: o teaser passa a responder "o que você ganha", e economia é só UMA das respostas.
// Os argumentos de serviço são verificáveis (prazo real medido no CNPJ do próprio Pedro,
// dez/2025: pagamento 10/12 → CNPJ + Simples deferido 12/12) → 2026-07-16-pos-pagamento-operacao-real.md
const ARGUMENTO_SERVICO = 'CNPJ em ~2 dias úteis · alvará imediato · a gente paga seu DAS todo mês';


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
  versao: '0.5.0',
  cobertura: 'Entrada + B1 (gate+ENCAIXE+resumo) + B3 (cobrança) + B2 (dossiê, sem N17) + B4 + B4.5',

  passos: [
    // ── ENTRADA ──────────────────────────────────────────────────────────
    {
      id: 'entrada.fork', bloco: 'ENTRADA', tela: 'N3', tipo: 'escolha',
      nome: 'Fork de 3 rotas (UX-55, travado 16/07)',
      // 🔴 O bug: até a v0.3.x este fork tinha 2 saídas e mandava "já tenho CNPJ" pra login.
      // Mas quem quer trocar de contador NÃO TEM CONTA — metade do mercado batia numa porta
      // escrita "faça login". Agora são 3 rotas:
      //   abrir_cnpj    → flow #1 (este schema)
      //   ja_tenho_cnpj → flow #2 (flow-migrar.js)
      //   entrar        → login
      // ⚠️ Copy travada como **"Já tenho empresa"**, não "quero migrar": (a) "migrar" é jargão
      // (viola UX-12/48 — rótulo literal, zero jargão); (b) "migrar"/"trocar de contador"
      // EXCLUIRIA quem não tem contador (faz sozinho, ou está sem há meses) — e essa pessoa é
      // o MELHOR cliente do flow #2, porque sem contador antigo não há distrato nem TTRT, ou
      // seja, o risco do `migra-refem` nem existe. A pergunta "tem contador?" vive lá dentro.
      deriva: (ctx) => {
        const e = ctx.respostas.entrada_escolha;
        if (e === 'abrir_cnpj') return { resultado: 'rota: abertura de CNPJ (flow #1)' };
        if (e === 'ja_tenho_cnpj') {
          return { resultado: 'rota: JÁ TENHO EMPRESA → flow #2 (migrar)', termina: 'rota-migrar' };
        }
        return { resultado: 'rota: entrar na minha conta (login)', termina: 'saiu-fluxo' };
      },
    },

    // ── B1 — Gate-CNAE + triagem + teaser + conta ────────────────────────
    {
      id: 'b1.descricao', bloco: 'B1', tela: 'N4', tipo: 'input',
      nome: 'Gate-CNAE: descrição da atividade',
      valida: (ctx) => {
        const t = (ctx.respostas.atividade_descricao || '').trim();
        return t.length >= 10 ? null : 'conta um pouco mais do que você faz';
      },
      deriva: () => ({ resultado: 'descrição aceita' }),
    },
    {
      id: 'b1.mapeamento', bloco: 'B1', tela: 'N4', tipo: 'ia-dublada',
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
      id: 'b1.desambiguacao', bloco: 'B1', tela: 'N4', tipo: 'decisao',
      nome: 'Mini-loop de desambiguação (só se ambíguo / baixa confiança)',
      pula_se: (ctx) => ctx.dados.confianca === 'alta' && !ctx.dados.ambiguo,
      deriva: (ctx) => ({ resultado: 'desambiguou: ' + (ctx.respostas.desambiguacao_ramo || '?') }),
    },
    {
      id: 'b1.filtro', bloco: 'B1', tela: 'N4', tipo: 'decisao',
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
      id: 'b1.veredito', bloco: 'B1', tela: 'N4', tipo: 'gate',
      nome: 'Veredito 🟢/🟡/🔴 (regra de ouro: regulada nunca vira 🟢 automático)',
      // Decisão 16/07: regulada segue na waitlist. O líder atende (cobra e pede carteira
      // profissional depois) — divergência estratégica consciente, reavaliar com o Mauro.
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
      id: 'b1.encaixe', bloco: 'B1', tela: 'N-ENC', tipo: 'escolha',
      nome: '🆕 ENCAIXE: escolhe/trava o CNAE (recomendado + alternativas) — pré-pago',
      // 🆕 v0.5.0 (reordenacao-cluster-fiscal-encaixe): a escolha do CNAE saiu do B2
      // (N17 tardio) e virou a tela de DESCOBERTA, logo após o veredito 🟢 e antes da
      // triagem. TRAVA o CNAE antes do nome/objeto/Junta (que dependem dele desde o 1º
      // preenchimento — confirmado pelo Pedro). Garante o SETUP ("o código mais barato
      // que serve"), NÃO o resultado em R$ — a economia em número é do simulador (N18),
      // pós-pago. Regra: nunca troca em silêncio; "manter o atual" é escolha legítima
      // (o ótimo fiscal nem sempre é o ótimo comercial). Herda o opt-in do antigo N17.
      deriva: (ctx) => {
        const r = ctx.respostas;
        const fam = r.cnae_equivalentes;
        if (!Array.isArray(fam) || fam.length <= 1) {
          return {
            resultado: 'enquadramento único (sem CNAE alternativo) · segue com o código encontrado',
            dados: { cnae_otimo: null, swap_adotado: false },
          };
        }
        const ord = [...fam].sort((a, b) => a.aliquota - b.aliquota);
        const otimo = ord[0];
        const pior = ord[ord.length - 1];
        const adota = r.adota_cnae_otimo === true;
        const base = `recomendado ${otimo.cnae} (Anexo ${otimo.anexo}, ${otimo.aliquota}%) vs atual ${pior.cnae} (${pior.aliquota}%) · mesma nota, o que muda é a tabela`;
        return {
          resultado: adota
            ? `${base} · ✅ ESCOLHEU o recomendado (opt-in explícito · CNAE travado)`
            : `${base} · manteve o atual (escolha respeitada)`,
          dados: { cnae_otimo: otimo.cnae, swap_adotado: adota },
        };
      },
    },
    {
      id: 'b1.triagem', bloco: 'B1', tela: 'N4', tipo: 'gate',
      nome: '🆕 Triagem de elegibilidade (UX-21 fail-fast) — ANTES do dinheiro',
      // ⚠️ NOVO em v0.3.0 e OBRIGATÓRIO por causa da reordenação. O UX-21 já mandava perguntar
      // "quantos sócios?" e "algum no exterior?" no B1; o motor v0.2.x só barrava lá no B2.
      // Com cobrança no N9, barrar depois = cobrar de quem não pode abrir. Sobe pra cá.
      // Só roda pós-🟢: quem é 🟡/🔴 já saiu e não precisa responder nada disso.
      valida: (ctx) => {
        const r = ctx.respostas;
        if (r.socio_exterior) return 'sócio no exterior: bloqueia opção Simples (LC 123 art.17 II) → rota humana';
        const n = Number(r.num_socios || 1);
        if (n > 2) return 'acima de 2 sócios: atendimento humano';
        return null;
      },
      deriva: (ctx) => {
        const n = Number(ctx.respostas.num_socios || 1);
        return {
          resultado: `elegível · ${n <= 1 ? 'solo' : n + ' sócios'} · ninguém no exterior`,
          dados: { num_socios: n },
        };
      },
    },
    {
      id: 'b1.faturamento', bloco: 'B1', tela: 'N4', tipo: 'escolha',
      nome: '🆕 Faixa de faturamento (alimenta o teaser)',
      deriva: (ctx) => {
        const fat = faturamentoMedio(ctx.respostas.faturamento_faixa);
        return {
          resultado: fat ? `faixa ${ctx.respostas.faturamento_faixa} (ponto médio R$${fat})` : 'faixa não informada',
          dados: { fat_medio: fat },
        };
      },
    },
    {
      id: 'b1.resumo', bloco: 'B1', tela: "N5'", tipo: 'simulador',
      nome: "🆕 N5' Resumo de valor (opção B — vende segurança, não promete economia)",
      // 🆕 v0.5.0: o que sobrou do teaser depois que a prova de economia migrou pro
      // ENCAIXE. NÃO promete economia — mostra o IMPOSTO por faixa (alíquota de entrada
      // Anexo III sobre a mediana) com carimbo de que varia conforme o pró-labore. Sem
      // número prometido → sem promessa a quebrar. Vende segurança + o argumento de serviço.
      deriva: (ctx) => {
        const fat = ctx.dados.fat_medio;
        if (!fat) {
          return { resultado: `resumo (segurança): ${ARGUMENTO_SERVICO} · a conta exata a gente fecha com você (faixa não informada)` };
        }
        const imposto = Math.round(FISCAL.ANEXO_III * fat);
        return {
          resultado: `resumo (segurança): imposto por volta de ~R$${imposto}/mês na sua faixa · pode variar conforme quanto você se paga · ${ARGUMENTO_SERVICO} · carimbo estimativa (UX-26)`,
          dados: { resumo_imposto: imposto },
        };
      },
    },
    {
      id: 'b1.conta', bloco: 'B1', tela: 'N6', tipo: 'acao',
      nome: 'Criar conta (credencial funcionando) + detecta GOV.BR',
      // UX-29: detecta nível GOV.BR cedo. Bronze → upgrade guiado antes do B4.
      // Prova de que criar credencial aqui importa: o líder manda entrar via "Esqueci minha
      // senha" e gerou 8 resets em 72h no caso real → 2026-07-16-pos-pagamento-operacao-real.md
      deriva: (ctx) => ({
        resultado: ctx.respostas.govbr_nivel === 'bronze'
          ? 'conta criada (credencial ok) · GOV.BR bronze sinalizado (upgrade guiado antes do B4)'
          : 'conta criada (credencial ok) · entra no checkout',
      }),
    },

    // ── B3 — Cobrança (SUBIU: agora vem antes do dossiê) ─────────────────
    {
      id: 'b3.conta_abertura', bloco: 'B3', tela: 'N7', tipo: 'acao',
      nome: 'A conta da abertura + plano (UX-33 — com PRAZO por linha)',
      // Fusão do T16+T17. A captura do líder mostrou o custo de omitir: "Total a pagar R$195",
      // e a TFLF (R$168,48) apareceu no dia 40 com 4 dias pra pagar e correção já embutida.
      deriva: (ctx) => {
        const r = ctx.respostas;
        const up = r.quer_endereco_fiscal ? ' + endereço fiscal (add-on, a partir da 2ª parcela)' : '';
        return {
          resultado: `conta da abertura: honorário R$0 · governo (DAE JUCEMG ~R$268,51 agora 🟡 · ` +
                     `TFLF BH ~R$161 em ~40 dias) · recorrente: plano ${r.b3_plano || 'base'}${up}`,
        };
      },
    },
    {
      id: 'b3.aceite', bloco: 'B3', tela: 'N8', tipo: 'gate',
      nome: 'Aceite do CONTRATO (assinatura — reversível, CDC art.49)',
      // 🆕 v0.3.0: o T18 rachou em dois. Aqui é só o contrato de serviço: ele virou cliente,
      // e nada é irreversível ainda (nenhum centavo de governo saiu). O termo irreversível
      // desceu pro b2.termo (N20), onde a máquina de fato liga. 🟡 ratificar Larissa/Mauro.
      valida: (ctx) => (ctx.respostas.b3_aceite === false ? 'contrato não aceito → não avança' : null),
      // UX-52 (rodada #5): o leigo agora paga ANTES de ver o cálculo — confiança invertida,
      // quem tem menos paga mais cedo. Não dá pra desfazer sem matar a reordenação, MAS o
      // contrato aqui JÁ é reversível (art.49) e isso nunca foi dito. Comunicar é grátis e
      // verdadeiro. UX-50: com 2 sócios, avisar que ele contrata sozinho em nome da sociedade.
      deriva: (ctx) => {
        const n = Number(ctx.respostas.num_socios || 1);
        const multi = n > 1
          ? ' · você contrata sozinho agora; seu sócio ratifica antes de abrirmos qualquer coisa'
          : '';
        return {
          resultado: `contrato aceito · GARANTIA VISÍVEL: 7 dias pra desistir e receber de volta (CDC art.49)${multi}`,
        };
      },
    },
    {
      id: 'b3.pagamento', bloco: 'B3', tela: 'N9', tipo: 'pausa',
      nome: 'Pagamento (CPF valida elegibilidade + cartão/boleto/Pix)',
      // 🆕 v0.3.0 — duas mudanças:
      // 1) CPF: obrigatório pro gateway de qualquer jeito. MESMO CAMPO, DOIS USOS —
      //    situação cadastral irregular NÃO COBRA e roteia (persona `cpf-irregular`).
      // 2) Boleto NÃO termina mais o flow (decisão do Pedro 16/07): entra no app, faz o B2
      //    inteiro, e trava em b2.revisao (export) + b2.termo (execução) até compensar.
      valida: (ctx) => {
        const r = ctx.respostas;
        if (!validaCPF(r.socio_cpf)) return 'CPF inválido (dígito verificador) → não cobra';
        if (r.socio_cpf_situacao !== 'regular') return `CPF ${r.socio_cpf_situacao} na Receita → não cobra, roteia pro humano`;
        return null;
      },
      deriva: (ctx) => {
        const r = ctx.respostas;
        const st = r.b3_pagamento_status || 'pago';
        if (st !== 'pago') {
          return {
            resultado: `CPF regular ✓ · pagamento ${st} (${r.b3_metodo}) · ENTRA no app · dossiê liberado, execução travada`,
            dados: { pagamento_pendente: true },
          };
        }
        return { resultado: `CPF regular ✓ · pagamento confirmado (${r.b3_metodo}) · entra no app` };
      },
    },

    // ── B2 — Dossiê (DENTRO do app, logado e pago) ───────────────────────
    {
      id: 'b2.socio', bloco: 'B2', tela: 'N10', tipo: 'input',
      nome: '2.1 Dados do sócio (CPF já validado no N9)',
      // exterior saiu daqui: virou triagem no b1.triagem (antes do dinheiro).
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
      id: 'b2.clt', bloco: 'B2', tela: 'N11', tipo: 'toggle',
      nome: '2.2 Duplo vínculo CLT (INSS com folga do teto)',
      // UX-43: querer ser CLT da própria empresa é confusão conceitual, não bloqueio fatal.
      // Educa e SEGUE. (Se ainda fosse bloqueio fatal, com a reordenação ela pagaria e seria
      // barrada na tela seguinte — o UX-43 salvou a persona sem saber.)
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
      id: 'b2.socios', bloco: 'B2', tela: 'N12', tipo: 'input',
      nome: '2.3 +Sócios (limite já triado no B1 — aqui é o detalhe)',
      deriva: (ctx) => {
        const n = Number(ctx.respostas.num_socios || 1);
        return { resultado: n <= 1 ? 'solo (sem +sócios)' : `${n} sócios · participação soma 100%` };
      },
    },
    {
      id: 'b2.empresa', bloco: 'B2', tela: 'N13', tipo: 'input',
      nome: '2.4 Dados da empresa (+ upsell endereço fiscal)',
      valida: (ctx) => (Number(ctx.respostas.empresa_capital || 0) > 0 ? null : 'capital social deve ser > 0'),
      deriva: (ctx) => {
        const r = ctx.respostas;
        // add-on pós-pagamento cobra "a partir da 2ª parcela" (mecânica copiada do líder).
        const up = r.quer_endereco_fiscal ? ' · +endereço fiscal (add-on a partir da 2ª parcela)' : '';
        return {
          resultado: `empresa ok · capital R$${r.empresa_capital} · endereço ${r.empresa_endereco_tipo || 'próprio'}${up}`,
          dados: { endereco_fiscal: !!r.quer_endereco_fiscal },
        };
      },
    },
    {
      id: 'b2.cnae_sec', bloco: 'B2', tela: 'N14', tipo: 'input',
      nome: '2.5 CNAE secundários',
      deriva: (ctx) => {
        const s = ctx.respostas.cnae_secundarios || [];
        return { resultado: s.length ? `${s.length} secundário(s): ${s.join(', ')}` : 'sem secundários' };
      },
    },
    {
      id: 'b2.natureza', bloco: 'B2', tela: 'N15', tipo: 'decisao',
      nome: '2.6 Natureza jurídica (guard-rail SLU×LTDA)',
      // 🟡 SOB SUSPEITA: o caso real (CNPJ do Pedro, dez/2025) saiu SOCIEDADE EMPRESÁRIA
      // LIMITADA num caso SOLO. Se SLU é LTDA de sócio único (mesma natureza 206-2), esta
      // regra está mal formulada e o guard-rail abaixo pode ser errado. Pergunta pra Larissa.
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
      id: 'b2.nome', bloco: 'B2', tela: 'N16', tipo: 'input',
      nome: '2.7 Razão social + nome fantasia (viabilidade prévia)',
      deriva: (ctx) => ({
        resultado: ctx.respostas.nome_viavel !== false
          ? 'razão social + fantasia · nome disponível (viabilidade prévia)'
          : 'nome em uso · sugere variação',
      }),
    },
    {
      id: 'b2.simulador', bloco: 'B2', tela: 'N18', tipo: 'simulador',
      nome: '2.9 Simulador Fator R + pró-labore ótimo (a 2ª alavanca, pós-pago)',
      // 🆕 v0.5.0: sem teaser, não há número prometido pré-pago a quebrar. O simulador só
      // MOSTRA o real (o N5' resumo já avisou que varia). A economia do SWAP foi decidida no
      // ENCAIXE; aqui ela entra na conta só se a pessoa escolheu o recomendado (swap_adotado).
      deriva: (ctx) => {
        const r = ctx.respostas;
        const fat = ctx.dados.fat_medio;
        const folhaPct = r.fator_r_folha_pct != null ? Number(r.fator_r_folha_pct) / 100 : 0;
        const jaOtimo = folhaPct >= FISCAL.FATOR_R_LIMIAR;
        // 🐛 corrigido em v0.3.0: o anexo NÃO sai só da folha. CNAE III-por-padrão (ex.: 8599-6/04,
        // SC Cosit 205/14 + SRRF08 8022/18) já é Anexo III **sem Fator R** — a folha é irrelevante,
        // e recomendar pró-labore ótimo pra essa pessoa é conselho errado.
        const anexoDireto = r.cnae_anexo_padrao === 'III';
        const anexo = (anexoDireto || jaOtimo) ? 'III (6%)' : 'V (15,5%)';
        const otimo = proLaboreOtimo(fat);
        const irrf = otimo != null && otimo <= FISCAL.IRRF_ISENCAO ? 'IRRF zero' : 'IRRF s/ excedente';
        // UX-24: consome o CLT declarado no b2.clt em vez de recalcular do zero.
        const custo = otimo != null ? custoProLabore(otimo, r.clt_remuneracao) : null;
        const custoTxt = custo ? ` · custo: ${custo.nota}` : '';
        // UX-39: quem está entre 28% e 30% está tecnicamente em III, mas encostado na borda.
        const borda = naBorda(folhaPct) ? ' · ⚠️ ENCOSTADO NA BORDA (um mês de folha menor joga pro Anexo V no ano inteiro; mire ~30%)' : '';
        const tail = anexoDireto
          ? ' · CNAE já é Anexo III sem Fator R (folha não muda nada)'
          : (otimo != null
              ? (jaOtimo
                  ? ` · já em III${borda}`
                  : ` · ótimo R$${otimo} (mira 30%, com colchão) → Anexo III (${irrf})${custoTxt}`)
              : '');

        // 🆕 v0.5.0: a economia do SWAP foi decidida no ENCAIXE (pré-pago). Aqui só ENTRA na
        // conta se a pessoa escolheu o recomendado (swap_adotado).
        const economiaSwapR = ctx.dados.swap_adotado ? Math.round(economiaSwap(r.cnae_equivalentes, fat)) : 0;
        // Economia REAL = o que o PRODUTO consegue entregar. O que impede de verdade é a MARGEM
        // (o pró-labore não é custo, é dinheiro dela; o custo real é só INSS+IRRF. Quem fatura
        // R$40k e subcontrata fica com R$10k e não tem de onde tirar R$11.200 de pró-labore).
        const margem = r.margem_mensal != null ? Number(r.margem_mensal) : Infinity;
        const caminhoExiste = r.cnae_anexo_padrao === 'V' && otimo != null && otimo <= margem;
        const ganhoFatorR = caminhoExiste ? (FISCAL.ANEXO_V - FISCAL.ANEXO_III) * (fat || 0) : 0;
        // as 2 alavancas são ALTERNATIVAS, não cumulativas: trocar de CNAE OU subir o pró-labore.
        const real = Math.round(Math.max(ganhoFatorR, economiaSwapR));

        // Sem promessa pré-paga: o simulador só mostra o real. Quem tem margem curta cai em
        // economia 0 — e o N5' resumo já avisou que varia (não é promessa quebrada).
        const econTxt = real > 0
          ? ` · economia real ~R$${real}/mês`
          : (r.cnae_anexo_padrao === 'V'
              ? ' · economia real R$0 (a margem não comporta o pró-labore ótimo; o resumo já avisou que varia)'
              : '');
        return {
          resultado: `est. Fator R ${Math.round(folhaPct * 100)}% → Anexo ${anexo}${tail}${econTxt}`,
          dados: { anexo, pro_labore_otimo: otimo, economia_real: real },
        };
      },
    },
    {
      id: 'b2.revisao', bloco: 'B2', tela: 'N19', tipo: 'acao',
      nome: '2.10 Revisão do dossiê (export 🔒 trava se pagamento pendente)',
      // 🆕 v0.3.0: o dossiê exportável era entregue ANTES de cobrar (T15) — o cliente levava
      // o melhor trabalho de graça. Agora ele já pagou, e o PDF é entregável. Boleto pendente
      // trava o export: senão o buraco original volta pela janela.
      // UX-53 (rodada #5): travar o export DEPOIS de a pessoa preencher tudo é surpresa ruim.
      // O aviso vem no começo do dossiê, não no fim — a trava deixa de ser pegadinha.
      deriva: (ctx) => ({
        resultado: ctx.dados.pagamento_pendente
          ? 'dossiê completo · 🔒 export libera quando o boleto compensar (avisado desde o início do dossiê, sem surpresa)'
          : 'dossiê completo · PDF exportável liberado (entregável de cliente)',
      }),
    },
    {
      id: 'b2.consenso', bloco: 'B2', tela: 'N19.5', tipo: 'gate',
      nome: '🆕 Consenso do 2º sócio (UX-44/UX-20) — antes do irreversível',
      // 🆕 rodada #5 (UX-50). A reordenação QUEBROU o UX-44, que exigia "pagamento/registro só
      // liberam com os dois de acordo": o titular passou a pagar no N9 e o sócio só aparecia
      // 13 telas depois. A própria spec avisa: "sociedade quebra quando um decide e o outro
      // descobre a conta depois" — e a gente tinha construído exatamente isso.
      // Fix: o consenso não pode viver no pagamento (mataria a cobrança cedo), então migra pro
      // portão do IRREVERSÍVEL. O titular arrisca os R$195 dele (reversíveis, art.49); ninguém
      // compromete o outro em dinheiro de governo sem ratificação. Espírito do UX-44 preservado.
      // Bônus: o convite do 2º sócio existia na spec (T21) desde o UX-20 e NUNCA foi passo do motor.
      pula_se: (ctx) => Number(ctx.respostas.num_socios || 1) <= 1,
      valida: (ctx) => (ctx.respostas.socio2_ratificou === false
        ? '2º sócio não ratificou o dossiê/custo/split → não executa (consenso é pré-condição do irreversível)'
        : null),
      deriva: () => ({
        resultado: '2º sócio convidado · ratificou dossiê + custo + split de pró-labore · consenso explícito dos dois',
      }),
    },
    {
      id: 'b2.termo', bloco: 'B2', tela: 'N20', tipo: 'gate',
      nome: '🆕 Termo IRREVERSÍVEL (aqui a máquina liga e o dinheiro de governo sai)',
      // 🆕 v0.3.0 — a outra metade do T18. É o portão da execução:
      //  · sem pagamento compensado, não liga (a `knife` do boleto para aqui)
      //  · aceito = a partir daqui as taxas de governo não voltam (exceção de serviço iniciado
      //    morde de verdade, porque o serviço de fato inicia)
      valida: (ctx) => (ctx.respostas.b2_termo_aceite === false ? 'termo irreversível não aceito → não executa' : null),
      deriva: (ctx) => {
        if (ctx.dados.pagamento_pendente) {
          return {
            resultado: '🔒 execução travada: boleto não compensou · dunning proativo puxa de volta PRA CASA (UX-45)',
            termina: 'aguardando-pagamento',
          };
        }
        return { resultado: 'termo irreversível aceito · taxas de governo não voltam a partir daqui · B4 liberado' };
      },
    },

    // ── B4 — Constituição (Redesim/JUCEMG/BH) ────────────────────────────
    {
      id: 'b4.viabilidade', bloco: 'B4', tela: 'N21', tipo: 'decisao',
      nome: 'Viabilidade (JUCEMG+municipal unificada)',
      // B6 (UX-40): órgão externo pode recusar mesmo com prévia OK. Não é crash nem limbo:
      // vira estado 🔴 "precisa de você" (evento `recusa` na persona) e recupera no pipeline.
      deriva: (ctx) => ({
        resultado: ctx.respostas.viabilidade_recusa
          ? 'viabilidade INDEFERIDA: nome reprovado na JUCEMG (apesar da prévia) — precisa de você'
          : 'viabilidade deferida (nome+endereço+CNAE) — JUCEMG unificada',
      }),
    },
    {
      id: 'b4.dbe', bloco: 'B4', tela: 'N21', tipo: 'acao',
      nome: 'DBE / Coleta Web (Receita)',
      deriva: () => ({ resultado: 'DBE gerado (Coleta Web/Receita)' }),
    },
    {
      id: 'b4.registro', bloco: 'B4', tela: 'N21', tipo: 'acao',
      nome: 'Registro JUCEMG (contrato pronto) + assinatura GOV.BR',
      // 🔒 REGRA DURA: nunca pedir pra desabilitar o 2FA do gov.br. O líder pede isso por
      // escrito em e-mail padrão porque a automação dele não lida com 2FA. Nós resolvemos
      // por procuração e-CAC (UX-31). Diferencial vendável, não detalhe técnico.
      deriva: (ctx) => ({
        resultado: ctx.respostas.govbr_nivel === 'bronze'
          ? 'contrato pronto (JUCEMG) + GOV.BR upgrade bronze→prata/ouro (banco/biometria) → assinado · 2FA intacto'
          : 'contrato pronto (JUCEMG) + assinado GOV.BR prata/ouro · 2FA intacto',
      }),
    },
    {
      id: 'b4.taxa', bloco: 'B4', tela: 'N21', tipo: 'acao',
      nome: 'Taxa DAE JUCEMG (repasse)',
      // 🟡 valor em disputa: vault diz R$288 "pago pelo cliente" (Izabela) × ~R$268,51 (tabela),
      // aberto desde 09/07. O checkout do líder foi R$195 total e não há e-mail de DAE no caso
      // real — ou absorvem, ou foi pago por fora, ou há isenção. Muda a régua do preço.
      deriva: () => ({ resultado: 'DAE JUCEMG paga (repasse ~R$268,51 🟡 valor a reconciliar)' }),
    },
    {
      id: 'b4.cnpj', bloco: 'B4', tela: 'N21', tipo: 'gate',
      nome: 'CNPJ emitido + opção Simples automática + CRC',
      deriva: () => ({ resultado: 'CNPJ emitido + opção Simples automática + CRC assina' }),
    },
    {
      id: 'b4.dispensas', bloco: 'B4', tela: 'N21', tipo: 'acao',
      nome: '🆕 Dispensas (sanitária + bombeiros) — com consentimento informado',
      // 🆕 v0.3.0 — FURO EXPOSTO PELA CAPTURA: a timeline não tinha as dispensas, e no caso
      // real elas foram O GARGALO (alvará 15/12, dispensas só 02/01 — 18 dias, última etapa).
      // A do Corpo de Bombeiros é AUTODECLARAÇÃO do empreendedor ("ambiente inócuo" +
      // "instalarei medidas contra incêndio"). O líder declarou em nome do cliente e mandou
      // como boa notícia. Aqui o consentimento é explícito (UX-31 estendido a todo ato
      // declarado em nome do cliente).
      deriva: () => ({
        resultado: 'dispensa sanitária + bombeiros (REDESIMPLES) · autodeclaração EXPLICADA e consentida antes de assinar',
      }),
    },
    {
      id: 'b4.certificado', bloco: 'B4', tela: 'N21', tipo: 'acao',
      nome: 'Certificado digital A1 (pós-CNPJ)',
      deriva: () => ({ resultado: 'certificado A1 emitido (pós-CNPJ)' }),
    },
    {
      id: 'b4.municipal', bloco: 'B4', tela: 'N21', tipo: 'acao',
      nome: 'Inscrição municipal + credenciamento NFS-e (DES-BH)',
      deriva: () => ({ resultado: 'inscrição municipal + credenciamento NFS-e (DES-BH)' }),
    },

    // ── B4.5 — Ativação fiscal (API Serpro) ──────────────────────────────
    {
      id: 'b45.ativacao', bloco: 'B4.5', tela: 'N23', tipo: 'acao',
      nome: 'Ativação fiscal: procuração e-CAC → API Serpro',
      deriva: () => ({ resultado: 'procuração e-CAC → API Serpro (PGDAS-D/DAS automatizado)' }),
    },
    {
      id: 'fim.ativa', bloco: 'FIM', tela: 'N24', tipo: 'gate',
      nome: 'Empresa ativa e operando',
      deriva: () => ({ resultado: 'empresa ativa e operando ✅', termina: 'ativa' }),
    },
  ],

  FISCAL,
  faturamentoMedio,
  proLaboreOtimo,
  inssComFolga,
  economiaSwap,
  validaCPF,
};
