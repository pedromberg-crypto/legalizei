---
tipo: referencia
status: vivo
data: 2026-09-15
assunto: prompt-defis-e-canais-de-transmissao
tags: [pesquisa, prompt, gemini, defis, serpro, integra-contador, esocial]
---

# 🔎 Prompt de pesquisa — a DEFIS, a migração de 2027, e os canais de transmissão

> 🧭 **Como usar:** colar no **Gemini com Google Search**. O Pedro roda fora e cola o retorno.
>
> 🎯 **Por que agora:** a DEFIS é a **única** obrigação do nosso ciclo cujo canal segue 🟡 não confirmado, e ela tem **data para deixar de existir** (extinta a partir de 2027, absorvida pelo PGDAS-D). Decidir o canal sem saber o que acontece na virada seria construir para jogar fora.
>
> 🔴 **E tem urgência de produto:** a conta real mostrou que uma empresa aberta em **12/12/2025** entregou DEFIS do ano-calendário 2025 **inteiro**, transmitida em 08/02/2026. Duas das nossas personas abrem em novembro e dezembro — para elas a primeira obrigação anual cai poucas semanas depois da abertura.

---

## O prompt

```
Você é um especialista em obrigações acessórias do Simples Nacional e em
integração com as APIs de governo brasileiras (SERPRO / Receita Federal).
Responda em português do Brasil, com fonte primária e citação literal.

═══════════════════════════════════════════════════════════════════
CONTEXTO TRAVADO — responda SOMENTE dentro deste recorte
═══════════════════════════════════════════════════════════════════

Somos um escritório de contabilidade digital construindo o próprio sistema.
O cliente é sempre:
· Microempresa (ME) optante pelo Simples Nacional
· Anexo III ou Anexo V, NUNCA Anexo I, II ou IV
· Prestadora de SERVIÇO não regulamentado, sediada em Belo Horizonte/MG
· De 1 a 4 sócios pessoa física, SEM NENHUM FUNCIONÁRIO
· Faturamento até R$ 360.000/ano

Transmitimos as obrigações EM NOME DO CLIENTE, com procuração e certificado
digital e-CNPJ. Já decidimos usar o eSocial (Web Service SOAP/XML gratuito) e
a API Integra Contador do SERPRO.

NÃO responda sobre: MEI, Lucro Presumido, Lucro Real, empresa com empregados,
ECD, ECF, obrigações estaduais de ICMS.

Se algo mudou ou vai mudar entre 2026 e 2028, diga a data exata e a norma que
determinou a mudança. NÃO PREENCHA LACUNA COM PLAUSIBILIDADE — prefiro "não
encontrei" a uma resposta bonita e não amparada. Se a informação vier de blog
de contabilidade e não de fonte oficial, diga isso explicitamente.

═══════════════════════════════════════════════════════════════════
FORMATO OBRIGATÓRIO DE CADA RESPOSTA
═══════════════════════════════════════════════════════════════════

1. Resposta direta (uma frase)
2. Fonte (norma, manual oficial, ou documentação técnica — com URL)
3. Citação LITERAL, entre aspas
4. Vigência em setembro de 2026, e o que muda em 2027/2028
5. Confiança: ALTA (norma/manual oficial) / MÉDIA (nota técnica, FAQ) /
   BAIXA (blog, doutrina, prática)

═══════════════════════════════════════════════════════════════════
P1 · O QUE É A DEFIS, EXATAMENTE, E O QUE VAI DENTRO DELA
═══════════════════════════════════════════════════════════════════

1.1 · O que é a DEFIS e qual a norma que a institui?

1.2 · Qual o PRAZO exato de entrega e qual a multa por atraso ou por não
      entrega? A multa tem valor mínimo?

1.3 · Liste TODOS os campos/informações que a DEFIS exige de uma ME de
      serviço sem empregados. Quero a lista completa, não um resumo:
      ganhos de capital, saldo em caixa/banco no início e no fim do
      ano, despesas, número de empregados no início e no fim, lucro
      contábil apurado, rendimentos dos sócios, distribuição de lucros
      por sócio, doações, e o que mais houver.

1.4 · Quais desses campos são OBRIGATÓRIOS e quais podem ficar em
      branco/zero numa ME de serviço sem empregados?

1.5 · A DEFIS exige ESCRITURAÇÃO CONTÁBIL completa (balanço, DRE) para
      ser preenchida, ou basta o Livro Caixa?

1.6 · Empresa aberta em dezembro entrega a DEFIS do ano inteiro em que
      foi aberta? (Vimos um caso real: CNPJ aberto em 12/12/2025,
      DEFIS do ano-calendário 2025 transmitida em 08/02/2026,
      abrangendo 01/01/2025 a 31/12/2025.) Confirme se está correto e
      explique como se declara o período anterior à existência.

1.7 · O que acontece se a DEFIS não for entregue? Ela bloqueia a
      transmissão do PGDAS-D das competências seguintes?

═══════════════════════════════════════════════════════════════════
P2 · A EXTINÇÃO DA DEFIS EM 2027
═══════════════════════════════════════════════════════════════════

2.1 · A DEFIS está mesmo sendo extinta/absorvida pelo PGDAS-D? Qual a
      norma, e a partir de qual ano-calendário?

2.2 · A DEFIS do ano-calendário 2026 (entregue em 2027) ainda existe,
      ou já entra no novo formato?

2.3 · O que exatamente muda no PGDAS-D para absorver a DEFIS? Passa a
      ter campos anuais? Muda o layout? Muda o prazo?

2.4 · Um sistema que estamos construindo agora deve implementar a
      DEFIS no formato atual, ou já deve mirar o formato novo? Qual é
      a janela de convivência entre os dois?

═══════════════════════════════════════════════════════════════════
P3 · O INTEGRA CONTADOR (SERPRO) ATENDE O QUE PRECISAMOS?
═══════════════════════════════════════════════════════════════════

Queremos usar a API Integra Contador para tudo que for possível. Precisamos
saber, serviço por serviço, se ela cobre:

3.1 · Transmitir a DEFIS
3.2 · Transmitir o PGDAS-D (declaração mensal)
3.3 · Emitir a guia DAS (com código de barras e valor)
3.4 · Emitir o DAS de competência em ATRASO, já com multa e juros
      calculados pelo próprio sistema
3.5 · CONSULTAR se uma guia foi paga (situação de arrecadação)
3.6 · Consultar o histórico de declarações transmitidas
3.7 · Emitir o DARF do INSS e do IRRF do pró-labore do sócio
3.8 · Transmitir a DCTFWeb

Para CADA um: existe endpoint? Qual o nome do serviço na documentação?
É pago por requisição? Qual a ordem de grandeza do custo?

3.9 · O Integra Contador exige procuração eletrônica e-CAC do cliente
      para o nosso CNPJ, ou basta o certificado digital e-CNPJ dele?
      Como se dá o vínculo entre o escritório e o cliente na API?

3.10 · Existe ambiente de HOMOLOGAÇÃO/sandbox? Como se contrata?

3.11 · Há limite de requisições, throttling, ou exigência de volume
       mínimo de contratação?

═══════════════════════════════════════════════════════════════════
P4 · O QUE SOBRA FORA DO INTEGRA CONTADOR
═══════════════════════════════════════════════════════════════════

4.1 · Das obrigações listadas na P3, alguma NÃO tem API e só pode ser
      feita manualmente no portal? Quais?

4.2 · O eSocial (Web Service SOAP/XML) e a DCTFWeb são caminhos
      separados, ou a DCTFWeb é gerada automaticamente a partir dos
      eventos do eSocial? Precisamos transmitir as duas coisas ou uma
      só?

4.3 · Para uma ME sem empregados, que eventos do eSocial são
      obrigatórios? (Presumimos S-1000, S-1200 e S-1299 — confirme e
      complete.) Existe evento anual obrigatório?

4.4 · Existe a figura do "eSocial sem movimento"? Como e quando se
      declara?

═══════════════════════════════════════════════════════════════════
FECHAMENTO
═══════════════════════════════════════════════════════════════════

Monte uma tabela final com: obrigação · prazo · canal de transmissão ·
tem API? · custo · confiança da informação.

E declare separadamente quais respostas você NÃO encontrou em fonte
oficial.
```

---

## Onde o retorno entra

| | |
|---|---|
| Captura literal | `pesquisa/fontes/2026-09-XX-defis-e-canais-LITERAL.md`, 100% do texto |
| P1 → | vira o desenho da DEFIS, que hoje **não está em nenhuma das 8 categorias** de processo |
| P2 → | decide se implementamos o formato atual ou já o novo |
| P3 → | fecha o `CANAL.A_CONFERIR` do A1 em `ciclo-do-cnpj.mjs`, e confirma os outros 4 que já apontam pro Integra Contador |
| P4 → | diz se o M4 é **um** envio ou **dois** |

⚠️ **Etiqueta de 3 vias na leitura:** o retorno anterior (pró-labore, 15/09) acertou a **estrutura** citando norma primária e **errou os números do IRRF**, usando tabela desatualizada. Estrutura e número precisam ser conferidos separadamente.

## Links
[[PENDENCIAS]] · [[ciclo-do-cnpj]] · [[prompt-pesquisa-pro-labore-por-socio]] · [[2026-09-14-declaracao-anual-e-informe-de-rendimentos]]
