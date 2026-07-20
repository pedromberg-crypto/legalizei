---
tipo: marco
status: vivo
data: 2026-07-19
etapa: construcao-telas
tags: [produto, ux, telas, wizard, a7, a9, dinheiro]
---

# 🏗️ 13 telas novas: entrada, dinheiro, espera e saída graciosa

> 5º flow de construção. A prancheta `/mockup` saiu de **16 → 26 telas**, em 8 grupos, **sem grupo vazio**. Todo o wizard (N1–N9) existe em código, mais o login, as 2 pausas do A7 e as 2 saídas do A9.
> Verificação: `tsc` + `eslint` limpos (1 warning pré-existente no simulador). ⚠️ `next build` **não** foi usado — ver dívida técnica abaixo.

## O que foi construído

| Grupo | Telas |
|---|---|
| **Entrada · N1–N3** | splash · welcome (3 slides) · fork de 3 rotas |
| **💰 Dinheiro · N6–N9** | criar conta · a conta da abertura · aceite do contrato · pagamento |
| **A7 · Espera** | P1 retomar · P2 aguardando o boleto |
| **A9 · Saída graciosa** | sócio no exterior · 3+ sócios |
| **Fora do flow** | login |

**Infra nascida no caminho:** `components/lottie.tsx` (runtime + player de loop) · `logo.tsx` (3 variantes) · `marcas-sociais.tsx` (Google/Apple) · `lista-passos.tsx` · `lib/passos.ts` · `ui/tela.tsx` + `ui/form.tsx` (promovidos do dossiê pela regra dos 3) · `Card` com `tom` no lugar de `tint`.

## Decisões travadas

- **N1–N3 não têm arquétipo.** Não mapeiam em A1–A10 (não perguntam, não julgam, não provam). Viraram grupo próprio na prancheta, por posição no flow.
- **N3 sem a palavra "migrar"** (UX-55 aplicada): o protótipo dizia "migrar de contador"; a copy virou **"Já tenho empresa"**. "Trocar de contador" excluiria quem não tem contador, que é o melhor cliente do flow #2.
- **Login sem número N.** É a saída terminal A1 do mapa: sai da abertura e não reconverge. Não usa o template A9 (aquele é pra recusa; login é rota feliz).
- **N7 — hierarquia invertida.** O maior número da tela era o R$463,51 (soma artificial de repasse + mensalidade). Passou a ser **"Grátis"** (verde, com check) e **R$195/mês**; o total desceu pro rodapé, colado no CTA. Achado do Pedro: *"o valor total está em mais destaque que o grátis"*.
- **N8 — o cancelamento saiu de bloco próprio.** Eram 3 cards, o maior bloco da tela do sim. Virou 2 bullets, com a fidelidade dita como **consequência do benefício** ("como a abertura é gratuita, existe permanência mínima"). Causa: resíduo do racha do T18 — o conteúdo não se dividiu quando a tela virou duas.
- **N8 — o card azul virou os 22 anos.** Trabalho defensivo ("aceitar aqui não abre nada") deu lugar às credenciais do escritório, em 3 pontos com ícone.
- **A9 usa selo `humano` (azul), não `danger`.** Contraria nota anterior no `veredito.tsx`. No caso dos 3 sócios o limite é **nosso** — vermelho culparia o cliente por escolha de produto; no exterior a empresa continua possível, só não no Simples.
- **P2 — o gancho da economia saiu da tela.** O UX-45 fala de **push/WhatsApp**, não da tela. Repetir o teto do teaser ali cravava número errado pra 2 dos 3 modos (`fator-r` promete faixa desde R$0; `servico` não promete nada). No lugar entrou **progresso**, que é verdade nos 3 modos.
- **P1 — o aviso UX-23 saiu.** Falava de "quanto você se paga" (passo 9) pra quem retoma no passo 3: número que ele nunca viu. E pró-labore fora de contexto assusta, porque o dono de PJ parte do princípio de que o faturamento inteiro é dele. **Migra pro N18.**
- **Digitar é grátis, checar é caro** (N16): o cliente escolhe o nome, a consulta na JUCEMG roda quando o pagamento cair, e volta com veredito + alternativas de IA. Nenhum RPA roda por quem não pagou.
- **Vocabulário alinhado:** N10 `"Dados do sócio"` → **"Seus dados"** (quem abre sozinho não se vê como sócio); N12 `"Sociedade"` → **"Sócios"**. Casa com `lib/passos`, que é o que o cliente lê na P1/P2.

## Bugs que a review do Pedro pegou

1. **"5 de 9" × "3 de 6"** — as duas telas do A7, lado a lado, davam contagens diferentes. Eu inventei os números em cada tela. Virou `lib/passos.ts`, fonte única. **São 10 passos** (9 sem CNAE ótimo), incluindo "Revisar e confirmar" (N19+N20 como um ato).
2. **O contador mentia no fim.** Parava no N18: quem paga com cartão chegava em "9 de 9" e ainda tinha revisar, assinar termo e assinar no GOV.BR.
3. **"O próximo passo é só esse"** — lia como "só falta esse", com 6 pela frente.
4. **`R$1.518 → R$1.621` como boa notícia** — salário mínimo não cai. O caso real de melhora é a faixa isenta do IR.
5. **Faixa de faturamento ambígua:** "R$ 10 a 20 mil" foi lido como *dez reais*. Só as duas faixas do meio abreviam o "mil".

## 🚧 Dívidas abertas (todas nascidas neste flow)

| # | Dívida | Espera |
|---|---|---|
| 1 | UX-29 GOV.BR vira tarefa acionável | **N21** |
| 2 | Camada 2 do cancelamento (taxa não volta depois de aberto) | **N20** |
| 3 | Gancho de economia por modo do teaser na notificação | régua de CRM |
| 4 | UX-23: aviso de revalidação da estimativa | **N18 (existe, dá pra fechar)** |
| 5 | Validação de **nome** ≠ validação da **empresa** na junta | dev / Izabela |
| 6 | Faixas (10/20/30) não ancoram em corte fiscal nenhum | Pedro, interno |
| 7 | Endereço fiscal fora da "conta total" do N7 | decisão de spec |
| 8 | Persona `govbr-bronze` testa comportamento que a UI não tem mais | motor |
| 9 | N12 re-pergunta o nº de sócios que o N4 já sabe | decisão do Pedro |
| 10 | `next build` corrompe o `.next` do dev server (404 em tudo) | verificar só com `tsc`+`eslint` |

**As 1, 2 e 3 são a mesma classe de risco:** telas não construídas carregando conteúdo que tiramos de outras. Se o N20 nascer sem a camada 2, a redução do N8 vira omissão.

## Achados que apontam pra fora

- **JUCEMG não tem API** ([[fluxo-abertura-portais-pedro-dev]]): a checagem de viabilidade provavelmente é RPA. Liberá-la antes do pagamento gastaria o recurso mais caro do sistema com quem talvez nunca pague.
- **N15 pode não precisar existir.** Se SLU é LTDA de sócio único (mesma natureza 206-2), a tela não dá escolha pra quem tem sócio e dá uma escolha inexistente pra quem está solo. Já registrado em `motor-testes/README.md` e na fila da Larissa, com o CNPJ do Pedro como evidência.
- **Natureza jurídica lista "EI / SLU / LTDA"** no fluxo de portais; a tela só oferece 2. O corte do EI faz sentido pro ICP (não separa patrimônio), mas não está registrado como decisão.

## Links
[[legalize-telas-padrao-layout]] · [[reordenacao-flow-cobranca-cedo]] · [[spec-telas-b3-b4-aterrissagem]] · [[compilado-ux-flow]] · [[mapa-ramificacoes-flow]] · [[HOME]]
