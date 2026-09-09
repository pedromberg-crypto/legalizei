---
tipo: derivado
status: vivo
data: 2026-08-04
assunto: validacao-cruzada-fiscal-e-flow
deriva_de: [fiscal-simples-bh-2026, cnae-matriz-governo, mapa-mental-mockup, legalize-mvp-so-servico-cnae]
tags: [fiscal, cnae, jucemg, gemini, validacao, cruzamento]
---

# 🔬 Cruzamento — `Fluxo GEMINI.md` × nosso vault (mapa + pesquisa fiscal)

> Fonte externa: `C:\Users\pedro\Desktop\Fluxo GEMINI.md` (blueprint Gemini: CNAEs V1, motor Fator R, jornada JUCEMG/PBH, PRD de dados). Cruzado contra `execucao/mapa-mental-mockup.md` (telas+conexões reais do app) + `pesquisa/fiscal-simples-bh-2026.md` (fonte-verdade fiscal, já ela própria cruzada com 2 outras pesquisas Gemini em 15/07) + `pesquisa/cnae-matriz/*.csv`. **Método de pagamento**: o Gemini não cobre, ignorado por instrução — nosso flow já tem (E6–E9).

## 📋 Tabela de observações e validações

| # | Ponto | Nosso vault diz | Gemini diz | Validação |
|---|---|---|---|---|
| 1 | **Limiar Fator R** | 28% (`FISCAL.FATOR_R_LIMIAR`, `fiscal.ts`) | 28% | ✅ **Convergem 100%** |
| 2 | **Alíquota inicial Anexo III / V** | 6,00% / 15,50% (`fiscal-simples-bh-2026.md` bloco D-resíduo, `fiscal.ts`) | 6% / 15,5% | ✅ **Convergem 100%** |
| 3 | **INSS sobre pró-labore** | 11% direto (não 11%×20%), teto R$8.475,55 | 11% (implícito no cálculo do exemplo R$20k) | ✅ **Convergem** |
| 4 | **CPP patronal 20%** | dentro do DAS nos Anexos III/V, sem guia separada | não mencionado (mas Gemini também não soma CPP à parte no exemplo) | ✅ Consistente, sem conflito |
| 5 | **Break-even Simples × Lucro Presumido** | 🕳️ **Não existe hoje no vault** — só a saída `/saida/exterior` registra "sem cotar Lucro Presumido, depende do Mauro" | Anexo III puro vale até ~R$120k/mês · Anexo V c/ Fator R até R$50-70k/mês · Anexo V sem Fator R → Presumido fica mais barato **a partir de R$25k/mês** | 🆕 **DADO NOVO, valioso.** Cobre exatamente o gap [[legalize-escopo-mei-lucro-presumido-aberto]] já registrado. **Não travar sem Larissa** — Gemini não citou fonte/norma pra esses 3 números (aliq. ISSQN PBH 2-5% embutida no cálculo, mas sem link). Confiança 🟡. |
| 6 | **Passo a passo oficial de abertura (JUCEMG/PBH)** | 7 etapas: Consultar Viabilidade → DBE → Módulo Integrador → pagar DAE → Registro Digital → enviar → obter documento (`fiscal-simples-bh-2026.md` item E, fonte JUCEMG+Portal MG) | 5 etapas: Consulta prévia (endereço+nome) → DBE → Registro JUCEMG (minuta+assinatura) → Inscrição municipal CadWeb → Opção tributária+NFS-e | ⚠️ **Não é contradição, é agregação diferente.** Gemini funde "pagar DAE + Registro Digital + enviar + obter documento" num único passo 3; e adiciona um passo explícito que o nosso não nomeava — **"Inscrição Municipal via CadWeb PBH + emissão de dispensa de alvará"** como etapa própria (nosso item E cita "Alvará" só como parte do "entrega de uma vez", não como sistema/portal nomeado). **Ação:** incorporar "CadWeb PBH" como nome do sistema no schema do motor, hoje genérico. |
| 7 | **Chave/índice cadastral do IPTU** | Coletado em C4 (`/dossie/empresa`), campo "Índice cadastral do IPTU" obrigatório desde 28/07 (`wizard-dossie.tsx:724`) — **sem validação de tamanho** | Exige explicitamente **11 dígitos**, usado já na **Consulta de Viabilidade** (1º passo, pré-DBE) | ⚠️ **2 achados:** (a) campo existe e é obrigatório ✅, mas falta validar 11 dígitos — hoje aceita qualquer string não-vazia (`iptu.trim() !== ""`); (b) **sequência diverge de propósito**: Gemini coleta o IPTU ANTES do DBE (pré-pagamento, no fluxo dele); nós coletamos em C4, **depois do pagamento** (E9), porque a Constituição (C1-C7) é toda pós-cobrança por decisão de produto. Não é erro — é o front-load que já cobramos antes do TTRT ([[legalize-flow-2-migrar-construido]]), aplicado aqui: só pedimos o que é estritamente necessário pra pagar (E6), o resto é dossiê. Mas **vale confirmar com Larissa se dá pra rodar a consulta de viabilidade só com o dossiê fechado** (nosso caso) ou se atrasa o prazo de "1 dia útil" que o próprio vault já cravou. |
| 8 | **Matriz de responsabilidades (usuário × automação)** | Espalhada em notas de tela (E6 front-load, C1 "só o que faltou", A3 timeline automática) | Tabela explícita 1 linha por etapa (Onboarding/Viabilidade/JUCEMG/Municipal/Certificado) | 🆕 Gemini estrutura melhor essa visão (é literalmente um PRD); vale portar o **formato de tabela**, não o conteúdo (o nosso já é mais fino: divide MEI×ME, front-load 28/07, etc. que o Gemini não sabe que existe) |
| 9 | **"Pasta Digital" / documentos entregáveis** | `/mais/documentos` hoje mocka 3 grupos: Constituição (contrato social, certificado MEI/ME, cartão CNPJ), Certidões (CND federal, inscrição municipal), Fiscais (guia DAS, relatório) | 7 entregáveis: Contrato Social · Cartão CNPJ · Inscrição Municipal CTM · **Certificado de Dispensa de Licenciamento/Alvará** · **Termo de Deferimento da Opção pelo Simples Nacional** · Credenciamento/API NFS-e · Certificado Digital e-CNPJ A1 | 🔴 **GAP REAL:** faltam 2 documentos na tela mockada — **Certificado de Dispensa de Licenciamento (Alvará)** e **Termo de Deferimento do Simples Nacional**. Ambos são documentos que o cliente vai querer baixar/mostrar (ex.: pra abrir conta PJ em banco) e hoje não têm linha na lista. O e-CNPJ **não é gap** — já mora em `/mais/certificado` de propósito ("certificado tem casa própria", comentário no código). Credenciamento API NFS-e não é documento de cliente, correto ficar de fora. |
| 10 | **Escopo de CNAE (o que atendemos)** | 387 CNAEs mapeados (`cnae-matriz.csv`), 260 serviço; recorte "liso/verificar/tato" com **103 CNAEs "liso" = happy path MVP** (`cnae-liso-servico.csv`), já com `fator_r` sim/não por código | 4 clusters nomeados (Tech · Marketing/Criativos · Consultoria/BPO · Educação online), **~24 CNAEs no total** | ✅ Nosso é **muito mais completo em amplitude** (103 vs 24) — Gemini é um recorte editorial de "verticais-alvo", não uma varredura. Nenhum dos 24 do Gemini contradiz o nosso `fator_r`; ver linha 12. **Veredito: nosso dataset é a base, o do Gemini serve só como checklist de prioridade de GTM (quais clusters vender primeiro).** |
| 11 | **Critérios de exclusão (o que NÃO atendemos)** | Comércio cortado (Anexo I, standby) + risco alto/médio mapeado em `cnae-complexidade-abertura` (CGSIM Res. 51) + profissões regulamentadas tratadas como saída dedicada (`/veredito/waitlist`) | Mesmos 4 critérios: comércio/indústria (Seções A-E,G) · conselhos de classe · alto/médio risco · estabelecimento físico | ✅ **Convergem 100%** — o Gemini não trouxe critério novo aqui, só confirma o que já travamos 15/07 ([[legalize-mvp-so-servico-cnae]]) |
| 12 | **Enquadramento por CNAE específico** (checagem código a código dos 24 do Gemini contra `cnae-liso-servico.csv`) | ver tabela abaixo | ver tabela abaixo | ⚠️ **1 erro encontrado no Gemini** — ver linha 13 |
| 13 | **7410-2/02 rotulado errado no Gemini** | Nosso dado (IBGE oficial, `cnae-matriz.csv`): `7410-2/02` = **"Design de interiores"** | Gemini escreve: `7410-202` = **"Design gráfico, UX/UI e web design"** | 🔴 **Erro factual do Gemini.** Web design de verdade é `6201-5/02` (já no nosso `cnae-liso-servico.csv`, `fator_r: sim`); "design gráfico" genérico cairia em `7410-2/99` (atividades de design não especificadas). Se algum código do produto usar o Gemini como fonte pra classificar CNAE, **não copiar esse código-descrição sem checar o IBGE.** |
| 14 | **Distrato / TTRT / migração de contador** | Coberto em profundidade (`fiscal-simples-bh-2026.md` bloco I: Distrato → TTRT CRC-MG → DBE Evento 232 → procuração e-CAC), com 2 pendências marcadas 🟡 pra Larissa (nº resolução CFC, código Evento 232) | **Não coberto** — o `Fluxo GEMINI.md` não fala de migração/flow #2 em nenhum sprint | ➖ Fora do escopo do doc Gemini, não é gap dele — só confirma que **nosso doc é o único que cobre o caminho Migrar** |

## 🧬 Cross-check código a código (os 24 CNAEs do Gemini vs `cnae-liso-servico.csv`)

| CNAE (Gemini) | Descrição (Gemini) | Enquadramento (Gemini) | `fator_r` no nosso dataset | Match? |
|---|---|---|---|---|
| 6201-501/502 | Dev. sob encomenda | Anexo V (Fator R→III) | sim | ✅ |
| 6202-300 | Dev. customizável | Anexo V (Fator R→III) | sim | ✅ |
| 6203-100 | Dev. não-customizável | Anexo V (Fator R→III) | sim | ✅ |
| 6204-000 | Consultoria TI | Anexo V (Fator R→III) | sim | ✅ |
| 6209-100 | Suporte técnico TI | Anexo III | não | ✅ |
| 6311-900 | Tratamento de dados/hosting | Anexo III | sim | ⚠️ Gemini crava "Anexo III" fixo; nosso dataset marca `fator_r: sim` (III/V, depende do cálculo) — **nosso é mais correto tecnicamente** (não existe CNAE de serviço "sempre V", mas "sempre III" também não deveria existir se sujeito a Fator R; a lei olha a ATIVIDADE, não o código) |
| 6319-100 | Portais/conteúdo | Anexo III | sim | ⚠️ mesma observação da linha acima |
| 7311-400 | Agências de publicidade | Anexo III | sim | ⚠️ mesma observação |
| 7319-002 | Promoção de vendas | Anexo III | não | ✅ |
| 7319-003 | Marketing direto | Anexo III | não | ✅ |
| 7319-004 | Consultoria em publicidade | Anexo V (Fator R→III) | sim | ✅ |
| 7410-202 | "Design gráfico/UX/web design" | Anexo V (Fator R→III) | sim (mas descrição real = Design de interiores) | 🔴 ver linha 13 — código certo, **descrição errada** |
| 7420-001 | Fotografia (exceto aérea) | Anexo III | não | ✅ |
| 5911-199 | Produção de vídeo | Anexo III | não | ✅ |
| 9001-906 | Sonorização/iluminação | Anexo III | não | ✅ |
| 7020-400 | Consultoria em gestão | Anexo V (Fator R→III) | sim | ✅ |
| 8211-300 | Apoio administrativo/BPO | Anexo III | não | ✅ |
| 8219-999 | Preparação de documentos | Anexo III | não | ✅ |
| 8291-100 | Cobranças/inf. cadastrais | Anexo III | não | ✅ |
| 8299-799 | Outras ativ. de apoio | Anexo III | não | ✅ |
| 7320-300 | Pesquisa de mercado | Anexo III | sim | ⚠️ mesma observação da 6311 |
| 8599-604 | Treinamento profissional/gerencial | Anexo III | não | ✅ |
| 8599-699 | Outras ativ. de ensino | Anexo III | não | ✅ |
| 8592-901 | Ensino de arte/cultura | Anexo III | sim | ⚠️ nosso dataset diz `sim` (III/V) pro código exato 8592-9/01 (Ensino de dança); os irmãos 8592-9/02/03/99 são `não` (sempre III). Gemini generalizou "Ensino de arte e cultura" pro grupo todo — **se o cliente descrever "dança" especificamente, o enquadramento certo é III/V, não III fixo como o Gemini sugere.** |

**Resumo do cross-check:** 17 de 24 batem 100%. 7 têm nuance (Gemini simplificou pra "Anexo III fixo" onde a lei na verdade sujeita a atividade ao cálculo do Fator R — o nosso dataset, que já reflete o cruzamento de 15/07 com a Res. CGSN 140/2018, é o mais correto tecnicamente nesses casos). 1 tem erro de rotulagem (código × descrição, linha 13).

## ✅ Veredito — qual documento é mais completo

- **Fiscal (valores, fórmulas, passo a passo legal):** os dois convergem quase 100% onde se sobrepõem. Nosso `fiscal-simples-bh-2026.md` é mais **rastreável** (cada fato com norma+URL+confiança 🟢/🟡); o Gemini novo traz **1 dado genuinamente novo e útil** (break-even Presumido, linha 5) que não existia no vault — vale abrir como 🟡 fila-Larissa, não travar.
- **CNAE (cobertura):** nosso `cnae-matriz.csv`/`cnae-liso-servico.csv` é **ordens de grandeza mais completo** (103-387 vs 24) e tecnicamente mais correto nos casos Fator R que o Gemini achatou. O valor do Gemini aqui é **priorização de GTM** (4 clusters-alvo), não dado fiscal.
- **Flow/telas (captação de dados, passo a passo do produto):** nosso `mapa-mental-mockup.md` é a única fonte que cobre **telas reais + o caminho Migrar inteiro**, que o Gemini não tem. O Gemini contribui 2 achados acionáveis: **(1)** faltam 2 documentos na tela `/mais/documentos` (Alvará + Termo de Opção Simples) e **(2)** falta validação de formato (11 dígitos) no campo de IPTU.
- **Nenhuma contradição dura encontrada** — só 1 erro de rotulagem (linha 13) e simplificações esperadas de um documento mais enxuto.

## 🔴 Ações concretas que saem daqui
1. ✅ **Aplicado 04/08** — Adicionadas **Certificado de Dispensa de Licenciamento** e **Termo de Deferimento do Simples Nacional** à lista mock de `/mais/documentos`.
2. ✅ **Aplicado 04/08** — Campo `iptu` de `wizard-dossie.tsx` agora valida um piso de dígitos (10) em vez de só checar não-vazio. 🟡 formato exato (10-12 dígitos) segue sem confirmação — não travei em "11" porque nem o Gemini citou fonte, nem nosso mock (`dossie/mock.ts`) usa esse número (usa 12).
3. Levar break-even Simples×Presumido (linha 5) pra fila-Larissa antes de usar em produto — reabre [[legalize-escopo-mei-lucro-presumido-aberto]]. **Não aplicado** (é decisão de dado/negócio, não de tela).
4. Nomear "CadWeb PBH" explicitamente no schema do motor de testes, como sistema da etapa de inscrição municipal (hoje genérico). **Não aplicado** — a tela `/migrar/transferencia` já nomeia "Prefeitura de Belo Horizonte" na etapa (ver [[cruzamento-gemini-fluxo-migracao]] ação 5), mas o motor (`flow-migrar.js`) ainda não foi tocado.
