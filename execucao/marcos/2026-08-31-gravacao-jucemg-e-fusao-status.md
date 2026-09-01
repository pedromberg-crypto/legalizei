---
tipo: historico
status: vivo
data: 2026-08-31
assunto: gravacao-jucemg-gap-analysis-fusao-status
tags: [marco, flow, jucemg, constituicao, ux, decisao]
---

# 🏁 40º flow — a gravação real da JUCEMG vira produto (31/08 → 01/09)

> O flow mais "fonte-primária" que o produto já teve. Pedro e a Izabela (contadora, Legalize Digital) **rodaram uma constituição de verdade na JUCEMG**, gravando a tela, campo a campo, da viabilidade até a hora de assinar. Duas capturas da mesma reunião (vídeo RS38-40 + áudio Tela 1-2), 141 prints. Tudo que estava documentado no vault foi cruzado contra o que o sistema oficial de fato pede — e uma parte não bateu.

## 1. 🎥 A fonte

- **Reunião Rua Satélite 38-40** (31/08), 2 capturas cruzadas: vídeo (RS38→RS39→RS40) e áudio (Tela 1→Tela 2). Conteúdo idêntico; a captura de áudio rendeu 2 detalhes a mais (ContaAzul citado como concorrente a estudar; confirmação verbal de que "o CNPJ é gratuito").
- **141 prints reais** colados pelo Pedro, mapeados um a um em [[telas-jucemg-mapeamento-prints]] — cada linha traz a tela, a fala/regra da especialista que a justifica, e o print.
- Achados classificados (mantém × ajusta × cria) em [[2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo]].
- **Checklist interativo** publicado pra validar com a especialista: `execucao/checklist-validacao-jucemg.html` (43 campos, etapas 15-18 do processo com responsabilidade nós×cliente, sidebar de exemplos de CNAE liso).

## 2. 🔴 O achado que vale mais que os outros

> **Incluir procuração ou qualquer anexo no processo DERRUBA a elegibilidade ao Registro Automático da JUCEMG.**

Não é opinião nossa nem estimativa de esforço: é aviso do próprio sistema, visto ao vivo. A aprovação deixa de ser imediata e vira análise manual. Isso **encerra o debate sobre a procuração da Junta** — que vinha em aberto desde julho (UX-31) — com argumento técnico. A procuração do e-CAC continua sendo outra história (Receita Federal, pós-CNPJ, e dispensável se o cliente tiver certificado ativo).

## 3. 🐛 O bug que a gravação revelou

O app **nunca perguntava** a regra que decide o deferimento na Prefeitura de BH:

- Endereço em **apartamento** exige que o sócio **resida no local** — senão indefere. Vimos isso ao vivo: a mesma empresa foi de indeferida para deferida mudando só essa resposta.
- No código, a pergunta de residência só renderizava com `SOCIOS > 1`. Ou seja: no caso **mais comum do produto** (dono único, SLU), ela nunca aparecia.
- Pior: o campo "casa ou apartamento" **não existia em lugar nenhum** (`grep -r "apartamento" app/src` = zero).

## 4. 📋 O que mudou na captação de dados

| Onde | O quê |
|---|---|
| **C3 · Sócios** | Sócio extra ganhou a qualificação completa (nascimento, nacionalidade, RG+órgão, estado civil+regime). Tínhamos só nome+% — com 2+ sócios o contrato não podia ser lavrado. Titular ganhou % editável, que redistribui os extras proporcionalmente |
| **C4 · Empresa** | Campo NOVO "casa ou apartamento" (empresa e endereço pessoal). Residência agora vale pra 1 sócio também, e é sempre sobre o TITULAR. Apartamento trava em "sim"; quem não reside informa o endereço pessoal |
| **C4 · Empresa** | Capital social travado em R$10.000, sumiu da tela |
| **C4 · Empresa** | "Endereço virtual" saiu do seletor — é valor fixo do endereço fiscal da Legalizai, não escolha |
| **C6 · Natureza** | REMOVIDA. SLU × LTDA virou decisão interna nos 2 casos. Rota apagada |
| **C0 · Atividade** | Categoria vinda do gate vira chip confirmado; sobra só a descrição livre (é ela que cruza pra achar o CNAE) |

## 5. 📐 `PREENCHIDOS_INTERNAMENTE`: de 3 pra 20

A seção "campos que a gente preenche sem perguntar" tinha 3 entradas — e **2 estavam erradas**:

- Tipo de unidade: documentado "Sede", real **"Produtiva"**.
- Metragem: documentado "não implementado", real **20m² fixo**.

Entraram 16 novos, todos verificados contra print + transcrição: valor nominal de cotas (R$1), qualificação do representante ("49 - Sócio-Administrador"), datas (dia do preenchimento, nunca retroativa), acesso ao endereço (Pedestre), "atividade exercida no local?" (sempre Não — é o que habilita "escritório administrativo"), atividade inócua (Sim), SPE (Não), capital integralizado (Sim), tipo de contrato (Padrão 15 cláusulas), testemunhas (nenhuma), e-mail/telefone (sempre nossos, pra BO não chegar no cliente), endereço de correspondência (igual ao estabelecimento), requerente do DAE (o titular), natureza jurídica (automática), tipo de endereço virtual (fixo).

Vive em `flow-data.mjs` e vira doc gerado — **referência única pra tela E pro backend**, que era exatamente o pedido do Pedro.

## 6. 🔀 A fusão A3 + E9

Pedido literal: *"quando as pessoas clicarem em retomar processo teremos uma tela única de retorno, que é a E9"*.

- `/painel` (A3) e `/aguardando` (E9.1) viraram **a mesma tela**: 12 passos numa jornada só (9 do dossiê + 3 da Junta).
- "Documentação completa preenchida" **saiu** — era redundante com os 9 passos já concluídos logo acima. De 4 etapas voltou a 3.
- `RetomarView` **retirada**: `/retomar` é só a porta de CPF e cai sempre no status.
- Cada passo mostra **sub-descrição** (o que envolve + tempo estimado) quando é a vez dele.
- CTA travado (**"Aguardando compensar"**) enquanto o boleto não cai — antes ficava ativo prometendo algo que o backend recusaria.
- Spinner corrigido: fica no passo "Plano escolhido" (a espera é do banco), não no CNAE.
- Tela nova **`/splash-boleto`** ("Boleto gerado"), simétrica ao splash de pagamento — o boleto ia direto pro status, sem confirmação.
- MEI e Migrar **mantêm pipeline próprio** (nó `A3_M` novo no mapa).

## 7. ✅ Estado

- Mapa **v58**, zero drift no flow de constituição.
- `tsc` e `eslint` limpos. E2E não rodado (regra da auto-memória: só quando pedido).
- 2 commits: `641d5ac` (pesquisa/vault) e `635b8e9` (código), já no `origin/main`.

## 8. 🔜 Falta

- 🔴 **`next build` segue quebrado desde 04/08** (`(portal)/layout.tsx`, `useSearchParams` sem Suspense) — nenhum commit desta rodada tocou nisso.
- 🔴 **Procuração e-CAC precisa mudar de lugar**: hoje está no Passo 16 do checklist, mas e-CAC exige CNPJ já existente — só pode valer depois do Passo 18. Levantado, não movido.
- 🟡 **Endereço do contabilista (PF) usa o endereço do escritório** — dúvida jurídica confirmada visualmente no print, ninguém validou se é correto.
- 🟡 Os PDFs oficiais (DBE e DAE) têm campo de **assinatura física com firma reconhecida** — confirmar com a especialista se isso prevalece sobre a assinatura GOV.BR eletrônica.
- 🟡 Prints do Bloco 3 pararam na tela de escolha de assinatura — falta capturar o clique real em "Assinatura GOV.BR", 2FA, deferimento e liberação do CNPJ.
- 🟡 `/apresentacao` ainda lista C6 como etapa do carrossel (superfície grande, não tocada).
- 🟡 Decidir se/quando o MEI ganha o mesmo tratamento de status unificado.

## Links
- [[2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo]] — nota da reunião
- [[telas-jucemg-mapeamento-prints]] — as 141 telas
- [[dados-coletados-abertura-ate-viabilidade]] — doc gerado, o que o app coleta
- [[decisoes-marca]] — 10 linhas novas de ADR (31/08)
