---
tipo: fato
status: vivo
data: 2026-08-27
assunto: cnae-conselhos-profissionais
tags: [pesquisa, cnae, regulamentacao, conselhos, fonte-primaria]
---

# ⚖️ Profissões regulamentadas (conselho de classe) por CNAE — 5º dado

> Quinto dado que faltava pra decidir com segurança "quais CNAEs atendemos" (item pedido pelo Pedro em 27/08, depois de fechar os 4 dados fiscais em [[cnae-matriz-governo]]). Diferente dos outros 4: **não é regime fiscal (Receita/CGSN)**, é regulação profissional (conselhos de classe) — decide se abrir a empresa depende de um responsável técnico registrado, independente de Anexo/Fator R/MEI/risco municipal.

## A lei-âncora

**Lei 6.839, de 30/10/1980**: exige que empresas se registrem no conselho de classe correspondente à sua **atividade básica** — mesmo padrão jurídico dos outros 4 dados ("não é por CNAE, é por atividade"). Confirmado via jurisprudência real (CRA-RJ, CRA-BA): "o critério condutor da inscrição junto ao conselho profissional é a atividade básica e não a CNAE."

## Método
Compilação de profissões regulamentadas clássicas (título protegido ou atividade reservada por lei federal), cada uma com o conselho e a lei de regência, cruzada via regex contra a `descricao` oficial IBGE de cada CNAE (mesmo método do Anexo/Fator R — só descrição, não `observacoes`/`atividades`, pra evitar contaminação por referência cruzada a outros códigos).

## Lista de profissões regulamentadas usada (fonte + confiança)
| Conselho | Lei | Confiança |
|---|---|---|
| OAB (advocacia) | Lei 8.906/1994 | alta |
| CAU (arquitetura e urbanismo) | Lei 12.378/2010 | alta |
| CREA (engenharia, agronomia, geologia, cartografia/topografia/geodésia, desenho técnico, testes/análises técnicas) | Lei 5.194/1966 | alta |
| CRC (contabilidade) | Decreto-Lei 9.295/1946 | alta |
| CRM (medicina) | Lei 3.268/1957 | alta |
| CRO (odontologia) | Lei 4.324/1964 | alta |
| CRMV (medicina veterinária) | Lei 5.517/1968 | alta |
| CREFITO (fisioterapia/terapia ocupacional) | Lei 6.316/1975 | alta |
| CFFa (fonoaudiologia) | Lei 6.965/1981 | alta |
| CRP (psicologia) | Lei 5.766/1971 | alta |
| CRN (nutrição) | Lei 8.234/1991 | alta |
| COREN (enfermagem) | Lei 5.905/1973 | alta |
| CRESS (serviço social) | Lei 8.662/1993 | alta |
| CRECI/CRA (corretagem e gestão de imóveis de terceiros) | Lei 6.530/1978 + Lei 4.769/1965 | média |
| CRA/CFA (consultoria em gestão empresarial, RH, seleção/agenciamento de mão de obra) | Lei 4.769/1965 + **Lei 6.839/1980** | média (jurisprudência confirmada — CRA-RJ, CRA-BA) |
| CORECON (economia) | Lei 1.411/1951 | média |
| CREF (condicionamento físico/personal trainer) | Lei 9.696/1998 | média |
| SUSEP (corretagem de seguros) | Lei 4.594/1964 | média |
| INPI — regime próprio, não é conselho clássico (agente de propriedade industrial) | Lei 9.279/1996 | média |

**34 CNAEs bateram "sim"** nessa lista (de 1332 totais).

## Casos marcados `duvida` (propositalmente não classificados)
Não forcei sim nem não — ficam fora do "atendemos com certeza" até confirmação:
- **Apoio à gestão de saúde** (8660-7/00) — possível exigência ligada à saúde (CRM/COREN a apurar).
- **Investigação particular** (8030-7/00) — Lei 13.432/2017 regula a profissão de detetive particular; não confirmei se exige registro formal em algum órgão.
- **Monitoramento de sistemas de segurança eletrônica** (8020-0/01) — segurança privada tem regime próprio (Lei 7.102/1983, autorização da Polícia Federal), diferente de conselho profissional clássico — não mapeado aqui, precisaria de pesquisa dedicada se entrar em escopo.

## Coluna na matriz
`exige_conselho` (sim/nao/duvida) · `conselho_qual` · `conselho_fonte` (lei) · `conselho_confianca` (alta/média/baixa).

⚠️ **Pesquisa com fonte de lei citada, mas NÃO ratificada por contador/advogado.** Mesma trava que o resto da camada tributária.

## Cruzamento — nova lista candidata de "atendemos com certeza" (ME Simples Nacional, serviço)

Funil aplicado sobre os 641 CNAEs de serviço:

```
641 serviço
→ 549 não vedados ao Simples (CGSN140 Anexo VI)
→ 532 não ambíguos (CGSN140 Anexo VII)
→ 122 baixo risco (CGSIM Anexo I — dispensa vistoria/alvará)
→  96 não exigem conselho profissional
```

**96 CNAEs** — comparado com a lista antiga [[cnae-liso-servico]] (103, de 17/07, herdada/não-ratificada):
- **80 confirmados** (os dois métodos concordam — núcleo sólido).
- **23 saem**: 21 eram na verdade comércio/indústria pelo IBGE (violavam "MVP só serviço" — a curadoria de julho errou a seção); 2 eram regulamentados que passaram batido (`7020-4/00` consultoria em gestão/CRA, `7490-1/03` agronomia/CREA).
- **16 entram**: batiam nos 5 critérios e não estavam na lista velha (restaurantes/lanchonetes, edição de livro/jornal/revista, agência de viagem/operador turístico, atividades veterinárias, testes técnicos, agenciamento marítimo, recuperação de materiais metálicos/plásticos, envasamento sob contrato, reparação de bicicletas, adestramento de cães de guarda).

**Ainda não decidido:** se isso vira o novo `cnae-liso-servico.md` (substituindo o antigo) — combinado com o Pedro fazer isso numa próxima rodada, junto com a fusão pedida de [[cnae-liso-servico]] + `cnae-complexidade-abertura.md`.

## Links
- [[cnae-matriz-governo]] · [[lc123-art18-anexos-taxativo]] · [[cnae-liso-servico]] · `pesquisa/cnae-matriz/cnae-complexidade-abertura.md`
