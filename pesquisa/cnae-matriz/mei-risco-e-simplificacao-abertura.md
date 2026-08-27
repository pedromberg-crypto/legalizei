---
tipo: fato
status: vivo
data: 2026-08-27
assunto: mei-risco-simplificacao
tags: [pesquisa, cnae, mei, risco, fonte-primaria, lc123]
---

# 🏠 MEI e risco/alvará — a abertura é mais simples, mas não é isenta de regra

> Pergunta do Pedro (27/08): existe MEI que não é "baixo risco"? A abertura do MEI dispensa vistoria/alvará sempre, a ponto de podermos atender qualquer MEI de serviço sem checar risco? Pesquisado direto no texto da LC 123/2006, Art. 18-A (bloco inteiro do MEI).

## Resposta curta
**Não.** MEI **não é isento** da classificação de risco (CGSIM) — usa o **mesmo framework** que ME/EPP. O que muda é **velocidade de registro**, não **exigência de operação**.

## Confirmado com dado real (matriz)
```
351 CNAEs permitem MEI
→ 156 (44%) são baixo risco CGSIM
→ 195 (56%) NÃO estão na lista federal de baixo risco
```
195 dos 351 são majoritariamente fabricação de alimento (laticínios, conservas, farinha, açúcar), agropecuária, buffet/eventos, transporte coletivo — atividades que plausivelmente exigem vigilância sanitária ou corpo de bombeiros **mesmo sendo MEI**.

## O que a lei diz, artigo por artigo (Art. 18-A, LC 123/2006)

- **§18**: *"Os Municípios somente poderão realizar o cancelamento da inscrição do MEI caso tenham regulamentação própria de classificação de risco... em conformidade com esta Lei Complementar e com as resoluções do CGSIM."* → confirma: risco do MEI segue o **mesmo CGSIM** que ME. Não existe classificação de risco paralela e mais frouxa exclusiva pro MEI.
- **§19-B**: conselhos profissionais são vedados de exigir registro do MEI **quando a ocupação não exigir registro profissional da pessoa física** — reforça que o eixo "exige conselho" (5º dado, [[profissoes-regulamentadas-conselhos]]) continua valendo igual pro MEI.
- **§25**: *"O MEI poderá utilizar sua residência como sede do estabelecimento, quando não for indispensável a existência de local próprio para o exercício da atividade."* — **achado real de diferença**: esse texto **não condiciona à classificação de risco** (diferente da regra geral CGSIM Res. 51/2019 pra ME, que exige Nível de Risco I **e** ausência de recepção de público). Pro MEI é um direito estatutário mais direto — só depende de "não ser indispensável local próprio", não do risco do CNAE.
- **Art. 7º, §único, II** (regra geral, não é só MEI): mesmo em atividade de **alto risco**, o Município **pode** (discricionário, "poderá") emitir Alvará de Funcionamento Provisório se for na residência do empreendedor "na hipótese em que a atividade não gere grande circulação de pessoas" — vale pra MEI e ME igual, não é vantagem exclusiva do MEI.
- **Art. 6º, §4º** (regra geral): baixo risco = licenciamento por **simples declaração**, sem comprovação prévia — de novo, regra geral (CGSIM), não MEI-exclusiva.

## O que É genuinamente mais simples no MEI (fonte primária)
1. **Registro instantâneo (CCMEI no mesmo dia)**, independente do risco da atividade — a velocidade do CNPJ não é bloqueada por vistoria prévia (isso é da inscrição, não da operação legal depois).
2. **§13**: dispensado de RAIS, de declarar ausência de fato gerador ao FGTS, de parte das obrigações do art. 32 IV da Lei 8.212/91 — simplificação administrativa/trabalhista, não de risco físico.
3. **§25**: direito de usar a residência como sede sem o duplo requisito (risco + sem-recepção) que a regra geral do CGSIM exige pra ME.

## O que NÃO é mais simples
- Atividade de **alto risco continua exigindo vigilância sanitária/corpo de bombeiros mesmo sendo MEI** — a inscrição sai rápido, mas a legalidade de **operar** sem a licença, não. Confirmado por fonte secundária (blogs de contabilidade) consistente com o texto legal: "atividades de alto risco (manipulação de alimentos, estética invasiva, tatuagem) ainda exigem licenciamento da Vigilância Sanitária."

## Conclusão prática pro produto
O filtro `risco_baixo_cgsim` continua sendo o critério certo pro MEI, **igual usamos pro ME**. Os 58 CNAEs "MEI que atendemos com certeza" (ver [[profissoes-regulamentadas-conselhos]] e [[cnae-liso-servico]]) **seguem válidos como estão** — não precisam de correção, e não dá pra expandir isso pros outros 195 MEI "de risco não confirmado" sem tratar vigilância/alvará como etapa própria do fluxo (fase posterior, mesmo padrão que já existe pra regulamentados).

## Links
- [[profissoes-regulamentadas-conselhos]] · [[lc123-art18-anexos-taxativo]] · [[cnae-matriz-governo]]
