---
tipo: fato
status: vivo
data: 2026-08-27
assunto: resultado-pesquisa-cnae-anexos-mei
tags: [pesquisa, cnae, fiscal, simples-nacional, mei, fonte-primaria]
---

# 📥 Resultado — pesquisa fundamentos CNAE/Anexos/Fator R/MEI

> Rodado no Gemini Pro (Google Search) a partir de [[prompt-pesquisa-fundamentos-cnae-anexos-mei]], colado por Pedro em 27/08. Versão abaixo: conteúdo integral, só removi as imagens (fórmulas em base64, inúteis fora do render) e limpei a prosa jurídica mais rebuscada do bloco final. Já **cruzado** contra [[fundamentos-cnae]] (correções aplicadas lá) e contra `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md` (bate, sem contradição — ver nota no fim).

## BLOCO 1 — Anexo III × Anexo V

**Base legal:** Art. 18 da LC 123/2006, operacionalizado pela Resolução CGSN 140/2018. O extinto Anexo VI foi revogado pela LC 155/2016 (fundiu no mecanismo Fator R atual).

- **§ 5º-B** = lista fechada, SEMPRE Anexo III, nunca entra Fator R. Exemplos: creches/pré-escolas, agências de viagem, academias (dança/capoeira/ioga/artes marciais), instalação/manutenção/reparação, **escritórios de contabilidade** (inciso XIV — mesmo sendo atividade intelectual, foi fixado por lei, exceção deliberada).
- **§ 5º-D e § 5º-I** = lista de atividades SUJEITAS ao Fator R (migram III↔V). Exemplos nominais: fisioterapia, arquitetura/urbanismo, medicina (inclusive laboratorial)/enfermagem, odontologia, psicologia/psicanálise/terapia ocupacional/acupuntura/podologia, engenharia/medição/cartografia/topografia, auditoria/economia/consultoria/gestão/organização/controle, jornalismo, publicidade. **Software** (desenvolvimento/licenciamento, inclusive "de prateleira") = Fator R por SC Cosit 59/2022 e 31/2022. Cláusula de varredura no inciso XII do § 5º-I: "outras atividades de natureza intelectual" — pega análogas não nominadas.
- **§ 5º-J**: se folha/receita ≥ 28% → Anexo III (mesmo sendo atividade Fator R).
- **§ 5º-M**: se < 28% → Anexo V.
- 🔑 **Não existe lista oficial de atividades SEMPRE Anexo V.** Anexo V não é mais "destino fixo" desde a LC 155/2016 — é a penalidade condicional de quem não bate 28% nas atividades do § 5º-D/§5º-I. Toda atividade Fator R tem, por definição, a porta aberta pro III se a folha crescer.

## BLOCO 2 — Fórmula do Fator R

Base legal: Art. 26 da Resolução CGSN 140/2018 (regulamenta §§ 5º-J/K/M do Art. 18 da LC 123/2006).

**Fator R = Folha de Salários (12 meses) / Receita Bruta (12 meses)**

- **Numerador (folha, 12 meses, REGIME DE CAIXA):** salários CLT + pró-labore dos sócios (desde que declarado/tributado no IRPF) + CPP (contribuição patronal previdenciária, mesmo embutida no DAS) + FGTS. Só conta o que foi **efetivamente pago/desembolsado** nos 12 meses — provisão contábil ou declaração no eSocial/GFIP sem pagamento não conta (SC Cosit 17/2019). Sem teto pelo limite do salário de contribuição INSS (SC Cosit 24/2020 — a folha inteira entra, sem achatamento). **Exclui** expressamente aluguéis e distribuição de lucros/dividendos (Art. 26 §2º CGSN140 + Art. 18 §26 LC123).
- **Denominador (receita, 12 meses, REGIME DE COMPETÊNCIA):** receita bruta total (mercado interno+externo) pelo momento do fato gerador (faturamento/prestação), não pelo ingresso financeiro.
- **Assimetria caixa×competência (achado importante):** um pico de faturamento (mesmo com inadimplência do cliente) impacta o denominador na hora; um aumento de custo de mão-de-obra só impacta o numerador quando o pagamento sai de fato. Empresa que fatura mais rápido do que paga folha corre risco de cair pro Anexo V sem ter "ficado mais barata" de verdade.
- **Empresa nova (<13 meses):** anualiza — média mensal apurada até o momento × 12 (Art. 26 §§3º-6º CGSN140).
- **Frequência:** recálculo MENSAL, janela móvel de 12 meses (desliza a cada PGDAS-D, não é evento anual fixo).
- **Margem de segurança nos 28%:** 🔑 **não existe margem oficial na lei — é limiar binário, seco, sem faixa de transição.** Mercado (contadores/softwares) usa buffer de 30-32% como prática prudencial pra absorver sazonalidade, não é regra do CGSN/LC123.

## BLOCO 3 — MEI × Simples ME

- **Lista oficial fechada de CNAEs do MEI:** Anexo XI da Resolução CGSN 140/2018 (não o Portal do Empreendedor — ele só espelha a resolução, não cria regra própria). Atualizada por novas resoluções do CGSN.
- **Por que a lista do MEI é mais restrita:** base é o **Art. 100 da Res. CGSN 140/2018 c/c Art. 966, parágrafo único, do Código Civil (Lei 10.406/2002)**. O parágrafo único do 966 exclui do conceito de "empresário" quem exerce profissão intelectual, científica, literária ou artística — MEI é definido como empresário individual monocrático (Art. 966 caput), então toda atividade que o Código Civil classifica como "não-empresarial" (profissão intelectual/técnica/científica) fica de fora do MEI mesmo que sirva perfeitamente pro Simples ME. É filtro jurídico, não filtro de faturamento.
- **10 exemplos confirmados — CNAE serve pro Simples ME mas é vedado ao MEI:**
  | CNAE | Atividade | Por quê barrado |
  |---|---|---|
  | 6201-5/01 | Desenvolvimento de software sob encomenda | Art. 966 CC — obra intelectual |
  | 6911-7/01 | Advocacia | Dupla vedação: Art. 966 CC + Estatuto OAB (Lei 8.906/94) proíbe registro mercantil em Junta Comercial |
  | 8630-5/03 | Medicina ambulatorial | Art. 966 CC — saber científico personalíssimo |
  | 7112-0/00 | Engenharia | Art. 966 CC + prerrogativas CONFEA/CREA |
  | 7111-1/00 | Arquitetura e urbanismo | Art. 966 CC + CAU |
  | 8630-5/04 | Odontologia | Art. 966 CC |
  | 6920-6/01 | Contabilidade | Art. 966 CC — **mesmo estando fixo no Anexo III (§5º-B XIV) pro Simples ME, é vedado ao MEI** |
  | 7020-4/00 | Consultoria em gestão empresarial | Art. 966 CC — produção intelectual incorpórea |
  | 8650-0/04 | Fisioterapia | Art. 966 CC — supervisão clínica intelectual |
  | 7500-1/00 | Atividades veterinárias | Art. 966 CC + zelo biomédico científico |
- **MEI não tem Anexo nem Fator R.** Regime é o Simei (Art. 18-A LC123): valor FIXO mensal, independente de faturamento — 5% do salário mínimo (INSS) + R$1 (ICMS, comércio/indústria) ou R$5 (ISS, serviço). Mês sem faturamento ainda gera cobrança (vira dívida ativa se não pago). Já o Simples ME é marginal/progressivo sobre RBT12 — mês sem faturamento = R$0 de DAS.

## BLOCO 4 — Risco municipal / dispensa de vistoria

- Base: **Lei 13.874/2019 (Liberdade Econômica)**, Art. 3º §1º II — direito nacional ao exercício de atividade "baixo risco" sem licença/vistoria prévia.
- Operacionalizado via CGSIM (Redesim): **Resolução CGSIM 51/2019** (+ 57/2020 e 59/2020, ajustes). Lista positiva de CNAEs em Nível de Risco I no Anexo I da Res. 51/2019.
- Se o município não regulamentar risco por conta própria (ou regulamentar de forma divergente), vale automaticamente a tabela federal da CGSIM 51/2019 — silêncio do município não trava a dispensa.
- **Endereço residencial como "Ponto de Referência":** precisa das DUAS condições juntas — (1) CNAE em Nível de Risco I, (2) atividade exercida na residência **sem recepção de público**. Conceito formal: "Endereço como Ponto de Referência" / "escritório de contato ou virtual" (Res. CGSIM 51/2019).

---

## Cruzamento com o motor `cnae-fiscalmente-otimo.md`

**Veredito: bate, sem contradição.** O motor já modelava corretamente Grupo A (III fixo, §5º-B/§5º-F residual), Grupo B (Fator R, §5º-I) e Grupo C (Anexo IV, §5º-C — fora do escopo desta pesquisa, que não cobriu §5º-C). Esta pesquisa não derruba nenhuma família nem delta do motor — ela **aprofunda o mecanismo** (fórmula caixa×competência, ausência de margem de segurança oficial) e adiciona uma camada nova que o motor ainda não tinha: **MEI é filtro jurídico separado (Art. 966 CC), não é "Simples ME com teto menor"** — inclusive contabilidade (6920-6/01), que é Anexo III privilegiado, é vedada ao MEI. Isso importa se o produto algum dia recomendar MEI como ponto de partida pra CNAEs intelectuais/regulamentados — não pode.

## Referências citadas na pesquisa
Lei Complementar 123/2006 (Planalto) · Resolução CGSN 140/2018 · SC Cosit 17/2019, 24/2020, 59/2022, 31/2022, 27/2021, 303/2019 · Lei 13.874/2019 (Liberdade Econômica) · Resoluções CGSIM 51/2019, 57/2020, 59/2020 · Código Civil Art. 966 (Lei 10.406/2002) · Estatuto da OAB (Lei 8.906/94). Lista completa de URLs no arquivo original (`Tributação Simples Nacional E MEI.md`, salvo pelo Pedro em Downloads, não versionado aqui por conter apenas links).

## Links
- [[fundamentos-cnae]] — atualizado com estas ratificações.
- [[prompt-pesquisa-fundamentos-cnae-anexos-mei]] — prompt que gerou este resultado.
- `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md` — motor cruzado acima, sem contradição.
