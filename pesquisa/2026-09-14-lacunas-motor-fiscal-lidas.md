---
tipo: verdade
status: vivo
data: 2026-09-14
assunto: lacunas-motor-fiscal-respondidas
tags: [pesquisa, fiscal, motor, rbt12, iss, sublimite]
---

# ⚖️ As 3 lacunas do motor fiscal, respondidas

> 📖 **Leitura integral declarada:** 211 linhas · **32.330 caracteres · 100% lidos**. Texto literal salvo em [[2026-09-14-lacunas-motor-fiscal-LITERAL]]. Prompt que gerou: [[prompt-pesquisa-lacunas-motor-fiscal]]. Rodado pelo Pedro no Gemini com Google Search em 14/09.
>
> 🎯 **As três fecharam.** Duas viraram código no mesmo dia, uma fechou sem virar código — e isso é ganho, não perda.

## Placar

| | Lacuna | Veredito | Onde foi parar |
|---|---|---|---|
| **L1** | RBT12 de empresa em início de atividade | ✅ resolvida | `rbt12De()` em `execucao/motor-fiscal/apurador.mjs` · teste dourado **G4** |
| **L2** | ISS retido na fonte pelo tomador | ✅ resolvida | ainda não virou código — e a resposta **reduz** o que era pra construir |
| **L3** | Sublimite estadual | ✅ fechada | **não se aplica ao porte ME.** Zero código |

---

## L1 · O RBT12 não é sempre a soma dos 12 meses

**Res. CGSN 140/2018, art. 24, caput e inciso I.** Três regimes, e o que separa é o número de meses de atividade:

| Momento | Fórmula |
|---|---|
| **1º mês** | receita do **próprio mês** × 12 |
| **2º ao 12º mês** | média aritmética dos **meses anteriores** × 12 |
| **13º em diante** | soma simples dos 12 meses anteriores |

Citação literal: *"no 1º (primeiro) mês de atividade, utilizar como receita bruta total acumulada, a receita do próprio mês de apuração multiplicada por 12 (doze). I - nos 11 (onze) meses posteriores ao do início de atividade, (…) a média aritmética da receita bruta total dos meses anteriores ao do período de apuração, multiplicada por 12 (doze)"*.

### 🔴 As duas armadilhas, as duas confirmadas

**O mês corrente não entra.** Nem no numerador, nem no divisor. A norma diz *"meses anteriores ao do período de apuração"*. O faturamento do mês declarado é só a base sobre a qual a alíquota cai depois.

**Mês com receita ZERO entra — como zero, e conta no divisor.** É o que a intuição erra. Excluir mês zerado **infla** a média, sobe o RBT12, sobe a faixa e faz o cliente pagar a maior. A pesquisa chama isso de *"erro material sistêmico"*.

🧪 **Medido na persona zero:** RBT12 correto de ago/26 = **R$ 54.000**. Tirando os três meses zerados do divisor daria **R$ 144.000** — **167% a mais**. Mesma faixa por sorte (o teto da 1ª é R$180k), mas a poucos mil reais de custar caro.

### 📅 Qual das três datas manda

**A data de abertura constante do CNPJ.** Res. CGSN 140/2018 art. 2º, V: *"data de início de atividade a data de abertura constante do CNPJ"*.

🔑 Não é a assinatura do contrato social (11/12 na persona zero), não é o registro na Junta. Isso responde direto os itens **44**, **45** e **46** de [[PENDENCIAS]], que mandam guardar as três datas separadas: agora sabemos **qual delas o motor lê**.

### A folha anualiza pelo mesmo critério

**Art. 26, §4º**, literal: *"na hipótese de a ME ou EPP ter menos de 13 (treze) meses de atividade, adotar-se-ão, para a determinação da folha de salários anualizada, incluídos encargos, os mesmos critérios para a determinação da receita bruta total acumulada"*. Confirma o que o motor já fazia.

---

## L2 · ISS retido: a resposta DIMINUI o que havia pra construir

**Não é compensação, é segregação.** LC 123/2006 art. 21 §4º, literal: *"a microempresa ou a empresa de pequeno porte não fará jus à apropriação ou compensação do valor do ISS retido, devendo a receita sujeita à retenção na fonte ser segregada no momento da apuração do Simples Nacional, de forma que o aplicativo de cálculo a desconsidere da base de cálculo do ISS devido"*.

Na prática: a receita com retenção vai em rubrica própria no PGDAS-D, o sistema tira o ISS da base, e o DAS sai só com os federais.

### 🔑 E aqui está o achado que muda o produto

**Para as NOSSAS atividades, retenção intermunicipal não deveria existir.**

A regra do art. 3º da LC 116/2003 é que *"o serviço considera-se prestado, e o imposto, devido, no local do estabelecimento prestador"*. As 25 exceções que deslocam a competência (construção civil, vigilância, varrição, andaimes) **não incluem** consultoria, publicidade, TI, design, ensino nem tradução.

Então: empresa em BH, tomador em outro município de MG → **o ISS é de Belo Horizonte**, e o tomador que retém está praticando ato *"eivado de nulidade"*. A empresa continua devendo em BH. O procedimento correto é emitir a nota **sem retenção** e pagar o DAS integral.

⚠️ **Dentro de BH a retenção existe e é real.** A Lei Municipal 8.725/2003 (arts. 20, 21 e 24) põe órgãos públicos, hospitais, concessionárias e instituições financeiras como substitutos — e o **art. 24 obriga retenção sobre agências de publicidade**, que é categoria nossa. Mas só alcança tomador inscrito no Cadastro Mobiliário da capital.

🎯 **Consequência de produto:** o caso comum (tomador fora de BH) **não** precisa de tela de retenção. O caso que precisa é tomador em BH com uma das naturezas do art. 20/21, ou agência de publicidade pelo art. 24. É um recorte muito menor do que eu supunha.

---

## L3 · Sublimite: fechada sem virar código

**Sublimite MG 2026 = R$ 3.600.000** (LC 123 art. 19 · Portaria CGSN 54/2025).

🟢 **A resposta que eu pedi por escrito veio por escrito:** *"não se aplica ao porte ME"*. O teto do ME é R$360.000. É impossibilidade matemática, não interpretação.

⚠️ **Mas uma coisa que eu tinha errado:** eu supunha que sublimite fosse assunto de ICMS, logo irrelevante pra serviço. **Não é.** O art. 19 diz *"ICMS e o ISS"*, e a adoção pelo estado "carrega" os municípios. Se a empresa virar EPP e passar dos 3,6mi, **o ISS sai do DAS** e passa a ser apurado direto na Prefeitura. Como EPP é porta de saída no nosso escopo, isso vira aviso, não funcionalidade.

---

## ⚠️ O que eu NÃO trataria como fato

A pesquisa é boa e cita fonte primária nos pontos centrais (Planalto, Receita, LegisWeb). Quatro ressalvas:

1. 🔴 **A Resolução CGSN nº 190/2026** — citada como mudando *"data de abertura"* para *"data de inscrição"* no CNPJ a partir de 01/01/2027. A fonte é **site secundário** (`normaslegais.com.br`), e o prompt proibia blog/portal como fonte primária. **Conferir no Diário Oficial antes de virar código.** Fica como lacuna **L4** no motor.

2. ⚠️ **A regra do mês zerado se apoia em blog.** A referência 4 é `contta.com.br`, não texto legal. A regra é coerente com o art. 24 (que fala em média dos meses anteriores, sem ressalva), e o raciocínio de que excluir causaria recolhimento a maior se sustenta sozinho. Mas a citação literal que ampara **especificamente** o mês zerado não veio.

3. ✅ **A própria pesquisa confessou dois pontos de interpretação**, e isso é bom sinal: a repartição de 33,50% do ISS sai da tabela anexa, não de frase literal; e a proibição de retenção intermunicipal foi **deduzida** da sistemática federativa — *"não existe um artigo com fraseologia denegatória"*.

4. 🐛 **Erro de redação no relatório:** ele chama Belo Horizonte de *"soteropolitana"* em dois trechos. Soteropolitano é de **Salvador**. Não muda nenhuma conclusão (o resto do texto usa "belo-horizontina" corretamente e cita a lei municipal certa), mas indica que o texto não foi revisado com cuidado — pesar isso ao usar as partes sem citação literal.

5. 📅 **LC 214/2025 (CBS e IBS)** aparece no fechamento como coisa que vai mexer em retenção e limites. Sem data e sem número. Virou lacuna **L5**.

---

## 🔴 E a pesquisa errou o DAS — a gente acertou

Ela calcula o DAS de agosto como **R$ 474,60**, aplicando `7.910 × 6%`.

A guia real da Receita é **R$ 474,59**, porque o DAS é a soma de seis parcelas arredondadas por tributo. Nosso motor devolve 474,59 e bate com o recibo do PGDAS-D.

🔑 **Vale como método, não como troféu:** uma pesquisa com fonte primária, confiança alta e citação literal ainda reproduziu o erro de centavo — porque a lei não fala de arredondamento, só o recibo fala. **Documento não substitui uso real**, que é o que [[legalize-uso-real-corrige-o-mapa]] já dizia.

## Links
[[2026-09-14-lacunas-motor-fiscal-LITERAL]] · [[prompt-pesquisa-lacunas-motor-fiscal]] · [[anexo-iii-simples]] · [[anexo-v-simples]] · [[PENDENCIAS]] · [[PERSONA]] · [[legalize-uso-real-corrige-o-mapa]]
