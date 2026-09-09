---
tipo: verdade
status: vivo
dominio: funcionalidade
data: 2026-09-09
assunto: guia-de-imposto
autoridade: fonte-verdade
cobertura: parcial
balde: core
dependencia: externa
confianca: media
bloqueio: motor de cálculo; 2.4 (saber que foi pago); Serpro não contratado
tags: [produto, funcionalidade, das, darf, guia, pagamento, parcelamento]
---

# 🏛️ A guia de imposto — a nossa funcionalidade

> 🧭 **Autoridade:** manda no **desenho da guia no nosso app**, do cálculo ao pagamento.
> O que o concorrente faz está em [[2026-09-09-contabilizei-guia-imposto]], foto com data.
> Hub: [[HOME-produto]] · catálogo: [[_catalogo]] (§2, linhas 2.1–2.9) · dependências: [[_matriz-dependencia]].

---

## 🔗 Cruzamentos declarados

| | |
|---|---|
| **⬅️ Recebe de** | 🔑 **é a SAÍDA das três frentes já mapeadas**: [[emitir-nota-fiscal]] (faturamento) → [[aliquota-e-enquadramento]] (alíquota) → **DAS** · [[pro-labore]] (INSS + IRRF) → **DARF**. Mais a **retenção** de ISS por cliente, que abate do DAS |
| **➡️ Manda em** | **compliance** (`emDia`) · **pendência** → Termo de Exclusão → alíquota de Lucro Presumido · **receita à-la-carte** (recálculo, parcelamento) |
| **📅 Obrigação que dispara** | DAS dia 20 (**prorroga**) · DARF dia 20 (**ANTECIPA**) · **TFE** municipal, vencimento próprio |
| **👁️ O cliente precisa ver** | quanto · quando · **se já pagou** · e, se atrasou, **quanto do valor é multa** |

🔴 **O cruzamento em uma frase:** a guia é onde **toda** a cadeia desemboca, e é o único elo cujo fracasso puxa a corrente inteira: guia não paga → pendência → Termo de Exclusão → perda do Simples → alíquota de 6% vira Lucro Presumido.

---

## 📦 Contrato de dados (validado em produção pelo líder)

```ts
type Guia = {
  id: number
  aba: { id: "ESTE_MES" | "EM_ATRASO", secao: "BOLETO_OU_CARTAO" | "DEBITO_AUTOMATICO" | "VENCIDOS" }
  identificadorImposto: "SIMPLES" | "DARF_UNIFICADO" | "TFE" | …
  competencia: { mes, ano, periodo }              // 202608
  vencimento: { data, calculando, badge, estaVencido, venceMesAtual }
  valor: { total, status, mostrarMemoriaCalculo, diaDisponibilizacao }
  confirmacaoDePagamento: {
    tipo, confirmado, desabilitado, tooltipHover,
    verificacaoPagamentoAutomatica: boolean       // 🔑 por guia, não global
  }
  acaoBotao: { id: "PAGAR" | "RECALCULAR" | "BAIXAR_GUIA", desabilitado }
  status: "AGUARDANDO_DISPONIBILIZACAO" | "VENCIDA" | "PAGO" | …
  erroGeracaoGuia: boolean
  // no histórico, ainda:
  valorPrincipal, valorPago, valorRecalculo, codigoBarras,
  idParcelamento, quantidadeParcelas, nrPrestacao, ocultarGuia,
  modalDetalhes: { exibir, tipo, oqueE, porQueEImportante }
}
```

🔑 **Três decisões que valem copiar tal e qual:**

1. **`acaoBotao` vem do servidor.** O front não infere ação a partir de status. Um botão, três significados (`PAGAR` → `RECALCULAR` → `BAIXAR_GUIA`), e a regra mora num lugar só.
2. **`AGUARDANDO_DISPONIBILIZACAO` é estado próprio.** A guia existe antes de poder ser paga. Isso separa **disponibilização** de **vencimento**, dois conceitos que a gente vinha misturando.
3. **`erroGeracaoGuia` é campo, não exceção.** Geração de guia falha, e o produto precisa ter cara pra isso.

### Os 10 status (especificação pronta)

```
Calculando · Pendente · Prorrogada · Postergada · Pagamento agendado ·
Verificando pagamento · Paga · Paga via parcelamento · Vencida · Recalculando
```

---

## ✅ O que copiamos sem vergonha

1. **`acaoBotao` como dado**, com os 10 status acima.
2. **Separar disponibilização de vencimento.** *"Disponível até o dia 15"* × *"Vence 18/09"* são coisas diferentes e o cliente precisa das duas.
3. **`emDia: boolean`** como resposta direta na API. É a nossa linha 5.1 já resolvida em formato.
4. **`memoriaDeCalculo`**: dois cenários completos (atual × ideal), cada um quebrado em DAS e DARF, mais a `economia`. **É o payload da nossa tela "por que pago isso".**
5. **Aba de parcelamentos** com três estados (em andamento · ativos · histórico), ligada à guia por `idParcelamento`.
6. **Débito automático como SEÇÃO**, não toggle solto: a guia sabe por qual trilho vai ser paga.

---

## ✍️ O que fazemos diferente, e por quê

| # | Eles | Nós | Por quê |
|:--:|---|---|---|
| 1 | Juros e multa **sem linha própria** (só `valorPago > valorPrincipal`) | **Linha separada**: "principal R$720 + multa e juros R$40,46" | O dado existe e é calculável. Esconder o custo do atraso é o oposto de ensinar o cliente a não atrasar |
| 2 | Explicador **inconsistente entre telas**: rico na Central de Rotinas, nulo em `Impostos a pagar` | **A mesma explicação em toda tela onde o imposto aparece**, vinda de uma fonte só | Eles têm o texto e ele não chega onde o cliente decide pagar. É custo zero de conteúdo e ganho direto de confiança |
| 3 | `RECALCULAR` a **R$15,90** aparece assim que vence | Recalcular a guia do próprio cliente é **incluso**. Cobramos serviço, não correção de algo que a gente já calculou | Cobrar pra reemitir o que a gente errou de prazo é o "surcharge oculto" que a gente critica no líder |
| 4 | Auditoria em **lote mensal** | 🔴 decisão de arquitetura em aberto (2.4) | Ver abaixo |
| 5 | Confirmação manual que a auditoria **derruba em silêncio** | Se a auditoria contradisser o cliente, **mostrar a data da checagem e perguntar** | Desmentir o cliente sem mostrar a fonte corrói a confiança |
| 6 | TFE municipal misturada na lista, sem explicação | **TFE explicada**: o que é, por que existe, quando vence | É taxa de BH, do nosso território, e o cliente nunca ouviu falar dela |

---

## 🔴 O que trava, e a decisão que não é de produto

| | O quê | Onde resolve |
|:--:|---|---|
| 🔴 | **2.4 — saber que foi pago.** O líder resolve com lote mensal + trilho próprio (Contabilizei.bank). **Não é descoberta, é decisão**: ou a gente consulta arrecadação com atraso, ou possui o trilho | arquitetura + negócio |
| 🔴 | **Motor de cálculo** não existe | trilha própria |
| 🔴 | **Serpro Integra Contador** não contratado. Sem ele não há guia oficial | [[_matriz-dependencia]] 2.2 |
| 🟡 | **TFE**: regra, base de cálculo e vencimento em BH não mapeados | [[fiscal-simples-bh-2026]] |
| 🕓 | **`DARF_UNIFICADO_ATIVACAO_FATOR_R`** de R$11: mecânica de pró-labore simbólico para abrir a contagem do Fator R. **Observada, não ratificada.** Fica abaixo do mínimo de contribuição do INSS | Larissa |
| 🟡 | Parcelamento: existe no modelo deles, oferta condicional (`HTTP 204`). Regra de elegibilidade desconhecida | investigar |

---

## Links
[[_mapa-de-cruzamentos]] · [[2026-09-09-contabilizei-guia-imposto]] · [[aliquota-e-enquadramento]] · [[pro-labore]] · [[emitir-nota-fiscal]] · [[HOME-produto]] · [[_catalogo]] · [[_matriz-dependencia]] · [[fiscal-simples-bh-2026]]
