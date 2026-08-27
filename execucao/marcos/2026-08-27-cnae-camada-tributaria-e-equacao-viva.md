---
tipo: marco
status: vivo
data: 2026-08-27
area: fiscal
impacto: alto
tempo-gasto: 1 dia
tags: [cnae, fiscal, simples-nacional, mei, fator-r, arquitetura]
---

# CNAE: camada tributária completa (4 dados) + provocação da equação viva

Sessão longa em `pesquisa/`, dois blocos: (1) execução — fechar os 4 dados que faltavam na matriz CNAE; (2) conceitual — provocação do Pedro sobre transformar isso numa "equação viva" por CNPJ, ainda sem desenho final.

## Bloco 1 — camada tributária dos 1332 CNAEs (execução, feita e commitada)

Ratificamos `fundamentos-cnae.md` com pesquisa fonte-primária (Gemini), enriquecemos a matriz com `observacoes`/`atividades` direto da API do IBGE (antes só tínhamos 6 campos de taxonomia), e mapeamos os 4 dados que não vêm do IBGE, nessa ordem:

1. **MEI** (Anexo XI CGSN140) — 351/1332 permitem MEI.
2. **Risco municipal** (CGSIM Anexo I, Res. 51/2019) — 284/1332 baixo risco.
3. **Anexo III/IV/V + Fator R** — confirmamos que **não existe crosswalk oficial em lugar nenhum** (nem lei, nem CGSN140, nem PGDAS-D — o manual oficial diz que o contador escolhe manualmente). Classificado via regex contra a descrição oficial IBGE cruzada com os 5 grupos taxativos do Art. 18 LC123 (texto extraído do Planalto, separando manualmente redação vigente de revogada). 481 III-fixo · 47 Fator R dinâmico · 51 Anexo IV · 62 `requer-revisao` (ambíguo, não chutado).
4. **ISS por CNAE (BH)** — aqui EXISTE crosswalk oficial (planilha da Fazenda PBH). 524/1332 com alíquota.

Achado bônus: CGSN140 Anexo VI/VII (101 CNAEs vedados ao Simples inteiro + 21 ambíguos) — achado procurando o crosswalk do item 3.

`cnae-matriz-governo.md` foi promovido a `tipo: verdade` no `_sistema/indice-autoridade.md` (assunto novo: "Dados oficiais por CNAE"). Corrigimos também o vocabulário fechado (`tipo`/`status`) nas 5 notas novas, que tinham inventado tipos fora da lista de 6 do índice de autoridade.

⚠️ **A coluna `anexo_fator_r_grupo` NÃO foi ratificada por contador.** Mesma trava que `cnae-fiscalmente-otimo.md` já exige (Larissa assina) antes de virar verdade de produto.

**Artifact publicado:** [Matriz CNAE](https://claude.ai/code/artifact/5c1e2221-4ffc-40ab-9ab1-64c9ab739b1c) — tabela navegável dos 1332 códigos, busca/filtro por seção/grupo/MEI/risco.

Commits: `80a0a2c` → `8b82b73` (10 commits, `pesquisa(cnae): ...`).

## Bloco 2 — cruzamento com o DER `modelagem-cnae.drawio` (achados, não decisão)

Pedro trouxe um DER (Chen, `modelagem-cnae.drawio`, fora do vault ainda) modelando CNAE/ENQUADRAMENTO/EMPRESA/SIMULAÇÃO DE ENQUADRAMENTO. Cruzamos contra o repo:

- **3 referências do DER nunca existiram**: `regras-cnae-anexos-fator-r.md`, "vault 40-ambiguidades", "divergencias #5" — eram placeholders de intenção. O conteúdo real que resolve a pendência citada está no Bloco 1 acima.
- **Decisão "escopo-anexos-3-e-5" não existe como ADR** em `decisoes-marca.md` (lido inteiro). O motor real (`cnae-fiscalmente-otimo.md`) já modela III, IV e V.
- 🔴 **Achado acionável mais importante:** `app/src/lib/fiscal.ts` (código rodando, outra sessão mexendo nele hoje) só tem constantes pra Anexo III e V — **sem Anexo IV**. Mas achamos 51 CNAEs reais em Anexo IV hoje (construção inteira + limpeza/vigilância + advocacia). Se um usuário escolhe um desses CNAEs, o cálculo fiscal provavelmente sai errado hoje. **Ainda não reportado à sessão de código nem corrigido** — próxima ação real.
- Ponto positivo: `FATOR_R_MARGEM: 0.3` vs `FATOR_R_LIMIAR: 0.28` em `fiscal.ts` já bate com o que ratificamos (28% é limiar legal, 30% é margem de mercado sem previsão oficial).
- `flow-data.mjs`: E5A/E5V/E5.1/E5.2/E5.3/C5 confirmados reais e batendo com o DER. `E5F` (faixa de faturamento) é onde o Fator R começa a ser alimentado no flow. Não confirmamos onde pró-labore é capturado (pergunta em aberto).

Cruzamento **pausado por decisão do Pedro** no meio — não terminamos de propor a v2 do DER.

## Provocação em aberto — "equação fiscal viva" (conceitual, sem desenho final)

Pedro trouxe a ideia de que os 4 dados do Bloco 1 não bastam soltos em colunas — precisam virar uma equação condicional que o **backend** executa sozinho enquanto o usuário só confirma "esse CNAE está bom". Duas camadas:

- **Camada 1** (o Bloco 1 acima): regra estática por CNAE. Muda raramente (governo) — por isso precisa ser **versionada e linkada ao CNPJ do usuário**, com capacidade de identificar quem foi afetado por uma mudança de regra, atualizar em massa e **notificar**. Pedro chama isso de "nossa vigia constante" — uma das ferramentas mais importantes do produto, não nice-to-have.
- **Camada 2** (ainda não mapeada): dado financeiro **mensal** do CNPJ que alimenta a mesma fórmula — pró-labore pago (numerador do Fator R, regime de caixa) e faturamento/NF emitidas (denominador do Fator R + decide a faixa RBT12 da alíquota progressiva). Recalculado todo mês (janela móvel 12 meses, já ratificado em `fundamentos-cnae.md`), não é foto tirada na abertura.

**Validação com caso real:** usamos o CNPJ do próprio Pedro (CNAE 7319-0/04 Consultoria em Publicidade, Fator R dinâmico confirmado, R$10k/mês em NF) como exemplo pra rastrear a cadeia manualmente. Pedro depois mostrou o "Central de Sócios" da Contabilizei (print), que já calcula o pró-labore ótimo automaticamente todo mês — confirma que essa é feature esperada no mercado, e bate com 2 coisas que já existiam no vault sem estarem conectadas: `cnae-fiscalmente-otimo.md` já lista "pró-labore ótimo (B2.8)" como ✅ construída, e o próprio DER já tinha os campos `pró-labore escolhido` e `pró-labore ótimo` separados.

**Decisão de produto ainda não tomada:** hoje o app deixa o usuário escolher o pró-labore livremente. Três caminhos possíveis (livre / automático como a Contabilizei / guiado com sugestão) — não decidido, é o próximo ponto de discussão.

## Ficou em aberto

- Fusão de `cnae-complexidade-abertura.md` + `cnae-liso-servico.md` num arquivo só — **pedida pelo Pedro, ainda não feita** (pausamos antes de chegar nela pro cruzamento do DER).
- Cruzamento com `contabilizei-cnae-completo.csv` — **descartado por decisão do Pedro** (cruzar dado nosso, fonte primária, contra dado do concorrente de origem incerta só gera dúvida, não confiança).
- Mapear quais variáveis do CNPJ (camada 2) são diretamente controladas pelo uso/definições dentro do nosso próprio app — pedido pelo Pedro, não iniciado.
- Reportar o gap de Anexo IV em `fiscal.ts` pra quem está codando.
- Decidir o caminho do pró-labore (livre/automático/guiado).

## Links
- [[fundamentos-cnae]] · [[resultado-pesquisa-fundamentos-cnae-27-08]] · [[lc123-art18-anexos-taxativo]] · `pesquisa/cnae-matriz/cnae-matriz-governo.md` · `execucao/cnae-fiscalmente-otimo.md` · [[estado-atual-pesquisa-cnae]]
