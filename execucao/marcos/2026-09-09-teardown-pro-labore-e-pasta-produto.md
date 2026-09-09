---
tipo: marco
data: 2026-09-09
assunto: funcionalidades-produto
area: produto
impacto: alto
tags: [execucao, marcos, funcionalidades, concorrente, pro-labore, vault]
---

# 🏁 53º flow — o primeiro teardown funcionalidade a funcionalidade, e a pasta `produto/`

> Segundo flow do mesmo dia, e mudou o **método de trabalho**, não só o conteúdo.
> Até aqui a gente lia o concorrente de fora (páginas públicas, e-mails, um dossiê
> geral). Neste flow eu entrei na conta paga do Pedro e destrinchei **uma
> funcionalidade até o fim**. Rendeu mais que semanas de leitura por fora, e o
> motivo foi o método.

---

## Por que pró-labore foi a escolha certa

O Pedro pediu para aprofundar "função por função" e sugeriu pró-labore como exemplo. Era a escolha ótima sem que isso estivesse dito: pró-labore é o **nó onde quatro coisas se cruzam** — Fator R, INSS mensal, eSocial/DCTFWeb e IRPF do sócio.

Desenhar ele destravou, de uma vez, o cálculo de imposto, o calendário de obrigações, o informe anual e a base da folha.

**Vira regra de escolha:** a pergunta não é *"qual funcionalidade é mais fácil?"*, é **"quantas outras esta aqui responde?"**.

---

## O que a navegação achou

### A página que decide tudo, e está escondida

`#/impostos-a-pagar/como-foi-calculado` **não tem entrada no menu**. Chega-se por um link no rodapé de outra tela. E é onde mora a matemática inteira do produto deles.

🎯 Lição de produto: eles têm a tese de transparência pronta e a escondem. Na nossa, a explicação não é link, **é a própria tela do imposto**.

### O algoritmo do "pró-labore ideal"

Duas definições aparecem na mesma página, e não são a mesma coisa. O tooltip diz "28% sobre a **média**"; o box de cálculo diz "o **acúmulo** de 12 meses, lançando o **menor valor possível**". A segunda é a que manda, porque carrega o histórico: se meses passados ficaram abaixo, o mês atual precisa compensar.

```
Restrição:  Σ(pró-labore 12m) ≥ 0,28 × Σ(faturamento 12m)

pró_labore_do_mês = max(
    piso,
    0,28 × Σ(faturamento 12m) − Σ(pró-labore 11m anteriores)
)
```

É **minimização com restrição**, não "subir quando precisa". Confere com os números reais da conta: folha acumulada de R$16.564 contra R$43.910 de faturamento dá **37,7%**, folga de R$4.269, e por isso o valor está travado no piso de R$1.621.

### Os 3 achados que valem sozinhos

| | Achado | Efeito |
|:--:|---|---|
| 1 | **O "DARF Unificado" é a guia do INSS do pró-labore.** As 3 guias vencidas são de R$178,31, exatos 11% de R$1.621 | Fecha a linha **4.5** da matriz com evidência de tela, não só de documentação |
| 2 | **Calendário confirmado empiricamente.** Mesma competência Ago/2026: DARF vence **18/09**, DAS vence **21/09**. 20/09 cai domingo, um antecipa e o outro prorroga | A regra que a verificação da manhã afirmou em teoria, vista funcionando |
| 3 | 🔴 **O líder TEM auditoria de pagamento**, com atraso declarado de ~30 dias, e ela **derruba a marcação do cliente** | A linha **2.4** muda de pergunta. Ver ADR |

### Duas escolhas de produto que a gente faz diferente

- Eles exibem `maior ou igual a 28%` em vez dos **37,7% reais**. Escondem a folga de propósito: evita a pergunta "se sobra folga, por que ainda pago?", mas esconde o que o dono mais quer saber.
- O aviso de saída da Gestão Inteligente tem **botões assimétricos**. O aviso é verdadeiro (sair pode custar imposto), então não é mentira; o que incomoda é o peso visual. Nossa versão diz a mesma verdade com os dois botões no mesmo peso.

### Dois defeitos deles, anotados

- **Bug de variável em produção:** na opção "Salário Mínimo", o benefício mostra `R$178,31` (que é o desconto de INSS) onde devia mostrar `R$1.621,00`.
- **Divergência de um centavo no DAS:** 7.910,00 × 6% = 474,60, e a tela mostra **474,59**. Pequeno, e é exatamente o tipo de coisa que o cliente confere. 🟡 Nossa regra de arredondamento precisa estar escrita **antes** do motor.

---

## A pasta `produto/`

O Pedro pediu **vault próprio** para essa frente. Recomendei **pasta-raiz, não vault Obsidian separado**, e ele aprovou. O racional está no ADR; o que interessa aqui é o diagnóstico:

> O vault é organizado por **fonte**. Funcionalidade precisa ser organizada por **objeto**.

Uma funcionalidade tinha 6 facetas em 6 pastas. Ninguém respondia *"como está o pró-labore?"* sem abrir 6 arquivos.

```
produto/
  HOME-produto.md          hub, placar, fila
  _metodo.md               os 6 passos + regra de navegação na conta de produção
  _catalogo.md             as 51 funcionalidades e a cobertura
  _matriz-dependencia.md   as 23 dependências externas
  funcionalidades.base     4 vistas filtráveis
  funcionalidades/         spec VIVA (o que o dev implementa)
  evidencias/              foto com DATA (não manda em nada)
```

**A separação `funcionalidades/` × `evidencias/` é o que dá o valor.** O teardown envelhece sozinho; o desenho não.

### O que foi mexido em volta

- `funcionalidades-me-simples.md` **quebrado em dois** e transformado em **redirecionador** (tinha 8 backlinks reais que deletar quebraria).
- `indice-autoridade` ganhou **5 linhas**. Sem isso a pasta seria só uma pasta.
- **Placar da matriz recontado:** era 🟢8 · 🟡6 · 🔴10, virou **🟢16 · 🟡3 · 🔴4**.
- **Tabela "o que já sabemos das APIs" reescrita.** Ela estava **contradizendo a própria matriz** logo acima: dava Asaas como travado e Focus NFe como candidato, dois dias depois de os dois morrerem. Ganhou bloco "linhas mortas, não reabrir".

---

## 🔴 O achado colateral, que ficou pro próximo flow

O `indice-autoridade` diz que `tipo` é **vocabulário fechado em 6 valores**, e que "se não couber, discute antes de inventar". A varredura achou **34 valores distintos** no vault.

`fato` (101) · `derivado` (83) · `historico` (77) dominam, mas existem `original` (40), `referencia` (33), `marco` (31), `artefato` (16) e mais 27 caudas.

⚠️ **Eu mesmo inventei 4** ao criar a pasta (`spec`, `funcionalidade`, `evidencia`, `metodo`) e corrigi antes de entregar: mapeei para `verdade` e `fato`, e movi a discriminação real para uma **propriedade nova `dominio`**, que é o que a `.base` filtra. `tipo` e `status` são fechados; **propriedade pode crescer**.

**A doutrina existe e não é aplicada por nada.** Proposta na mesa, a pedido do Pedro: um verificador rodando junto com o `gerar-mapa.mjs`, na mesma família das 3 travas do MEI. **A próxima janela começa por aqui.**

---

## O que fica aberto

| | O quê |
|:--:|---|
| 🔴 | A **tabela do IRRF** do líder não foi ratificada (tela de concorrente, e o app deles carrega banner de reforma tributária) |
| 🔴 | A **2.4** segue sem caminho, agora com a pergunta certa |
| 🟡 | Regra de arredondamento do DAS, antes do motor |
| 🟡 | As 8 notas que linkam `[[funcionalidades-me-simples]]` ainda passam pelo redirecionador |

## Links
[[HOME-produto]] · [[pro-labore]] · [[2026-09-09-contabilizei-pro-labore]] · [[_metodo]] · [[_matriz-dependencia]] · [[decisoes-marca]] · [[indice-autoridade]]
