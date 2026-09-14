---
tipo: verdade
status: vivo
data: 2026-09-14
assunto: persona-e-cliente-travado
autoridade: fonte-verdade
tags: [produto, persona, escopo, trava]
---

# 👤 A persona — quem é o cliente, e por consequência o que existe no produto

> ⚠️ **NOTA GERADA.** A fonte é `execucao/processos/_persona.mjs`, que é o arquivo que a trava lê. Editar aqui não muda nada e some na próxima rodada.
>
> 🧭 **Autoridade:** manda em *quem é o cliente*. O `_escopo.mjs` manda em *qual é o regime*. São coisas diferentes, e a segunda não pega a primeira.

**19 travas · 1 perguntas abertas · 🔴 1 crítica(s)**

---

## Por que este documento existe

Travado pelo Pedro em 13/09: *"nem sempre a gente está alinhado ao nosso produto de fato e à nossa persona. (…) igual vi em pró-labore do sócio com benefícios, a gente não tem essa opção do sócio ter benefício. (…) Precisamos desenhar MUITO bem o nosso usuário padrão pois ele é fixo."*

São **dois filtros diferentes**, e até 13/09 só um estava travado:

| Filtro | Pergunta que ele faz | Pega |
|---|---|---|
| **Escopo** (`_escopo.mjs`, 12/09) | isso é de outro **regime**? | ICMS, CFOP, SEFAZ, Lucro Presumido |
| **Persona** (este, 13/09) | isso é legal no nosso regime e mesmo assim **não existe no nosso produto**? | benefício de sócio, estoque, 13º de sócio |

🔴 **O caso que fez isto nascer.** Na varredura de pró-labore de 13/09 ficou escrito *"plano de saúde do sócio sai do pró-labore como desconto"*, copiado da plataforma do líder. É **perfeitamente legal** num ME Anexo III, e por isso a trava de escopo jamais ia pegar. Só que o nosso sócio não tem benefício. O nó `L26` inteiro existia por imitação.

---

## 🔒 O que está travado

| | Travado | Fonte |
|---|---|---|
| **regime** | Simples Nacional, porte ME | Pedro, 12/09 · `_escopo.mjs` |
| **anexos** | III ou V, com ou sem Fator R | Pedro, 12/09 |
| **epp** | FORA. E o produto só tem a PORTA DE SAÍDA, não a permanência | Pedro, 13/09 · contrato `minuta-contrato-me.md` linha 401 |
| **comercio** | FORA. Serviço apenas | Pedro, 15/07 e 12/09 |
| **regulamentadas** | FORA. Continuam fora | Pedro, 13/09 · já estava no `_escopo.mjs` desde 12/09 |
| **socios** | 1 (unipessoal) ATÉ 4 — o que constitui, mais até 3. Todos PESSOA FÍSICA e domiciliados no Brasil | Pedro, 13/09 · corrobora o gate-telas.tsx de 29/08 |
| **folha** | FICA no MLP. As 9 funcionalidades do §8 são produto | Pedro, 13/09 |
| **funcionario** | PODE ter. Não é o padrão, e o fluxo tem que existir | Pedro, 13/09 |
| **dependenteDoSocio** | NÃO CAPTAMOS. Dependente existe só em FOLHA, para colaborador | Pedro, 13/09 |
| **beneficioDoSocio** | NÃO EXISTE. Nenhum: plano de saúde, VT, VR, VA | Pedro, 13/09 |
| **geo** | Belo Horizonte E Minas Gerais | Pedro, 13/09 — corrigindo a minha leitura |
| **exterior** | FORA dos dois lados: nem CLIENTE do exterior, nem SÓCIO do exterior | Pedro, 13/09 |
| **entradaDoCliente** | O cliente entra no app como PESSOA FÍSICA | Pedro, 13/09 |
| **faturamento** | NÃO SE PRESUME, SE MEDE | Pedro, 13/09 |
| **emissaoDeNF** | ILIMITADA. Sem teto de notas por mês | Pedro, 13/09 |
| **papelDaCasa** | CALCULAR CERTO, GERAR A GUIA CERTA, NA DATA CERTA. Não fiscalizar o que a pessoa faz com o dinheiro dela | Pedro, 13/09 |
| **tomadorDaNota** | PF e PJ, os dois. O que muda são os campos obrigatórios | Pedro, 13/09 · pesquisa anterior da casa |
| **naoExisteUmaPersonaSo** | O produto atende uma FAIXA de comportamento, não um cliente médio. Faturamento varia mês a mês, e pode ser zero | Pedro, 13/09 |
| **personaZero** | A própria empresa do Pedro é cliente-padrão nº 1, para CONFERIR, não para definir | Pedro, 13/09 |

- **anexos** · O Anexo vale POR COMPETÊNCIA e pode virar no meio do ano. Confirmado em produção: `anexoEscolhido` viaja em cada nota.
- **epp** · 🔑 O Pedro disse "EPP que não atendemos AINDA" — é futuro, não é nunca. No contrato EPP existe só como "Desenquadramento de ME para EPP, R$ 139,00, no ato": a empresa SAI, ela não fica. Enquanto for assim, processo nenhum pode ter ramo de EPP.
- **comercio** · Comércio emite outro documento por outro sistema — FORA DO ESCOPO.
- **regulamentadas** · Conselho de classe e rito próprio de abertura. Confirmado explicitamente em 13/09, então não é herança não revisada.
- **socios** · 🔴 NÃO EXISTE "quantidade padrão", e essa foi a resposta do Pedro em 13/09: *"temos que ter a variável para unipessoal e também para até 3 sócios além do que constitui"*. Ou seja **1 a 4 é FAIXA, não default** — todo processo que toca pró-labore, INSS, IRRF ou lucro tem que funcionar com N sócios, não com um. ⚠️ A varredura de pró-labore de 13/09 foi escrita assumindo UM valor de pró-labore e precisa de repasse. 🔑 Sócio via CNPJ e sócio no exterior foram REMOVIDOS do produto, não escondidos: o Simples não aceita. Não é preferência de UI, é lei.
- **folha** · 🔴 ISTO ENCERRA UMA CONTRADIÇÃO QUE ESTAVA ESCRITA NO VAULT. Eu havia proposto em `lancamento-mlp.md` o corte *'Sai: a folha inteira (§8, 9 itens)'*, e a proposta **está morta** — nunca tinha sido ratificada e agora foi negada. Consequência: 👷 Folha é a maior categoria ainda sem processo nenhum desenhado, e o vocabulário dela (13º, férias, rescisão, FGTS, dependente) é legítimo LÁ e proibido em pró-labore.
- **funcionario** · 🔑 "Pode ter" e não "tem": *"vamos tratar como pode ter pq é um fluxo que precisamos mapear também, a parte da folha de pagamento"*. Então folha é RAMO, com padrão zero funcionário — mas ramo construído, não adiado.
- **dependenteDoSocio** · 🔑 Vira DECISÃO, e deixa de ser buraco — era pergunta aberta do handoff desde 12/09. Consequência direta: o IRRF do pró-labore sai **sem dedução por dependente**, então sobra o desconto simplificado (`deducaoSimplificada`) como única via. E some a pergunta que eu ia mandar pro time de constituição criar campo novo.
- **beneficioDoSocio** · 🔴 Foi o achado que fez este arquivo nascer. O líder tem, e eu copiei. Sócio recebe pró-labore e lucro, e ponto.
- **geo** · ⚠️ EU TINHA TRAVADO SÓ BH E ESTAVA ERRADO. O Pedro corrigiu: é BH/MG, como já dizia o CLAUDE.md da raiz. 🔴 A consequência não é de cadastro, é de REGRA: ISS e NFS-e são MUNICIPAIS, então cada município de MG tem alíquota e obrigação acessória próprias. A persona zero é de BH (IBGE 3106200 na chave), mas o produto não é. O mapa de notas precisa de repasse com essa lente.
- **exterior** · 🔑 Sócio no exterior o Simples já proibia. Cliente do exterior é DECISÃO NOSSA — a plataforma do líder tem o caminho com 244 países no seletor, e eu mapeei um ramo inteiro de notas por imitação. Esse ramo sai.
- **entradaDoCliente** · ⚠️ Isto é sobre a ENTRADA (quem abre a empresa), não sobre o tomador da nota. São perguntas diferentes, e a resposta da segunda é outra — ver `tomadorDaNota`.
- **faturamento** · 🔑 A minha pergunta ("qual o faturamento típico?") estava mal formada, e a resposta reformula: o faturamento é *"o que a pessoa registrar de NF no nosso app ou trazer externamente"*, mais a conferência no fechamento do ciclo pela **API da Receita Federal**. É entrada medida em três fontes, não característica fixa da persona. ⚠️ Isso cria um requisito que não estava em lugar nenhum: **nota trazida de fora**, emitida noutro lugar, precisa entrar na conta do RBT12.
- **emissaoDeNF** · Sem limite no produto; para a persona o volume naturalmente não é alto. A persona zero emite 1 por mês.
- **papelDaCasa** · 🔴🔴 A CORREÇÃO MAIS IMPORTANTE DO DIA, e ela é de DOUTRINA, não de dado. Palavras dele: *"não é nosso papel regular como é usado esse faturamento, temos apenas que fazer nossa parte de cálculos e guias corretas nas datas corretas"*. ⚠️ Eu tinha desenhado o oposto: no `L20` a distribuição de lucro ficava TRAVADA por débito federal em aberto, e o `L21` era uma porta fechada. A lei da multa de 50% é real — mas ela é **informação que a pessoa precisa ter**, não fechadura que a gente opera. Se o dono saca tudo, o problema é dele e nós avisamos; a nossa entrega é o cálculo e a guia. 🔑 A régua que fica: INFORMAR, nunca TUTELAR. Vale pro produto inteiro, não só pro lucro.
- **tomadorDaNota** · 🔑 Fecha a ambiguidade da P3.1b sem matar caminho: *'podemos sim emitir para PF e PJ sem problemas desde que coloque os dados corretos'*. A persona zero emite pra PJ. ⚠️ Não confundir com a entrada: quem ABRE a empresa entra como PF; quem RECEBE a nota pode ser os dois.
- **naoExisteUmaPersonaSo** · 🔴 CORREÇÃO DE ENQUADRAMENTO, e ela conserta a minha pergunta original. Eu perguntei "qual o faturamento típico?" como se a persona tivesse um número. O Pedro: *"o meu se repete, mas teremos usuários com faturamentos variados, pode gerar valor x em um mês, y no outro ou não faturar nada em determinado mês. E por isso que eu insisto que não tem como validarmos apenas 1 persona no nosso fluxo"*. 🔑 O que é FIXO é o enquadramento (ME Simples, Anexo III/V, serviço, PF na entrada, 1-4 sócios). O que VARIA é o comportamento — e variação não é exceção, é o caso normal. Todo cálculo tem que aguentar mês zerado, mês alto e mês irregular sem virar caso de canto. ⚠️ A persona zero serve para CONFERIR o que existe, nunca para definir o que basta.
- **personaZero** · *"eu sou uma das personas e perfil fixo de cliente. Podemos inclusive me usar como uma dessas personas validadoras."* Ver PERSONA_ZERO.

---

## ⏳ O que ainda não está travado

🔑 Estas perguntas moram como **dado** no `_persona.mjs`, não em prosa, porque o gerador conta quantas seguem abertas a cada rodada. Pergunta que mora em prosa envelhece sem ninguém notar.


### 1 · A empresa

**✅ P1.5 — Endereço: casa, apartamento, sede própria ou endereço fiscal nosso?**

> **Resposta:** PARCIAL — não é uma persona só. Casa, apartamento e endereço fiscal nosso são variáveis internas, e grande parte já está mapeada. A persona zero é APARTAMENTO (APT 601, confirmado no Cartão CNPJ).

- *Por que importa:* 🔑 A resposta reformula a pergunta, e a reformulação é a parte importante: endereço não é traço fixo da persona, é VARIÁVEL com efeito diferente em cada valor. Apartamento puxa condomínio e IPTU próprio; endereço fiscal nosso é produto pago (R$49/mês).
- *O que muda:* Falta dizer O QUE MUDA em cada valor: IPTU, alvará e taxa municipal saem iguais nos três? É o que a categoria ✅ Estar em dia precisa saber, e ela ainda não foi varrida.


### 2 · O sócio, pessoa

**✅ P2.1 — Vínculo CLT por fora: comum ou raro?**

> **Resposta:** RARO, mas existe e já é perguntado no cadastro do usuário.

- *Por que importa:* Quem já contribui como CLT tem folga no teto do INSS, e isso muda o líquido do sócio sem mudar o valor declarado. O Pedro confirmou que a pergunta já está no cadastro e que interfere em funcionalidade interna.
- *O que muda:* O L24 CONTINUA no mapa — raro não é inexistente. Falta saber em quais funcionalidades ele bate além do INSS; o Pedro sinalizou que pode valer pesquisa externa.

**🔴 P2.3 — Como o lucro entra nos nossos cálculos, já que não vamos inferir de extrato?**

- *Por que importa:* 🔴 VIROU OUTRA PERGUNTA, e maior. A original era "a persona tira lucro?". O Pedro respondeu algo mais fundo: *"a Contabilizei em momento nenhum nem cita sobre retirada de lucro, então com toda certeza é algo que é calculado por trás e vem com respostas apenas que o usuário precisa saber"*. Bate com a evidência: na plataforma do líder o lucro é INFERIDO DO EXTRATO, silenciosamente, e nunca é perguntado. ⚠️ E a casa travou em 09/09 que não teremos conta nem integração bancária — então o caminho dele não existe pra nós.
- *O que muda:* Como DECLARAMOS o que é retirada de lucro. O Pedro alerta que interfere no resto dos cálculos, ainda que seja só pra mostrar. 📚 Ele autorizou buscar fora: é pesquisa em fonte primária de governo, não dedução minha. ⚠️ E a resposta precisa respeitar a régua nova: INFORMAR, não TUTELAR.

**✅ P2.4 — Como o líder recalcula o pró-labore sozinho em mês sem faturamento?**

> **Resposta:** RESPONDIDA EM 13/09, na conta logada. Enquanto a receita era regular (R$ 12.000/mês) ele pagava R$ 3.360 = 0,28 × 12.000, o alvo EXATO do Fator R. No fechamento de maio/2026 — primeiro mês com receita zero — ele recalculou e desceu para R$ 1.621, o salário mínimo, que é o PISO legal. E não voltou a subir quando o faturamento retornou em junho. 🔑 A regra dele não é 'manter o Fator R em 28%': é pagar o MENOR valor que ainda segura o anexo barato. Mês sem faturar encolhe o denominador, o Fator R sobra, e o motor aproveita a folga pra baixar o pró-labore.

- *Por que importa:* 🔑 Pergunta NOVA, levantada pelo próprio Pedro em 13/09: *"eles fazem aquela conta automática do pró-labore para sempre manter a gente na menor alíquota e ele recalcula sozinho também em meses que eu não faturo"*. É exatamente o nó L3 do nosso mapa, e a conta do L4. A conta de mês cheio nós temos; a de mês vazio, não.
- *O que muda:* L3 e L4. Hoje o mapa oferece um switch 'pagar ou não pagar'; se o líder RECALCULA um valor específico, a regra dele é outra e precisa ser lida. Os dados do Pedro estão dentro da plataforma deles — é teardown, complementável com pesquisa externa.

---

## 🧪 Persona zero — BERG CONSULTORIA EM MARKETING

Pedido do Pedro em 13/09: *"eu sou uma das personas e perfil fixo de cliente. Podemos inclusive me usar como uma dessas personas validadoras dos processos de funcionalidades."*

**CNPJ 64.037.271/0001-02** · fonte: Cartão CNPJ emitido 26/05/2026 13:10 (lido íntegro: 1 página, 1.912 caracteres) + chave de acesso da NFS-e nº 6 de 12/09/2026 + Pedro, 13/09

⚠️ Só entra aqui o que foi **medido**. Perfil imaginado não vale.

| Dado | Valor |
|---|---|
| porte | ME — confirmado no cartão |
| naturezaJuridica | 206-2 Sociedade Empresária Limitada |
| dataAbertura | 12/12/2025 — a empresa tem ~9 meses |
| situacao | ATIVA |
| socios | UNIPESSOAL, sem sócio (Pedro, 13/09) |
| funcionarios | NENHUM — *"meu plano nem permite"* (Pedro, 13/09) |
| cnae | 73.19-0-04 Consultoria em publicidade — CNAE ÚNICO, sem secundário |
| alvara | DISPENSADO (Res. CGSIM 51/2019, marcado no próprio cartão) |
| conselho | nenhum — não é atividade regulamentada |
| anexo | III — 6% |
| comoSeSabe | 🔴 CORRIGIDO EM 13/09. Eu tinha escrito Anexo V lendo `anexoEscolhido: 5` como se o 5 fosse o anexo. NÃO É — é id interno do líder. Duas provas independentes: (1) a própria nota carrega 'Conforme Lei 12.741/2012, o percentual total de impostos é de aproximadamente 6,00%'; (2) a aritmética do ISS fecha exata — R$ 198,89 ÷ R$ 9.895,00 = 2,0100%, e 6% × 33,50% (repartição do ISS no Anexo III faixa 1) = 2,010%. No Anexo V daria 15,5% × 14,00% = 2,17%, que não bate. |
| prolabore | R$ 1.621,00/mês desde maio/2026 — exatamente o salário mínimo |
| prolaboreAntes | R$ 3.360,00 em março e abril, que é 0,28 × 12.000 EXATO (o alvo do Fator R) |
| prolaboreSerieOficial | 🔴 CORRIGIDO 14/09 pelas DCTFWeb (INSS segurado ÷ 11%): dez/25 R$100 · jan/26 SEM MOVIMENTO · fev R$3.260 · mar R$3.360 · abr R$3.360 · mai-ago R$1.621. A Central de Sócios só mostra a partir de MARÇO — esconde 3 competências, duas delas com valor. Eu tinha registrado '3 meses sem pró-labore nenhum'; era a tela, não o fato. |
| receitaSerieOficial | PGDAS-D por competência: dez/25 0 · jan 0 · fev 12.000 · mar 12.000 · abr 12.000 · mai 0 · jun 0 · jul 0 · ago 7.910. ✅ DIVERGÊNCIA RESOLVIDA 14/09: o antigo receitaReal dizia jun 12.000 porque a **NF nº4 foi emitida em 03/06 por R$12.000 e CANCELADA** (tela Consultar notas fiscais; situação `cancelada`). A nota existiu, a receita não. 🔴 E o Diário contábil **não tem um único lançamento dela** — nem original, nem estorno — então reconstituir histórico fiscal exige DUAS fontes: o livro e a lista de NFS-e. |
| receitaReal | dez/25 0 · jan 0 · fev 12.000 · mar 12.000 · abr 12.000 · mai 0 · jun 0 (NF nº4 emitida e CANCELADA) · jul 0 · ago 7.910 · set 9.895 |
| endereco | R Corinto 202, APT 601, Serra — APARTAMENTO |
| municipio | Belo Horizonte / MG — IBGE 3106200 na chave de acesso |
| iss | 2,01% (R$ 198,89 sobre R$ 9.895,00), não retido |
| valorDaNota | R$ 9.895,00 |
| frequencia | 1 nota por mês, numeração sequencial sem pulo (5 em agosto, 6 em setembro) |
| tomador | PJ nacional |
| servico | Desenvolvimento de produto digital e gestão de equipe |
| competencia | M-1 — a nota de setembro diz 'referente ao serviço prestado no mês de agosto' |
| contadorAtual | Contabilizei |

**O que ainda não se sabe dela:**

- se tira lucro, e com que frequência — ver P2.3
- o que é o `baseCalculoIrrf: 5000` que viaja no payload do líder
- o pró-labore de dez/25, jan e fev/26 — o histórico da plataforma só devolve 6 meses

🔑 **Como usar:** Ao escrever ou revisar um nó de processo, perguntar: isso acontece com esta empresa? Se não acontece e nem poderia acontecer com a persona travada, o nó é delírio copiado do líder — é o teste que teria pego o plano de saúde do sócio na hora.

---

## 🚫 Vocabulário proibido, por categoria

🔑 **Por categoria, e não global, de propósito.** "Rescisão", "13º" e "férias" são legítimos em `folha.mjs` e proibidos em `prolabore.mjs`, porque funcionário tem e sócio não tem. O `benefício` de `impostos.mjs` prova o ponto pelo outro lado: lá ele quer dizer *benefício de plano comercial*, e é legítimo.

| Onde vale | Termos |
|---|---|
| **todo arquivo de processo** | `EPP` · `empresa de pequeno porte` · `estoque` · `revenda` · `mercadoria` · `sócio no exterior` · `sócio pessoa jurídica` · `sócio PJ` |
| `cru/prolabore.mjs` | `plano de saúde` · `vale-transporte` · `vale-refeição` · `vale-alimentação` · `décimo terceiro` · `13º` · `férias` · `rescisão` · `FGTS` · `benefício` · `dependente` |
| `cru/notas.mjs` | *(nenhum declarado ainda)* |
| `cru/impostos.mjs` | *(nenhum declarado ainda)* |
| `cru/folha.mjs` | *(nenhum declarado ainda)* |

Citação legítima se libera escrevendo `FORA DO ESCOPO` na **mesma linha** — mesmo mecanismo do `_escopo.mjs`, de propósito: um jeito só de destravar, e ele obriga um humano a olhar cada caso.

---

## ⚠️ Onde esta trava não chega

Ela pega **vocabulário, não raciocínio** — mesma fronteira da trava de escopo e da de anatomia do MEI. Dá pra descrever uma empresa que não é a nossa usando só palavras permitidas. Contra isso existe a persona zero: *isso acontece com a empresa do Pedro?*

## Links
- [[FUNCIONALIDADES]] · [[PROCESSOS]] · [[HANDOFF-DADOS]] · [[decisoes-marca]]
- Fonte: `execucao/processos/_persona.mjs` · Trava: `execucao/processos/verificar-persona.mjs`
- Irmão: `execucao/processos/_escopo.mjs` (regime, não persona)
