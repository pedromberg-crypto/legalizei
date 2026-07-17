---
name: legalize-lista-cnae-furada-na-raiz
description: "Os 460/260 CNAEs \"atendidos\" nunca foram verificados — saíram da inversão de uma lista de 17 recusas; 45 impossíveis, 91 duvidosos, 124 não-refutados."
metadata: 
  node_type: memory
  type: project
  originSessionId: d8a3e7a3-16ca-4581-bed7-1c454d019eb2
---

**A lista do que a Legalizei atende nunca foi uma lista do que a Legalizei atende.** Descoberto 2026-07-17 → [[legalize-mvp-so-servico-cnae]] (que registra o corte de 15/07 feito **em cima desta base furada**).

**Causa-raiz — ausência de recusa lida como presença de atendimento:**
1. **Não existe página de CNAEs atendidos na Contabilizei.** Só `suporte.contabilizei.com.br/.../204678699-Atividades-não-atendidas`: **17 categorias RECUSADAS**, por categoria, não por CNAE.
2. Os 460 saíram da **inversão** disso: mapeou-se as 17 recusas em seção/divisão e tudo que sobrou virou "atende".
3. **Prova:** os 460 carregam a string literal `presumido (serviço/comércio leve no Simples; validar)`. Nos 460. Ninguém validou.
4. `8422-1/00 DEFESA` é "atende" porque o Ministério da Defesa não está entre as 17 recusas do concorrente.

O mapeamento das 17 também falhou: **"Cartórios" é o item 3** e `6912-5/00` saiu "atende"; **"Gráficas" é o item 8** e as 5 "edição integrada à impressão" saíram "atende".

**Estado (proposta, não veredito)** — `node pesquisa/cnae-matriz/classificar-260.js` → nota `limpeza-260-servico.md`:
**45 impossível** (Pedro decide) · **91 duvidoso** (Larissa, 7 baldes c/ pergunta fechada) · **124 "real"**.

⚠️ **Os 124 são NÃO-REFUTADOS, não validados.** Nenhum contador olhou. O Pedro chamou de "já validados e confirmados" e foi corrigido: tratar não-refutado como confirmado é o que produziu `DEFESA` na lista. Crivo dos contadores = encaminhado por ele.

**Achado dentro do achado:** os **68 condicionais também estão furados** — 10 CNAEs que exigem conselho (CRECI, leiloeiro, CREA) estão em "atende". Com a cobrança no N9, isso é falso 🟢 que **cobra antes de barrar**.

🔴 **Respinga no dev:** o `cnae-lookup-b1.json` entregue 15/07 sai das mesmas 1332 pela mesma regra → a triagem dele diz "atende, passa liso" pra DEFESA. Soma ao [[legalize-handoff-dev-repo]]: não é só o contrato, **os dados também**.

**A pista quente:** `contabilizei.com.br/contabilidade-online/cnae/` tem **Anexo · Fator R · Alíquota · Atende** por CNAE — o que falta na nossa matriz (`fator_r`/`aliquota_inicial` vazios nos 1332). Só temos OCR podre de uma imagem (369 códigos, dígitos corrompidos, colunas descoladas). **Extração pendente**, o Pedro ia guiar.
