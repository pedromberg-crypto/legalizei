---
tipo: ata
data: 2026-09-16
fonte: Rua Satélite 51
participantes: [Pedro Maia, Leonan (Léo), Speaker 1 (dev)]
audio: 3 de 3
---

# 🎙️ Áudio 3/3 — Leonan, 16/09: o resto do Bloco D e as sete contas do Bloco E

> 📖 **Leitura integral cumprida.** Transcript de **73.637 caracteres / 607 linhas**, lido **100%**. Notas do Plaud: 7.852 caracteres, lidas 100%. Literais em [[2026-09-16-rua-satelite-51-transcript-LITERAL]] e [[2026-09-16-rua-satelite-51-notas-plaud]].
>
> 🧭 **Onde pega.** Retoma a P01 exatamente onde o áudio 2 cortou, percorre **P03, P09, P11 e P16**, o bloco **🏢 do espelho da Contabilizei**, e depois o **Bloco E inteiro, conta por conta**. Fecha com ISS e o encerramento da reunião — *"foi umas 5 horas quase aqui"*.
>
> ⚠️ **O que ficou de fora, declarado.** Das 607 linhas, cerca de **80 (linhas 224-306, ~15 minutos)** são uma **ligação telefônica particular do Leonan sobre outro cliente**, sem relação com o Legalizai. Li, identifiquei como fora de assunto e **não analisei nem reproduzi** o conteúdo. Está no literal salvo, se você precisar.

---

## 🔑 O placar deste áudio

| | |
|---|---:|
| Contas do Bloco E ratificadas | **7 de 7** |
| 🔴 Decisões que REVOGAM regra travada nossa | **1** |
| 🔴 Onde ele CONTRADIZ o que nós tínhamos encerrado | **1** |
| 🔴 Onde ele contradiz o **áudio 2** | **1** |
| 🔴 Onde a conta dele não fecha e eu fico com o motor | **1** |
| 🆕 Decisões novas | 5 |

---

# ✅ A MARGEM DE 30% ESTÁ TRAVADA — ele ratificou com caso na mão

Era a decisão nossa mais exposta do Bloco E: mirar **30%** quando a lei pede **28%**.

> **Léo:** *"Se quiser manter essa margem de 30%, cara… melhor. Eu trabalho só com um pouco de segurança. Porque **é melhor você pecar nos 2% a mais** do que eu chegar lá na frente e falar assim… 'faltou 0,1%'."*
>
> *"**Tô com um caso lá embaixo, faltou 60 reais pra esse cara aqui.** Aí eu vou ter que inventar um monte de desculpa ali."*

**Pedro:** *"Então fechou. Eu vou travar pra 30% em vez de 28 o cálculo."*

✅ **`FATOR_R.MARGEM = 0.3` fica como está.** E agora tem justificativa de campo, não só de projeto: R$60 de diferença já custou o Anexo III de um cliente real dele.

---

# 🔴 EPP ENTRA NO ESCOPO — e isso REVOGA uma regra travada

A regra travada em 13/09 dizia: **"EPP só como porta de SAÍDA, nunca como permanência"** (`_persona.mjs`).

Na P16, discutindo a empresa que encosta no teto do ME:

> **Léo:** *"O EPP funciona igual… Ele tem o limite de ME de 360 mil, mas **o Simples ele pode faturar até 4.800.000**. Então ele pode ser EPP e continuar sendo Simples."*
>
> **Pedro:** *"Então a gente pode atender o EPP até 4.800.000?"*
> **Léo:** *"É. Porque tem EPP que fica no lucro presumido."*
> **Pedro:** *"Só que aí a gente não atenderia o lucro presumido, mas o EPP sim. **Vou mudar esse ali.**"*

E o desenquadramento é menos dramático do que supúnhamos:

> *"Na verdade ele vai continuar como Simples. Só tem um processo… lá no cartão CNPJ dele que está escrito **porte**. Ele só vai mudar aquele ME para EPP."*
>
> *"**Ele nem é automático**, esse processo de EPP. Ele nem gera um processo automático para isso. Mas ele continua gerando a informação do Simples, normal, sem grandes alterações."*
>
> 🔑 *"**A Receita não trava o CNPJ dele por falta desse enquadramento como EPP**, não. E o Simples Nacional dele fica igual, exatamente igual."*

🔴 **Isto é decisão de sócio, não de ata.** A `_persona.mjs` e a trava `verificar-persona.mjs` afirmam o contrário, e os três geradores rodam em cima disso. **Não alterei nada.**

> ✅ **RESOLVIDO em 16/09, pelo Pedro: fica em STANDBY.** A `_persona.mjs` não muda e a trava segue derrubando a rodada. As observações do Leonan ficam guardadas porque **baixam o custo de mudar de ideia depois**. ⇢ [[2026-09-16-tres-conflitos-do-contador-resolvidos]] §1

⚠️ **E muda a P16:** hoje ela diz *"é o único caso em que a porta de saída para EPP aparece"*. Com EPP no escopo, deixa de ser saída e vira **upsell** — alteração de porte com honorário mais as taxas da Junta.

---

# 🔴 ELE CONTRADIZ O NOSSO ASSUNTO ENCERRADO — a CPP no Fator R

> 🔒 **Contexto:** `E-CPP` foi encerrado em 14/09 com fonte literal — Res. CGSN 140/2018 art. 26 §2º I 'a' nomeia **só o Anexo IV**, e o silêncio sobre III e V é vedação. Foi um dos três erros que o Pedro me cobrou para não repetir.

O Pedro leu a linha do Bloco E em voz alta e o Leonan disse o oposto:

> *"Esse CPP, ele entra ali na tributação do DAS, só que **eu posso pegar esses R$205 que gera ali, e eu posso somar ele lá no Fator R**."*
>
> *"Se você fez o cálculo de 29% de Fator R, pelo menos 29, **ele vai acumular mais 1% ali, vai virar 30**. Ele vai ser um plus."*
>
> **Pedro:** *"A CPP não entra. O que seria 'não entra'?"*
> **Léo:** *"**Pode considerar em tudo.**"*

🔑 **Eu NÃO reabri o assunto e NÃO mexi no motor.** Registro o conflito como ele é: **autoridade humana contra norma capturada literal**. Três razões para não mover nada agora:

1. A fala dele é **hesitante e confusa** no trecho — ele tenta encaixar a frase em *"caixa"* antes de responder (*"é que eu acho que ele tá falando sobre… sobre caixa, não"*).
2. Ele **não citou norma**; nós temos o artigo capturado literal.
3. 🔴 **O efeito é grande e é para o lado do risco:** se a CPP entrasse, empresas com Fator R entre ~27% e 28% seriam declaradas no Anexo III **sem direito**.

⏳ **O caminho é confrontá-lo com o texto**, não escolher entre os dois.

> ✅ **RESOLVIDO em 16/09, pelo Pedro — e a leitura certa desfez o conflito.** Ele não contestava a norma: **descrevia uma manobra**. Decisão: *"a gente faria essa manobra… mas de fato não faremos isso. O CPP continuará sendo apenas gerado dentro da guia normal."* Agora o `E-CPP` tem duas camadas — a norma diz que não entra, **e** nós não fazemos a conta mesmo que alguém interprete que entra. ⇢ [[2026-09-16-tres-conflitos-do-contador-resolvidos]] §2

---

# 🔴 E ELE CONTRADIZ O PRÓPRIO ÁUDIO 2

No áudio 2 ele foi taxativo: o Fator R lê a **competência anterior**, e por isso empresa que fatura no mês da abertura paga 15,5% obrigatoriamente.

Aqui, discutindo quem opta por não gerar pró-labore até faturar:

> **Pedro:** *"Eu não quero gerar pró-labore até eu faturar. Ponto final. E ele fatura daqui dois meses."*
> **Léo:** *"Ele fatura daqui dois meses, **faz os 28 e gera a folha**. Porque ele já vai ter aqui…"*
> **Pedro:** *"Esse mês agora já conta? **O próprio mês vai contar?**"*
> **Léo:** *"**Mês vai contar.**"*
> **Pedro:** *"Então já está resguardado… mesmo que ele não gerou pró-labore."*
> **Léo:** *"Mesmo que ele não tenha gerado."*

E aí ele mesmo recuou:

> *"**Ali não sou 100% não**, para poder evitar às vezes precisar retificar alguma coisa."*

| | Áudio 2 | Áudio 3 |
|---|---|---|
| A folha que conta | competência **anterior** | o **próprio mês** |
| Confiança dele | firme, com exemplo numérico | *"não sou 100%"* |

🔴 **São afirmações incompatíveis, e a diferença decide se o 1º mês paga 6% ou 15,5%.** Nosso motor hoje não decide nem uma nem outra: devolve `anexo: null`.

> ✅ **RESOLVIDO em 16/09 — e não foi preciso escolher entre as duas.** O desenho já tinha sido combinado no **áudio 2**: o pró-labore começa na 1ª nota, e constituir-e-faturar no mesmo mês **dispara alerta interno** para a casa ligar e oferecer a folha da competência da constituição, deixando o **mês seguinte** já no Anexo III. **A ação é idêntica nas duas leituras** — adotamos a conservadora do áudio 2, que nunca cobra a menos. 🔑 E a operação **não é retroativa**: cabe no prazo normal do eSocial, até o dia 15. ⇢ [[2026-09-16-tres-conflitos-do-contador-resolvidos]] §3

---

# 🔴 A "PAULADA": ele disse que compensa, e a conta dele não fecha

Lendo o cenário B do Bloco E (déficit de R$41.569), o Leonan primeiro **corrigiu bem** uma leitura errada do Pedro:

> **Léo:** *"Ele não vai gerar um débito de 40 mil. **Aquela é a base dele pra calcular 11%.**"*

✅ **Correção legítima e importante:** os R$41.569 são **base de pró-labore**, não desembolso de imposto. Vale colocar isso na redação.

Mas daí ele concluiu:

> *"Basicamente o INSS dele seria de **R$4.730**… perto do cara faturar 18 mil, para ele regularizar, **compensa demais**. No mês só ele paga e se livra dos próximos cinco meses."*

🔴 **A conta dele deixou duas coisas de fora.** Rodei no motor em 16/09:

| Pró-labore de R$46.969 num mês | Valor |
|---|---:|
| INSS — **travado no teto** | R$ 932,31 |
| IRRF | **R$ 11.751,36** |
| **Total** | **R$ 12.683,67** |
| Menos o que sairia no piso | − R$ 178,31 |
| **Custo extra da paulada** | **R$ 12.505,36** |

**O que ele fez de cabeça foi `11% × 43.000 = R$4.730`**, e ali:
- ⚠️ **o teto do INSS não entrou** — a contribuição para em R$932,31, não vai a R$4.730 *(o erro é a favor do cliente)*;
- 🔴 **o IRRF não entrou** — e é ele que domina: **R$11.751,36** numa retirada única de R$46.969.

**Economia:** R$1.629,00/mês. **Custo:** R$12.505,36. **Saldo: −R$10.311,02.** Não compensa.

🔑 **Fico com o motor**, e o alerta que o piloto já emite continua valendo: *"quitar o déficit de uma vez custaria mais do que economiza; o salto é decisão do sócio, não do robô."*

⚠️ **Mas há uma síntese possível que nenhum dos dois disse:** o que quebra a conta é concentrar tudo **num mês**, por causa da progressividade do IRRF. **Diluir em 3 ou 4 meses** mantém o INSS no mesmo lugar e derruba o IRRF. O Pedro chegou a propor (*"a gente nos próximos três meses emitiria de 7"*) e o Leonan descartou sem fazer a conta (*"o mais sugerido seria basicamente a paulada"*). ⇢ **P16, vale simular**

---

# ✅ As sete contas do Bloco E — 7 de 7 ratificadas

| Conta | Veredito |
|---|---|
| **1 · DAS e o centavo** | ✅ *"Bateu 100% do valor, que é o que eu paguei lá."* Conferido contra a guia real |
| **2 · Alíquota efetiva** | ✅ *"A fórmula é essa."* 🔑 E ele deu o atalho de conferência: *"pega o valor do imposto dividido pelo faturamento, já chega direto"* |
| **3 · Fator R** | ✅ com a ressalva da CPP acima |
| **4 · Guia do sócio** | ✅ linha a linha. Sobre o IRRF final: *"149 menos 149… isso"*. E sobre a dedução: *"ele olha o que é maior e faz a dedução que é mais benéfica"* |
| **5 · RBT12, três regras** | ✅ incluindo as duas armadilhas. Sobre o mês zerado no divisor: *"perfeito… se excluir ele, sobe a faixa"* |
| **6 · Guia em atraso** | ✅ |
| **7 · O piloto** | ✅ na mecânica, 🔴 na conclusão da paulada |

⚠️ **Um detalhe de arredondamento ficou impreciso na conversa.** O Pedro disse *"tudo aqui é arredondado pra cima"* e o Leonan concordou. **Não é o que o motor faz** — ele usa arredondamento **meio-pra-cima por tributo** (`Math.round`), que é o que bate com o recibo real dos R$474,59. Ninguém agiu em cima disso, mas fica registrado para não virar regra por repetição.

---

# 🆕 Cinco decisões novas

## D10 · CNAEs secundários travados em **5**

O DBE permite 15. O app hoje sugere por IA e deixa digitar livre.

> **Léo:** *"Põe o limite de 5. Se ele quiser, ele tem que ter uma ação de clicar num botão e adicionar o campo."*
> *"Dificilmente o cara vai colocar muito… **isso pode gerar futuramente complexidade**. Muita atividade é quando a empresa é comercial."*

⚠️ E ele deu o porquê fiscal: CNAE secundário de Fator R **contamina** a vigilância. *"Às vezes o cara tem mais de uma atividade e uma delas é Fator R. Aí ele teria que controlar o Fator R."*

## D11 · 🔴 O salário mínimo precisa de rotina anual — hoje está no código

> **Léo:** *"Vai ter a trava do R$1.621 — todo ano você vai rodar um código lá pra atualizar? **Já de uma vez no automático, né? Num campo só.** Porque todo ano é o P."*

✅ Ele tem razão e é dívida real: `PREVIDENCIA.SALARIO_MINIMO: 1621` está fixo em `_tabelas.mjs`. Vira campo com vigência, não constante. ⇢ **P17**

## D12 · A pergunta de onboarding do pró-labore — **fechou**

Depois de ficar aberta nos áudios 1 e 2, virou uma pergunta só:

> *"Você quer já gerar pró-labore a partir desse mês da sua constituição, **ou você quer aguardar seu primeiro faturamento?**"*

E o que a decisão resolve:

| Escolha | O que a casa faz |
|---|---|
| **Aguardar o faturamento** *(default)* | nada até a 1ª nota. Na 1ª nota, calcula os 28% e gera a folha |
| **Gerar agora** | pró-labore no **salário mínimo** desde a constituição, para quem quer manter contribuição |

🔴 **E mata o R$100 da Contabilizei de vez:** *"a gente não vai gerar R$100, não vai gerar nada… pra mim isso aqui a gente corta. Eu acho um trem muito gambiarrado."* ⇢ fecha **🏢3**

🔑 **O argumento que o Leonan deu para a opção "gerar agora" não é fiscal, é humano:**

> *"Essa contribuição contínua dá a ele o benefício de você precisar de algum seguro… **tinha muito caso da mulher** que não contribuiu por um período. Ela estava acostumada a receber 6 mil, aí ia cair para um salário no mês."*

✅ **Decisão: damos a opção e avisamos.** Não decidimos por ele.

## D13 · Uma vez ligado, o pró-labore **não para**

> *"O ideal seria manter o pró-labore."*

E o motivo é concreto — o cliente que esquece de emitir e dobra no mês seguinte:

> *"Teve um mês que ele não emitiu, e esse mês que ele não emitiu, ele emitiu no próximo mês. **Dobrado.** Aí automaticamente a folha dele teria que ser duas vezes aquele valor."*

⚠️ Mas o cliente pode desligar, e aí é dele: *"só vai interferir nos cálculos lá pra frente, porque aí ele mesmo já opta por fazer isso."*

## D14 · 🆕 O boleto editável — vulnerabilidade de cobrança

Levantada pelo dev, não pelo Leonan:

> *"O cara, vai R$139, chega lá e ele paga R$100. **Você pode escolher isso no boleto, quanto que você vai pagar.**"*
>
> **Pedro:** *"Penso já um jeito de bloquear… porque senão vira um vício. Por mais que gere juros, **o cara para se manter ativo vai lá todo mês e paga R$30 ou R$1**."*

⏳ Ação: verificar se o gateway bloqueia edição de valor. ⇢ **P18**

---

# 🔒 ISS — o encerrado se manteve, e ganhou um fato de 2027

> ⚠️ **Não reabri.** O assunto entrou porque o Pedro leu a linha da tabela *"o que ficou de fora"*, e a conversa **confirmou** a decisão de produto: o ISS não é pergunta do cliente.

O Leonan explicou a retenção pelo tomador e concluiu:

> *"Para o prestador de serviço **dificilmente você vai receber uma nota com o ISS retido**… lá eu tinha pouquíssimos casos."*

E confirmou que **não precisa perguntar nada ao cliente**, porque o dado vem por API:

> *"O Portal Nacional virou uma consulta única, praticamente. Então eu conseguiria baixar a informação… **e eu já ia ter um alerta lá dentro do sistema**."*

✅ Alinhado com a decisão travada: *"o ISS não é cálculo, tela, pergunta nem decisão do usuário."*

🆕 **O fato novo, e é de 2027:**

> *"Na reforma, a partir de 2027, vai ser **prioritariamente todo mundo recolher no local da prestação**. Eu estou em Belo Horizonte, se eu prestar serviço em Contagem, eu vou pagar a alíquota de Contagem."*

⏳ Isso muda a premissa do `E-ISS`, que se apoia no **local do estabelecimento prestador** (LC 116/2003 art. 3º). **Não altera nada hoje** e não reabre a decisão de produto — mas é a **quarta** mudança de 2027 na lista. ⇢ **P19**

---

# 📅 O que já são QUATRO mudanças em 2027

| | O que muda | De onde veio |
|---|---|---|
| **1** | DEFIS morre, vira campo do PGDAS-D | Res. CGSN 190/2026, já tínhamos |
| **2** | Regime de **caixa** acaba no Simples | áudio 1 |
| **3** | A janela do Fator R **pula um mês** | áudio 2 |
| **4** | ISS passa a ser no **local da prestação** | áudio 3 |

🔴 **Nenhuma das quatro tem norma nomeada por nós além da primeira.** Três saíram de memória do contador, e todas mexem no motor. ⇢ vira frente de pesquisa própria

---

# ⏳ Pendências novas deste áudio

| | O que falta | Peso |
|---|---|---|
| ~~P14~~ | ✅ **EPP — decidido: standby.** Observações guardadas | fechado 16/09 |
| ~~P15~~ | ✅ **CPP — decidido: não fazemos a manobra.** Travado no `_encerrados.mjs` | fechado 16/09 |
| ~~P11~~ | ✅ **1º mês — decidido: alerta interno + contato.** Leitura conservadora | fechado 16/09 |
| **P21** | 🟡 Qual das duas leituras do Fator R é a da norma? Vira **pesquisa**, não trava | pesquisa |
| **P22** | 🟡 Falta **vida de teste** que constitui e fatura no mesmo mês com CNAE de Fator R | testes |
| **P16** | 🟡 A paulada **diluída** em 3-4 meses nunca foi simulada, e é onde a conta pode virar | produto |
| **P17** | 🟡 Salário mínimo hardcoded — virar campo com vigência | produto |
| **P18** | 🟡 Boleto editável: o gateway bloqueia? | dev |
| **P19** | 🟡 ISS no local da prestação a partir de 2027 | pesquisa |
| **P20** | ⚪ Passar a lista dos **87 CNAEs** (15 com Fator R) para o Leonan e a Izabela revisarem | 🔴 Pedro |

---

## Links
[[2026-09-16-leonan-audio-1-bloco-a-e-c]] · [[2026-09-16-leonan-audio-2-bloco-d]] · [[_duvidas-contador]] · [[2026-09-16-rua-satelite-51-transcript-LITERAL]] · [[_encerrados]] · [[PENDENCIAS]]
