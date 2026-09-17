---
tipo: derivado
status: vivo
data: 2026-09-17
assunto: funcionalidades-core-me-simples
gerado_por: produto/me/viver/funcionalidades/gerar-funcionalidades.mjs
tags: [produto, funcionalidades, semaforo, mvp]
---

# 📱 As 58 funcionalidades core do ME no Simples

> ⚠️ **Nota gerada.** Não editar à mão: rode `node produto/me/viver/funcionalidades/gerar-funcionalidades.mjs`. A fonte é `funcionalidades-data.mjs`.
>
> **A lista é a que foi ao Mauro em 11/09** (`funcionalidades-legalizai.pdf`), ratificada pelo Pedro em 12/09 como a lista core oficial: a **folha de pagamento entra no MVP**, e saem "acesso do 2º sócio" e "pagar o DAS dentro do app".
>
> 🔴 **O semáforo é DERIVADO, não digitado.** 🟢 tem tela e tem processo · 🟡 tem só um dos dois · 🔴 não tem nenhum. As duas perguntas são checadas contra arquivo real a cada rodada: a rota existe em `app/src/app`, o passo existe em `processos-data.mjs`. Referência quebrada derruba o gerador.
>
> ⚠️ **Numeração:** é a do PDF, e ela difere do `_catalogo.md` em §1 e §2 por causa dos dois cortes. Ao citar, escreva o nome junto do número.
>
> ⚠️ **Onde este semáforo NÃO chega.** "Tem tela" quer dizer que **a rota existe**, não que ela entrega a funcionalidade inteira; "tem processo" quer dizer que existe passo desenhado, não que ele está resolvido (a luz do passo é outra, e mora no `/processos`). Um 🟢 aqui significa *"sabemos onde acontece e o que acontece"*, nunca *"está pronto"*. Qualidade de tela segue sendo olho humano no print, igual à trava de anatomia do MEI e ao selo de insumo.

## Placar

**🟢 19 · 🟡 27 · 🔴 12**

| | Significa | Quantos |
|:--:|---|:--:|
| 🟢 | tem tela **e** tem processo | 19 |
| 🟡 | tem tela sem processo, ou processo sem tela | 27 |
| 🔴 | só o nome | 12 |

**40 têm tela** · **25 têm processo desenhado**

## 🏠 Home e navegação

🟢 0 · 🟡 5 · 🔴 0

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟡 | 1.1 | Home “o que fazer hoje”, com um foco por vez | `/inicio` | — |
| 🟡 | 1.2 | Home do dia 1, para quem acabou de abrir | `/home-dia1` | — |
| 🟡 | 1.3 | Navegação em 4 abas, com emitir nota no centro | `app/src/app/(app)/(portal)/layout.tsx` | — |
| 🟡 | 1.4 | Central de avisos — precisa de você · aconteceu na conta · vale saber · momento | `/avisos` | — |
| 🟡 | 1.5 | Conteúdo e micro-educação | `/blog` | — |

**1.1 · Home “o que fazer hoje”, com um foco por vez**

A home não é processo: ela é a LEITURA de todos os outros. Só vai poder dizer o foco do dia quando os processos que a alimentam existirem.

**1.4 · Central de avisos — precisa de você · aconteceu na conta · vale saber · momento**

🔴 Onze passos do P1 ao P5 terminam em “avisa”, e nenhum processo desenha o canal. É o candidato mais forte a processo próprio: hoje cada passo promete um aviso que ninguém sabe como sai.

## 🏛 Impostos

🟢 5 · 🟡 1 · 🔴 2

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟢 | 2.1 | O DAS do mês: valor, vencimento e composição | `/impostos` | **P2.1** Apura e emite a guia do mês |
| 🟢 | 2.2 | Baixar a guia e copiar o código de barras | `/impostos/pagar` | **P2.1** Apura e emite a guia do mês |
| 🟢 | 2.3 | Histórico de guias pagas | `/impostos/guias` | **P2.6** Guia quitada, e o mês fecha |
| 🟡 | 2.4 | Saber que foi pago sem perguntar ao cliente | — | **P2.2** Marca “já paguei”, se quiser · **P2.3** Passou o vencimento? · **P2.4** Consulta a arrecadação e descobre sozinha · **P2.5** A guia foi paga? |
| 🟢 | 2.5 | Minhas alíquotas: anexo, ISS e Fator R abertos | `/impostos/aliquotas` | **P5.9** Entra no Fator R, e a alíquota se sustenta |
| 🟢 | 2.6 | Recalcular e reemitir guia vencida | `/mais/servicos` | **P2.7** Venceu sem pagar: oferece refazer a guia |
| 🔴 | 2.7 | Simulador de impostos do mês seguinte | — | — |
| 🔴 | 2.8 | Débito automático do DAS | — | — |

**2.4 · Saber que foi pago sem perguntar ao cliente**

É o diferencial nº 1 do teardown e o caso mais claro de “processo sem tela”: quatro passos desenhados, nenhuma tela. Era 🔴 sem caminho até o P2 existir.

**2.5 · Minhas alíquotas: anexo, ISS e Fator R abertos**

⚠️ PARCIAL: o P5.9 mantém o Fator R e o anexo que vale no mês. A composição do ISS de BH e a memória de cálculo não vêm de processo nenhum, vêm do motor fiscal.

**2.7 · Simulador de impostos do mês seguinte**

Mesma engine do 2.1 rodando com notas hipotéticas. Sem dependência externa: é trabalho nosso, não bloqueio de terceiro.

**2.8 · Débito automático do DAS**

⚠️ Não confundir com o “pagar o DAS no app”, que SAIU do escopo em 12/09. Este sobrevive como benefício de plano e exige mandato bancário.

## 🧾 Notas fiscais

🟢 5 · 🟡 3 · 🔴 1

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟢 | 3.1 | Emitir NFS-e pedindo só valor e cliente | `/emitir` | **P3.3** Pede só o valor e o cliente · **P3.5** Transmite ao Emissor Nacional · **P3.6** O órgão aceitou? · **P3.7** Nota emitida, e a receita entra na conta |
| 🟢 | 3.2 | Lista e gestão das notas emitidas | `/notas` | **P3.7** Nota emitida, e a receita entra na conta · **P6.12** Substitui: nasce a nota nova, ligada à velha |
| 🟢 | 3.3 | Ver, baixar e enviar a nota | `/notas/detalhe` | **P3.7** Nota emitida, e a receita entra na conta |
| 🟢 | 3.4 | Cancelar, corrigir e reemitir | `/notas/detalhe` | **P6.7** ◆ Cancelar, substituir ou corrigir? · **P6.8** Confirma com a nota inteira na tela · **P6.9** Pede o cancelamento e espera o município · **P6.12** Substitui: nasce a nota nova, ligada à velha · **P6.13** ■ Corrige o que não mexe em imposto, e guarda no log |
| 🟢 | 3.5 | Cadastro de clientes, PJ e pessoa física | `/emitir` | **P3.3** Pede só o valor e o cliente |
| 🟡 | 3.6 | Sugestão do código do serviço | — | **P3.4** Sugere o código do serviço |
| 🟡 | 3.7 | Importar notas emitidas fora do app | — | **P3.10** Emitiu fora: a nota precisa entrar aqui |
| 🔴 | 3.8 | Registrar notas recebidas de fornecedores | — | — |
| 🟡 | 3.9 | Nota emitida pela nossa equipe | `/mais/servicos` | — |

**3.2 · Lista e gestão das notas emitidas**

O P6.12 entra aqui por um motivo de desenho: nota substituída NÃO some da lista. As duas ficam, ligadas, com a velha marcada — senão o histórico mente sobre o que foi faturado em cada mês.

**3.3 · Ver, baixar e enviar a nota**

⚠️ PARCIAL: o P3.7 guarda número, PDF e XML. Enviar por canal (WhatsApp, e-mail) não é passo de processo nenhum.

**3.4 · Cancelar, corrigir e reemitir**

🔑 O nome junta TRÊS ações com consequências diferentes, e o P6 as separa: **cancelar** (a nota deixa de valer e a receita cai), **substituir** (nasce nota nova ligada à velha nos dois sentidos) e **corrigir** (muda o que não mexe em imposto). 🔴 Mudar valor não é correção, é substituição — tratar as duas como a mesma coisa faz a receita da competência mentir sem ninguém ver.

**3.8 · Registrar notas recebidas de fornecedores**

Entrada manual ou OCR. Era “fora do MVP” no catálogo; entrou na lista do Mauro sem decisão registrada.

**3.9 · Nota emitida pela nossa equipe**

Avulso: o P4 cobre pedir e cobrar, não executar. Por definição é humano.

## 👥 Pró-labore e sócios

🟢 4 · 🟡 2 · 🔴 1

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟢 | 4.1 | Pró-labore interativo: mexe e vê o imposto mudar | `/pro-labore` | **P5.2** Calcula o que mantém o Anexo III · **P5.3** Mexe e vê o imposto mudar · **P5.6** Confirma o valor do mês |
| 🟢 | 4.2 | Fator R com alerta antes de virar a faixa | `/pro-labore` | **P5.11** Avisa ANTES de virar a faixa |
| 🟢 | 4.3 | Sem pró-labore em mês sem faturamento | `/pro-labore` | **P5.4** Faturou neste mês? · **P5.5** Sem faturamento, sem pró-labore |
| 🔴 | 4.4 | Recibo de pró-labore e informe de rendimentos | — | — |
| 🟡 | 4.5 | Guia do INSS do pró-labore | — | **P5.7** Declara e gera a guia do INSS |
| 🟢 | 4.6 | Duplo vínculo: CLT e sócio na mesma conta | `/mais/socios` | **P5.3** Mexe e vê o imposto mudar |
| 🟡 | 4.7 | Alterar pró-labore de mês já processado | `/mais/servicos` | — |

**4.4 · Recibo de pró-labore e informe de rendimentos**

Documento gerado pelo motor, sem API externa. O P5 declara e gera a guia, mas nenhum passo produz o recibo nem o informe anual.

**4.6 · Duplo vínculo: CLT e sócio na mesma conta**

⚠️ PARCIAL: o dado é captado na constituição (tela C2) e entra no cálculo do P5.3. O que não existe é a apresentação da folga do teto do INSS, que é o que a pessoa precisa entender.

**4.7 · Alterar pró-labore de mês já processado**

Avulso: retificação de obrigação acessória, exige contador. O P4 cobre pedir e cobrar, não executar.

## ✅ Estar em dia

🟢 1 · 🟡 5 · 🔴 0

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟡 | 5.1 | “Você está em dia”, sem jargão | `/mais/em-dia` | — |
| 🟡 | 5.2 | Declarações entregues: DEFIS, DCTF, SPED | `/mais/declaracoes` | — |
| 🟡 | 5.3 | Calendário de obrigações do mês | `/obrigacoes` | — |
| 🟢 | 5.4 | Vigília fiscal preditiva: avisa antes do problema | `/inicio` | **P5.11** Avisa ANTES de virar a faixa |
| 🟡 | 5.5 | Verificação de pendências nos órgãos | `/mais/servicos` | — |
| 🟡 | 5.6 | Relatórios contábeis: DRE, balanço, razão | `/mais/relatorios` | — |

**5.1 · “Você está em dia”, sem jargão**

Como a home, é leitura dos outros: deriva de obrigações do período × entregues. Não vai poder afirmar “em dia” enquanto ninguém desenhar quem entrega o quê.

**5.4 · Vigília fiscal preditiva: avisa antes do problema**

⚠️ PARCIAL, e é o diferencial nº 2: o P5.11 vigia só o Fator R. O teto do Simples e a virada de faixa de RBT12 não têm passo nenhum.

**5.5 · Verificação de pendências nos órgãos**

Avulso sob demanda. ⚠️ O catálogo trava que o MONITORAMENTO passivo fica grátis e core; só a consulta avulsa se cobra. O monitoramento não tem tela nem processo.

## 📄 Documentos e certificado

🟢 1 · 🟡 5 · 🔴 0

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟡 | 6.1 | Documentos da empresa num lugar só | `/mais/documentos` | — |
| 🟢 | 6.2 | Certificado digital resolvido nos bastidores | `/mais/certificado` | **P3.9** O certificado está válido? · **P3.11** Emissão parada: falta o certificado |
| 🟡 | 6.3 | Emissão de certidão negativa | `/mais/servicos` | — |
| 🟡 | 6.4 | Declaração de faturamento, para abrir conta PJ | `/mais/servicos` | — |
| 🟡 | 6.5 | DECORE, comprovante de renda do sócio | `/mais/servicos` | — |
| 🟡 | 6.6 | Dados da empresa sempre atualizados | `/mais/empresa` | — |

**6.2 · Certificado digital resolvido nos bastidores**

⚠️ PARCIAL, e a fronteira importa: o P3 trata o certificado como GATE (está válido? senão para a emissão). A obtenção e a renovação são da certificadora parceira, e a plataforma interna que recebe o arquivo e a senha ainda não existe.

**6.3 · Emissão de certidão negativa**

Avulso: o P4 cobre pedir e cobrar, não executar.

**6.4 · Declaração de faturamento, para abrir conta PJ**

🔴 Candidato a virar CORE (catálogo): é dor do dia 1 do nosso ICP, e cobrar por isso é o que a gente critica no líder. Decisão nunca tomada.

**6.5 · DECORE, comprovante de renda do sócio**

Avulso: exige protocolo no CRC pelo contador. Não automatizável.

## 💳 Plano e cobrança

🟢 3 · 🟡 4 · 🔴 0

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟢 | 7.1 | Plano, próxima fatura e avulsos contratados | `/mais/plano` | **P1.1** Monta a fatura do ciclo · **P1.6** Dá baixa e o ciclo segue · **P4.7** Entra como item de linha · **P4.11** O ciclo vira e a fatura soma tudo |
| 🟡 | 7.2 | Trocar a forma de pagamento | `/mais/plano` | — |
| 🟢 | 7.3 | Histórico de faturas | `/mais/plano` | **P1.6** Dá baixa e o ciclo segue |
| 🟡 | 7.4 | Cancelar o plano sem punição | `/mais/plano` | — |
| 🟢 | 7.5 | Loja de serviços avulsos | `/mais/servicos` | **P4.1** Escolhe o serviço · **P4.2** Aceita o serviço, na sheet · **P4.5** Guarda o pedido e trava o preço · **P4.7** Entra como item de linha |
| 🟡 | 7.6 | Perfil, conta e acesso | `/perfil` | — |
| 🟡 | 7.7 | Reajuste anual com regra anunciada | — | **P1.2** O preço mudou neste ciclo? · **P1.3** Avisa o preço novo, 30 dias antes |

**7.2 · Trocar a forma de pagamento**

🔴 O P1.4 cobra NA forma cadastrada e o P1.8 oferece “trocar a forma” dentro de um aviso de inadimplência — mas trocar não é passo de ninguém. E o handoff de 12/09 abriu a pergunta antes dela: o pagamento da abertura chega a deixar uma forma salva?

**7.4 · Cancelar o plano sem punição**

🔴 É posicionamento âncora (o líder cobra R$1.406–1.999 pra sair) e não tem processo. O P4.10 trata o avulso DURANTE o cancelamento e o P1.9/P1.10 tratam a saída por inadimplência; a saída voluntária não existe em lugar nenhum. Candidato a processo próprio.

## 👷 Folha de pagamento

🟢 0 · 🟡 2 · 🔴 8

| | # | Funcionalidade | Tela | Processo |
|:--:|:--:|---|---|---|
| 🟡 | 8.1 | Cadastro do colaborador: PIS, cargo, dependentes | `/mais/colaborador` | — |
| 🔴 | 8.2 | Lançamentos do mês e fechamento da competência | — | — |
| 🔴 | 8.3 | Holerite e demonstrativo de pagamento | — | — |
| 🔴 | 8.4 | Guias da folha: INSS, FGTS e IRRF | — | — |
| 🔴 | 8.5 | Obrigações mensais — eSocial, EFD-Reinf, DCTFWeb | — | — |
| 🔴 | 8.6 | Declaração de mês sem movimento | — | — |
| 🔴 | 8.7 | Desligamento e rescisão | — | — |
| 🔴 | 8.8 | Quanto custa o colaborador, antes de contratar | — | — |
| 🟡 | 8.9 | A folha somando no Fator R junto com o pró-labore | — | **P5.9** Entra no Fator R, e a alíquota se sustenta |
| 🔴 | 8.10 | Dependentes para o IRRF | — | — |

**8.1 · Cadastro do colaborador: PIS, cargo, dependentes**

⚠️ A tela existe desde 04/08 (veio junto do Plano MEI) e a nota da capacidade, de 09/09, diz `cobertura: nao-existe`. Uma das duas está errada — conferir se a tela cobre algo ou é casca.

**8.4 · Guias da folha: INSS, FGTS e IRRF**

🔴 “Por onde sai o FGTS” é um dos 3 bloqueios declarados na nota da capacidade.

**8.5 · Obrigações mensais — eSocial, EFD-Reinf, DCTFWeb**

Mesmo trilho técnico do P5.7 (Integra Contador), que já transmite o pró-labore por S-1200. A diferença é o volume de eventos, não o caminho.

**8.6 · Declaração de mês sem movimento**

🔑 O líder cobra por isso (R$71,90), o que prova a regra do negócio: contratar folha cria obrigação mensal PERMANENTE, mesmo em mês parado. O simulador do 8.8 precisa dizer isso antes.

**8.8 · Quanto custa o colaborador, antes de contratar**

É a versão-folha do pró-labore interativo (4.1), que é o diferencial-âncora do produto. Mesma tese: mostrar a conta em vez de pedir confiança.

**8.9 · A folha somando no Fator R junto com o pró-labore**

⚠️ PARCIAL, e é a costura das duas seções: o P5.9 já soma “a folha dos 12 meses” no Fator R. O que não existe é o que ALIMENTA essa folha — hoje ela só tem pró-labore dentro.

**8.10 · Dependentes para o IRRF**

🔄 MUDOU DE SEÇÃO EM 14/09 (Pedro): era o **4.7**, em §4 Pró-labore. O Pedro travou em 13/09 que NÃO captamos dependente de SÓCIO — dependente existe só em folha, para colaborador. Então o IRRF do pró-labore sai **sem dedução por pessoa a cargo**, e o desconto simplificado é a única via. ⚠️ **A renumeração foi forçada, não escolhida:** o gerador exige numeração contígua dentro da seção, então o antigo 4.8 (*Alterar pró-labore de mês já processado*) virou **4.7**. Ao citar, escreva o nome junto do número — a regra do cabeçalho vale em dobro aqui.

## O que cada processo realiza

> A seta do outro lado: dos 62 passos desenhados, quais viram funcionalidade na lista. Passo que não aparece aqui é mecânica interna, não promessa ao cliente — não é defeito por si só.

| Processo | Funcionalidades que ele realiza |
|---|---|
| **P1** | 7.1 · 7.3 · 7.7 (3) |
| **P2** | 2.1 · 2.2 · 2.3 · 2.4 · 2.6 (5) |
| **P3** | 3.1 · 3.2 · 3.3 · 3.5 · 3.6 · 3.7 · 6.2 (7) |
| **P4** | 7.1 · 7.5 (2) |
| **P5** | 2.5 · 4.1 · 4.2 · 4.3 · 4.5 · 4.6 · 5.4 · 8.9 (8) |
| **P6** | 3.2 · 3.4 (2) |

**37 dos 79 passos** realizam alguma funcionalidade da lista. Os outros 42 são mecânica interna (decisões, esperas, gates, passos que só a casa vê).

## Nota de fonte

Gerado de `funcionalidades-data.mjs`. As rotas são validadas contra `app/src/app` (respeitando os route groups) e os ids de passo contra `produto/me/viver/processos/processos-data.mjs`. A luz de cada linha é calculada, nunca escrita — é o que separa esta nota do `_catalogo.md` e do campo `cobre` do `portal-data.mjs`, que envelheceram porque o status era digitado.
