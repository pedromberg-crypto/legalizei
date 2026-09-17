---
name: legalize-base-copy-insuficiente
description: "Base de tom-de-voz/copy é PARCIAL, não suficiente pra validar telas — falta glossário técnico e exemplos por tipo de tela; personas não cobrem isso"
metadata:
  type: project
  originSessionId: f8d378ac-1f1c-4359-ae6e-0a68b21dd249
  modified: 2026-08-05T14:48:29.925Z
---

**05/08:** Pedro pediu pra validar copy das telas E1-E4.5 contra "o produto como um todo". Pesquisei o que existe no vault pra isso e a base é **parcial**.

**O que existe:**
- `marca/conceito/conceito-marca.md` §5 "Tom de voz" — o mais próximo de guia real: arquétipo (Aliado leve/vitorioso), 4 traços (Humano/Transparente/Proativo/Descomplicado), do/don't com só 2-3 exemplos de cada lado ("Sua empresa está em dia ✅" vs "obrigação acessória pendente"), 1 regra de ouro (termo técnico sempre traduzido ou escondido).
- `marca/decisoes-marca.md` — regras pontuais soltas (travessão zero, número sem fonte, DAE sem tela nova...).
- `produto/_flow/metodo-varredura-flow.md` (rubrica D1-D11) — checklist MECÂNICO de auditoria (redundância, eco, hierarquia), não fonte de princípio; resume regras herdadas no rodapé, não as cria.

**O que falta:**
- Glossário de tradução termo-técnico→humano (CNAE, DAS, Fator R, pró-labore, TTRT...) — crítico pro flow fiscal.
- Exemplos de copy por TIPO de tela (erro, vazio, sucesso, aviso legal, confirmação).
- Lista de vocabulário proibido/permitido além dos 3 exemplos do §5.

**Personas NÃO preenchem essa lacuna.** `_arquivo/motor-testes/personas/*.json` (18 arquivos) são artefato de QA do motor de testes — simulam passagem pelo flow com nível de letramento digital + gatilhos de estresse (`estressa: [...]`). Não têm jobs-to-be-done formal, não têm linguagem-alvo por perfil, não têm verbatim de fala do cliente. Servem pra gerar caso de teste determinístico, não pra validar tom de escrita.

**Why:** validar copy hoje = costurar manualmente 3 fontes espalhadas (conceito-marca + decisoes-marca + metodo-varredura). Funciona pra achado pontual, não pra rodada sistemática tipo E1→E4.5.

**How to apply:** antes de rodar qualquer validação de copy sistemática (E1-E4.5 ou outro flow), verificar se essa base já foi fechada nesta janela ou anterior — não presumir que "temos personas" resolve isso. Registrado como item K em `execucao/parking-lot.md`. Ver [[legalize-auditoria-copy-rubrica]] (o processo que existe, distinto da fonte de princípios que falta).
