---
tipo: pesquisa
data: 2026-07-15
tags: [fiscal, simples-nacional, fator-r, cnae, bh, compliance, pesquisa]
status: parcial
fontes: oficiais
confianca: alta-exceto-bloco-D
---

# 🔬 Pesquisa fiscal — Simples · ME serviço · BH/MG (2026)

> Pesquisa aterrada em fontes OFICIAIS (deep-research + verificação adversarial, 3 votos/claim). Escopo travado: **Simples Nacional · Microempresa · atividade de SERVIÇO · Belo Horizonte/MG · 2026**. Regra anti-guru: cada achado tem fonte + confiança. **Double-check humano = Larissa (fiscal).** Companheira de [[blocos-fluxo-abertura]] · [[spec-telas-entrada-b1-b2]] · [[cnae-atendidos-e-nao-atendidos]] · [[plano-padrao-195-referencia]].
>
> ⚠️ **Bloco D (valores fiscais vigentes) NÃO foi coberto** — a busca caiu no meio (erro de conexão). Re-rodar dedicado antes de usar número fiscal no app.

## Veredito de topo
Produto viável. A maior parte do enquadramento é **modelável deterministicamente**. Só **1 condicional é fatal** (sócio no exterior). A pesquisa **derruba 3 suposições** (ver §Refutados).

---

## A) Fator R / Anexo III × V — é determinístico por CNAE?
**Achado (🟢 alta):** NÃO é 100% determinístico por CNAE para atividade sujeita a Fator R. Regra: folha dos últimos 12 meses ≥ **28%** da receita bruta 12m → **Anexo III**; abaixo → **Anexo V**. Recalcula **a cada apuração** (janela móvel de 12 meses).
- Base: LC 123/2006 art. 18 §5º-J/K/M · Res. CGSN 140/2018 art. 25-26 · Manual PGDAS-D (limiar 0,28 verbatim). Estável desde LC 155/2016.
- **Pré-classificação PARCIAL possível:** o Manual separa em 3 grupos → (1) **não sujeitas ao Fator R = sempre Anexo III**; (2) **sujeitas ao Fator R = III ou V por cálculo**; (3) **Anexo IV permanente**. No app: filtra por CNAE os grupos "sempre III" e "Anexo IV"; só o grupo Fator-R o motor calcula em runtime.
- **Não existe CNAE de serviço "sempre Anexo V"** — V é só *resultado* do cálculo (<28%), nunca classificação fixa por atividade.
- Fontes: [planalto LC 123](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm) · [Res. CGSN 140/2018](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=92278&visao=compilado) · [Manual PGDAS-D](https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/manual_pgdas-d_2018_v4.pdf)

## B) "Anexos diferentes" (segregação de receita)
**Achado (🟢 alta):** a lei obriga considerar **destacadamente** a receita por atividade — revenda→Anexo I, industrialização→II, serviço→III/IV/V. É esse mecanismo que faz um mesmo negócio ter receita em anexos distintos. LC 123/2006 art. 18 §4º + Res. CGSN 140/2018 art. 25 §1º.
- **Impacto no recorte:** só pesa em empresa **mista** (serviço + comércio). Serviço puro → sem essa mistura.
- **Dado da nossa matriz:** dos **460 CNAEs atendidos hoje, 200 são Anexo I (comércio) e 260 são serviço (III/IV/V\*)** (fonte: `cnae-matriz.csv`, contagem local). Ou seja, a lista atual **não é só serviço** — tem 43% comércio. Isso **contradiz o modelo operacional "só serviço" (13/07)** → decisão pendente: cortar comércio? Ver [[cnae-atendidos-e-nao-atendidos]].

## C) Contabilizei — plano de entrada
**Achado (🟢 alta):** o "~R$195" é o plano **Padrão** (Simples). Lucro Presumido começa em R$239. Faixa ideal **até R$25 mil/mês**. **NÃO é o mais barato: Básico = R$139.** Fonte: [contabilizei/quanto-custa](https://www.contabilizei.com.br/quanto-custa-contabilizei/) · [tabela-planos.pdf](https://www.contabilizei.com.br/assets/pdf/tabela-planos.pdf).
- Nosso "1 plano igual ao 195" = o Padrão, não o piso. Existe régua mais barata (139) se quisermos posicionar abaixo.

## D) Valores fiscais vigentes — ⚠️ NÃO COBERTO
Busca caiu no meio (erro de conexão). **Sem claim verificado** para: salário mínimo 2026, teto INSS, alíquota INSS pró-labore, faixa/tabela IRRF, alíquotas iniciais DAS Anexo III e V, sublimite estadual MG. **Re-rodar dedicado.** (Menção *en passant* não confirmada: sublimite MG ~R$3,6 mi; teto Simples 2026 R$4,8 mi / ME até R$360 mil/ano.)

## E) Passo a passo oficial — abrir ME serviço em BH
**Achado (🟢 alta):** processo digital **integrado, 7 etapas** via JUCEMG/Redesim: (1) Consultar Viabilidade → (2) DBE (Coletor Nacional/Receita) → (3) Módulo Integrador → (4) pagar DAE → (5) Registro Digital (assinatura) → (6) enviar → (7) obter documento registrado.
- **Entrega de uma vez:** registro na Junta + **CNPJ + inscrição municipal + Alvará de Localização** (e Inscrição Estadual se a atividade exigir).
- **Prazo: até 1 dia útil** para serviço de **baixo risco** (BH: 95% dos alvarás = "ALF Imediato", sem vistoria; tempo médio caiu p/ 8h em fev/2025).
- **Certificado digital ICP-Brasil** = pré-requisito das assinaturas (etapa 5).
- **Médio/alto risco** ("ALF Mediante Requerimento", ~5%) ou licenciamento sanitário/ambiental/bombeiros → 15-45 dias (fora do happy path).
- Fontes: [JUCEMG](https://jucemg.mg.gov.br/servicos/14/ABRIR+UMA+EMPRESA) · [Portal MG](https://www.mg.gov.br/servico/solicitar-abertura-de-uma-empresa) · [PBH Alvará](https://prefeitura.pbh.gov.br/empreendedor/abrir-minha-empresa/alvara-localizacao-funcionamento)

## F) Condicionais societárias — quais mordem no recorte?
**Achado (🟢 alta):**
- **Sócio residente/domiciliado no exterior = ÚNICO fatal.** LC 123/2006 art. 17, II impede a opção pelo Simples (a empresa até existe como ME/EPP, mas cai em Lucro Presumido/Real — fora do produto). LC 214/2025 reforçou. → **bloquear + rota humana.**
- **Regime de bens do casamento:** só bloqueia se **ambos os cônjuges na MESMA sociedade**, casados em comunhão universal OU separação obrigatória (art. 977 CC + DREI Ofício 300/2023 + STJ AgInt REsp 1.721.600). Um cônjuge sozinho com terceiro = livre. **Peso prático baixo.**
- **Sócio-CLT, SLU × LTDA, integralização com imóvel** → NÃO desenquadram do Simples.
- Fonte: [DREI Ofício 300/2023](https://www.gov.br/empresas-e-negocios/pt-br/drei/legislacao/oficios-circulares/arquivos/oficio-circular-sei-no-300-2023-mdic.pdf) · LC 123 art. 17.

## G) Obrigações e documentos mensais (ME serviço Simples, sem empregado)
**Achado (🟢 alta):**
- **PGDAS-D (declaração) + DAS (guia) mensais**, até **dia 20** do mês seguinte (prorroga p/ dia útil posterior se dia 20 sem expediente). Res. CGSN 140 art. 40 + LC 123 art. 21.
- **NFS-e de BH migrou para o Emissor Nacional:** ME/EPP do Simples que recolhe ISS via DAS desde **01/11/2025**, rollout total **01/01/2026** (Portaria SMFA 75/2025). O BHISS Digital segue pra DES/AIDF/guias; a **emissão de NFS-e** vai pro Emissor Nacional.
- **Divisão de tarefa:** **NFS-e = usuário emite sozinho** (portal Emissor Nacional). **DAS/PGDAS-D = contador/motor** (exige Fator R + segregação de receita). ⚠️ DAS é federal → **automatizável via API oficial** (Serpro Integra Contador / Integra-SN gera PGDAS-D + DAS); confirmar credencial/procuração eletrônica.
- Fontes: [Manual PGDAS-D](https://www8.receita.fazenda.gov.br/simplesnacional/arquivos/manual/manual_pgdas-d_2018_v4.pdf) · [PBH adesão NFS-e Nacional](https://prefeitura.pbh.gov.br/noticias/belo-horizonte-adere-ao-emissor-nacional-de-nota-fiscal-de-servico-eletronica) · [BHISS](https://prefeitura.pbh.gov.br/fazenda/bhiss)

---

## ❌ Refutados (0-3) — NÃO entram no produto
1. Que o **§5º-D listaria atividades "sempre Anexo III"** (software, laboratório, academia…). Não hardcodar sem mapear §5º-B/C artigo por artigo.
2. Que a **NFS-e "substituiu a DES"** em BH. DES e NFS-e **coexistem** no BHISS.
3. Que os **preços da Contabilizei são exclusivos do Simples**. A mesma grade existe pro Lucro Presumido (R$239). Simples e Lucro Presumido são **regimes distintos**; a Contabilizei (empresa) atende os dois.

## ⚠️ Caveats
- **Sensibilidade temporal:** cronograma NFS-e Emissor Nacional BH atinge rollout total 01/01/2026 (hoje 15/07/2026, já vigente — confirmar sem prorrogação). Res. CGSN sofre emendas frequentes (183/2025, 189/2026); limiar Fator R (28%) e estrutura de anexos permanecem, mas revalidar composição exata da folha.
- **Fontes fracas pontuais:** bloco F citou JUCESC (SC, não MG) como fonte primária de "sócio exterior" — texto legal robusto, mas confirmar direto no planalto. Fetch do planalto falhou (ECONNRESET) em vários momentos; LC 123 confirmada por espelhos oficiais.

## 🔴 Pendências para double-check (Larissa)
1. **Bloco D inteiro** (valores fiscais 2026) — furou, re-rodar.
2. **Lista exata de CNAEs** "sempre III" × "Fator-R" × "Anexo IV" — mapear §5º-B/§5º-C contra `cnae-matriz.csv` (hipótese fácil do §5º-D foi refutada). **Tarefa de cruzamento de dados, factível internamente.**
3. **Fator R para empresa com <12 meses** (janela móvel incompleta) — regra de proporcionalização da Res. CGSN 140 não detalhada. **Relevante: toda empresa nova (nossa cobaia inclusa) começa assim.**
4. **DEFIS anual + eSocial sem movimento** para ME sem empregado — periodicidade e quem transmite não plenamente verificados.

## 💡 Implicações para o motor / spec
- Anexo vira **3 grupos filtráveis** (não `*` aberto) → simplifica B2·2.8 e a matriz CNAE.
- "Anexos diferentes" **encolhe** se cortarmos comércio (decisão pendente: 200 comércio × 260 serviço).
- **Regime de bens despriorizado** (peso baixo).
- **Sócio no exterior = único 🔴 fatal** → guarda-corpo confirmado.
- **B4 (constituição)** ganha o passo-a-passo oficial de BH pronto pra virar schema (happy path baixo risco).

---

# 🔬 Rodada 2 (blocos D re-rodado + H·I·J·K·L·M) — 2026-07-15

## D) Valores fiscais 2026 — núcleo CONFIRMADO (🟢 alta)
| Item | Valor 2026 | Fonte |
|---|---|---|
| Salário mínimo (= piso INSS) | **R$ 1.621,00** | Decreto 12.797/2025 · [INSS gov.br](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal) |
| Teto INSS | **R$ 8.475,55** (reajuste INPC 3,9%) | [INSS gov.br](https://www.gov.br/inss/pt-br/assuntos/com-reajuste-de-3-9-teto-do-inss-chega-a-r-8-475-55-em-2026) |
| Tabela IRRF | 7,5% (R$2.428,81–2.826,65) · 15% (até 3.751,05) · 22,5% (até 4.664,68) · 27,5% (acima). **Redutor Lei 15.270/2025 isenta na prática até ~R$5.000/mês** | [Receita/tabelas 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026) |
| Sublimite Simples MG | **R$ 3.600.000** (todos os estados; NÃO há reduzido pra MG). Limite geral Simples R$4,8M; ME até R$360 mil/ano | Portaria CGSN 54/2025 · [Portal Simples](https://www8.receita.fazenda.gov.br/simplesnacional/noticias/NoticiaCompleta.aspx?id=94c10cc2-7eb5-4ef0-bfb2-5479e72caff8) |

## K) Automação de DAS — VIÁVEL e mapeada (🟢 alta)
- **API oficial Serpro Integra Contador → "Integra PGDAS-D"**: serviços reais **`TRANSDECLARACAO11`** (entregar PGDAS-D) e **`GERARDAS12`** (gerar DAS) + consultar declaração/extrato. Em produção desde 2022. Requer **certificado + credenciamento Serpro**. [Doc Serpro](https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/pt/sistemas/pgdasd/)
- **Procuração eletrônica e-CAC**: delegação granular de serviços ao escritório (opção "todos" cobre futuros); em 2025 o procurador precisa aceitar em "Minhas Autorizações de Acesso". [Serviço gov.br](https://www.gov.br/pt-br/servicos/cadastrar-ou-cancelar-procuracao-para-acesso-ao-e-cac)
- **Concretiza o passo "ativação fiscal" (B4.5):** certificado → procuração e-CAC → integração Serpro que emite DAS/PGDAS-D sozinho. DEFIS anual sai do mesmo módulo.

## J) Risco + Alvará BH — happy path sólido (🟢 alta)
- Classificação: **dispensada / baixo / alto** risco (Decreto municipal 17.245/19 + Lei Liberdade Econômica).
- **Baixo risco (ex: escritório) = ALF IMEDIATO**: 100% eletrônico, sem vistoria, validade 5 anos, ~**96% dos alvarás**. Alto risco/poluente → requerimento. [PBH](https://prefeitura.pbh.gov.br/noticias/prefeitura-de-bh-simplifica-obtencao-de-alvara-de-localizacao-e-funcionamento)
- Caveat: vertical **sanitária (GVISA)** tem "médio risco" à parte (serviço puro normalmente não cai nela).

## M) Viabilidade de nome (JUCEMG) — sem API aberta (🟢 alta)
- Consulta **gratuita, web, login CPF+senha, até 2 dias úteis**; verifica nome + endereço + CNAE + natureza de forma integrada. Precisa **2 opções de nome**, sem "ME/EPP" na consulta. Validade do resultado 6 meses.
- **NÃO é API aberta** → não dá pra checar nome programaticamente por esse canal (é portal autenticado). Impacta o design da **tela 2.7**: ou manda pro portal, ou usa a etapa de Viabilidade do próprio processo de registro (etapa 1 do bloco E).
- Nome: princípios **veracidade + novidade** (CC art.34 · IN DREI/MEMP 1/2025); proteção por UF; reprova idêntico/semelhante na mesma UF. [JUCEMG](https://jucemg.mg.gov.br/servicos/16/CONSULTAR+VIABILIDADE)

## L) Custos de abertura — parcial (🟡 média)
- Tabela de preços JUCEMG **2026 vigente** (atualizada 05/01/2026, RP 02/2025). ME contrato padrão ~**R$268,51** (corroborante, não claim isolada). [JUCEMG tabela](https://www.jucemg.mg.gov.br/tabela_de_precos.html)
- ⚠️ Valores exatos das **taxas municipais BH** + **faixa e-CNPJ** NÃO confirmados.

## ❌ Refutados rodada 2 (não usar)
1. **INSS pró-labore "11% + 20%"** (0-3) — formulação errada; **re-pesquisar a alíquota correta**.
2. **IRRF "isento até R$2.428,80"** (1-2) — em 2026 o **redutor da Lei 15.270/2025** isenta na prática até **~R$5.000/mês**. (Boa notícia: pró-labore mínimo não paga IRRF.)
3. **Alvará BH "mediante requerimento" como padrão** (0-3) — o padrão de baixo risco é **imediato/automático**.

## 🔴 LACUNAS que sobraram (double-check Larissa / 3ª rodada)
- **Bloco H (Fator R 1º ano) — ZERO claims.** Como a Res. CGSN 140/2018 trata empresa recém-aberta sem 12m de folha (proporcionalização)? Composição exata da folha (pró-labore + CPP + FGTS + 13º). **Crítico: toda empresa nova nossa começa assim.**
- **Bloco I (migração de contador) — ZERO claims.** Passo a passo, procuração, DAS/obrigações em aberto, prazos. **Crítico pro flow MIGRAR.**
- **D residual:** alíquota correta de INSS sobre pró-labore + alíquotas iniciais DAS Anexo III (6%?) e V (15,5%?).

## Links
