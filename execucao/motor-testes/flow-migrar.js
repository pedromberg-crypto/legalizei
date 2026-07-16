// flow-migrar.js — FLOW #2: quem JÁ TEM CNPJ e troca de contador.
// Node puro, zero dependência.
//
// ⚠️ Por que este arquivo existe: [[compilado-ux-flow]] listava o flow MIGRAR como blind spot
// desde 15/07 com estas palavras — **"metade do mercado, zero testado"**. E a reordenação do
// flow #1 (cobrança cedo) piorou a lacuna: quem já tem CNPJ **não passa pelo gate de abertura**,
// então o funil inteiro que redesenhamos não se aplica a ele.
//
// 🔴 ACHADO DA CONSTRUÇÃO (16/07): o flow #1 **não tem porta pra cá**. O `entrada.fork` manda
// quem escolhe "já tenho CNPJ" pra `saiu-fluxo` (login) — mas quem quer trocar de contador
// NÃO TEM CONTA. Metade do mercado bate numa porta escrita "faça login". Ver M0 abaixo.
//
// Fonte da lógica: pesquisa/fiscal-simples-bh-2026.md — bloco I (migração) + #14 do CONSOLIDADO:
//   Distrato → TTRT CRC-MG → DBE Evento 232 (atualiza RFB+Sefaz-MG+PBH) → procuração e-CAC nova.
// 🟡 PENDÊNCIA D (fila-Larissa): o nº da resolução CFC (Gemini escreveu "1.590/2020" mas a própria
// lista de refs dele cita CFC 987/2003 e 1493/2015 → possível citação trocada) e o código
// "Evento 232" contra o Coletor Redesim oficial. **Verificar em fonte primária antes de codar
// isso pra valer.** O motor testa a MECÂNICA, não crava a citação.

const base = require('./flow-schema.js');
const { FISCAL, faturamentoMedio, proLaboreOtimo, inssComFolga, validaCPF } = base;

// Fator R na MIGRAÇÃO é diferente da abertura, e é a favor do cliente:
// empresa com 12+ meses usa o **histórico REAL**, sem proporcionalizar (CGSN 140/18 art. 26).
// Ou seja: aqui a conta NÃO é estimativa em cima de faixa — é o número dele.
// É a diferença mais importante entre o flow #1 e o #2, e ela vira argumento de venda.
function fatorRReal(folha12, receita12) {
  if (!folha12 || !receita12) return null;
  return folha12 / receita12;
}

module.exports = {
  id: 'migrar',
  flow_num: 2,
  versao: '0.1.0',
  cobertura: 'Entrada(M0) + M1 diagnóstico do CNPJ + M2 proposta + M3 cobrança + M4 transferência + M5 ativação',

  passos: [
    // ── M0 — Porta de entrada (a que não existia) ────────────────────────
    {
      id: 'm0.fork', bloco: 'ENTRADA', tela: 'N3', tipo: 'escolha',
      nome: 'Fork: "já tenho CNPJ" → MIGRAR (não login!)',
      // 🔴 No flow #1 esta escolha morre em `saiu-fluxo`. Aqui ela é a PORTA.
      // Requer separar 3 coisas que hoje estão coladas num botão só:
      //   "sou cliente" (login) × "tenho CNPJ e quero trocar de contador" (MIGRAR) × "tenho CNPJ e só quero cotar"
      deriva: (ctx) => {
        const e = ctx.respostas.entrada_escolha;
        if (e !== 'ja_tenho_cnpj') {
          return { resultado: 'não é migração', termina: 'saiu-fluxo' };
        }
        return { resultado: 'rota: MIGRAR (troca de contador) — NÃO é login' };
      },
    },

    // ── M1 — Diagnóstico do CNPJ existente ───────────────────────────────
    {
      id: 'm1.cnpj', bloco: 'M1', tela: 'M1', tipo: 'input',
      nome: 'CNPJ + consulta do cartão (o CNAE já existe, não se descreve atividade)',
      // Diferença estrutural do flow #1: aqui NÃO tem entrevista de atividade. O CNAE já está
      // registrado. A IA de mapeamento não roda — a gente LÊ o cartão CNPJ.
      // 🟡 provider da consulta (mesmo pool do CPF) = decisão aberta do Pedro.
      valida: (ctx) => {
        const c = String(ctx.respostas.cnpj || '').replace(/\D/g, '');
        if (c.length !== 14) return 'CNPJ inválido';
        if (ctx.respostas.cnpj_situacao !== 'ativa') return `CNPJ ${ctx.respostas.cnpj_situacao} na Receita → rota humana (não dá pra migrar o que não está ativo)`;
        return null;
      },
      deriva: (ctx) => {
        const r = ctx.respostas;
        return {
          resultado: `CNPJ ativo · CNAE ${r.cnae} · ${r.natureza} · ${r.porte} · no Simples: ${r.no_simples ? 'sim' : 'NÃO'}`,
          dados: { cnae: r.cnae, no_simples: !!r.no_simples },
        };
      },
    },
    {
      id: 'm1.filtro', bloco: 'M1', tela: 'M1', tipo: 'decisao',
      nome: 'Filtro de atendimento (mesmo recorte do flow #1)',
      deriva: (ctx) => {
        const r = ctx.respostas;
        return {
          resultado: `serviço ${r.filtro_servico ? '✓' : '✗'} · Simples ${r.no_simples ? '✓' : '✗'} · ${r.filtro_regulada ? 'REGULADA' : 'não-regulada ✓'}`,
          dados: { servico: !!r.filtro_servico, regulada: !!r.filtro_regulada },
        };
      },
    },
    {
      id: 'm1.veredito', bloco: 'M1', tela: 'M1', tipo: 'gate',
      nome: 'Veredito 🟢/🟡/🔴 (regulada segue na waitlist, decisão 16/07)',
      deriva: (ctx) => {
        const d = ctx.dados;
        let v, termina = null;
        if (d.servico && d.no_simples && !d.regulada) v = '🟢 atende';
        else if (d.regulada) { v = '🟡 waitlist'; termina = 'waitlist'; }
        else { v = '🔴 não atende'; termina = 'comercial-mauro'; }
        return { resultado: v, veredito_b1: v, termina };
      },
    },

    // ── M2 — A proposta (o "teaser" do MIGRAR — e ele é MELHOR) ──────────
    {
      id: 'm2.diagnostico', bloco: 'M2', tela: 'M2', tipo: 'simulador',
      nome: '🎯 Diagnóstico com o número REAL dele (não estimativa)',
      // A grande vantagem do flow #2 sobre o #1: empresa com 12+ meses tem **histórico real**
      // (CGSN 140/18 art. 26 — usa os 12 meses, sem proporcionalizar). No flow #1 o teaser é
      // uma promessa em cima de faixa, e daí nasceu a `promessa-quebrada`. Aqui NÃO: ele
      // informa a folha e a receita dos últimos 12 meses e a conta é a dele.
      // Consequência: `TEASER_PISO` e o risco de promessa quebrada **não se aplicam ao flow #2**.
      deriva: (ctx) => {
        const r = ctx.respostas;
        const fr = fatorRReal(r.folha_12m, r.receita_12m);
        if (fr == null) {
          return { resultado: '🟡 sem histórico informado · diagnóstico vira estimativa (cai no risco do flow #1)' };
        }
        const anexoHoje = fr >= FISCAL.FATOR_R_LIMIAR ? 'III (6%)' : 'V (15,5%)';
        const mensal = r.receita_12m / 12;
        const jaOtimo = fr >= FISCAL.FATOR_R_LIMIAR;
        const ganho = jaOtimo ? 0 : Math.round((FISCAL.ANEXO_V - FISCAL.ANEXO_III) * mensal);
        return {
          resultado: `Fator R REAL ${(fr * 100).toFixed(1)}% (12m: folha R$${r.folha_12m} / receita R$${r.receita_12m}) → hoje Anexo ${anexoHoje}` +
                     (ganho > 0
                       ? ` · 🎯 você paga ~R$${ganho}/mês a mais do que precisa`
                       : ' · seu enquadramento já está certo'),
          dados: { fator_r_real: fr, ganho_mensal: ganho, ja_otimo: jaOtimo },
        };
      },
    },
    {
      id: 'm2.honestidade', bloco: 'M2', tela: 'M2', tipo: 'gate',
      nome: '⚖️ Honestidade: e se não houver nada a ganhar?',
      // Guarda-corpo do flow #2. Se o contador atual dele já faz tudo certo, a resposta honesta
      // é "seu enquadramento está correto" — e aí vendemos SERVIÇO (app, DAS automático,
      // prazo), não economia inexistente. Mesmo princípio do UX-49 do flow #1: o argumento
      // muda, mas nunca some. Vender economia pra quem não tem = a `promessa-quebrada` do #2.
      deriva: (ctx) => ({
        resultado: ctx.dados.ja_otimo
          ? 'sem ganho fiscal · proposta = SERVIÇO (app, DAS automático, sem sumir) · NÃO inventa economia'
          : `proposta = economia real de ~R$${ctx.dados.ganho_mensal}/mês + serviço`,
      }),
    },
    {
      id: 'm2.conta', bloco: 'M2', tela: 'M2', tipo: 'acao',
      nome: 'Criar conta (credencial funcionando) + detecta GOV.BR',
      deriva: (ctx) => ({
        resultado: ctx.respostas.govbr_nivel === 'bronze'
          ? 'conta criada · GOV.BR bronze sinalizado (procuração e-CAC vai exigir prata/ouro)'
          : 'conta criada · entra no checkout',
      }),
    },

    // ── M3 — Cobrança (mesma tese do flow #1: cobra cedo) ────────────────
    {
      id: 'm3.conta_abertura', bloco: 'M3', tela: 'M3', tipo: 'acao',
      nome: 'A conta da migração (não tem taxa de governo!)',
      // Diferença boa: migrar NÃO tem DAE JUCEMG nem TFLF nova. A empresa já existe.
      // O choque de custo do UX-54 (~R$625 na 3ª tela) **não existe aqui** — é só a mensalidade.
      deriva: (ctx) => ({
        resultado: `conta da migração: transferência R$0 · SEM taxa de governo (a empresa já existe) · recorrente: plano ${ctx.respostas.plano || 'base'}`,
      }),
    },
    {
      id: 'm3.aceite', bloco: 'M3', tela: 'M3', tipo: 'gate',
      nome: 'Aceite do contrato (reversível · CDC art.49)',
      valida: (ctx) => (ctx.respostas.aceite === false ? 'contrato não aceito → não avança' : null),
      deriva: () => ({ resultado: 'contrato aceito · GARANTIA VISÍVEL: 7 dias pra desistir (CDC art.49)' }),
    },
    {
      id: 'm3.pagamento', bloco: 'M3', tela: 'M3', tipo: 'pausa',
      nome: 'Pagamento (CPF valida + cartão/boleto/Pix)',
      valida: (ctx) => {
        const r = ctx.respostas;
        if (!validaCPF(r.socio_cpf)) return 'CPF inválido → não cobra';
        if (r.socio_cpf_situacao !== 'regular') return `CPF ${r.socio_cpf_situacao} na Receita → não cobra, roteia`;
        return null;
      },
      deriva: (ctx) => {
        const st = ctx.respostas.pagamento_status || 'pago';
        if (st !== 'pago') {
          return {
            resultado: `CPF regular ✓ · pagamento ${st} · entra no app · transferência travada até compensar`,
            dados: { pagamento_pendente: true },
          };
        }
        return { resultado: 'CPF regular ✓ · pagamento confirmado · entra no app' };
      },
    },

    // ── M4 — A transferência (o coração do flow #2) ──────────────────────
    {
      id: 'm4.pendencias', bloco: 'M4', tela: 'M4', tipo: 'gate',
      nome: '🔴 Auditoria de passivo: o que o contador antigo deixou',
      // 🔥 O risco EXCLUSIVO do flow #2, que a abertura não tem: a empresa chega com passado.
      // O consolidado fiscal (#14) diz: "obrigações do período antigo ficam com o contador
      // anterior" — mas o CLIENTE não sabe disso, e o passivo é DELE, não do contador.
      // Assumir a empresa sem auditar = herdar dívida que a gente não criou e virar o culpado.
      deriva: (ctx) => {
        const r = ctx.respostas;
        const itens = [];
        if (r.das_em_atraso) itens.push(`DAS em atraso (R$${r.das_em_atraso})`);
        if (r.obrigacoes_pendentes) itens.push(`obrigações acessórias pendentes: ${r.obrigacoes_pendentes}`);
        if (r.divida_ativa) itens.push('inscrição em DÍVIDA ATIVA');
        if (!itens.length) {
          return { resultado: 'sem passivo identificado · migração limpa', dados: { passivo: false } };
        }
        return {
          resultado: `⚠️ PASSIVO HERDADO: ${itens.join(' · ')} · mostrado ANTES de assumir · responsabilidade do período antigo é do contador anterior (#14), mas a dívida é da empresa`,
          dados: { passivo: true },
        };
      },
    },
    {
      id: 'm4.distrato', bloco: 'M4', tela: 'M4', tipo: 'acao',
      nome: 'Distrato com o contador antigo',
      deriva: () => ({ resultado: 'distrato formalizado com o escritório anterior' }),
    },
    {
      id: 'm4.ttrt', bloco: 'M4', tela: 'M4', tipo: 'pausa',
      nome: '🔴 TTRT no CRC-MG — depende do contador ANTIGO validar',
      // 🔥 A pausa mais perigosa de todo o produto, e ela não tem irmã no flow #1.
      // O Termo de Transferência de Responsabilidade Técnica: o NOVO contador abre no portal
      // CRC-MG e **o ANTIGO valida**. Ou seja: a migração depende de um terceiro com
      // interesse CONTRÁRIO — ele está perdendo o cliente para nós.
      // Todas as pausas do flow #1 esperam órgão (neutro) ou o próprio cliente. Esta espera
      // um concorrente contrariado. Persona: `migra-refem`.
      // 🟡 nº da resolução CFC a verificar em fonte primária (pendência D).
      valida: (ctx) => (ctx.respostas.ttrt_validado === false
        ? 'contador antigo NÃO validou o TTRT → migração travada por terceiro hostil → rota humana (CRC-MG resolve, mas leva tempo)'
        : null),
      deriva: () => ({ resultado: 'TTRT aberto no CRC-MG · contador antigo validou · responsabilidade técnica transferida' }),
    },
    {
      id: 'm4.evento232', bloco: 'M4', tela: 'M4', tipo: 'acao',
      nome: 'DBE Evento 232 (Alteração do Contabilista) via Coletor Redesim',
      // Atualiza RFB + Sefaz-MG + PBH de uma vez. Assinado com e-CNPJ da empresa.
      // 🟡 código "232" a conferir no Coletor Redesim oficial (pendência D).
      deriva: () => ({ resultado: 'DBE Evento 232 transmitido (atualiza RFB + Sefaz-MG + PBH de uma vez) 🟡 código a verificar' }),
    },
    {
      id: 'm4.procuracao', bloco: 'M4', tela: 'M4', tipo: 'gate',
      nome: 'Procuração e-CAC: revoga a antiga + emite a nova',
      // 🔒 REGRA DURA herdada do flow #1: nunca pedir pra desabilitar o 2FA do gov.br.
      // Exige prata/ouro (detectado no M2). Validade 5 anos. "Restringir processos digitais? → NÃO"
      deriva: (ctx) => ({
        resultado: ctx.respostas.govbr_nivel === 'bronze'
          ? 'GOV.BR upgrade bronze→prata/ouro → procuração antiga REVOGADA + nova emitida (5 anos) · 2FA intacto'
          : 'procuração antiga REVOGADA + nova emitida ao Legalizei (5 anos) · 2FA intacto',
      }),
    },

    // ── M5 — Ativação ────────────────────────────────────────────────────
    {
      id: 'm5.ativacao', bloco: 'M5', tela: 'M5', tipo: 'acao',
      nome: 'Ativação fiscal: API Serpro (mesmo B4.5 do flow #1)',
      deriva: () => ({ resultado: 'procuração e-CAC → API Serpro (PGDAS-D/DAS automatizado)' }),
    },
    {
      id: 'fim.migrada', bloco: 'FIM', tela: 'M5', tipo: 'gate',
      nome: 'Empresa migrada e operando',
      deriva: () => ({ resultado: 'empresa migrada e operando ✅', termina: 'migrada' }),
    },
  ],

  FISCAL,
  fatorRReal,
  faturamentoMedio,
  proLaboreOtimo,
  inssComFolga,
  validaCPF,
};
