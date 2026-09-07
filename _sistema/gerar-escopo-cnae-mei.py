# -*- coding: utf-8 -*-
"""Gera app/src/lib/mei-escopo-cnae.ts a partir da matriz CNAE."""
import json, io, re

matriz = json.load(io.open('pesquisa/cnae-matriz/cnae-matriz.json', encoding='utf-8'))
por_cnae = {re.sub(r'\D', '', c['cnae']): c for c in matriz}

src = io.open('app/src/lib/mei.ts', encoding='utf-8').read()
bloco = re.search(r'export const OCUPACOES[\s\S]*?\n};', src).group(0)
cnaes = sorted(set(re.findall(r'cnae: "([^"]+)"', bloco)))
print('cnaes no recorte:', len(cnaes))


def humanizar(t):
    t = (t or '').strip()
    if not t:
        return ''
    # O IBGE inverte pra ordenar ("AUTOMOVEIS COM MOTORISTA; LOCACAO DE").
    if ';' in t:
        cabeca, _, cauda = t.rpartition(';')
        if len(cauda.strip()) <= 40:
            t = cauda.strip() + ' ' + cabeca.strip()
    t = t.lower()
    return t[0].upper() + t[1:]


def esc(s):
    return s.replace(chr(92), chr(92) * 2).replace('"', chr(92) + '"')


faltando, linhas = [], []
for cn in cnaes:
    reg = por_cnae.get(re.sub(r'\D', '', cn))
    if not reg:
        faltando.append(cn)
        continue
    desc = humanizar(reg.get('descricao'))
    ats = [humanizar(a) for a in (reg.get('atividades') or '').split('||')]
    vistos, limpos = {desc.lower()}, []
    for a in ats:
        if a and a.lower() not in vistos:
            vistos.add(a.lower())
            limpos.append(a)
    itens = ', '.join('"%s"' % esc(a) for a in limpos[:6])
    linhas.append('  "%s": {\n    descricao: "%s",\n    cobre: [%s],\n  },'
                  % (cn, esc(desc), itens))

print('sem registro na matriz:', faltando)

CAB = '''/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O ESCOPO DOS CNAEs QUE AS OCUPAÇÕES DE MEI MAPEIAM.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. GERADO a partir de `pesquisa/cnae-matriz/cnae-matriz.json` (campos
 * `descricao` e `atividades`, fonte IBGE), filtrado pelos CNAEs que aparecem
 * em `OCUPACOES` (`lib/mei.ts`). **Não editar à mão**: se a matriz mudar,
 * regerar por `_sistema/gerar-escopo-cnae-mei.py`.
 *
 * ─── 🔴 LEIA ISTO ANTES DE USAR ESTE ARQUIVO ────────────────────────────────
 * Este é o escopo do **CNAE**, e o MEI NÃO pode exercer tudo o que ele abrange.
 *
 * Solução de Consulta Cosit nº 27/2021: existe um **limite externo** (o escopo
 * do CNAE, que é o que está aqui) e um **limite interno** (o conceito estrito
 * da ocupação nomeada no Anexo XI). Se o CNAE cobre 5 atividades e o Anexo XI
 * só nomeou 1 como ocupação, as outras 4 estão PROIBIDAS pro MEI.
 *
 * Por isso todo lugar que renderiza `cobre` é obrigado a rotular a lista como
 * sendo **do CNAE** e a mostrar o aviso do limite interno junto. Decisão do
 * Pedro (07/09): mostrar o escopo real, rotulado, vale mais do que esconder —
 * desde que a ressalva venha grudada. Sem o rótulo, a lista vira uma promessa
 * que a Receita não honra.
 *
 * ─── SOBRE O TEXTO ──────────────────────────────────────────────────────────
 * O IBGE guarda tudo em MAIÚSCULAS e com a ordem invertida pra ordenação
 * alfabética ("AUTOMÓVEIS COM MOTORISTA; LOCAÇÃO DE"). O gerador desinverte e
 * devolve pro caixa normal: maiúscula em bloco grita na tela e se lê pior.
 * Teto de 6 itens por CNAE, senão o sheet vira parede de texto.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EscopoCnae {
  /** O nome oficial do CNAE (IBGE). */
  descricao: string;
  /** O que o CNAE abrange. ⚠️ NÃO é o que o MEI pode fazer. */
  cobre: string[];
}

export const ESCOPO_CNAE: Record<string, EscopoCnae> = {
'''

RODAPE = '''};

/** O escopo de um CNAE, ou `null` se ele não está no recorte. */
export function escopoDe(cnae: string): EscopoCnae | null {
  return ESCOPO_CNAE[cnae] ?? null;
}
'''

io.open('app/src/lib/mei-escopo-cnae.ts', 'w', encoding='utf-8').write(
    CAB + '\n'.join(linhas) + '\n' + RODAPE)
print('gerado:', len(linhas), 'cnaes')
