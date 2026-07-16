---
tipo: hub
status: vivo
data: 2026-07-16
tags: [sistema, fila, placeholder, decisao, meta]
---

# 🕓 Fila de validação humana

> **Decisão do Pedro (16/07), e é uma correção de um vício meu:** eu vinha carimbando 🔴 em
> preço, `TEASER_PISO`, DAE, SLU×LTDA e tratando cada um como urgência. **Não são.** São
> valores que precisam de **pessoa certa** (Mauro, Larissa, Karla), e o Pedro puxa **quando
> for a hora**, depois da casa organizada.
>
> **A regra: 🕓 não bloqueia.** Constrói com placeholder marcado e segue. O que bloqueia é 🔴,
> e é raro.
>
> **O que esta nota é:** o lugar único onde esses valores vivem, pra que a validação seja
> **uma conversa só** em vez de arqueologia. Quando o Pedro sentar com o Mauro, é esta a
> lista.

---

## 💰 Números com placeholder no código

| O que | Valor hoje | De onde veio | Quem valida | O que muda se mudar |
|---|---|---|---|---|
| **Nosso preço** | `~R$195` **FAKE** | benchmark do plano Padrão do líder ([[plano-padrao-195-referencia]]) | **Mauro** + custo unitário real (DB+API) | N7 e N9. Se virar parcelamento ou +1 plano, **muda a estrutura** das telas, não só o número → [[legalize-preco-deferido-custo-real]] |
| **DAE JUCEMG** | `~R$268,51` | tabela | **Larissa/Mauro** | ⚠️ **em disputa desde 09/07**: a Izabela cravou **R$288** ([[fluxo-abertura-portais-pedro-dev]]) e nunca foi reconciliado. Aparece na "conta da abertura" (N7) |
| **Endereço fiscal** | `~R$60/mês` | ✅ **confirmado com print** do líder 16/07 ("cobrado a partir da 2ª parcela") | Mauro (o nosso preço) | upsell do N13 |
| **Certificado A1** | `R$209–229/ano` | Izabela | Mauro (parceiro) | N7 |
| **TFLF BH** | `R$161,36 + correção` | ✅ **fato duro**: boleto real do CNPJ do Pedro | — (é do município) | N25 |
| **`FISCAL.TEASER_PISO`** | `0.5` | 🤷 **chute meu**, não ratificado | **Pedro** | só o modo `swap` do teaser. Depois do UX-51 (3 modos), o risco caiu muito |

## ⚖️ Decisões de produto que esperam gente

| O que | Estado | Quem decide |
|---|---|---|
| **Natureza jurídica: SLU × LTDA** | 🕓 nossa regra diz "solo→SLU", mas **o CNPJ real do Pedro saiu LTDA num caso solo**. Se SLU é LTDA de sócio único (mesma natureza 206-2), o guard-rail do N15 está errado | **Larissa** |
| **7 pontos fiscais** | 🕓 mecânica Fator R meses 2–12 · CPP-no-DAS no numerador · FS12 caixa · citações CFC · lista CNAE · DEFIS · taxas BH → [[perguntas-larissa-fiscal]] | **Larissa** |
| **Famílias de swap CNAE** | 🕓 3 entram limpas no MVP; tráfego pago e white-label são de menor confiança → [[cnae-fiscalmente-otimo]] | **Larissa** |
| **UX-42 — bloqueio vira decisão modelada** | 🕓 servir nutri com RT? cotar MEI/Lucro Presumido nos bloqueios? Única coisa que ainda move 4 personas | **Mauro + Larissa** |
| **Reguladas** | ✅ decidido 16/07: **waitlist**. Mas o líder **atende** (cobra e pede a carteira depois) — divergência consciente | Mauro (reavaliar) |
| **Rachadura do T18** (aceite N8 × termo irreversível N20) | 🕓 estrutura parece mais defensável que a atual (hoje a gente alega serviço exaurido quando nada foi executado) | **Larissa/Mauro** |
| **Promessa quebrada** | 🕓 o que o produto faz quando o teaser não se cumpre? Hoje o motor só **marca** | **Pedro** |
| **Flow #2: cobrar antes do TTRT?** | 🕓 é cobrar por algo que a gente **não controla** (quem destrava é o contador que ele demitiu). SLA? reembolso? | **Pedro + Mauro** |
| **Flow #2: passivo herdado** | 🕓 DAS atrasado/dívida ativa é upsell ou fora do escopo? | **Mauro** |
| **Prazo de fidelidade** | 🕓 12 meses como o líder, ou menos pra vender mais fácil? | **Pedro** |
| **Certificado digital** | 🕓 terceirizar (Sete Minas) ou emitir? | **Mauro** |

## 📚 Citações a conferir em fonte primária

| O que | Risco |
|---|---|
| **Nº da resolução CFC** da transferência | o Gemini escreveu "1.590/2020" mas a própria lista de refs dele cita CFC 987/2003 e 1493/2015 → **possível citação trocada**. Usada no flow #2 (TTRT) |
| **Código "Evento 232"** (Alteração do Contabilista) | conferir no Coletor Redesim oficial. Usado no flow #2 |
| **COSIT 17/2021** (FS12 regime de caixa) | a spec do N18 tem um alerta 🟡 que **não deve ser exibido** até verificar |

> ⚠️ **Anti-guru:** o motor testa a **mecânica** desses passos, não crava a citação. Nenhum
> desses números vai pra texto de cliente antes de fonte primária.

---

## 🔴 O que realmente bloqueia (a lista curta)

Pra contraste. **Uma coisa só, e não é número:**

| O que | Por quê |
|---|---|
| **Avisar o dev** | ele recebeu 15/07 uma spec congelada com *"as 14 personas são o critério de aceite"*. Desde então: a ordem inverteu, viraram **16 personas**, nasceu um **flow #2**, e **5 promessas da spec** se revelaram não implementadas. Ele está em E2E contra um contrato que não existe mais |

Todo o resto é 🕓.

## Links
- [[indice-autoridade]] · [[HOME]] · [[perguntas-larissa-fiscal]] · [[legalize-preco-deferido-custo-real]] · [[fiscal-simples-bh-2026]]
