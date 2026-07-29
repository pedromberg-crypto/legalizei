---
tipo: verdade
status: vivo
data: 2026-07-29
assunto: achados-ux-apresentacao
tags: [produto, ux, ui, flow, apresentacao, log, backlog]
---

# 🔬 Achados da APRESENTAÇÃO — log vivo

> **O que é:** os buracos de UX/UI que aparecem enquanto a gente monta e lapida a `/apresentacao` (a demo pra gestão da Legalize Digital). Caderno próprio, alimentado em tempo real; os itens são numerados na mesma série do [[compilado-ux-flow]] (UX-NN) pra não existirem dois sistemas de ID.
>
> **Por que existe separado:** o compilado nasce de **bateria de personas** (motor de testes). Este nasce de **narrar o flow em voz alta pra quem não construiu**. São lentes diferentes e é honesto manter a origem visível — quando um item daqui for aplicado, ele **não passou pelo motor**, e as personas afetadas precisam ser revalidadas.

## ⚙️ Como funciona (combinado com o Pedro, 29/07)
1. Achou algo lapidando a apresentação → entra aqui na hora, com ID.
2. **Aplico primeiro na `/apresentacao`** (é lá que a gestão vai ver).
3. O **flow original** (rota de produção) só muda quando o Pedro mandar — por isso as duas colunas de status.

## 🔗 Fidelidade: linkada × deslinkada (regra travada 29/07)
**Por padrão a apresentação renderiza o componente APROVADO**, o mesmo que a rota de produção usa. Não existe cópia — a v1 tinha, e divergiu em 1 dia (o N3 da demo perdeu o Lottie, os ícones e o layout dos cards sem ninguém notar).

Pra isso as telas viraram **fonte única**, mesmo padrão que `VereditoView`/`EncaixeView` já seguiam:

| Componente | Arquivo | Consumido por |
|---|---|---|
| `EntradaView` (N3 fork + gate cidade) | `components/entrada.tsx` | `/entrada` · `/apresentacao` |
| `PerguntaView` · `AnalisandoView` · `TriagemView` · `FaixaView` (N4) | `components/gate-telas.tsx` | `/gate` · `/apresentacao` |
| `VereditoView` | `components/veredito.tsx` | `/gate` · esteira A2 · `/apresentacao` |
| `EncaixeView` + `ConteudoCnae` + `OutrasOpcoes` | `components/encaixe.tsx` | `/gate` · `/encaixe` · `VereditoView` · `/apresentacao` |
| `SaidaView` | `components/saida.tsx` | as 3 saídas A9 · `/apresentacao` |
| `ContaView` · `PlanoView` · `ContratoView` · `PagamentoView` (**B3**, 29/07) | `components/wizard-dinheiro.tsx` | `/conta` · `/plano` · `/contrato` · `/pagamento` · `/apresentacao` |

As pages de produção viraram **wrappers finos**: guardam estado e ligam a navegação (`router`). Nenhum pixel mudou.

**Quando eu edito uma tela na apresentação, ela DESLINKA:**
- ganha selo **🔓 Deslinkada da oficial · [ID]** acima do aparelho (o resto mostra 🔗 *Tela aprovada, sem alteração*);
- o painel da direita ganha bloco âmbar **"Esta tela foi editada aqui (ainda não está no app)"** com o que mudou e o status;
- entra na tabela abaixo. O flow de produção **só muda depois da validação do Pedro**.

## Legenda
- 🔴 **aberto** · 🟢 **aplicado na apresentação** · ✅ **aplicado no flow original** · 🟡 **parcial / depende de decisão**

## 📋 Itens

| ID | Tela | Achado | Na apresentação | No flow original |
|---|---|---|---|---|
| UX-60 | N4 · Gate-CNAE | **Não existe volta pro N3 (fork).** Quem escolheu "Quero abrir minha empresa" e caiu no gate não consegue voltar pra trocar por "Já tenho empresa" (flow #2) ou "Entrar na minha conta". A única saída é o browser. | 🟢 29/07 — seta no header do N4 volta pro gate de cidade; o N3 (fork + gate BH) virou etapa real da demo, então o voltar tem destino de verdade | 🔴 |
| — (demo) | N4 · Veredito 🔴 | O split **"Mauro atende" × "ninguém atende"** ainda é *mock estático por página* no `/gate`: as 3 vias existem como telas, mas não saem do mesmo campo. Na demo isso apareceria como truque. | 🟢 29/07 — `mapear` da demo estendido com o ramo rural, pros 3 desfechos saírem do MESMO texto digitado | 🟡 depende da lista de CNAEs (fila Larissa) |
| 🐛 BUG-01 | N3 · Fork + gate de cidade | **Estado vazava entre as duas intenções.** Repro (achado pelo Pedro na 1ª validação tela a tela): "Já tenho empresa" → "Sim, é em BH" → card *"essa parte ainda não existe"* → voltar → "Quero abrir minha empresa" → **aparecia o card do migrar**. Quem escolheu ABRIR via a tela de MIGRAR. Causa: `migrarEmBreve` é estado interno do `EntradaView` e ninguém o zerava ao trocar de intenção. | ✅ corrigido | ✅ **corrigido na fonte** (`components/entrada.tsx`) — é defeito, não mudança de design, então foi direto pro oficial |
| UX-61 | N3 · Gate de cidade | **O estado "migrar ainda não existe" é beco sem saída:** o botão "Voltar" some (`{!migrarEmBreve && …}`), e não há nenhuma outra saída. Quem clicou em "Já tenho empresa" e confirmou BH fica preso na tela. | 🟢 sai pela seta externa da demo | 🔴 |
| UX-62 | N3G → Saída fora de BH | **O CTA "Não é em BH" não levava a lugar nenhum na demo**, e a saída que existe em produção é uma captura genérica: não pergunta QUAL cidade (waitlist geográfica sem cidade não diz pra onde expandir) e promete "falamos em até 1 dia útil", que nessa saída não se cumpre. | 🟢 29/07 — lista de espera classificada: etiqueta `Outra cidade` + **autocomplete de município validado contra a base do IBGE** (só vale o que for escolhido da lista) + CTA "Me avisem quando chegarem aqui" + confirmação honesta | 🔴 pendente em `/saida/fora-bh` |

| UX-63 | N3 · Fork de 3 rotas | Card de destaque ("Quero abrir minha empresa") usa **coral-700**, enquanto o botão "Sim, é em BH" usa **coral-600** — duas telas seguidas, dois corais. Pedro pediu unificar no coral-600. | 🟢 29/07 (prop `destaqueCoral600`) | 🔴 **decisão pendente** — ver ressalva abaixo |
| 🐛 BUG-02 | Toda tela de confirmação | **O selo verde dizia "Achei o seu encaixe" em TODA confirmação** — inclusive na waitlist e na saída de cidade, onde ninguém encaixou em nada. A frase era fixa por tipo de selo (`sucesso`), e o comentário do código dizia que o verde marcava "a AÇÃO deu certo", mas a frase nunca foi trocada junto. Copy que mente na tela terminal. | ✅ corrigido | ✅ **corrigido na fonte** — `Selo` aceita `frase`; waitlist diz "Você entrou na lista", 🔴 diz "Seu contato chegou", saída de cidade diz "Recebemos o seu contato" |
| UX-64 | Confirmações 🟡 waitlist · 🔴 contato especial · 🔴 fora de escopo | **Telas terminais sem saída.** A waitlist só oferece "Falar com um contador agora" (quem não quer falar com ninguém agora fica sem rumo); o 🔴 enviado e o **decline limpo** (fora de escopo) não têm CTA nenhum — becos puros. | 🟢 29/07 — as três ganharam "Ler o blog" · "Conhecer o site" (coral) · "Voltar ao início" | 🔴 pendente no `VereditoView` |
| ⏳ pendência | Confirmações (waitlist · 🔴 · cidade) | Os CTAs **"Ler o blog"** e **"Conhecer o site"** apontam pra páginas que não existem como rota do app (o `/blog` atual é o do portal LOGADO). | 🟢 visíveis, sem destino | 🔴 criar blog público + site institucional |

| UX-65 | 🟢 Atende | Só mostrava o CNAE recomendado num card simples. Agora: **card principal com o layout do ENCAIXE** (pill ★ Recomendado · par de stat cards · "o que esse CNAE cobre") + **% compatível** em badge, e **"Outras opções compatíveis" clicáveis** — tocar promove a opção pro topo e devolve a antiga pra lista. | 🟢 29/07 | 🔴 pendente no `VereditoView` |
| UX-66 | ENCAIXE + 🟢 Atende (card verde) | **"O mais barato / que serve / pra você"** era linguagem de varejo: "barato" fala de preço de produto, e o assunto ali é imposto. | ✅ aplicado | ✅ **em produção** — virou **"Imposto / mais baixo / entre os que servem"**. O rodapé preserva a regra 3 do ENCAIXE (garante o SETUP, não o resultado: não é "o menor imposto possível", é o menor entre os códigos que cobrem a atividade). Decisão do Pedro 29/07. |
| ⚠️ decidir | 🟢 Atende × ENCAIXE | **As duas telas agora fazem a mesma pergunta, e não conversam.** A troca feita no Atende não chega no Encaixe (que remonta a lista do CNAE original): promover "Design gráfico" no veredito e seguir mostra "Criação de sites" como recomendado na tela seguinte. | 🟡 contradição visível na demo | 🔴 **decisão de produto** |

| UX-67 | N4 · Triagem | Pergunta "alguém mora fora do Brasil?" aparece mesmo quando a pessoa marcou **"Só eu"**. | 🟢 29/07 — condicional: some no solo | 🔴 **decisão** — ver ressalva fiscal abaixo |
| UX-74 | N7 · A conta da abertura | A tela mais comercial do flow não vendia: dois cards e uma linha de taxa. Reconstruída como **oferta** — âncora verdadeira (escritório tradicional cobra honorário, a gente não) · o plano vira **produto** (card escuro com os 7 itens inclusos, em linguagem de dono, escopo espelhado do benchmark) · **FAQ** que desarma as 4 objeções reais · prova dos 22 anos do escritório. | 🟢 29/07 | 🔴 pendente (`layout="oferta"`) |
| UX-71 | N6 · Criar conta | Recriado com o **layout do login** (painel escuro sangrando com marca centralizada + folha clara sobreposta, campos com ícone). Ajustes de leitura: **1 campo por linha** (CPF e telefone lado a lado cortavam o valor mascarado) e o endereço do CEP **não trunca mais** (cortar o logradouro esconde justo o que a pessoa precisa conferir). | 🟢 29/07 | 🔴 pendente (`layout="painel"`) |
| UX-72 | N6 · Criar conta | Google/Apple eram botões decorativos. Agora **conectam**: nome e e-mail vêm do provedor, a tela mostra "conectado como…" (com "Trocar") e pede **só o que falta** — CPF, telefone e endereço, que nenhum provedor entrega. Senha some, porque conta social não tem. | 🟢 29/07 | 🔴 pendente |
| UX-73 | N6 · Criar conta | "É a primeira empresa que você abre?" virou **obrigatória**, inclusive no cadastro social. | 🟢 29/07 | 🔴 **decisão** — conflita com UX-48, ver abaixo |
| UX-70 | N4 · Triagem + Faixa | Botão selecionado era **tint claro + borda coral** (`bg-surface-tint-brand`), destaque fraco perto das pills do gate, que já são coral preenchido. Virou **coral com texto branco** nos 4 grupos de opção (sócios · exterior · faixas). | ✅ aplicado | ✅ **em produção** (decisão do Pedro 29/07) · ⚠️ **herda o dilema do UX-63**: ver abaixo |
| UX-69 | N4 · Faixa de faturamento | Título ganhou **"Pode ser estimativa!"** (2ª parte em tom secundário, mesmo padrão do N3). Tira a pressão de acertar o número antes de a pessoa olhar as opções. O subtítulo parou de repetir "estimativa" e ficou só com o acolhimento de quem já sabe o valor. | ✅ aplicado | ✅ **em produção** (copy, decisão do Pedro 29/07) |
| UX-68 | N4 · Faixa de faturamento | "Sei o valor exato" **trocava a tela inteira** (as faixas sumiam), fazendo parecer que a pessoa saiu do passo — justo quando ela precisa da referência pra digitar um número que vai cair numa daquelas faixas. | 🟢 29/07 — campo revela **abaixo** das faixas; tocar numa faixa limpa o valor digitado | 🔴 pendente no `FaixaView` |
| 🗑️ ENCAIXE | Demo | Depois do UX-65, o **Atende** passou a fazer o mesmo trabalho do ENCAIXE (escolher entre os CNAEs compatíveis). Duas telas, uma pergunta. | 🟢 29/07 — removido da apresentação (veredito 🟢 segue direto pra triagem) | 🔴 a rota `/encaixe` continua em produção |

## 🧠 Notas por item

### UX-60 — o N4 não volta pro N3
**O raciocínio que sustenta o item** (pra não virar "porque sim" depois): o wizard ser *fullscreen, sem nav, sem saída lateral* é decisão travada (`app/src/app/(wizard)/layout.tsx`) e continua certa — mas **não implica** ausência de "voltar um passo". São duas coisas: *navegação entre seções* (que o wizard não tem, de propósito) × *desfazer o passo anterior* (que todo formulário longo precisa).

⚠️ **Não confundir com "Não é bem isso, refazer"** (veredito): aquele volta DENTRO do N4, refazendo a descrição. O que falta é **sair** do N4 pro N3.

**Custo do erro hoje:** errar o fork é plausível (as duas primeiras opções são parecidas pra quem não conhece o produto) e custa a sessão inteira. Com seta, custa um toque.

**Como ficou na apresentação:** a seta aparece só no N4 (`etapa === "perguntando"`), no header, à esquerda de "Legalizai" — o mesmo lugar/afordance do `TelaHeader voltar` que o portal já usa. É **diferente da seta externa** da apresentação (aquela é controle da demo, fica fora do aparelho).

### BUG-01 / UX-61 — o que a 1ª validação tela a tela entregou
**O bug não era da apresentação, era do produto.** A demo só o tornou *visível*, porque ela permite voltar e reescolher — coisa que a rota de produção nem oferece (é o próprio UX-61: uma vez em "migrar ainda não existe", não há saída). Ou seja: **o beco escondia o vazamento de estado**. Consertar o UX-61 sem consertar o BUG-01 teria exposto o bug pro usuário real.

⚠️ **Regra que isso estabelece:** *defeito* (comportamento errado) eu corrijo direto na fonte única — não faz sentido segurar bug esperando validação. *Mudança de design* (UX-60, UX-61) fica deslinkada até o Pedro validar. A distinção é: o código está fazendo o que foi projetado (→ design) ou não (→ bug)?

### UX-62 — a saída de cidade é ativo de expansão, não descarte
Duas coisas que a validação tela a tela expôs:

1. **Sem a cidade, a lista não serve pra nada.** A saída capturava nome + contato e mandava embora. Mas o valor dessa fila não é o lead individual: é o **agregado** — 40 pessoas de Contagem é sinal de para onde expandir; 40 e-mails sem cidade é uma newsletter. Por isso o campo é obrigatório.
2. **A confirmação mentia.** O template de saída é compartilhado com as saídas de triagem (exterior, 3+ sócios), onde "nosso time fala com você em até um dia útil" é verdade — um humano assume o caso. Numa waitlist de cidade ninguém vai ligar amanhã. Copy honesta é regra do projeto, então a confirmação virou sobrescrevível e esta saída promete só o que cumpre.

3. **Campo livre não valida nada.** Lista de espera geográfica com input aberto coleta "sp", "minha cidade", "Uberlandiaa" — e aí o agregado do item 1 não existe, porque não dá pra contar o que não é canônico. Virou **autocomplete contra a base do IBGE** (`components/campo-municipio.tsx`): digitar não seleciona, só vale tocar numa sugestão; editar depois de escolher **invalida** a escolha (senão dava pra selecionar "Uberlândia" e emendar " do Norte").

⚠️ Implementação: as capacidades novas do `SaidaView` (`tag`, `extra`, `confirmacao`, `ctaEnviar`) são **props opcionais** — as saídas antigas não passam nada e seguem idênticas. Produção intacta.

📦 **Dado congelado, não API:** os 5.570 municípios vieram de `servicodados.ibge.gov.br/api/v1/localidades/municipios` e estão em `app/public/dados/municipios.json` (~190KB, `[nome, UF, UF-nome]`). Congelar é decisão, não preguiça: a demo roda em reunião e depender de rede pra um autocomplete é convite pra falhar na hora errada. Regerar só quando o mapa municipal mudar (raro — a última alteração relevante foi 2013).
⚠️ Isto **não** entra na regra de autoridade de `pesquisa/integracoes-apis/` — aquilo é consulta de documento (CNPJ/CPF/certidão). Isto é uma lista de nomes.

### UX-63 — coral-600 no card do fork: o número, pra decidir com dado
O pedido faz sentido de UI (duas telas seguidas com dois corais diferentes lê como inconsistência). Mas o coral-700 ali **não é escolha estética, é o token `action-primary-sm`**, criado exatamente pela regra AA travada em 12/07. Medido:

| Fill | Contraste com branco | AA texto normal (4,5:1) |
|---|---|---|
| coral-600 `#DD4E27` | **4,04:1** | ❌ falha |
| coral-700 `#B83D1C` | **5,64:1** | ✅ passa |

O título do card é `text-body` **bold 16px** — não alcança o piso de texto grande (18,66px bold), que exigiria só 3:1. Então no coral-600 o card fica fora de AA.

**Três saídas, e a escolha é do Pedro:**
1. **Manter coral-700 no card** (aprovado hoje) — o botão continua 600, o card 700; a inconsistência é proposital e documentada.
2. **Ir pra coral-600 e aceitar 4,04:1** — assume-se a falha AA nesse card.
3. **Coral-600 + subir o título pra ≥18,66px bold** — vira "texto grande", passa com 3:1, e os dois corais ficam iguais. É a única que resolve os dois lados.

⚠️ Enquanto não decidir, a demo mostra a opção 2 (deslinkada) e a produção segue na 1.

### UX-74 — vender sem quebrar as regras da tela
O N7 é oferta, mas é oferta de **contabilidade**: a confiança é o produto. Por isso o que **não** entrou é tão relevante quanto o que entrou.

**Ficou de fora, de propósito:** contagem regressiva, "vagas limitadas", preço riscado inventado, "de R$X por R$Y". Escassez falsa numa tela que vende serviço contábil queima exatamente o ativo que os 22 anos do escritório constroem, e o público-alvo (quem está abrindo CNPJ) é o mais desconfiado que existe.

**A âncora usada é verdadeira:** escritório tradicional cobra honorário de abertura, e o nosso é zero. Não precisa inventar desconto quando o diferencial real já é grande.

**As 4 regras travadas seguem intactas:**
1. Os 3 baldes separados (grátis · taxa de governo · mensalidade).
2. "Grátis" = honorário zero, **não** governo zero. A taxa da Junta continua com valor visível.
3. Total do dia conferível no rodapé, colado no CTA.
4. Preço marcado como referência (é placeholder declarado no `lib/fiscal`).

**O FAQ é conversão E honestidade ao mesmo tempo:** as 4 perguntas são as objeções que a pessoa já tem na cabeça ("onde está a pegadinha?", "por que fidelidade?", "e se eu desistir?", "a mensalidade muda?"). Respondê-las na tela onde nascem tira o atrito sem precisar de truque.

### UX-73 — coorte obrigatória × UX-48, e a escolha é real
O UX-48 travou a coorte como **dado puro**: *"as duas respostas veem as mesmas telas, na mesma ordem"* e por isso ela é **pulável sem custo**. O racional: não cobrar fricção por algo que **não muda nada** no que vem depois. A regra irmã ("nunca rotular a pessoa") continua intacta aqui — obrigar a responder não é o mesmo que chamar alguém de leigo.

**O argumento a favor de obrigar:** dado opcional em onboarding tem resposta enviesada (quem pula não é aleatório), e a coorte existe justamente pra decidir COM DADO se vale bifurcar ritmo. Amostra torta serve mal a essa decisão.

**O argumento contra:** é uma pergunta a mais entre a pessoa e a conta dela, num passo que já pede 7 campos. E o UX-48 nasceu de uma persona concreta — o `reta-direto`, que odeia onboarding que prende.

**Meio-termo possível, se quiser os dois:** manter obrigatória mas oferecer explicitamente uma 3ª opção ("prefiro não dizer"). O dado continua estruturado, ninguém trava, e quem pula vira uma categoria contável em vez de um buraco.

### UX-63 + UX-70 — o coral-600 virou padrão, e a conta de AA cresceu
São o mesmo dilema em dois lugares, e agora vale tratar junto: **branco sobre coral-600 dá 4,04:1**; AA pede 4,5:1 pra texto normal e 3:1 só pra texto grande (≥18,66px bold).

| Onde | Texto | Passa AA? |
|---|---|---|
| Pills do gate (aprovadas 29/07) | 14px semibold | ❌ 4,04:1 |
| Card de destaque do N3 (UX-63) | 16px bold | ❌ 4,04:1 |
| Botões de opção da triagem/faixa (UX-70) | 16px semibold | ❌ 4,04:1 |
| `Button variant="primary"` | **18px bold** | ✅ conta como texto grande |

O token `action-primary-sm` (coral-700, **5,64:1**) existe exatamente pra esse caso e é visualmente quase idêntico. **Trocar os três pra coral-700 resolve tudo sem mudar a decisão de "ativo = coral preenchido".** Fica pro Pedro decidir: consistência com o 600 × AA.

### UX-67 — a condicional tem um furo fiscal, e ele importa
O argumento do Pedro: *"quem marcou 'Só eu' já disse lá atrás que abre em BH, então perguntar do exterior não justifica"*.

**O furo:** o gate do N3 confirma onde fica a **EMPRESA**, não onde a pessoa **MORA**. São coisas diferentes, e a lei olha a segunda: sócio domiciliado no exterior derruba o Simples (LC 123 art.17) mesmo sendo sócio único, mesmo com a empresa em BH. O caso "moro em Portugal e abro CNPJ em BH" existe e é justamente o que essa pergunta pega **antes do dinheiro** (fail-fast, UX-21). Escondendo, ele passa direto e só quebra depois de pago — que é o cenário que a reordenação de 16/07 foi feita pra evitar.

**Alternativa que resolve os dois lados:** não remover, e sim **reescrever** quando for solo — de *"Alguém mora fora do Brasil?"* pra *"Você mora fora do Brasil?"*. Fica menos estranho (era o incômodo real), sem abrir buraco de elegibilidade.

Aplicado como pediu, mas deslinkado e marcado 🔴 decisão.

### 🔍 Varredura do "voltar" no wizard (29/07)
O UX-60 não é caso isolado: varri as telas do `(wizard)` e **nenhuma** tem afordância de voltar.

`splash` · `welcome` · `entrada` · `gate` (todas as 6 etapas) · `conta` · `plano` · `contrato` · `pagamento` · `login` · as 3 saídas · os 4 vereditos.

Algumas **não devem** ter mesmo (splash é a primeira; as saídas são terminais por doutrina). Mas a travessia do dinheiro inteira — `conta` → `plano` → `contrato` → `pagamento` — não deixa a pessoa revisar o passo anterior, e ali o custo do erro é alto.

Na demo apliquei nas telas do piloto (todas menos o loading). O resto entra quando a apresentação chegar em N6+.

## 🎯 Leitura (padrão que está emergindo)
**A pergunta que a apresentação faz e a construção não fazia: _"e se a pessoa errou o passo anterior?"_.** O wizard foi otimizado inteiro pra frente — fail-fast, thumb zone, CTA único, cobrança cedo — e nunca modelou arrependimento. O UX-60 é o primeiro caso; provavelmente não é o único. **Quando a apresentação chegar em N6→N9, varrer com essa mesma pergunta.**

## Cruza com
[[compilado-ux-flow]] (log-mãe, rodada #6 aponta pra cá) · [[auditoria-copy-flow]] · [[metodo-varredura-flow]] · [[mapa-flow-mermaid]] · [[HOME]]
