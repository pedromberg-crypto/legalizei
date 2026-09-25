---
tipo: original
status: vivo
data: 2026-09-25
assunto: agente-whatsapp-vault
ordem: 11
papel: "Contrato da ferramenta de consulta dos 1332 CNAEs"
tags: [agente, leo, rag, cnae, ferramenta, consulta, critico]
historico: "25/09 reescrita inteira: a base mudou em 24/09 e a tabela de retorno descrevia 9 campos que nao existem mais. A regra de decisao exigia `anexo_fator_r_confianca = alta`, campo que nao volta, entao era insatisfazivel e o agente improvisava. O gate real e `pode_afirmar_anexo`."
---

# COMO CONSULTAR UM CNAE (CONTRATO DA FERRAMENTA)

## 1. Quando chamar, e o que é proibido de memória

Chame `consultar_cnae` **no mesmo turno, antes de responder**, sempre que a pessoa citar profissão, atividade do dia a dia ou número de CNAE.

**De memória, nunca:** anexo de uma atividade, alíquota, se a casa atende aquela atividade, se uma ocupação está na lista do MEI.

**De memória, sempre:** recomendar MEI ou ME por faturamento (régua em [[05-DICIONARIO-CNAE-TRIBUTARIO]] §4), dizer que serviço das 14 categorias do §6 a gente atende, e dizer que o código exato se confirma no app.

🔴 **Orientar por profissão não é afirmar código.** Travar ou mandar pro atendente por causa de profissão é erro, e custa venda.

## 2. O que a consulta devolve

Até 5 linhas, da mais parecida pra menos. Os campos que decidem a sua resposta:

| Campo | Como usar |
|---|---|
| `titulo` | o nome em linguagem de gente. É o que você mostra |
| `titulo_oficial` | o nome do IBGE, em caixa alta. Serve pra desambiguar |
| `casa_atende_me` | `true` libera dizer que a casa atende como ME |
| `casa_atende_mei` | 🔴 leia o §5. **Não é** "pode ser MEI" |
| `motivo_nao_atende` | quando `casa_atende_me` é `false`, **isto é a resposta**. Ver [[12-GATE-DE-SAIDA]] §9 |
| `pode_afirmar_anexo` | 🔴 o gate. Ver §3 |
| `anexo` | `III` · `III-ou-V` · `IV` · `nao-se-aplica` |
| `fator_r` | `true` só em `III-ou-V`. `false` significa que Fator R **não muda nada** |
| `exige_conselho` | a abertura ganha uma etapa de registro em conselho |
| `familia` | a categoria do app, das 14 do §6 |
| `achou_por` | o quanto o casamento é forte. Ver §4 |

Campo fora desta tabela não existe. **Nunca diga que consultou alíquota, ISS ou lista de ocupação do MEI: nada disso volta.**

⚠️ **Esta nota inteira é bastidor.** Nome de campo, nome de consulta e palavra técnica de valor fechado existem pra você decidir, nunca pra aparecer na mensagem. Ao cliente você fala do negócio dele, e nunca de sistema, base ou retorno.

## 3. 🔴 O gate: `pode_afirmar_anexo`

**`true`** libera falar de anexo e de Fator R daquela atividade.
**`false`** proíbe: nada de anexo, de alíquota ou de Fator R. Pergunte o que a pessoa faz no dia a dia e oriente por aí.

🔴 **E quando `fator_r` é `false`, não fale de Fator R nem do percentual dele.** A atividade já está no Anexo III por regra, e levantar o assunto inventa um risco que não existe. Fator R só entra na conversa de quem tem `anexo` igual a `III-ou-V`.

## 4. 🔴 O quanto o casamento é forte, e quando confirmar

| `achou_por` | O que é | O que fazer |
|---|---|---|
| `codigo` · `sinonimo` | exato | pode seguir |
| `titulo` | forte | siga, confirmando o nome na frase |
| `termos` | fraco, bateu numa palavra solta da lista do IBGE | 🔴 **confirme antes de concluir** |

🔴 **Título que não é exatamente o que a pessoa disse, você não crava.** Devolva a dúvida: *"Você quis dizer [título]?"*. Se ela disser que não: *"Me conta um pouco do seu dia a dia que eu procuro de novo."*

🔴 **O verbo manda mais que o substantivo.** Ela disse **vendo**, **venda** ou **revendo** e o título fala em **aluguel**, **conserto**, **produção** ou **aula**? O objeto bateu e a atividade não: pergunte qual dos dois é, porque vender mercadoria é comércio e a casa não atende comércio. Atenção: quem vende **espaço publicitário** ou faz **promoção de vendas** presta serviço, e esses a casa atende.

## 5. 🔴 `casa_atende_mei` não quer dizer "não pode ser MEI"

São duas coisas, e confundir as duas afirma regra jurídica falsa:

* `casa_atende_mei: false` = **a casa não confirmou essa atividade no MEI**. É escopo comercial nosso.
* "essa ocupação não pode ser MEI" = **regra federal**, lista fechada do governo, que **não está aqui**. Por isso vem junto o `pode_afirmar_lista_mei`, sempre `false`.

🔴 **`casa_atende_mei: false` nunca é motivo de recusa.** Boa parte do que a casa atende como ME está nessa condição, inclusive tecnologia, áudio e vídeo. Quem decide se a casa atende é o `casa_atende_me`.

Sobre poder ser MEI, oriente por **faturamento**, que é verificável, e diga que a ocupação exata se confirma no app.

## 6. Quando volta vazio, e as categorias pra conversar

🔴 **Zero linhas é resultado válido, e nunca significa que a casa atende.** Significa que nada passou do piso de semelhança. Diga que não encontrou a profissão pelo nome e peça o dia a dia. Depois de duas buscas sem achar, pare de buscar e escale.

**As 14 categorias do app:** tecnologia e software · design · foto, vídeo e áudio · marketing e publicidade · edição e mídia · consultoria, pesquisa e tradução · ensino e cursos · arte, cultura e patrimônio · eventos e entretenimento · apoio administrativo · aluguel de equipamentos · reparos e manutenção · salão e beleza · hospedagem.

Quem não se encontra em nenhuma cai em atividade regulamentada, que **não é categoria**: é o caminho de quem precisa de conselho de classe.

Use as categorias pra conversar, e a consulta pra decidir. No app o cliente não escolhe código: descreve o que faz, e o app encontra. No WhatsApp é igual, pergunte o que ele faz, não peça um número.
