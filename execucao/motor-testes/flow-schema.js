// flow-schema.js — o fluxo de abertura como DADOS (derivado de spec-telas-entrada-b1-b2.md).
// Node puro, zero dependência. Cobertura desta versão: Entrada + B1 + começo do B2.
//
// Cada passo é declarativo:
//   id        chave global do passo (aparece na trilha e no livro-caixa)
//   bloco     ENTRADA | B1 | B2 (mapa em mapa-telas-mobile.md)
//   tela      nº da tela na spec
//   tipo      escolha | input | ia-dublada | decisao | gate | acao | toggle
//   nome      rótulo humano
//   pula_se   (ctx) => bool   — condicional mutuamente exclusiva não roda (ex: desambiguação só se ambíguo)
//   valida    (ctx) => null | "mensagem de erro"  — barra e para o fluxo
//   deriva    (ctx) => { resultado, dados?, veredito_b1?, termina? }  — lógica de negócio
//
// IMPORTANTE: a IA de mapeamento CNAE NÃO roda aqui. Vem "dublada" pela persona
// (persona entrega cnae + confiança). Motor testa a LÓGICA do fluxo, sem gastar token.

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
  versao: '0.1.0',
  cobertura: 'Entrada + B1 (gate-cnae / login) + começo do B2 (2.1 sócio, 2.2 CLT)',

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

    // ── B2 — Coleta + Enquadramento (começo) ─────────────────────────────
    {
      id: 'b2.socio', bloco: 'B2', tela: '6', tipo: 'input',
      nome: '2.1 Dados do sócio',
      valida: (ctx) => {
        const r = ctx.respostas;
        if (!validaCPF(r.socio_cpf)) return 'CPF inválido (dígito verificador)';
        if (r.socio_cpf_situacao !== 'regular') return `CPF ${r.socio_cpf_situacao} na Receita`;
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
      nome: '2.2 Duplo vínculo CLT',
      deriva: (ctx) => {
        const r = ctx.respostas;
        return {
          resultado: r.duplo_vinculo_clt
            ? `tem CLT (R$${r.clt_remuneracao || '?'}) · checa teto INSS`
            : 'sem duplo vínculo · pró-labore normal',
        };
      },
    },
  ],

  validaCPF,
};
