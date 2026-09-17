---
name: legalize-apresentacao-gestao
description: "/apresentacao é demo pra gestão da Legalize Digital E lente de auditoria de UX — achados vão pro compilado-ux-flow, rodada #6."
metadata: 
  node_type: memory
  type: project
  originSessionId: 94633c37-c0c4-432d-b0e4-010c5b953f11
  modified: 2026-07-29T13:07:47.758Z
---

**`/apresentacao` (nasceu 2026-07-29, 19º flow)** — rota de DEMO pro time contábil da Legalize Digital (âncora técnica do negócio), não é mockup de comparação.

**Anatomia:** split-screen. Esquerda = aparelho 15 Pro Max (`MolduraAparelho`, extraída de `versao-board.tsx` — **sem iframe**, senão o painel não reage ao estado). Direita = 3 blocos por tela (o que faz · o que interfere na constituição · por que pede o dado) + chip do **dono da pausa** (🟧 usuário · 🟦 nossa · 🟨 órgão — 3 categorias, o 🔵 certificado do kanban NÃO entra aqui).

## 🔗 FIDELIDADE POR CONSTRUÇÃO (regra dura, 29/07)
A apresentação **importa os componentes aprovados**, nunca cópia. A v1 tinha cópia e divergiu em 1 dia (o N3 perdeu Lottie/ícones/layout sem ninguém notar) — o Pedro pegou e a regra virou dura.

Telas extraídas pra fonte única (pages de produção viraram **wrappers finos**, zero pixel mudou):
- `components/entrada.tsx` → `EntradaView` (N3 fork + gate cidade)
- `components/gate-telas.tsx` → `PerguntaView` · `AnalisandoView` · `TriagemView` · `FaixaView` (N4)
- já existiam: `components/veredito.tsx` (`VereditoView`, ganhou prop opcional `captura` p/ o "Simular validação") · `components/encaixe.tsx`

**Deslinkar:** ao editar uma tela na demo, ela ganha selo 🔓 + bloco âmbar de observação no painel, e entra na tabela de [[achados-apresentacao]]. **O flow de produção só muda com validação do Pedro.** Telas não editadas mostram 🔗 "Tela aprovada, sem alteração".

**Mecanismo travado com o Pedro:**
- **Cenários preenchem, não navegam.** Os botões (🟢 caminho feliz · 🟡 regulamentada · 🔴 comércio · 🔴 fora de escopo) põem pill + texto plausível no campo; quem dispara o desfecho é o CTA de dentro do aparelho. Motivo: a gestão precisa ver a **causa**, não só o resultado. O 🟡 clica numa pill que NÃO corresponde (advocacia não tem pill) — vira prova visual de [[legalize-pill-estreita-nao-valida]].
- **Seta de voltar FORA do aparelho**, à esquerda: é controle da apresentação, não do produto (o wizard real não tem saída lateral). Restaura snapshot do estado inteiro, não só a etapa.
- **"Simular validação"** só nas pausas que dependem do usuário.

**Piloto = N4 inteiro.** Validado o padrão, propaga pro resto (N6 em diante).

**Why:** narrar tela a tela pra quem não construiu expõe buraco que construir não expõe — construir assume contexto que a plateia não tem.

**How to apply:** todo achado de UX/UI que surgir lapidando a apresentação entra em **`produto/_flow/achados-apresentacao.md`** (nota própria, criada 29/07 a pedido do Pedro) — o `compilado-ux-flow.md` guarda só um ponteiro na rodada #6. **IDs seguem a série do compilado** (UX-60+), pra não haver duas numerações. Cada item tem 2 status: 🟢 aplicado na apresentação × ✅ aplicado no flow original.

**Ordem travada:** aplico **primeiro na `/apresentacao`** (é lá que a gestão vê); o flow de produção só muda quando o Pedro mandar.

Primeiro item: **UX-60 — o N4 não tinha volta pro N3 (fork)** → 🟢 aplicado na demo (seta no header do N4; o N3 fork + gate de cidade BH viraram etapas reais da apresentação pra o voltar ter destino), 🔴 pendente no `/gate` real. A pergunta que a demo faz e a construção não fazia: *"e se a pessoa errou o passo anterior?"* — o wizard foi otimizado inteiro pra frente e nunca modelou arrependimento.

Ver [[legalize-log-ux-flow-e-regra-ui]] · [[legalize-telas-padrao-layout]] · [[legalize-pedro-confere-ui-sozinho]].
