---
tipo: referencia
status: vivo
data: 2026-07-21
assunto: 2026-07-21-encaixe-rebrand
tags: [marco, marca, produto, flow, cnae, fiscal, rebrand]
---

# 🏁 Marco 2026-07-21 — rebrand Legalizai + reorder do cluster fiscal (ENCAIXE)

8º flow. Três frentes: rebrand no app, lapidação de copy, e a reordenação do cluster fiscal (debate → decisão → build stage 1+2).

## 1. Rebrand Legalizai Story Book → Legalizai
- Wordmark novo: a 8ª letra mudou de **e → a** (o "ai" final vem em **coral**). O ícone não mudou (mesmo quadrado coral com check; vetor reexportado).
- `app/src/components/logo.tsx` reescrito: viewBox 659.73×130, wordmark em 2 grupos (ink + coral), 3 variantes. **Negativos agora MONO-brancos** (decisão do Pedro: no fundo escuro a marca vai toda branca, perde o símbolo coral). O **wipe da splash** foi preservado usando quadrado SÓLIDO + check endereçável (o knockout do arquivo o quebraria).
- Copy: "Legalizai Story Book" → "Legalizai" em 8 arquivos (`<title>`, mockup, contrato, 3 veredito, gate, empresa). Assets Lottie (`*-legalizai-story-book.json`) e comentário-histórico do logo **intactos**.
- 3 SVGs-fonte no vault: `marca/identidade-visual/legalizai-{horizontal,negativa-clara,negativa-escura}.svg`.
- ⚠️ **Escopo = só o app.** Docs do vault, domínio `legalizai-story-book.app` e IG `@legalizai-story-book.app` seguem "Legalizai Story Book". O rename brand-level (domínios/INPI) é decisão aberta → [[legalize-rename-legalizai]].

## 2. F-round + varredura pesada (2ª passada)
- **F1–F6** (frases negativas → positivas) aplicados no flow. Ex: N24 "não some" → "continua com você"; N6 "ainda não cobrando" → "criar conta é de graça".
- **Varredura pesada** (rubrica D1–D11) nas 6 telas tocadas pegou **2 ecos que o próprio F-round plantou**: V12 (N24 "continua com você" duplicava o subtítulo) e V13 (N13 Aviso duplicava o botão do upsell). Corrigidos.
- V14: idempotência quase idêntica em N9 (pagamento) × N21 (painel) → **diferenciada por momento** (N9 = cobrança, N21 = processo); dissolveu o V15 de brinde.
- Registrado em [[auditoria-copy-flow]] (F1–F6 ✅, V12–V17).

## 3. ENCAIXE — reorder do cluster fiscal (a decisão grande)
- **Problema:** o N17 (swap do CNAE) vinha tarde (depois do dossiê + nome/Junta). Pedro: "fica parecendo que a gente foi descuidada e não ofereceu de cara".
- **Confirmado pelo Pedro:** o CNAE entra no 1º preenchimento e o nome/objeto/Junta dependem dele → travar cedo é **requisito**, não estética.
- **Decisão:** fundir escolha-do-CNAE + defesa-fiscal numa tela de **DESCOBERTA** (o ENCAIXE), logo após o veredito 🟢, pré-pago (modelo do print do Pedro: recomendado + alternativas). N5 = **opção B** (resumo de valor: vende segurança, não promete economia).
- **Build stage 1+2 (todo `tsc`+eslint limpo):** `components/encaixe.tsx` + rota `/encaixe`, wired no gate (`veredito 🟢 → ENCAIXE → triagem`); **removidos** os 3 teasers + `teaser.tsx` + o N17 (`/dossie/cnae-otimo`); criado o **N5' resumo** (`components/resumo-valor.tsx` + `/resumo`); `lib/passos` reindexado (−1 passo, `temCnaeOtimo` removido de 4 arquivos); mockup A3 atualizado; **`flow-data` → mapa v4 sem drift** (mermaid do Obsidian atualizado).
- Fonte completa: [[reordenacao-cluster-fiscal-encaixe]] (nota-proposta com as 4 regras + ripple).

## Aberto (próxima janela)
- **O MOTOR (`execucao/motor-testes/flow-schema.js`) está 1 passo atrás** — modela o flow velho (b2.cnae_otimo/N17). É o 1º item.
- N14/N16 lendo o "CNAE travado" — deferido até existir store de estado real (hoje tudo é mock por tela).
- Rename brand-level (domínios/IG/INPI) — decisão de sócio.

## Links
[[HOME]] · [[reordenacao-cluster-fiscal-encaixe]] · [[legalize-rename-legalizai]] · [[legalize-encaixe-cluster-fiscal]] · [[auditoria-copy-flow]] · [[mapa-flow-mermaid]]
