---
tipo: referencia
status: vivo
data: 2026-09-18
assunto: prompt-risco-medio-liberacao-automatica
tags: [pesquisa, prompt, gemini, cnae, risco, jucemg, pbh, licenciamento, mei]
---

# 🔎 Prompt de pesquisa — a camada ACIMA do baixo risco esconde CNAE que roda liso?

> 🧭 **Como usar:** colar no **Gemini Pro com Google Search**. Resposta longa é esperada.
>
> 🎯 **Por que existe (provocação do Pedro, 18/09):** a nossa whitelist nasceu de um filtro **binário** — `risco_baixo_cgsim` vale `sim` para os **284** CNAEs nomeados no Anexo I da Resolução CGSIM 51/2019 e `nao` para os outros **1.048**. Só que a lei não é binária: a Lei 13.874/2019 (Liberdade Econômica) e a própria CGSIM trabalham com **níveis**, e o **nível II (médio risco)** costuma permitir **emissão AUTOMÁTICA do alvará mediante termo de ciência e responsabilidade, sem vistoria prévia**. Ou seja: pode existir CNAE que **roda liso na constituição** e que a gente descarta só por estar fora de uma lista de 284.
>
> 🔴 **A evidência que fundamenta a suspeita está na nossa conta real.** No chamado 26994688 (15/12/2025), da constituição da persona zero, o escritório escreveu: *"Por exercer atividades consideradas de **baixo ou médio risco**, precisamos acessar o portal Licenciador…"*. Médio risco, na operação real, **é tratado — não é bloqueio**.
>
> 📏 **O tamanho da aposta, medido:** **76 CNAEs** passam TODOS os nossos outros filtros (serviço, não vedado ao Simples, não ambíguo, sem conselho, sem registro setorial) **e o motor fiscal sabe apurar o DAS deles** — e são barrados só pelo risco. Destes, **28 são saúde** (divisões 86/87), que a persona já exclui por atividade regulamentada. **Sobram 48**, e são exatamente a lista do §3.
>
> ⚠️ **Anti-guru:** nada entra sem fonte primária citada com artigo. Resposta sem fonte é descartada.

---

## O prompt

```
Você é um especialista em licenciamento empresarial e classificação de risco
no Brasil, com domínio da RedeSim, da Lei 13.874/2019 (Liberdade Econômica),
das Resoluções CGSIM e da legislação municipal de BELO HORIZONTE/MG.

Responda em português do Brasil. Toda afirmação precisa de FONTE PRIMÁRIA com
citação literal e referência exata (lei, decreto, resolução, artigo, anexo,
inciso). Se não encontrar fonte primária, escreva "NÃO ENCONTREI FONTE
PRIMÁRIA" — nunca preencha com conhecimento geral.

═══════════════════════════════════════════════════════════════════
1 · O CLIENTE, TRAVADO — responda só dentro deste recorte
═══════════════════════════════════════════════════════════════════

Somos uma contabilidade digital que ABRE e OPERA empresas. O cliente é fixo:

· Microempresa (ME) optante pelo SIMPLES NACIONAL, Anexos III ou V
  (com ou sem Fator R). Anexo I (comércio), Anexo IV, Lucro Presumido
  e Lucro Real estão FORA e não são "depois".
· PRESTAÇÃO DE SERVIÇO. Comércio e indústria estão fora.
· Sede em BELO HORIZONTE / MG. Só BH.
· 1 a 4 sócios, pessoas físicas domiciliadas no Brasil.
· Sem funcionários no momento da abertura.
· Atividade NÃO REGULAMENTADA: se exige registro em conselho profissional
  (CRM, CRO, CREA, CRC, OAB, CRA, CRF, CRMV…), está fora.
· MEI ENTRA NESTA PESQUISA: atendemos MEI também, e queremos a mesma
  resposta para as ocupações do Anexo XI da Resolução CGSN 140/2018.
· O modelo de operação é 100% digital e remoto: escritório administrativo,
  sem atendimento ao público no local, sem estoque, sem manipulação de
  alimento, sem uso de fogo, sem produto químico, sem fonte de radiação.
  Área utilizada declarada: 20 m².

═══════════════════════════════════════════════════════════════════
2 · A PERGUNTA CENTRAL
═══════════════════════════════════════════════════════════════════

Hoje só aceitamos CNAE classificado como BAIXO RISCO (nível I). Queremos saber
se estamos deixando dinheiro na mesa:

**Existem CNAEs de prestação de serviço que NÃO são nível I (baixo risco), mas
que, em Belo Horizonte, ainda assim obtêm as liberações de forma AUTOMÁTICA no
ato do registro — sem vistoria prévia e sem análise humana — permitindo que a
constituição corra "lisa" de ponta a ponta?**

Responda cobrindo, obrigatoriamente:

2.1 · OS NÍVEIS DE RISCO, com fonte
     Quantos níveis existem hoje, como se chamam, e o que CADA UM dispensa ou
     exige. Em especial: o nível II (médio risco) permite emissão automática
     de alvará/licença mediante termo de ciência e responsabilidade, sem
     vistoria prévia? Cite o artigo. Diga se isso é regra nacional, se o
     município pode endurecer, e o que BH fez de fato.

2.2 · QUEM CLASSIFICA, DE VERDADE, EM BH
     A classificação que vale para a abertura em BH é a da Resolução CGSIM
     51/2019 (Anexo I/II/III), ou BH tem lista municipal própria que
     prevalece? Nomeie o instrumento legal de BH (lei, decreto, portaria,
     resolução), com número e data, e diga qual prevalece quando divergem.

2.3 · 🔑 O RISCO É POR VERTICAL, E É AQUI QUE EU MAIS PRECISO DE CLAREZA
     Entendo que "risco" não é um número só: há classificação sanitária
     (vigilância/GVISA), ambiental, de bombeiros (CBMMG) e urbanística
     (zoneamento/uso do solo), e um CNAE pode ser baixo numa e médio noutra.
     Explique como o portal Licenciador de BH consolida isso e qual vertical
     determina se há vistoria PRÉVIA. Diga se, para um escritório
     administrativo de 20 m² sem atendimento ao público, as verticais
     sanitária, ambiental e de bombeiros tendem a sair como dispensa ou
     automático independentemente do CNAE — e com que fundamento legal.

2.4 · O QUE MUDA NA PRÁTICA DA ABERTURA
     Para um CNAE nível II em BH, descreva o passo a passo real: o que o
     Integrador/JUCEMG devolve, o que o portal Licenciador de BH exige, se o
     alvará sai na hora, se há taxa adicional, quanto tempo leva, e o que o
     empresário assina. Se houver diferença entre "dispensa de licenciamento"
     e "licenciamento automático", explique a diferença prática.

2.5 · REGISTRO AUTOMÁTICO NA JUCEMG
     A JUCEMG tem "Registro Automático" (deferimento sem análise humana) para
     constituição de sociedade limitada com contrato padrão. Diga quais são os
     requisitos para se enquadrar nele e — o ponto — se o NÍVEL DE RISCO do
     CNAE interfere no registro automático, ou se ele depende só do tipo de
     ato e do contrato. Cite a fonte da JUCEMG.

2.6 · MEI
     Para as ocupações MEI: a classificação de risco muda alguma coisa na
     abertura (que é imediata e gratuita)? Existe ocupação MEI de serviço que
     seja nível II e ainda assim abra e opere sem vistoria prévia em BH?

═══════════════════════════════════════════════════════════════════
3 · O TESTE CONCRETO — 48 CNAEs para classificar um a um
═══════════════════════════════════════════════════════════════════

Abaixo, 48 CNAEs de SERVIÇO que já passaram todos os nossos outros filtros e
que hoje rejeitamos apenas por não estarem na lista de baixo risco.

Para CADA UM, devolva uma linha de tabela com:

| CNAE | Nível em BH (I/II/III) | Fonte da classificação | Sai automático? (SIM/NÃO/DEPENDE) | O que trava, se travar | Veredito |

Use como "Veredito" exatamente um destes quatro:
  🟢 ENTRA      — roda liso, sem vistoria prévia, e a fonte primária confirma
  🟡 AVALIAR    — provavelmente roda liso, mas depende de parâmetro (área,
                  público, horário, equipamento) ou a fonte não é conclusiva
  🔴 FORA       — exige vistoria prévia, licença de outro órgão, ou conflita
                  com a persona travada do §1
  ⚪ SEM FONTE  — não achei fonte primária; não chute

🔑 EU QUERO OS 🟡. Mesmo em dúvida, liste e explique exatamente o que precisa
ser confirmado — eles vão para avaliação técnica da nossa contadora. Não
filtre por conservadorismo: dizer "não sei, e o que falta saber é X" vale mais
do que omitir.

⚠️ Um alerta que já detectei e quero conferido: vários CNAEs de saúde
(divisões 86 e 87) aparecem na nossa base como "não exige conselho".
Desconfio que a base esteja olhando o CNAE e não o responsável técnico. Se
você concordar que clínicas e laboratórios exigem RT com conselho e/ou licença
sanitária prévia, diga isso explicitamente — cortei os 28 de saúde desta lista
por esse motivo, e quero saber se o corte foi certo.

── A LISTA ──
0161-0/03  SERVIÇO DE PREPARAÇÃO DE TERRENO, CULTIVO E COLHEITA  [MEI]
0162-8/03  SERVIÇO DE MANEJO DE ANIMAIS
5211-7/02  GUARDA MÓVEIS  [MEI]
5320-2/01  SERVIÇOS DE MALOTE NÃO REALIZADOS PELO CORREIO NACIONAL  [MEI]
5320-2/02  SERVIÇOS DE ENTREGA RÁPIDA  [MEI]
5510-8/01  HOTÉIS
5510-8/02  APART HOTÉIS
5510-8/03  MOTÉIS
5590-6/02  CAMPINGS  [MEI]
5911-1/01  ESTÚDIOS CINEMATOGRÁFICOS
5911-1/99  ATIVIDADES DE PRODUÇÃO CINEMATOGRÁFICA, DE VÍDEOS E DE PROGRAMAS DE TV N.E.
5912-0/99  ATIVIDADES DE PÓS-PRODUÇÃO CINEMATOGRÁFICA, DE VÍDEOS E DE PROGRAMAS DE TV N.E.  [MEI]
5913-8/00  DISTRIBUIÇÃO CINEMATOGRÁFICA, DE VÍDEO E DE PROGRAMAS DE TV
5914-6/00  ATIVIDADES DE EXIBIÇÃO CINEMATOGRÁFICA
7119-7/04  SERVIÇOS DE PERÍCIA TÉCNICA RELACIONADOS À SEGURANÇA DO TRABALHO
7319-0/01  CRIAÇÃO DE ESTANDES PARA FEIRAS E EXPOSIÇÕES
7319-0/99  OUTRAS ATIVIDADES DE PUBLICIDADE NÃO ESPECIFICADAS ANTERIORMENTE  [MEI]
7420-0/02  ATIVIDADES DE PRODUÇÃO DE FOTOGRAFIAS AÉREAS E SUBMARINAS  [MEI]
7490-1/02  ESCAFANDRIA E MERGULHO  [MEI]
7711-0/00  LOCAÇÃO DE AUTOMÓVEIS SEM CONDUTOR
7731-4/00  ALUGUEL DE MÁQUINAS E EQUIPAMENTOS AGRÍCOLAS SEM OPERADOR  [MEI]
7732-2/01  ALUGUEL DE MÁQUINAS E EQUIPAMENTOS PARA CONSTRUÇÃO SEM OPERADOR  [MEI]
7732-2/02  ALUGUEL DE ANDAIMES  [MEI]
7739-0/01  ALUGUEL DE MÁQUINAS E EQUIPAMENTOS PARA EXTRAÇÃO DE MINÉRIOS E PETRÓLEO
7739-0/02  ALUGUEL DE EQUIPAMENTOS CIENTÍFICOS, MÉDICOS E HOSPITALARES  [MEI]
7739-0/03  ALUGUEL DE PALCOS, COBERTURAS E OUTRAS ESTRUTURAS DE USO TEMPORÁRIO  [MEI]
7740-3/00  GESTÃO DE ATIVOS INTANGÍVEIS NÃO FINANCEIROS
8122-2/00  IMUNIZAÇÃO E CONTROLE DE PRAGAS URBANAS
8230-0/02  CASAS DE FESTAS E EVENTOS  [MEI]
8299-7/01  MEDIÇÃO DE CONSUMO DE ENERGIA ELÉTRICA, GÁS E ÁGUA
8599-6/01  FORMAÇÃO DE CONDUTORES
8599-6/02  CURSOS DE PILOTAGEM
9001-9/05  PRODUÇÃO DE ESPETÁCULOS DE RODEIOS, VAQUEJADAS E SIMILARES
9001-9/06  ATIVIDADES DE SONORIZAÇÃO E DE ILUMINAÇÃO  [MEI]
9001-9/99  ARTES CÊNICAS, ESPETÁCULOS E ATIVIDADES COMPLEMENTARES N.E.
9003-5/00  GESTÃO DE ESPAÇOS PARA ARTES CÊNICAS, ESPETÁCULOS E OUTRAS ATIVIDADES
9101-5/00  ATIVIDADES DE BIBLIOTECAS E ARQUIVOS
9102-3/01  ATIVIDADES DE MUSEUS E DE EXPLORAÇÃO DE LUGARES E PRÉDIOS HISTÓRICOS
9311-5/00  GESTÃO DE INSTALAÇÕES DE ESPORTES
9329-8/02  EXPLORAÇÃO DE BOLICHES
9601-7/01  LAVANDERIAS  [MEI]
9601-7/02  TINTURARIAS  [MEI]
9601-7/03  TOALHEIROS  [MEI]
9602-5/02  ATIVIDADES DE ESTÉTICA E OUTROS SERVIÇOS DE CUIDADOS COM A BELEZA  [MEI]
9609-2/05  ATIVIDADES DE SAUNA E BANHOS
9609-2/06  SERVIÇOS DE TATUAGEM E COLOCAÇÃO DE PIERCING  [MEI]
9609-2/07  ALOJAMENTO DE ANIMAIS DOMÉSTICOS  [MEI]
9609-2/08  HIGIENE E EMBELEZAMENTO DE ANIMAIS DOMÉSTICOS  [MEI]

═══════════════════════════════════════════════════════════════════
4 · O QUE MAIS EU QUERO, ALÉM DA TABELA
═══════════════════════════════════════════════════════════════════

4.1 · Fora destes 48, existe algum CNAE de SERVIÇO compatível com a persona
      travada que você classificaria como 🟢 ENTRA e que provavelmente não
      está no nosso radar? Liste até 15, no mesmo formato.

4.2 · Existe algum CNAE que HOJE tratamos como baixo risco (nível I) e que em
      BH, por norma municipal, exige algo que a regra nacional não exige? Ou
      seja: estamos errando para o lado otimista em algum ponto? Esta pergunta
      tem prioridade sobre todas as outras.

4.3 · Qual é a fonte oficial, consultável e atualizável, da classificação de
      risco por CNAE em BH? Nome do portal ou arquivo, URL e com que
      frequência muda. Precisamos reconsultar isso periodicamente.

4.4 · Termine com uma seção "O QUE ESTA PESQUISA NÃO PROVA", listando o que
      ficou fora do alcance das fontes que você conseguiu abrir de fato.
```

---

## Ao voltar com a resposta

1. Salvar o retorno **literal** em `pesquisa/fontes/` com a data, antes de qualquer paráfrase — regra de leitura integral (10/09).
2. Os 🟢 com fonte primária viram candidatos a entrar na matriz, passando antes pelo `cnae-verifica-atende.cjs`, que deriva o veredito do zero.
3. Os 🟡 vão para a **fila-Larissa** (avaliação técnica da contadora), não direto para a whitelist.
4. Se o 4.2 trouxer algo, é **correção de erro nosso** e tem prioridade sobre a expansão.
5. Rodar `node pesquisa/cnae-matriz/verificar-cnae.cjs` depois de qualquer mudança na lista — ele confere os números e o cruzamento com a taxonomia de pills.

⚠️ **O que esta pesquisa NÃO resolve:** a lacuna dos **942 CNAEs** com `exige_registro_setorial: nao-verificado`. São eixos diferentes — risco é licenciamento municipal, registro setorial é habilitação federal. Um 🟢 aqui ainda pode cair lá.

Ver [[cnae-liso-servico]] · [[mei-risco-e-simplificacao-abertura]] · [[cnae-complexidade-abertura]] · a evidência do Licenciador em `produto/me/_evidencias/2026-09-13-cadeia-de-emails-da-abertura.md`.
