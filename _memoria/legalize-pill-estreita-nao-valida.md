---
name: legalize-pill-estreita-nao-valida
description: "Decisão N4 (17/07) — a pill de área ESTREITA a busca, nunca valida; o veredito vem sempre do texto livre + IA."
metadata: 
  node_type: memory
  type: project
  originSessionId: d8a3e7a3-16ca-4581-bed7-1c454d019eb2
---

**N4 ganha pills de área, mas a pill ESTREITA, não valida.** Travado 2026-07-17 no debate com o Pedro. Fluxo: **pill → "descreve um pouco mais o que você faz" → IA cruza → tela de aceite → pagamento.** O Pedro fechou com o argumento certo: abrir empresa é sério, qualquer persona gasta o pouco tempo de escrever uma frase, porque ela também quer sucesso na abertura.

**Why** (evidência do motor, não opinião):
- **`instrutora` (Ivete)**, a persona do CNAE-ótimo: seus 2 CNAEs caem em **pills diferentes** — `7020-4/00` consultoria (Fator R → V, **15,5%**) × `8599-6/04` treinamento (III, **6%**). O arquivo dela diz *"não sabe que o código escolhido muda o imposto"*. Pill-valida = a escolha da pill vira a escolha do CNAE, feita por quem não pode fazê-la, e ela **paga** antes de o motor poder contradizê-la. Mata a feature-âncora → [[legalize-cnae-fiscalmente-otimo]].
- **`camaleao`**: se erra ao **descrever** o próprio trabalho, erra mais ao **se encaixar na nossa caixa**. **Descrever é mais fácil que saber em qual gaveta você está.**
- **Toda pill é 🟢 por construção** (nasceram só dos atendidos) → o conjunto não expressa 🟡/🔴 → **100% do risco de elegibilidade mora no escape**. A nutricionista toca "Beleza e bem-estar" por estar perto → paga → não dá pra abrir.
- **A simplicidade do líder é financiada por call center** (*"o humano é o plano B do funil"*, captura própria). Importar o funil sem o call center = importar o passivo sem a mitigação.

**Custo aceito:** a `cida` (61 anos, baixa familiaridade digital) ganharia com pill-valida. Ela paga a conta da frase. Registrado, não varrido.

**⛔ Pills guiadas (sub-pills de CNAE) descartadas:** descrição de CNAE não é rótulo humano · 14 dos 124 são "(outros)" · **não dá pra mostrar a consequência** (`anexo_base` idêntico e `fator_r`/`aliquota` vazios) · o problema da Ivete se repete dentro da pill · power user já tem "já sei meu CNAE".

**How to apply:** o guarda-corpo de `taxonomia-pills.js` está **invertido** — obriga todo CNAE a ter pill (foi codado quando pill era promessa). Precisa virar **"toda pill só aponta pra CNAE 🟢"**, e aí a taxonomia deixa de cobrir os 124, as 3 latas de lixo somem e sobram **~6 pills de reconhecimento**. Não construído. Base = [[legalize-lista-cnae-furada-na-raiz]].
