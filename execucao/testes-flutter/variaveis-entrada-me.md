---
tipo: verdade
status: vivo
data: 2026-09-14
assunto: variaveis-teste-entrada-me
autoridade: fonte-verdade
tags: [execucao, teste, flutter, variaveis, entrada, persona]
---

# 🎛️ As variáveis do flow de entrada — constituição ME Simples

> 🧭 **Para que serve.** Esta nota é o **contrato de teste** entre este vault e o app Flutter. Ela declara todas as variáveis que o flow de entrada oferece, o domínio de cada uma, e o que é decidido por nós no backend em vez de perguntado na tela. O elenco que exercita essas variáveis vive em [[personas-entrada-me]].
>
> 🔒 **Escopo travado:** constituição de **ME no Simples Nacional, Anexos III e V**, serviço, BH/MG, 1 a 4 sócios PF domiciliados no Brasil. MEI, Migração, comércio, atividade regulamentada e Lucro Presumido estão **fora**. Ver [[PERSONA]] e `execucao/processos/_escopo.mjs`.
>
> 🎬 **Trecho coberto:** do **E1** (splash) até o **A5.H** (home dia-1, rota assistida). Inclui as duas assinaturas.

## Índice
- [[#🧭 O trecho, tela a tela]]
- [[#📏 O tamanho do cruzamento]]
- [[#🥇 Tier 1 — variáveis que abrem tela nova]]
- [[#🥈 Tier 2 — variáveis que enchem campo]]
- [[#🚪 O gate de elegibilidade — 6 perguntas que o flow AINDA NÃO FAZ]]
- [[#🔒 O que NÓS preenchemos]]
- [[#⚠️ O que ficou desatualizado nas personas antigas]]

---

## 🧭 O trecho, tela a tela

Ordem real, lida de `execucao/flow/flow-data.mjs`. Só o caminho **Abrir** (não Migrar, não MEI).

| Bloco | Telas | O que decide |
|---|---|---|
| **Entrada** | E1 · E2.1–E2.3 · E3 | Nada. Splash, welcome, fork de 4 rotas |
| **Lead** | E3.3 · E3.2 | Nome/e-mail/telefone · regime autodeclarado (MEI × ME) |
| **Os 2 gates** | **E3.4** · E3.4.1 | Endereço (CEP BH × endereço fiscal × fila da cidade) · **categoria de atividade** |
| **Triagem** | **E5T** · E5T.1 · **E5F** · E5F.1 | Nº de sócios · quem administra · 1ª empresa · faixa de faturamento |
| **Conta** | E6 · E6.1 · E6.2 | Nome · CPF · telefone · e-mail · senha · código de 8 dígitos |
| **Checkout** | E7 · E7.1 · **E9** · E9.S/SB/SR · E9.R · E9.1 · E9.1P | Método de pagamento · aceite do contrato · desfecho |
| **Atividade** | C0.0 · **C0** · C5 · C5.1 | Descrição livre → CNAE principal · secundários (até 15) |
| **Dossiê** | **C1** · **C2** · **C3** · C3.1/C3.2/C3.3 · **C4** · **C7** · C7′ | Qualificação civil · vínculo INSS · sócios extras · índice IPTU · razão social |
| **Aprovação** | A1 · A2 · A3 · A3.1 · **A3.P** · A3.SR/R/PS/PSB · A3′/A3‴ | Autorização · viabilidade · **guia DAE (R$281,08)** |
| **Assinaturas** | A3.H · A3.H1–H5 · **A4** · A4.1 · **A4″** | Agendamento · 1ª assinatura (sócios) · 2ª assinatura (gera o CNPJ) |
| **Fim** | **A5.H** | Home dia-1, rota assistida |

🔴 **C7 é a fronteira interna que importa:** é o CTA que dispara a **1ª tentativa de viabilidade na JUCEMG**. Tudo que foi coletado antes dele vai no pedido de viabilidade.

---

## 📏 O tamanho do cruzamento

Calculado sobre as 22 variáveis abaixo, respeitando as dependências reais (regime de bens só existe se casado; canal do convite só existe com 2+ sócios).

| Medida | Número | O que significa |
|---|---:|---|
| **Teto cartesiano** | **31.352.832.000** | Produto cru de todos os domínios. Ignora que metade das combinações é impossível |
| **Espaço alcançável** | **10.189.670.400** | O que sobrevive às dependências. **67,5% a menos** que o teto |
| **Piso par-a-par** | **70 a 112 casos** | Cobre todo *par* de valores. É o alvo de uma suíte madura |
| **Piso 1-wise** | **14 casos** | Cada valor de cada variável aparece pelo menos 1×. **É o piso desta rodada** |

🔑 **O piso é 14 porque a maior variável é a categoria, que tem 14 valores.** Por isso o elenco tem 14 personas base: uma por categoria, cada uma carregando uma combinação diferente do Tier 1. As 6 extras vão além disso, nos cruzamentos que só bug de interação revela. As **4 do gate** (P21 a P24, acrescentadas em 17/09) ficam fora desta conta pelo mesmo motivo que os gates de cidade e de atividade: elas terminam o flow em vez de preenchê-lo. Ver §"O gate de elegibilidade".

⚠️ **O CNAE não entra na conta como 87 valores.** Testar 87 CNAEs × 21 variáveis não fecha em nenhuma rodada humana. A dimensão testável é a **categoria** (14) mais o **grupo fiscal** (`III-fixo` × `fator-r-dinâmico`), que é o que muda comportamento. Ver [[taxonomia-pills-n4]].

### A proporção fiscal que o elenco precisa respeitar

Dos **87 CNAEs** que atendemos com certeza (`atende_me_certeza: sim` em `cnae-matriz.json`):

| Grupo | Quantos | O que muda |
|---|---:|---|
| `III-fixo` | **65** | Anexo III sempre. **Fator R não muda nada** |
| `fator-r-dinamico` (III↔V, limiar 28%) | **15** | O Fator R decide o anexo |
| `requer-revisao` | **7** | Indefinido, não usar em teste |

🔴 **75% do nosso catálogo real é `III-fixo`.** O elenco antigo tinha 4 de 6 personas válidas no grupo dinâmico, ou seja, testava demais a exceção. O elenco novo fecha **10 `III-fixo` × 4 `fator-r-dinamico`**, que é a proporção honesta.

---

## 🥇 Tier 1 — variáveis que abrem tela nova

São as que **bifurcam o fluxo**. Só elas podem esconder bug de caminho: uma tela que nunca aparece, um voltar que some, um estado que não volta.

| # | Variável | Tela | Domínio | n |
|---|---|---|---|---:|
| 1 | **Forma de endereço** | E3.4 | `proprio` (CEP BH válido) · `fiscal` (Legalizai, +R$49/mês) · `fila` (fora de BH, modo espera) | 3 |
| 2 | **Nº de sócios** | E5T | `1` · `2` · `3` · `4` | 4 |
| 3 | **Situação do CPF do titular** | E6 / E9 | `regular` · `divergente` (nome civil ≠ digitado → E6.2) · `suspenso` (descobre no checkout, **não é cobrado**) | 3 |
| 4 | **Desfecho do pagamento do plano** | E9 | `pago` · `recusado` → E9.SR → E9.R (nova tentativa) · `boleto pendente` → E9.SB → E9.1 (dossiê já liberado) | 3 |
| 5 | **Confiança do CNAE** | C0 | `alta` (segue direto) · `ambiguo` (abre desambiguação) | 2 |
| 6 | **Nome / razão social** | C7 | `aprovado` · `reprovado` → C7′ (2ª rodada de 3 nomes) + A3.1 (retry automático pelas 3 opções) | 2 |
| 7 | **Rota de assinatura** | A3.H | `automatica` · `assistida` (A3.H1–H5, agendamento de dia e hora) | 2 |
| 8 | **Desfecho da guia DAE** | A3.P | `paga` · `recusada` → A3.SR → A3.R · `boleto` → A3.PSB | 3 |
| 9 | **Vínculo INSS** | C2 | `nao` · `clt` · `aposentadoria` · `autonomo` · `socio-outro-cnpj` | 5 |
| 10 | **Estado civil** | C1 | `solteiro` · `casado` (abre regime de bens) · `uniao` · `divorciado` · `viuvo` | 5 |

Fonte dos rótulos: `app/src/lib/qualificacao.ts` (`ESTADO_CIVIL`, `REGIME_BENS`, `TIPO_IMOVEL`) e `app/src/components/gate-telas.tsx` (`PILLS`, `FAIXAS`).

🔴 **Falta um valor na variável 9 (17/09):** o domínio do vínculo INSS não tem `servidor-publico`, e ele é o único que **muda quem pode administrar** (impedimento O2, ver §"O gate de elegibilidade"). Os outros 5 tocam só o teto do INSS. Enquanto não entrar, servidor público se cadastra como `nao` e o app não percebe. **Não somei o valor ao domínio aqui** porque isso refaria a conta de §"O tamanho do cruzamento" com uma tela que ainda não existe — quando entrar, o `n` da variável 9 vai de 5 para 6.

---

## 🥈 Tier 2 — variáveis que enchem campo

Não bifurcam a tela, mas **é onde o relatório final é conferido**: objeto social, ISS-BH, capital, metragem e quotas saem daqui.

| # | Variável | Tela | Domínio | n |
|---|---|---|---|---:|
| 11 | **Categoria de atividade** | E3.4 | as **14 pills** (`tech` · `design` · `foto` · `mkt` · `edicao` · `consult` · `cursos` · `arte` · `eventos` · `admin` · `aluguel` · `reparos` · `salao` · `hospedagem`) | 14 |
| 12 | **Faixa de faturamento** | E5F | `nao-sei` · `5-10k` · `10-20k` · `20-30k` · valor exato | 5 |
| 13 | **Regime de bens** (só se casado) | C1 | `parcial` · `universal` · `separacao` · `final` (participação final nos aquestos) | 4 |
| 14 | **Tipo de imóvel** | C4 | `casa` · `apartamento` · `outro` | 3 |
| 15 | **Índice cadastral do IPTU** | C4 | `valido` · `invalido` | 2 |
| 16 | **Método de pagamento do plano** | E9 | `cartao` · `pix` · `boleto` | 3 |
| 17 | **Método de pagamento da guia** | A3.P | `cartao` · `pix` · `boleto` | 3 |
| 18 | **CNAEs secundários** | C5 | `0` a `15` | 2+ |
| 19 | **Quem administra** (só com 2+ sócios) | E5T | `so-titular` · `titular-e-socios` | 2 |
| 20 | **É a 1ª empresa?** | E5T | `sim` · `nao` | 2 |
| 21 | **Canal do convite ao sócio** (só com 2+) | A4 | `whatsapp` · `email` | 2 |
| 22 | **Código GOV.BR** | A4.1 | `ok` · `erro` (janela de 10min, 3 tentativas) | 2 |

🔴 **Teto do ME, e ele BARRA — corrigido em 17/09.** `TETO_ME_MENSAL = 30000` (R$360 mil/ano, LC 123 art. 3º II). A faixa "+R$30 mil" saiu da grade em 01/09 e quem fatura acima usa "Sei o valor exato" — mas **valor exato acima de R$30.000/mês é EPP, e EPP está fora do escopo**.

Até 14/09 esta nota terminava com *"Não barramos por faturamento"*, e essa frase ficou de pé contra duas travas: `execucao/processos/_persona.mjs:82` (13/09, *"processo nenhum pode ter ramo de EPP"* — no contrato o EPP existe só como **saída**, "Desenquadramento de ME para EPP, R$139,00") e a regra do agente Léo de 17/09 (`execucao/entregas/handoff-leo-ajustes-2026-09-17.md:76`), que manda **recusar e escalar** acima de R$360 mil/ano. A mesma pessoa não pode ouvir *"essa eu ainda não atendo"* no WhatsApp e ser aceita no app.

**Comportamento esperado:** valor exato acima do teto sai pela **porta de espera/escalada**, com o mesmo tratamento da P15 (recusa explicada, nunca erro genérico). Não abre empresa. Exercitado pela **P21**.

🧪 **Pagamento é fake no Flutter (14/09, Pedro).** Qualquer dado passa em E9 e A3.P. O que se testa é o **método** e o **desfecho**, nunca o número do cartão.

---

## 🚪 O gate de elegibilidade — 6 perguntas que o flow AINDA NÃO FAZ

> 🔴 **Acrescentado em 17/09.** A fonte é `execucao/estado-cnpj/ciclo-do-cnpj.mjs` → `GATE_DE_ENTRADA` (travado 15/09, literal em `pesquisa/fontes/2026-09-15-elegibilidade-simples-LITERAL.md`). O comentário dele diz textualmente: *"Isto é **dado**, não tela. Quem constrói a pergunta é o flow de entrada."* Este catálogo é de 14/09, um dia antes — por isso as perguntas não estavam aqui.

Dos 12 incisos do art. 3º §4º da LC 123, 8 não alcançam o nosso perfil (sócio PJ, sede no exterior, cooperativa, banco, cisão, S.A., filial no exterior, participar de outra PJ) e a modelagem já os neutraliza. Sobram 4, mais 2 impedimentos que vêm de fora do artigo.

| # | Pergunta ao usuário | Domínio | Gatilho real | Se sim | Hoje no app |
|---|---|---|---|---|---|
| **V1** | "Você já é dono ou sócio de alguma outra empresa hoje?" | `sim` · `nao` | receita bruta **global** das duas > R$4,8mi/ano. ⚠️ O percentual **não** importa: 0,1% já engatilha a soma | recusa | 🟡 o fato é captado no **C2**, mas como `vínculo INSS: socio-outro-cnpj`, ou seja **para o teto do INSS**. Ninguém pergunta a receita da outra empresa |
| **V2** | "Você tem mais de 10% de alguma empresa do Lucro Presumido ou Real?" | `sim` · `nao` | participação > 10% **E** receita global > R$4,8mi/ano | recusa | ❌ não perguntado |
| **V3** | "Você é diretor ou administrador registrado em outra empresa, mesmo sem ser dono?" | `sim` · `nao` | receita global > R$4,8mi/ano | recusa | ❌ não perguntado |
| **V4** | "Você vai prestar o serviço cumprindo horário e recebendo ordens do seu cliente, como um funcionário de carteira assinada?" | `sim` · `nao` | pessoalidade + subordinação + habitualidade, **cumulativamente**, com o mesmo contratante | recusa | ❌ não perguntado |
| **O1** | "Você tem um MEI aberto no seu nome?" | `sim` · `nao` | — | obriga baixa/desenquadramento **antes** | ✅ vem por **API** (está na lista dos 7) |
| **O2** | "Algum sócio é servidor público ativo?" | `sim` · `nao` | — | 🔑 **não** impede ser quotista; impede **administrar** | ❌ não perguntado, e colide com a regra 49/22 (ver abaixo) |

🔴 **V4 é o pior buraco, e é o nosso perfil exato.** A pesquisa classificou a pejotização (LC 123 art. 3º §4º XI) como risco **CRÍTICO** justamente para TI, design e consultoria — que são `tech`, `design`, `consult` e `mkt`, 4 das 14 categorias do elenco. E é a única vedação que a autodeclaração pega mal, porque depende da sinceridade de quem responde.

🔴 **O2 quebra a regra "titular é sempre 49".** Servidor público ativo pode ser quotista e **não** pode ser administrador (Lei 8.112/90 art. 117 X · Estatuto de BH, Lei 7.169/96). Num caso unipessoal — 7 das 14 base — não sobra ninguém para administrar, então o caso não é "trocar 49 por 22", é **recusa**. Ver a correção da regra em §"O que NÓS preenchemos".

✅ **O que a pesquisa declarou que NÃO é vedação** (confirmar ausência vale tanto quanto achar regra): sócio com **emprego CLT** (varreu LC 123 arts. 3º, 15, 17, 30 e 31 + Res. CGSN 140/2018 e declarou *"total inexistência de comando jurídico"*; o CLT toca só o teto do INSS, que é da **pessoa**) · sócio **aposentado** · **estrangeiro residente no Brasil**. As personas com esses vínculos seguem o caminho completo, como já seguem.

⚠️ **Se passar batido:** pendência cadastral trava na hora; estouro de faturamento global só aparece meses depois, e aí a exclusão é **retroativa** — a empresa cai no Lucro Presumido. Sócio que entra depois carregando vedação exclui a empresa **a partir do mês seguinte**.

📏 **Estas 6 não entram na conta de §"O tamanho do cruzamento".** Aquela conta é das **22 variáveis de preenchimento** do wizard. O gate não bifurca wizard, ele **termina** o flow, igual ao gate de cidade (E3.4.1) e ao de atividade (P15), que também ficam fora da conta. 🔴 Quando o gate virar tela, refazer a conta — e nesse dia as 22 viram 28.

🧪 **Exercitado pelas P22, P23 e P24.** Enquanto não existir tela, a rodada dessas personas **prova a ausência**, e o resultado é achado, não bug de teste.

---

## 🔒 O que NÓS preenchemos

**33 campos internos + 7 vindos de API.** O cliente nunca os vê, e são exatamente o que precisa ser conferido no relatório final. Fonte: `PREENCHIDOS_INTERNAMENTE` e `PREENCHIDOS_API` em `execucao/flow/flow-data.mjs`.

### Os que o Pedro pediu pra validar ao fim

| Campo | Valor esperado | Travado em |
|---|---|---|
| 🔴 **Capital social** | **R$ 10.000,00 fixo** | 31/08 — deixou de ser pergunta (era chips 1k/5k/10k + livre) |
| 🔴 **Metragem** (área total + área utilizada) | **20,00 m²** nas duas | 31/08 — print real da Viabilidade |
| **Valor nominal da quota** | **R$ 1,00** | travado |
| **Participação de cada sócio** | `% informado × R$10.000`; o valor em R$ **é** o nº de quotas | 01/09 |

### Os outros 29 internos, por família

**Identidade e qualificação:** profissão = `Empresário` (titular e todo sócio) · qualificação do representante = `49 - Sócio-Administrador` · qualificação de cada sócio no DBE = `49` se administra, `22` se não · representante perante a Receita = sempre quem iniciou o cadastro · regime de bens `separacao` traduz para `Separação Convencional de Bens` no RPA.

> 🔴 **Correção de 17/09 — o titular NÃO é sempre 49.** Esta nota dizia *"titular é sempre 49"*, e isso vale só enquanto o titular **puder** administrar. O impedimento **O2** do gate (Lei 8.112/90 art. 117 X) barra servidor público ativo de ser administrador, mesmo podendo ser quotista. A regra correta:
>
> | Caso | Qualificação | Consequência |
> |---|---|---|
> | Titular administra (o normal) | `49` | nada muda |
> | Titular servidor público, **com** outro sócio que administre | `22` no titular, `49` no administrador | muda quem assina pela empresa e quem é o representante perante a Receita |
> | Titular servidor público, **unipessoal** | — | 🔴 **recusa**. Não sobra administrador, e SLU sem administrador não existe |
>
> ⚠️ "Algum sócio é servidor público ativo?" **não é perguntado hoje** em lugar nenhum do flow, então a qualificação sai `49` por padrão, sem ninguém checar. Exercitado pela **P22**.

**Empresa e endereço:** natureza jurídica = `SLU` sem sócio, `LTDA` com sócio (automático, sem pergunta desde 31/08) · forma de atuação = `Atividade Desenvolvida Fora do Estabelecimento` · tipo de unidade = `Produtiva` · acesso ao endereço = `Pedestre` · tipo de endereço = `Endereço virtual` quando usa o endereço fiscal Legalizai · endereço de correspondência = igual ao do estabelecimento.

**Questionários de órgão:** "Atividade exercida no local?" = **Não** (principal e todas as secundárias) · "Atividade é inócua ou virtual?" = **Sim** · "Edificação nova?" = **Não** (🟡 suposição, fila-Izabela).

**Contrato:** tipo = **Padrão, 15 cláusulas, sem anexo** (🔴 anexo derruba o Registro Automático) · testemunhas = nenhuma · SPE = Não · capital integralizado em moeda corrente = Sim · forma de assinatura (isolada × conjunta) **não é enviada**, o contrato padrão não tem o campo.

**Processo:** tipo de evento = `Inscrição de primeiro estabelecimento (Matriz)` · código do ato = `Constituição` · evento de enquadramento = `Enquadramento de Microempresa` (é ele que faz a guia custar **R$281,08**, porque cobra 2 atos) · requerente do DAE = sempre o titular · data de assinatura e de início = dia do preenchimento, **nunca retroativa**.

**Contato:** e-mail e telefone enviados aos órgãos = sempre os **da Legalizai**, nunca os do cliente · 🔴 **telefone vai sem o 9º dígito** (8 dígitos) para DBE/Integrador, mas é **captado com 9** na tela. Quem remove é o robô.

**Pagamento (🔴 não implementado, depende do gateway):** `remoteIp` = IP do **dispositivo de quem paga**, nunca o do servidor · `billingType` = `CREDIT_CARD` · `PIX` · `BOLETO`. Débito não entra.

### Os 7 vindos de API

CPF com MEI ativo (impedimento de DBE) · logradouro/bairro/município/UF derivados do CEP (empresa, titular, e cada sócio extra) · situação do CPF na Receita (consultada **no ato do pagamento**) · CNAE principal sugerido pela IA a partir da descrição + categoria · situação do protocolo na JUCEMG/Receita (polling).

---

## ⚠️ O que ficou desatualizado nas personas antigas

Achados de 14/09, cruzando `execucao/motor-testes/personas/*.json` com o código real. **São a razão de o elenco novo começar do zero** em vez de herdar os JSONs.

| # | O que está velho | Realidade hoje |
|---|---|---|
| 1 | `empresa_capital` varia (R$3.000 a R$50.000) | **R$10.000 fixo** desde 31/08, e saiu da tela |
| 2 | `natureza` é pergunta (`SLU`/`LTDA`) | Pergunta **removida** em 31/08, virou automática pelo nº de sócios |
| 3 | `faturamento_faixa: "30k+"` e `"ate 10k"` | Grade redesenhada em 01/09: `nao-sei` · `5-10k` · `10-20k` · `20-30k` |
| 4 | `cnae: "6201-5/00"` em 4 personas | 🔴 **Código não existe** na matriz. O certo é `6201-5/01` |
| 5 | `cnae: "7020-4/00"` em 5 personas | 🔴 `atende_me_certeza: nao` — **exige conselho**. Viraria recusa no gate |
| 6 | Persona `bloq-3socios` | **Morta.** Teto virou **4 sócios** em 29/08 |
| 7 | Persona `bloq-exterior` | **Morta como bloqueio.** A pergunta "mora fora do Brasil" virou lembrete com link de escape em 29/08 |

## Links
[[personas-entrada-me]] · [[PERSONA]] · [[taxonomia-pills-n4]] · [[cnae-liso-servico]] · [[dados-coletados-abertura-ate-viabilidade]] · [[mapa-flow-mermaid]] · [[decisoes-marca]]
