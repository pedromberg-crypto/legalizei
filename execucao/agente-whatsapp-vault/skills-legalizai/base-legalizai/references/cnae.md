---
assunto: cnae
momento: [explicar, operar]
status: vivo
data: 2026-09-20
papel: "O que é CNAE, e o contrato da ferramenta que consulta os 1332"
tags: [agente, leo, rag, cnae, ferramenta, consulta, critico]
---

# CNAE (O CONCEITO E A FERRAMENTA)

## 1. O que é CNAE

É o código que diz oficialmente o que a empresa faz. Ele define o imposto, o registro e às vezes a exigência de conselho de classe.

Sem contabilês: **é o RG da atividade da empresa.** Errar ele é como nascer com o nome trocado na certidão.

No app, a pessoa **descreve a atividade com as próprias palavras** e a gente encontra o código certo. Ela não precisa saber o número, e a sua função no WhatsApp é a mesma: perguntar o que ela faz, não pedir que ela saiba um código.

## 2. 🔴 A base dos 1332 CNAEs não vive neste vault, e isso é de propósito

Ela é consultada por **ferramenta**, não lida por busca semântica. Dois códigos vizinhos como `6201-5/01` e `6201-5/02` são quase idênticos pra um mecanismo de similaridade, e **mudam a resposta fiscal**. Além disso a base carrega grau de confiança por linha, e confiança é regra de decisão, não texto.

🔴 **A ferramenta `consultar_cnae` ainda não está ligada neste canal. Não tente chamá-la.**

## 3. O que é proibido de memória, e o que não é

A diferença entre estas duas listas é o que separa **travar a conversa** de **dar resposta errada**.

**🔴 Proibido de memória, sempre, com ferramenta ligada ou desligada:**
* o anexo de um código de CNAE específico;
* a alíquota exata de um código;
* se um código específico é atendido;
* se uma ocupação está na lista oficial do MEI, quando ela não está escrita em [[mei-elegibilidade]] §2.

**✅ Permitido e esperado de você:**
* recomendar MEI ou ME por faturamento e tipo de atividade ([[mei-ou-me]]);
* dizer que serviço das 15 categorias do §5 a gente atende;
* o que está escrito em [[mei-elegibilidade]] §2 (fotógrafo pode; as intelectuais regulamentadas não);
* dizer que o código exato é confirmado no app, quando a pessoa descreve o que faz.

🔴 **Orientar por profissão não é afirmar código.** Travar numa dessas ou mandar pro atendente por causa de profissão é erro, e custa venda. Atendente só se ela insistir no anexo exato de um código.

⚠️ Isso é bastidor: pro cliente você **nunca cita ferramenta, base, nota ou nome de arquivo**.

## 4. A interface (para quando a ferramenta ligar)

```
consultar_cnae(codigo | termo_livre)
```

Fonte: a matriz de 1332 CNAEs, cobertura IBGE completa. Ela vive fora deste vault e é mantida pelo time.

| Campo | O que significa |
|---|---|
| `codigo`, `descricao` | identificação oficial |
| `atende_me_certeza` | "sim" libera afirmar que a gente atende como ME. Hoje são 87 códigos |
| `atende_mei_certeza` | idem pro MEI. Hoje são 51 |
| `mei_permitido` | se a ocupação existe na lista oficial do MEI. Hoje 351 dos 1332 permitem |
| `mei_ocupacoes` | o nome oficial da ocupação, útil pra confirmar com o cliente |
| `anexo_fator_r_grupo` | `III-fixo` (472) · `fator-r-dinamico` (47) · `IV` (51) · `requer-revisao` (62) |
| `anexo_fator_r_confianca` | `alta` (118) · `media` (452) · `baixa` (62) · vazio (700) |
| `exige_conselho` | 39 códigos exigem registro em conselho de classe, o que adiciona etapa na abertura |
| `iss_bh_aliquota` | ISS de BH, preenchido em 524 códigos |
| `escalar` | booleano calculado, ver §5 |

### 🔴 A regra de uso (isto é o que impede o erro caro)

Você só afirma anexo, alíquota ou elegibilidade quando **`anexo_fator_r_confianca` é `alta`** e o campo de certeza correspondente é `sim`.

Em qualquer outro caso (`media`, `baixa`, vazio, `requer-revisao`, `exige_conselho` igual a sim), a resposta é o **encaminhamento**, não o dado:

> "Essa atividade tem detalhe que eu não fecho sozinho. Já mandei pro nosso contador com CRC confirmar o enquadramento certo, e te trago a resposta com nome e sobrenome, não um chute."

Isso não é excesso de cautela: a reclassificação da matriz ainda está em validação com a contadora, e um enquadramento errado dito por WhatsApp vira decisão de negócio do cliente.

## 5. As 15 categorias que o app oferece

tecnologia e software · design · foto, vídeo e áudio · marketing e publicidade · edição e mídia · consultoria, pesquisa e tradução · ensino e cursos · arte, cultura e patrimônio · eventos e entretenimento · apoio administrativo · aluguel de equipamentos · reparos e manutenção · salão e beleza · hospedagem · atividade regulamentada (quando a pessoa não se encontra nas outras).

**Use essas categorias pra conversar. Use a ferramenta pra decidir.**

🔴 **Lista de código nunca entra neste vault.** Este arquivo guarda o conceito e as categorias em linguagem de gente, nada mais.
