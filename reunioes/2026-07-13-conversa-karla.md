---
tipo: historico
status: congelado
data: 2026-07-13
tags: [decisao, compliance, imersao, dp, fiscal]
---

# Reunião — Karla (Depto Pessoal): regras de pró-labore, sócio CLT, funcionários e obrigações acessórias

## Contexto
Continuação da [[2026-07-09-conversa-izabela|validação com a Izabela]]. Pedro passou com Karla o passo a passo das dúvidas de **DP** que ficaram em aberto (sócio CLT, pró-labore/INSS, eSocial sem movimento, entrada de funcionário) e já tocou parte do **fiscal** (Fator R, obrigações acessórias). ICP: **ME serviço Simples, sem funcionário, BH**. Escopo do app confirmado por Pedro na chamada: dos ~1.300 CNAEs do IBGE, líder atende ~400 (70 condicionais tipo médico ficam de fora agora) → **filtrado pra ~300 e poucos CNAEs de serviço puro**. Fonte: transcrição exata + resumo Plaud (Downloads). **Falta só a Larissa (fiscal) responder o restante.**

## 🟢 Pró-labore + INSS do sócio
- **Sócio NÃO pode ser CLT da própria empresa.** Não existe esse vínculo.
- **Pró-labore mínimo = 1 salário mínimo (R$1.621** na fala dela). Tabela atualiza todo ano; recolhe INSS + IR conforme valor. 🟡 confirmar valor exato do salário mínimo vigente (anti-guru).
- **Alíquota INSS do pró-labore = 11%** (diferente da do funcionário, 7,5%→14%). IR até 27,5%.
- **Pró-labore tem CUSTO mensal** e a retirada é no **líquido** (da conta PJ pra PF do sócio), pra garantir recolhimento correto. #dor histórica: empresas não avisavam o custo → cliente pedia aumento só pra baixar imposto, gerava **cancelamento/reemissão de guia = muito retrabalho**. → **app tem que mostrar custo da folha (INSS+IR) + custo do pró-labore líquido explícito.**

## 🟢 Fator R (benefício fiscal crítico)
- Prestador no **Anexo V** pode migrar pro **Anexo III** se a folha (incl. pró-labore) atingir **≥28% do faturamento**.
- Efeito: alíquota cai de **15,5% → 6%** (progressiva, mas essa é a régua geral).
- → **feature: simulador de Fator R** mostrando cenário A (sem aumento, 15,5%) × B (pró-labore maior, 6% + custo INSS/IR). Decisão informada, evita retrabalho. Complementa a pendência da Izabela "anexos diferentes tributa pela maior" (ainda p/ Larissa confirmar; Karla disse que **tributa pela especificidade da NOTA** quando o CNAE abrange 2 tributações).

## 🟢 Sócio com duplo vínculo (CLT em OUTRA empresa)
- **Tabela de INSS muda** (progressiva) e ele **perde PIS + seguro-desemprego**.
- **LGPD:** o sistema **não consegue puxar** vínculo empregatício de terceiros. → **o sócio precisa INFORMAR manualmente** que tem outro emprego **+ o valor da remuneração** (campo obrigatório). Motivo: se bater o **teto do INSS**, não se recolhe pró-labore pra ele. → **feature: campo "outro vínculo CLT?" + campo remuneração no onboarding, com aviso contextual.**

## 🟢 eSocial / sem movimento
- ME serviço sem funcionário: **transmite a 1ª declaração "sem movimento"** ao **eSocial** (braço de DP da Receita Federal).
- Depois da 1ª, **só transmite de novo quando recobra movimento** (admissão de funcionário OU início de retirada de pró-labore). Empresa paralisada **não envia todo mês**.
- Feito **pelo lado contador**. Acesso: precisa de **procuração do cliente** OU **certificado digital**. Portal **não exige login/senha de contador** — só com os dados/procuração se acessa. (Reforça o achado da Izabela sobre certificado.)

## 🟢 Entrada de funcionário (fica FORA do MVP, é DP profundo)
- **Não afeta a constituição** — pode ser feito depois, empresa já ativa. Constituição roda igual.
- Fluxo CLT: cliente avisa que tem funcionário → Legalize entende a demanda → classifica **função no CBO** → cliente faz **medicina do trabalho** (exames/relatórios) → só então **admissão** → todo mês: **FGTS + eSocial + folha + controle de férias**. Tudo no contrato.
- Vínculo empregatício = horário fixo, subordinação, rotina → **exige registro**.
- **PJ:** contabilidade normalmente **não se responsabiliza**; relação é direta empresa↔prestador (pagamento não passa pela Legalize). Pode-se oferecer **modelo de contrato PJ editável como diferencial**, mas não afeta a operação. → backlog/enfeite.

## 🟢 Obrigações acessórias
- = relatórios mensais que a contabilidade passa aos órgãos com **todas as movimentações** do cliente (inclusive o "sem movimento"). Base da **fiscalização/apuração** da Receita (checa imposto retido a menor etc.).
- **Regra é por TRIBUTAÇÃO, não por CNAE:** Simples entrega um tipo, Presumido outro, Real outro. Dentro de cada, há especificidade + **depende da prefeitura** (por isso geo BH primeiro).
- **Prazo:** maioria até **dia ~15** do mês. (Fiscal ela detalha melhor; DP ela não soube o dia exato.)
- **DAS:** sistema **importa notas → gera imposto pelo faturamento**; contador **confere** se puxou as alíquotas certas (dependem da nota) → sistema envia. **Sem faturamento no mês = declaração zerada obrigatória** (declara ausência de movimento).

## 🛠️ Sistema interno hoje
- Usam o **Domínio** (referência de mercado, o Mauro elogia). Importa dados e o time **confere manual** se puxou certo. → mesmo com bom sistema, **há checagem humana** (impacta modelo/escala do nosso app: precisa de camada de validação/revisão).

## ➡️ Requisitos que caem no produto (viram spec)
- Mostrar **custo da folha + pró-labore líquido** explícito (anti-retrabalho).
- **Simulador Fator R** (A × B) transparente.
- Onboarding captura **variáveis críticas** (outro vínculo CLT + remuneração) com aviso contextual.
- Motor de **obrigações acessórias por tributação** (Simples/BH) com prazos e alerta de multa.
- Camada de **revisão/validação** das importações fiscais (humana ou automatizada).
- **Funcionário e PJ = fora do MVP** (DP profundo / diferencial futuro). → alinha com [[legalize-mlp-nao-mvp]] e sequência espinha × enfeite ([[2026-07-13-plano-sequencia-pm]]).

## ⏳ Ainda em aberto (Larissa — fiscal)
- [ ] Lista real de **obrigações acessórias** p/ ICP (ME serviço Simples BH): quais se aplicam, periodicidade, prazo, risco de multa (Karla vai mandar print da listinha que tem).
- [ ] **Anexos diferentes** → tributa pela maior (Izabela) × pela especificidade da nota (Karla): fechar com fiscal.
- [ ] **Acessória estadual MG** p/ serviço puro sem ICMS (Karla não sabe — é fiscal).
- [ ] Mapear como concorrentes (Contabilizei) tratam **CLT/funcionário** na plataforma.

## Relatório bruto (Plaud)
> Arquivos: `Conversa com a Karla-transcript.txt` (transcrição exata) + `-Summary.md`, em Downloads. Data Plaud: 2026-07-13 11:16.

## Links
- [[2026-07-09-conversa-izabela]] · [[cnae-atendidos-e-nao-atendidos]] · [[spec-mvp-v0]] · [[2026-07-13-plano-sequencia-pm]] · [[HOME]]
