---
tipo: fato
status: vivo
data: 2026-08-27
tags: [cnae, fiscal, fator-r, arquitetura, pro-labore]
---

# Equação viva — Camada 2: quais variáveis do CNPJ o app já controla

Resposta ao próximo passo deixado em aberto no [[2026-08-27-cnae-camada-tributaria-e-equacao-viva]] (marco): mapear, no código real do app (`app/src/`), quais inputs da Camada 2 (pró-labore + faturamento, que alimentam Fator R/RBT12 mês a mês) já são capturados/controlados diretamente pela experiência do usuário, versus externos/declarados.

Método: leitura direta do código (`código > documento` — [[indice-autoridade]]), não suposição.

## Achado 1 — Pró-labore: o app JÁ controla, e já existe tela pronta

`app/src/app/(app)/(portal)/pro-labore/page.tsx` (P8 ver + P9 ajustar, telas de portal dia-2). Reusa `lib/fiscal.ts` (`proLaboreOtimo`, `naBorda`, `custoProLabore`):

- Mostra o pró-labore atual do sócio, o imposto que ele gera, e um slider que simula em tempo real o efeito de mudar o valor (dobra de imposto ao cair no Anexo V, aviso de borda 28-30%).
- `proLaboreOtimo(fat)` já calcula a sugestão (mira 30% de margem, nunca crava o limiar legal de 28% — regra UX-39).
- **O padrão de interação hoje é GUIADO, não livre nem automático:** o usuário pode arrastar pra qualquer valor (livre), a tela empurra ativamente pra sugestão ("Ganhe uma folga" / "Dá pra afinar"), mas **aplicar a mudança não é automático** — o CTA final ("Quero ajustar pra X") manda pro canal humano (`/mais`), não grava sozinho.
- 🔴 **Dado de entrada é mockado, hardcoded no componente:** `FAT = 6000` e `ATUAL = 1700` são constantes fixas no arquivo, não vêm de nenhum estado real do CNPJ.

## Achado 2 — Faturamento/NF: o app JÁ controla, mas é tela separada

`app/src/app/(app)/(portal)/notas/page.tsx` + `/emitir` — emissão de NFS-e é feita DENTRO do app (não é só espelho de sistema externo). Cada nota tem `valor`, `status` (emitindo/emitida/recusada/cancelada), agrupada por mês. Isso é exatamente o numerador/denominador real do RBT12 e do Fator R (regime de competência).

🔴 **Achado que não estava mapeado: as duas telas não se falam.** `/pro-labore` usa `FAT = 6000` fixo; `/notas` tem seu próprio mock de 20+ notas com valores reais somando por mês. Nenhuma lê a outra. É a mesma classe de bug que UX-24 já resolveu entre pró-labore e CLT (ver Achado 3) — aqui ainda não foi feito.

## Achado 3 — CLT do sócio: capturado, mas 1 vez só (onboarding), não mensal

`custoProLabore(proLabore, cltRemun)` em `fiscal.ts` já consome CLT declarado pra zerar/reduzir o INSS do pró-labore (comentário no código cita UX-24: "as duas telas não podem ser ilhas"). A captura em si acontece em `app/src/app/(app)/dossie/vinculo/page.tsx`, parte do dossiê pós-pagamento (N10-N19, uma vez na abertura) — não é um dado que o app revalida todo mês. Se o sócio mudar de emprego CLT depois, nada no app hoje pega essa mudança.

## Achado 4 — Faixa de faturamento inicial: só na entrada, uma vez

`gate-telas.tsx` (E5F, 24/08) captura a faixa de faturamento ANTES de saber o CNAE — é sinal de qualificação do lead/gate, não é o dado que alimenta o cálculo fiscal recorrente. Confirma que hoje não existe NENHUM ponto no app que recalcula RBT12/Fator R automaticamente a partir de dado real e recorrente — os dois blocos que fariam isso (`/pro-labore`, `/notas`) existem mas rodam com mock isolado.

## Conclusão — mapa de controle direto (Camada 2)

| Variável | O app controla/captura? | Onde | Frequência real hoje |
|---|---|---|---|
| Pró-labore pago | ✅ sim — tela dedicada, interativa | `/pro-labore` | mock estático (não recorrente) |
| Faturamento/NF emitida | ✅ sim — emissão acontece no app | `/notas`, `/emitir` | mock estático (não recorrente) |
| CLT do sócio | ✅ sim, mas captura única | `/dossie/vinculo` | 1x na abertura, não revalidado |
| Faixa de faturamento (RBT12) | ⚠️ só na entrada, é qualificação de lead | `gate-telas.tsx` E5F | 1x, pré-CNAE |

**Leitura pro Pedro:** as duas peças que a Camada 2 precisa (pró-labore + NF) **já existem construídas e desenhadas certo** (`/pro-labore` já é praticamente a "Central de Sócios" que ele viu na Contabilizei) — o que falta não é desenhar telas novas, é (a) conectar as duas ao mesmo dado real de CNPJ em vez de mock isolado, e (b) decidir se o ajuste de pró-labore fecha sozinho ou continua indo pro canal humano.

## Sobre o caminho do pró-labore (livre × automático × guiado) — não decidido, só evidência

`/pro-labore` como já construída **não é nenhuma das três puras**: é livre pra explorar (slider sem trava), guiada pra decidir (sugestão ativa, empurra pro ótimo), e humana pra aplicar (CTA manda pro `/mais`, não grava sozinha). Isso é dado pro Pedro decidir, não decisão em si.

## Ficou em aberto
- Conectar `/pro-labore` e `/notas` ao mesmo dado real de faturamento (hoje mocks isolados).
- Decidir se "aplicar mudança de pró-labore" volta a ser automático (como a Central de Sócios da Contabilizei) ou continua indo pro canal humano.
- Revalidação mensal de CLT (hoje só captura na abertura).
- Ainda falta desenhar a Camada 1 versionada+vigia (identificar CNPJ afetado por mudança de regra do governo, atualizar em massa, notificar) — isso é o outro lado da equação viva, não tocado aqui.

## Links
- [[2026-08-27-cnae-camada-tributaria-e-equacao-viva]] · [[fundamentos-cnae]] · `app/src/lib/fiscal.ts` · `app/src/app/(app)/(portal)/pro-labore/page.tsx` · `app/src/app/(app)/(portal)/notas/page.tsx` · [[indice-autoridade]]
