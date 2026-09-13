---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-13
assunto: persona-zero
tags: [produto, persona-zero, evidencia, prefeitura, alvara, documentos, sensivel]
---

# 🏛️ Os 4 documentos municipais da abertura — lidos 100%

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

Anexos dos chamados 26994688 (15/12/2025) e 27126269 (02/01/2026), baixados pelo Pedro e lidos com `pypdf`.

| Documento | Páginas | Caracteres | Lido |
|---|---:|---:|:--:|
| Ficha de Inscrição Cadastral (IM) | 1 | 2.273 | ✅ 100% |
| Alvará de Localização e Funcionamento | 4 | 12.302 | ✅ 100% |
| Dispensa de Licenciamento Sanitário | 1 | 1.207 | ✅ 100% |
| Dispensa Corpo de Bombeiros | 2 | 615 | ✅ 100% |

---

## 1 · 🔴🔴 O ACHADO GRAVE: um funcionário da Contabilizei assinou como REPRESENTANTE LEGAL

Página 4 do Alvará, **Termo de Compromisso**, texto literal:

> *"**Charles Davyd Gularte, CPF 003.\*\*\*.\*\*\*-44** neste ato atuando como **REPRESENTANTE LEGAL**, perante a Prefeitura de Belo Horizonte, da empresa ou do profissional autônomo acima indicado, e **sob responsabilidade penal, civil e administrativa**, DECLARA:"*

E o que foi declarado em nome do Pedro inclui:

- *"Que a **edificação** em que a atividade está instalada **atende aos dispositivos legais de prevenção e combate a incêndio e pânico**, conforme Auto de Vistoria do Corpo de Bombeiros - AVCB ou laudo técnico"*
- *"Que no caso de edificação condominial, **respeita os termos da convenção de condomínio** e do Código Civil"*
- *"Que **atende às normas sanitárias, ambientais, de segurança, acessibilidade e posturas**"*
- *"Que o empreendimento **não está localizado em Área de Preservação Permanente**"*
- *"**Estar ciente de que a falsidade na prestação das informações constitui crime, na forma do art. 299 do Código Penal**"*

🔴 **São afirmações sobre o IMÓVEL, feitas por quem nunca o viu.** O escritório não tem como saber se o prédio tem AVCB válido, nem o que diz a convenção do condomínio. E o termo é assinado *"por meio de uso de senha pessoal, de total responsabilidade do declarante, em substituição à assinatura convencional"*.

🔑 **A decisão que isso força pra nós, e é decisão de risco, não de UX.** Ou (a) **o cliente assina o termo** — verdadeiro, mais atrito, e ele responde pelo que declara; ou (b) **nós assinamos** — sem atrito, e um funcionário nosso assume responsabilidade penal por fato que não verificou. A líder escolheu (b) e ninguém contou ao cliente. ⚠️ Não é só ética: é passivo da agência, e precisa do Mauro e da advogada.

---

## 2 · 🔴 Área utilizada = **5 m²** (o nosso C4 crava 20 m²)

Aparece nos **dois** documentos oficiais: `ÁREA UTILIZADA: 5` na FIC e `Área a ser utilizada (m²): 5` no Alvará.

**Terceiro dos 22 valores ⚙️ conferido, terceiro errado.** O placar dessa coluna vira:

| Campo | Nosso | Real | |
|---|---|---|:--:|
| Capital social | R$ 10.000 | **R$ 1.000** | ❌ |
| Natureza jurídica (unipessoal) | SLU | **206-2 LTDA** | ❌ |
| **Metragem** | **20 m²** | **5 m²** | ❌ |
| Acesso ao endereço | Pedestre | **Pedestres** | ✅ |
| Atividade exercida no local | Não | **NÃO exercida** | ✅ |
| Atividade inócua ou virtual | Sim | **inócuo ou virtual** | ✅ |

**6 conferidos · 3 errados · 3 certos.** ⚠️ Padrão claro: acertamos os **campos categóricos** (que só têm uma resposta plausível) e erramos os **numéricos** (capital, metragem), que foram chutados. Os 16 restantes ainda não têm conferência.

---

## 3 · ✅ Três automações nossas CONFIRMADAS por documento de órgão

| Nosso campo (C4/C0) | Nosso valor | Onde bate |
|---|---|---|
| "Acesso ao endereço" | Pedestre | Alvará: *"Tipo de acesso: Pedestres"* |
| "Atividade exercida no local?" | Não (sempre) | Alvará: *"**Atividades NÃO exercidas no local**: 7319004-00 CONSULTORIA EM PUBLICIDADE (Grupo I) — NÃO exercida"* |
| "Atividade é inócua ou virtual?" | Sim (sempre) | Bombeiros: *"Declaro que o empreendimento será explorado em **ambiente inócuo ou virtual**"* |
| Tipo de imóvel | Apartamento (gate E3.4) | Alvará: *"Tipo de imóvel (IPTU): **APARTAMENTO**"* |
| "Você mora nele?" | Sim (gate E3.4) | Alvará: *"O local é residência de um dos sócios? **Sim**"* |

🔑 **E o gate de residência tem base legal nomeada**, que a gente não tinha: *"Liberado por se tratar de residência do titular da empresa ou do microempreendedor individual-MEI (**Lei 11.181/19, artigo 177, inciso II**)"*. Nosso gate estava certo por intuição; agora tem artigo.

---

## 4 · ✅ O índice cadastral do IPTU estava aqui o tempo todo

`Índice cadastral do IPTU: **108020 006A0264**` · `Tipo de imóvel (IPTU): APARTAMENTO`

Eu tinha classificado esse campo como "fora de escopo agora, temos o endereço completo". Ele está no Alvará — e é ele que puxa **todo o bloco urbanístico** que o órgão usa para decidir:

> Zoneamento **OM-3 (Ocupação Moderada 3)** · Área de Diretrizes Especiais: **ADE Serra do Curral** · Permissividade da via: **Vias de Caráter Misto - VM** · Classificação: **LOCAL** · Largura: **10M <= < 15M** · Regional: **Centro-sul - CS2** · *"Centralidade local"*

🔑 **Por isso o IPTU é campo obrigatório no nosso C4 e não dá pra derivar do CEP.** Não é burocracia: é a chave que liga o endereço às regras de uso do solo que decidem se a atividade é admitida ali. O nosso flow já pede — agora sabemos **por quê**, e dá pra explicar isso ao cliente em vez de só cobrar o número.

---

## 5 · 📄 Os documentos gerados, com número e validade

| Documento | Número | Emitido | Validade | Base legal |
|---|---|---|---|---|
| **Ficha de Inscrição Cadastral (IM)** | 1.724.064/001-7 | **15/12/2025** (início 12/12) | — | Cadastro Mobiliário de Contribuintes |
| **Alvará de Localização e Funcionamento** | **2025098844** | **15/12/2025** | 🔴 **15/12/2030** | Lei 11.181/19 |
| **Dispensa de Licenciamento Sanitário** | — | **02/01/2026** | — | Lei Municipal 7031/1996, art. 19 |
| **Dispensa Corpo de Bombeiros** | REDESIMPLES **MGL2506942520** | **02/01/2026** | — | declaração do empreendedor |

⏰ **O Alvará vence em 15/12/2030** e é *"Tipo: Alvará imediato"*. Renovação de 5 anos que **não existe no nosso mapa** — nem como aviso, nem como processo. Junta-se ao certificado digital (22/12/2026) como obrigação de ciclo longo que ninguém está vigiando.

🔑 **A "Emissão Dispensas" do chamado 27126269 são estes dois PDFs** — sanitário e bombeiros, ambos de 02/01/2026, **21 dias depois do CNPJ**. É o último ato da abertura, e é o que fecha o processo.

---

## 6 · 🔴 Duas obrigações de manutenção que não estão no nosso mapa

**1. Alteração cadastral em 30 dias.** Texto da FIC:

> *"Ocorrendo encerramento de atividade, mudança de endereço ou qualquer outra alteração de dados constantes do Cadastro Mobiliário de Contribuintes, deverá o contribuinte promover a competente baixa ou atualização no **prazo máximo de 30 (trinta) dias** após ocorrido o fato, conforme **Decreto Municipal 17.175/2019**, sob pena de ser autuado, conforme prevê a letra B do inciso I, art. 7º da Lei 7.378/97."*

**2. Alvará novo a cada mudança.** Texto do Alvará:

> *"Caso haja alteração de atividade(s), área utilizada, endereço do estabelecimento, ou demais condições que estejam em desacordo com as informações constantes neste documento, deverá ser providenciado **novo alvará de localização e funcionamento** (Lei 11.181/19, artigo 339, §3)."*

🔑 **Mudar de endereço, incluir CNAE ou trocar a área dispara DOIS processos municipais com prazo.** Nosso produto trata alteração cadastral como serviço avulso; aqui ela tem **prazo legal de 30 dias e multa**.

⚠️ **E o Alvará é para ficar afixado:** *"deverá ficar afixado em local visível e de fácil acesso à fiscalização (Decreto 14.060/2010, art. 6º)"* — num apartamento residencial, é regra que ninguém cumpre e todo mundo assina.

---

## 7 · Detalhes menores que valem registro

- **A IM não prova regularidade:** *"Este documento não implica no reconhecimento da regularidade do contribuinte… Não faz prova de regularidade fiscal, que deve ser feita mediante exibição da CND."*
- **A dispensa sanitária é revogável:** *"A Vigilância Sanitária **poderá convocar o empreendedor ao licenciamento** nos casos em que considerar necessário."* Dispensa não é imunidade.
- **E aponta para o estado:** *"Verifique se a atividade dispensada do licenciamento sanitário municipal é passível de licenciamento sanitário pela **Vigilância Sanitária do Estado de Minas Gerais**."* 🕓 Não checamos essa camada em lugar nenhum.
- **A declaração do Bombeiros é promessa futura:** *"Declaro que **instalarei** as medidas de segurança contra incêndio e pânico conforme normas vigentes no estado **antes do início das atividades**."* Assinada, e ninguém instalou nada num apartamento.
- **Atividade auxiliar registrada:** *"A - Escritório / sede administrativa de empresa"*, situação **Admitida**, dispensada de licenciamento ambiental. É um segundo eixo de classificação (além do CNAE) que o nosso flow não coleta.
- **Tipologia municipal:** Subcategoria **SERVIÇO**, Tipologia *"Serviços de comunicação"* — taxonomia da prefeitura, distinta do CNAE e da nossa pill.
- **Enquadramento ambiental:** Dispensado (art. 344, Lei 11.181/19 + Deliberação Normativa 102/20 do COMAM).

## Links
[[constituicao]] · [[2026-09-13-cadeia-de-emails-da-abertura]] · [[2026-09-13-cartao-cnpj-persona-zero-LITERAL]] · [[HOME]]
