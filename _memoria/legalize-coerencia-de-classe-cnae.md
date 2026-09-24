---
name: legalize-coerencia-de-classe-cnae
description: "24/09 — irmao de classe CNAE confirma ou veta, nunca decide sozinho (106 concordam x 15 divergem); e casar termo da lei contra `atividades` e ruido garantido."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-24T19:48:28.085Z
---

**Duas travas do classificador de anexo, as duas medidas antes de valer.**

**1. Coerencia de classe.** Subclasses da mesma classe de 5 digitos partilham a natureza economica — o IBGE as construiu assim. Medido: **106 classes onde os irmaos concordam × 15 onde divergem (12%)**, e as 15 sao a **lei dividindo de verdade** (`6911-7/01` advocacia e IV, `6911-7/02` auxiliares da justica e III, porque o §5º-C VII nomeia so advocacia).
🔑 Regra: o irmao **confirma ou veta, nunca decide sozinho**. Se contradiz o inciso, a linha **nao e gravada** e vira fila declarada (foi assim que `8020002` ficou de fora).

**2. 🔴 Casar termo da lei contra `atividades` e ruido garantido.** A 1ª versao do `reclassificar-anexo.mjs` casava tambem contra `atividades` e `subclasse_observacoes`, e produziu **101 mudancas, quase todas lixo**:

- `4211101 CONSTRUCAO DE RODOVIAS` caiu de **IV para III** porque a lista de termos dela contem "instalacao de"
- `7490-1/99` virou **medicina** porque cita "saude do trabalho"
- `8219-9/99` virou **publicidade** porque cita "material de publicidade"

`atividades` e um **saco de termos de busca com referencia cruzada para OUTROS CNAEs**. Casa-se **so na `descricao` oficial**.

**3. E nunca reescrever linha ja `IV`.** Anexo IV esta fora do escopo (travado 12/09). Errar na direcao III faz uma atividade **parecer atendivel** — e o cliente descobre depois de pago.

**4. Correcao de dado e refatura de schema nao andam no mesmo commit.** A 2ª aplicacao escreveu `III` / `III-ou-V` (vocabulario da tabela nova) numa coluna que o `apurador.anexoDoCnae()` le procurando `III-fixo`: 4 valores para 2 conceitos, motor teria parado. Revertido por md5 e regravado no vocabulario do arquivo.

**Why:** as tres primeiras sao o mesmo erro do classificador de 27/08 — inferir enquadramento fiscal de texto que nao foi escrito para isso.

**How to apply:** antes de aplicar qualquer classificador em massa, rodar em simulacao, abrir a amostra do que mudou e procurar o absurdo. Guardar md5 do arquivo antes de gravar. Ver [[legalize-dois-residuais-lc123]] e [[legalize-caminho-relativo-falha-calado]].
