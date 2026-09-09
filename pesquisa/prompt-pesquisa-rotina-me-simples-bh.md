---
tipo: prompt-pesquisa
status: pronto-pra-rodar
data: 2026-09-09
assunto: rotina-contabil-me-simples-bh
tags: [pesquisa, prompt, gemini, fiscal, folha, nfse, calendario, bh]
---

# 🔎 Prompt — a rotina contábil completa de um ME do Simples em BH

> **Por que existe:** a [[funcionalidades-me-simples|lista consolidada do portal]] foi montada olhando o que a Contabilizei entrega. Isso mapeia o CONCORRENTE, não a OBRIGAÇÃO. Faltava a pergunta de baixo: o que um ME de serviço no Simples, em Belo Horizonte, de fato precisa fazer todo mês, em que data, em que sistema, e com que consequência se atrasar.
>
> **Premissa nova e importante:** nesta altura do flow **o app já tem o certificado digital A1 do cliente em posse**. Isso muda o que é possível: dá pra agir em nome dele nos sistemas oficiais em vez de só orientar.
>
> **Como usar:** colar o bloco abaixo no Google Search Pro do Gemini. Ele roda fora da sessão e o resultado volta pro vault ([[legalize-pesquisa-grande-via-gemini]]).

---

## O prompt (copiar daqui pra baixo)

```
Você é um contador com experiência em Simples Nacional e em obrigações
municipais de Belo Horizonte/MG. Preciso de um levantamento completo, com base
legal e datas, da rotina contábil de uma empresa específica. O objetivo é
definir o que precisa existir dentro de um aplicativo de contabilidade digital.

# O PERFIL EXATO DA EMPRESA (não generalize para outros perfis)

- Porte: ME (Microempresa), optante pelo Simples Nacional.
- Atividade: PRESTAÇÃO DE SERVIÇO. Não é comércio nem indústria.
- Anexos aplicáveis: III (6% inicial) ou V (15,5% inicial), definidos pelo
  Fator R. Não trate de Anexo I, II ou IV.
- Município: BELO HORIZONTE/MG. Toda obrigação municipal deve ser a de BH,
  com o sistema e o prazo de lá.
- Sociedade: 1 ou 2 sócios, com pró-labore.
- Colaboradores: de zero a poucos empregados CLT.
- Faturamento: até R$ 360 mil/ano (faixa de ME).

# PREMISSA TÉCNICA QUE MUDA O ESCOPO

O aplicativo JÁ TEM EM POSSE o certificado digital e-CNPJ A1 da empresa,
entregue pelo cliente no onboarding. Portanto, ao responder cada item, diga
o que o certificado A1 PERMITE fazer em nome da empresa de forma automatizada,
e o que continua exigindo (a) procuração eletrônica e-CAC, (b) o login gov.br
pessoal do sócio, ou (c) presença/ação humana insubstituível. Essa distinção é
o dado mais importante da pesquisa.

# O QUE EU PRECISO

## 1. CALENDÁRIO FISCAL COMPLETO
Monte a tabela de TODAS as obrigações desta empresa, agrupadas por
periodicidade (mensal, trimestral, anual, eventual). Para cada uma:
- Nome da obrigação e o que ela é, em uma linha
- Prazo exato (dia do mês ou data) e a regra quando cai em fim de semana ou
  feriado (antecipa ou prorroga?)
- Base legal (lei, resolução CGSN, decreto municipal)
- Sistema oficial onde se cumpre (PGDAS-D, e-CAC, eSocial, DCTFWeb, BHISS
  Digital, SIARE, etc.)
- Quem pode cumprir: contador com A1, procuração e-CAC, ou só o sócio
- O que acontece se atrasar (multa mínima, percentual, e se gera exclusão do
  Simples)

Confirme ou corrija especificamente esta afirmação, que eu preciso validar:
"o DAS do Simples Nacional vence todo dia 20 do mês seguinte ao da apuração".
Diga se é dia 20 fixo, o que acontece quando dia 20 é não-útil, e desde
quando essa regra vale.

Não esqueça de cobrir, no mínimo: DAS mensal, PGDAS-D (a apuração, que é
diferente da guia), DEFIS anual, obrigações de ISS de Belo Horizonte,
declarações do eSocial, DCTFWeb, FGTS, e o que existir de estadual para
prestador de serviço.

Diga explicitamente também de QUAIS obrigações este perfil está DISPENSADO
(por exemplo ECD, ECF, EFD-Contribuições, DIRF), porque saber o que não se
aplica evita construir tela inútil.

## 2. A ROTINA DO EMPRESÁRIO, MÊS A MÊS
Descreva o ciclo real de um mês nessa empresa, na ordem em que acontece: o que
ele faz do dia 1 ao dia 31, o que o contador faz, e onde os dois se cruzam.
Quero entender a sequência (emitir nota, apurar, gerar guia, pagar, declarar),
não só a lista de obrigações.

## 3. FOLHA DE PAGAMENTO NO SIMPLES NACIONAL (aprofunde este bloco)
Este é o bloco que menos domino. Preciso de:
- Como funciona a folha de um ME do Simples com empregado CLT: quais encargos
  incidem, quais NÃO incidem (o Simples desonera parte da patronal no Anexo
  III?), e como isso difere do Anexo V.
- O passo a passo mensal completo: registro do empregado, evento no eSocial,
  cálculo, holerite, FGTS (via FGTS Digital), INSS (via DCTFWeb/DARF), IRRF.
- Prazos de cada etapa.
- Eventos que fogem do mês: 13º salário (parcelas e prazos), férias, aviso
  prévio, rescisão e a documentação de cada um.
- O que o certificado A1 da empresa permite fazer no eSocial e no FGTS Digital
  em nome dela, e o que exige procuração.
- Como funciona o pró-labore do sócio: é folha? Entra no eSocial? Qual guia,
  qual alíquota de INSS e de IRRF, qual prazo.
- CRUCIAL PARA MIM: a relação entre a folha e o FATOR R. A folha de salários
  dos últimos 12 meses dividida pela receita bruta dos últimos 12 meses define
  se a empresa cai no Anexo III (6%) ou no V (15,5%). Explique exatamente o que
  entra no numerador (pró-labore conta? FGTS conta? 13º conta?), como é o
  cálculo mês a mês, e em que momento a mudança de anexo passa a valer.
  Quero saber se contratar um empregado pode, na prática, REDUZIR o imposto
  total da empresa, e a partir de que ponto isso acontece.

## 4. NOTA FISCAL EM BELO HORIZONTE
- Qual documento este perfil emite: NFS-e municipal, NF-e (modelo 55), NFC-e?
  Explique a diferença e quando cada um se aplica a um prestador de serviço.
- Como funciona a emissão de NFS-e em Belo Horizonte hoje: qual sistema
  (BHISS Digital?), se há API pública, se exige certificado, e qual o estado
  da migração para o padrão NACIONAL de NFS-e.
- Quais códigos a emissão exige (LC 116, código municipal de serviço, CNAE) e
  se dá para pré-preencher a partir do cadastro da empresa.
- Regras de ISS em BH para este perfil: alíquota por tipo de serviço,
  retenção na fonte (quando o tomador retém), substituição tributária,
  e o que muda ao prestar serviço para tomador de OUTRO município (CPOM/CEPOM).
- Prazo e regra de cancelamento ou substituição de nota em BH.
- O que acontece se a empresa emite nota antes de estar liberada (AIDF ou
  equivalente) e se isso é um bloqueio real no primeiro mês de vida.

## 5. AS MOVIMENTAÇÕES QUE UM APP DEVERIA RESOLVER
Liste as ações que esse empresário precisa fazer ao longo do ano e que hoje o
obrigam a entrar em portal de órgão público. Para cada uma, diga o sistema, se
é automatizável com o A1, e a frequência típica. Inclua ao menos:
- Emitir certidão negativa (federal, estadual, municipal)
- Consultar e parcelar débitos
- Retificar declaração entregue com erro
- Consultar situação cadastral e regularidade do Simples
- Alterar dados cadastrais (endereço, CNAE, capital, quadro societário)
- Comprovar renda ou faturamento para banco
- Acompanhar o limite do Simples e o risco de desenquadramento

## 6. OS PRAZOS QUE MACHUCAM
Quais são os erros de prazo mais comuns nesse perfil, quanto custam, e quais
deles levam à EXCLUSÃO do Simples Nacional. Quero saber o que um app precisa
vigiar para o cliente nunca cair nisso.

## 7. O QUE MUDA COM A REFORMA TRIBUTÁRIA
Estamos em 2026, no período de transição da CBS/IBS. Diga objetivamente o que
muda para um ME do Simples prestador de serviço entre 2026 e 2027: se ele
continua no Simples, o que muda na nota fiscal, e o que um app precisa estar
preparado para absorver. Separe o que JÁ vale do que ainda é previsão.

# REGRAS DA RESPOSTA

- Cite a base legal e a DATA de cada prazo e alíquota. Regra fiscal muda, e
  informação de blog desatualizado é pior que informação nenhuma.
- Prefira fonte oficial (gov.br, Receita Federal, portal da PBH, Banco Central,
  legislação) a portal de notícia ou blog de escritório.
- Quando algo for específico de Belo Horizonte, diga isso com todas as letras
  e cite o decreto ou a instrução normativa municipal.
- Se não encontrar um dado confiável, escreva "não confirmado" em vez de
  estimar. Eu prefiro um buraco declarado a um número errado.
- Sinalize o que está em transição ou com data de mudança marcada.
- Português do Brasil. Sem jargão desnecessário: quando usar um termo técnico,
  explique em uma linha o que ele significa para o dono da empresa.
```

---

## Por que o prompt tem esses pontos

| Ponto | De onde saiu |
|---|---|
| Perfil travado em ME serviço, Anexo III/V, BH, 1–2 sócios | Escopo do MVP ([[BASE-ESTRATEGICA]]) e os 87 CNAEs de serviço que atendemos |
| "O app já tem o A1 em posse" | Premissa do Pedro (09/09). Muda a resposta de "oriente o cliente" para "faça por ele", e é o que separa nosso produto do concorrente |
| Confirmar o DAS dia 20 | Dúvida direta do Pedro. Está no app como pressuposto e nunca foi ratificado |
| A folha ligada ao **Fator R** | 🔑 A folha estava em **backlog** na lista consolidada ("solo de serviço não tem funcionário"). Mas `lib/fiscal.ts` usa `FATOR_R_LIMIAR = 0,28` para decidir entre Anexo III (6%) e V (15,5%): a folha **é a alavanca do imposto**, não um módulo de RH. Se contratar reduz imposto, isso é produto, não obrigação |
| Distinção NFS-e × NF-e × NFC-e | O Pedro falou "NF-e"; para prestador de serviço em BH o documento é NFS-e municipal. Vale confirmar em vez de presumir |
| CPOM/CEPOM e retenção de ISS | Já está no catálogo à-la-carte (R$249 no líder) sem a gente saber a regra |
| AIDF bloqueando a 1ª nota | Item 8.8 da matriz de dependência, marcado 🔴 e com o alerta de que, se bloqueia a primeira nota, não pode ser paywall |
| De quais obrigações ele está DISPENSADO | Evita construir tela para obrigação que não se aplica. Barato de perguntar, caro de descobrir depois |
| Reforma tributária 2026–2027 | O teardown viu o emissor da Contabilizei em migração por causa dela, e admitindo instabilidade |

## ⚠️ O que esta pesquisa deve destravar

Ela alimenta diretamente a **matriz de dependência externa** de [[funcionalidades-me-simples]], onde hoje **10 de 24 dependências estão em 🔴**. Em especial:

- **2.2** (emitir a guia do DAS) e **5.2** (transmitir declarações) — saber a obrigação exata é o passo antes de escolher a API
- **4.5** (guia do INSS do pró-labore) — hoje não mapeado
- **3.1 / 3.4 / 8.8** (NFS-e em BH, cancelamento e liberação)
- **5.3** (calendário de obrigações) — que hoje é tela construída sobre calendário que ninguém validou

E pode reabrir uma decisão: a **folha de pagamento** está em backlog desde o dossiê, com a justificativa de que "solo de serviço não tem funcionário". Se a folha for a alavanca do Fator R, a justificativa cai.

## Links
- [[funcionalidades-me-simples]] · [[fiscal-simples-bh-2026]] · [[cnae-fiscalmente-otimo]] · [[2026-07-21-dossie-plataforma-logada]] · [[BASE-ESTRATEGICA]] · [[HOME]]
