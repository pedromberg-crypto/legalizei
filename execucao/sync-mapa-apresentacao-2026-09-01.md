---
tipo: verdade
status: vivo
data: 2026-09-01
assunto: sincronia-mapa-apresentacao
tags: [execucao, flow, mapa, apresentacao, auditoria]
---

# 🔗 Mapa × Apresentação — auditoria de sincronia (01/09)

> Pedido do Pedro: *"valide se o MAPA está devidamente conectado à APRESENTAÇÃO e se todas as telas de MAPA estão em APRESENTAÇÃO e vice-versa"*. Este doc é o resultado, com o método pra repetir.

## Como a auditoria roda

Compara, por ROTA, duas listas:
- **mapa** = nós de `execucao/flow/flow-data.mjs` que têm `rota`
- **apresentação** = `ROTA_POR_MOMENTO` em `app/src/app/apresentacao/page.tsx`

E cruza as duas com as rotas que EXISTEM de verdade (varredura dos `page.tsx` em `app/src/app`). São 3 perguntas, não 2:
1. tela do mapa que a apresentação não mostra;
2. tela da apresentação que o mapa não registra;
3. **rota citada que não existe no app** (o link "abrir a tela real" que dá 404).

## Resultado — antes

| Pergunta | Achados |
|---|---|
| Mapa sem apresentação | 3 — `E3.1 /login`, `E4.2b.1 /saida/regime-nao-suportado`, **`E9.SB /splash-boleto`** |
| Apresentação sem mapa | 5 — `fora-bh`, `fora-bh-enviado`, `saida-exterior`, `saida-socios`, `saida-socio-pj` |
| Rotas mortas citadas | **5** — `/saida/fora-bh`, `/saida/exterior`, `/saida/socios`, `/saida/socio-pj` (a pasta `saida/` só tem cnpj-inapto, mei-outra-empresa, mei-servidor e regime-nao-suportado) |

**O que isso significava na prática:** quem passasse a apresentação e clicasse em "abrir a tela real" nessas 5 saídas caía num 404. Não era tela errada — era link pra tela que deixou de existir quando os gates viraram inline (fora-de-BH virou E3.4.1 em 30/08; as 3 saídas de sócio viraram um card informativo com escape inline em 29/08, nó E5T.1). Ninguém tinha corrigido o ponteiro.

## Resultado — depois

| Pergunta | Achados |
|---|---|
| Mapa sem apresentação | 2, **deliberados** (ver abaixo) |
| Apresentação sem mapa | 0 |
| Rotas mortas citadas | 0 |

### O que foi feito
1. **`E9.SB · Splash boleto` entrou na apresentação.** Existia no mapa desde 31/08 e nunca tinha sido adicionada: é a tela de quem paga por BOLETO (o par simétrico do E9.S). Entrou no carrossel, na narrativa de UX e no roteamento da demo — inclusive o `onPagar` do E9, que mandava boleto direto pro status.
2. **As 5 rotas mortas foram repontadas** pros gates reais: `fora-bh*` → `/endereco?simular=fora-bh`; as 3 saídas de sócio → `/gate?etapa=triagem&simular=socio-nao-encaixa`.
3. **A3.2 (certificado) saiu da apresentação** junto com a remoção do caminho ME (decisão do Pedro, 01/09). Continua no ramo MEI (`m-certificado`).
4. **C6 (natureza jurídica) saiu** do carrossel, do roteamento e da narrativa — a rota tinha sido apagada em 31/08 e a demo ainda mostrava a tela.

### As 2 ausências que ficam, de propósito

| Nó | Rota | Por que não está na apresentação |
|---|---|---|
| `E3.1` | `/login` | É a saída pro PORTAL de quem já é cliente, não uma tela da constituição. A apresentação é a leitura da jornada de abertura; o portal tem mapa próprio (`mapa-portal-mermaid.md`). |
| `E4.2b.1` | `/saida/regime-nao-suportado` | Saída de Lucro Presumido, ramo Migrar. A apresentação já cobre as saídas do ramo abrir; esta depende do payload próprio da tela e entra quando o ramo Migrar for revisado inteiro. |

Se qualquer uma virar prioridade, o custo é baixo: as duas telas já existem em produção.

## Como repetir

O script está inline no histórico da sessão de 01/09 e é curto: ler `flow-data.mjs` com regex de `id/rota/label/status`, ler `ROTA_POR_MOMENTO`, normalizar removendo querystring, e varrer `app/src/app` atrás de `page.tsx`. Vale transformar em `execucao/flow/verificar-apresentacao.mjs` quando a checagem virar rotina — hoje o `gerar-mapa.mjs` só acusa drift de rota × mapa, não de rota × apresentação.

## Links
- [[mapa-flow-mermaid]] (gerado)
- [[handoff-dev-2026-09-01-constituicao-me]]
- [[decisoes-marca]]
