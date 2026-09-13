---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-13
assunto: persona-zero
tags: [produto, persona-zero, evidencia, abertura, email]
---

# 📧 "[Abertura] Sua empresa está sendo criada" — o gate de confirmação da líder

**Fonte:** `pedromberg@gmail.com`, marcador Contabilizei (44 e-mails).
**Remetente:** `abertura@contabilizei.com.br` · **11/12/2025 11:49** — **um dia antes do CNPJ** (12/12/2025).
**Tamanho:** 2.911 caracteres · **lido 100%** (expandido "Exibir toda a mensagem").

> 🔑 **Decisão do Pedro, 13/09:** os e-mails da abertura passam a ser **fonte de lapidação de processos e funcionalidades**, não só contexto. Eles carregam o passo a passo completo até a entrada na plataforma — que é justamente o trecho que o portal não mostra.

---

## 1 · 🔴 Capital social: **R$ 1.000,00** (o nosso é R$ 10.000 fixo)

Texto literal do e-mail: `Capital social: R$ 1.000,00`.

Nossa automação do **C4** crava **R$ 10.000,00**, e o **C3** deriva daí *"valor da participação de cada sócio = % informado × R$10.000, e o valor em R$ é também o nº de quotas (quota = R$1)"*. **Dez vezes de diferença, e a conta das quotas nasce errada junto.**

🔑 **É o primeiro dos 9 valores fixos da C4 a ser conferido contra caso real — e já veio errado.** Não prova que R$1.000 seja o valor certo pro nosso produto (é escolha, não obrigação legal: a LC não fixa mínimo para LTDA). Prova que **R$10.000 foi escolhido sem referência**, e que a tela mais cega do flow merecia essa conferência.

⚠️ **Decisão pendente:** qual capital social o nosso produto usa por padrão, e se vira campo do cliente. Não decidir por imitação — decidir com o Mauro.

## 2 · 🐛 Dois merge tags quebrados, nos dois campos que mais importam

```
Regime tributário:
Sua empresa será enquadrada no *|REGIME_TRIBUTARIO|*

Descrição
*|OBJETO_SOCIAL|*
```

O e-mail que pede ao cliente para **conferir os dados antes de assinar** exibe código de template no lugar do **regime tributário** e do **objeto social**. 🐛 Bug em produção, na líder de 13 anos, no e-mail mais crítico da jornada — e **quebra calado**: nada avisa o cliente de que faltou informação.

🔑 **Lição de arquitetura, não de copy:** confirmação por e-mail estático não tem como validar que renderizou. Se a nossa confirmação for tela viva (A1 `/revisar`), o campo vazio aparece como vazio e o gerador audita.

## 3 · 🔑 É o nosso A1 (`/revisar`), entregue por e-mail e pós-pagamento

> *"Confira as informações abaixo e, se precisar alterar alguma informação, faça os ajustes o quanto antes. Se estiver tudo certo, é só esperar pela próxima etapa."* + botão **"Ajustar informação"**

**Os 7 campos que a líder escolhe confirmar** — a lista curta do que de fato vira documento:

| # | Campo | Valor real do Pedro |
|:--:|---|---|
| 1 | Razão social | PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA EM MARKETING LTDA |
| 2 | Nome da empresa (fantasia) | Berg Consultoria em Marketing |
| 3 | Regime tributário | 🐛 `*|REGIME_TRIBUTARIO|*` |
| 4 | **Capital social** | **R$ 1.000,00** |
| 5 | Endereço | Rua Corinto, 202, Apartamento 601, Serra, Belo Horizonte/MG |
| 6 | CNAE principal | 7319-0/04 - Consultoria em publicidade |
| 7 | Descrição (objeto social) | 🐛 `*|OBJETO_SOCIAL|*` |

⚠️ **E avisam que mudam a razão social sem perguntar:** *"Nossos especialistas podem ter feito alterações para garantir que ela seja aceita pela Junta Comercial."* 🏢 Humano no meio, e o cliente descobre depois. Nosso C7 pede 3 opções por ordem de prioridade justamente para não precisar disso.

## 4 · A esteira deles, em 6 passos literais

1. **Análise das informações enviadas** — *"se os dados preenchidos no cadastro estão dentro dos padrões necessários"*
2. **Criação da sua assinatura digital** — *"através da emissão do certificado digital do seu CPF"*
3. **Assinatura dos documentos**
4. **Emissão do CNPJ** — *"Enviaremos o cartão CNPJ e explicar como fazer o pagamento das taxas de regularização"*
5. **Configuração do certificado digital e da conta bancária** — *"emitir o certificado digital do seu CNPJ e mostrar como já garantir sua conta PJ gratuitamente"*
6. **Inscrição Municipal e outras licenças** — *"Realizaremos a Inscrição Municipal na prefeitura da sua cidade e logo depois sua empresa estará pronta para emitir Notas Fiscais"*

### 🔴 A CCM tem dono, e é o último passo

O passo 6 responde a pergunta 🔴 que ficou aberta no handoff de 12/09: a **Inscrição Municipal não estava em nenhum dos três trechos** (dev · assistido · parceira), e sem ela o P3 não emite nota. Na líder, **é serviço dela**, é o **último** passo da abertura, e é ele que **libera a NFS-e**. O CCM do Pedro é `17240640017`.

### ⚠️ Correção: NÃO são dois certificados

Eu tinha lido o passo 2 ("certificado digital do seu CPF") como um **segundo certificado**. **Não é** — ratificação do Pedro em 13/09:

> *"eles nessa primeira assinatura simplesmente pedem para acessar o gov, tem que ser Ouro e assinar por lá o usuário mesmo. Então não existe de fato esse segundo certificado. É apenas o do CNPJ mesmo."*

O que existe na 1ª assinatura é **assinatura eletrônica gov.br com conta nível Ouro**, feita pelo próprio sócio. Não há certificado a emitir, instalar ou pagar. A copy do e-mail é imprecisa. **O único certificado do processo é o e-CNPJ**, emitido no passo 5 — a cadeia AC SAFEWEB de 22/12/2025 ([[2026-09-13-certificado-16-minutos-e-o-contrato-que-nunca-chegou]]).

## 5 · ⏱️ A velocidade é real, e o Pedro tem a medida

E-mail em 11/12 11:49 (*"estamos analisando os dados"*) → **CNPJ em 12/12**. Menos de 24h para análise + assinatura + Junta + Receita. Levantei como implausível; o Pedro ratificou:

> *"a consulta de viabilidade chegamos a rodar no nosso RPA e demorou para o deferimento apenas 40 segundos. Então uma pessoa atenta aos processos pode constituir a empresa em 24h em Belo Horizonte."*

⚖️ **Viabilidade deferida em 40 segundos** (medido no nosso próprio RPA) e **constituição completa em 24h em BH** com acompanhamento atento. 🔑 Isso é promessa de produto, não detalhe: o gargalo do prazo **não é o órgão, é a atenção humana ao processo** — exatamente o que um app pode automatizar.

## 6 · Canais e endereços (para o mapa de atendimento deles)

- WhatsApp de abertura: **+55 (11) 9 3000-2634** · e-mail `abertura@contabilizei.com.br`
- Horário: **segunda a sexta, 9h às 18h** (a plataforma anuncia atendimento "até às 22h" no marketing — 🐛 divergência com o canal da abertura)
- Endereços: São Paulo (Av. Paulista, 1106) e Curitiba (Rua Nunes Machado, 68 — Cond. The Five - East Batel, o mesmo da procuração)

## Links
[[constituicao]] · [[2026-09-13-certificado-16-minutos-e-o-contrato-que-nunca-chegou]] · [[2026-09-13-ecac-procuracao-e-caixa-postal]] · [[HANDOFF-DADOS]] · [[HOME]]
