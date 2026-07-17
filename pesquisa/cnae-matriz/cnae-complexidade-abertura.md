---
tipo: referencia
status: vivo
data: 2026-07-17
fonte: CGSIM Res 51/2019 (Anexo I, red. Res 57/2020) + conjunto fechado conselhos/órgãos
confianca: derivado-de-fonte-oficial (nao-ratificado por humano)
cobertura: 387/387
---
# Complexidade de abertura por CNAE — liso × precisa-tato

> Enriquece os **387 CNAEs atendidos** ([[contabilizei-cnae-completo-relatorio]]) com o eixo **operacional de abertura** — o que passa liso ponta-a-ponta × o que exige atenção/órgão/humano. **Ortogonal ao fiscal** (anexo/Fator R): um CNAE pode ser Anexo III barato E precisar de vistoria.
> Responde a pergunta do Pedro (17/07): *"quais CNAEs de fato são simples e quais dependem de mais atenção até de atendimento humano?"* — o "asterisco" da Contabilizei, reconstruído por dado oficial (não raspado dela: o dado não existe no site deles).

## Veredito (387)
| balde | nº | % | o que é | roteamento de produto |
|---|---|---|---|---|
| 🟢 **liso** | **170** | 44% | baixo risco A (CGSIM) **e** sem conselho/setorial | abertura 100% automatizável (happy path MVP) |
| 🟡 **verificar-licenciamento** | **120** | 31% | fora do baixo-risco-A, sem conselho | precisa licença municipal — médio (provisório) OU alto (vistoria); nível é **municipal/BH** |
| 🔴 **tato-registro** | **97** | 25% | exige conselho de classe **ou** órgão setorial | quase sempre humano/RT → Mauro ou waitlist |

> Recorte para as telas: dos 170 liso, **103 são serviço puro** (Anexo III/IV/V) = happy path do MVP → [[cnae-liso-servico]]. Os outros 67 são comércio/indústria liso (Anexo I/II), fora do "MVP só serviço".

> O mkt do Pedro (7311/7319 publicidade, 7020 consultoria, 6201 web design) = **liso**. Médico (8630), hospital (8610), ensino regular (851x), obra (43x) = fora do liso. Bateu com a intuição.

## Os 3 eixos (regra determinística, re-executável)
`veredito = tato-registro` se tem conselho/setorial · senão `verificar-licenciamento` se fora do baixo-risco-A · senão `liso`.
Prioridade: **registro > licenciamento > liso**. Direção segura do erro travada: **falso-liso é o pecado** (cobra antes de barrar), **falso-tato é conservador** → só marca `liso` quem está na lista oficial; ausência nunca vira "presumido liso".

### Eixo A — risco (licenciamento sanitário/ambiental/incêndio)
- Fonte: **CGSIM Res 51/2019, Anexo I** (red. Res 57/2020) = lista nacional de **baixo risco A** (dispensa total de licença, opera na hora). PDF em `cgsim-res51-baixo-risco.pdf`.
- Join direto: **212/387 na lista** (baixo risco A) · **175 fora**.
- ⚠️ "Fora da lista" **≠ alto risco**. É médio **ou** alto. O **alto** é definido por cada município (Art. 5º) — nacionalmente só o baixo-A é fixo.

### Eixo B — profissão regulamentada (conselho + RT)
- Conjunto **fechado** de conselhos → classes CNAE. Confiança alta nos grandes (saúde/engenharia/jurídico/contábil), média nos menores.

### Eixo C — registro setorial (órgão, sem conselho)
- CADASTUR, Polícia Federal, MEC/Cons. Educação, Bacen/CVM/SUSEP, ANATEL, ANTT, IBAMA.
- O próprio CGSIM avisa: baixo risco **não** isenta licenciamento profissional. Por isso **advogado e agência de viagem são baixo-risco no eixo A mas tato no B/C** — prova de que os eixos são independentes.

## tato-registro (97) por órgão
| nº | órgão | conf |
|---|---|---|
| 44 | Conselhos de saúde (CRM/CRO/COREN/CRN/CRP/CREFITO/CRF) | alta |
| 15 | CORE (representação comercial, Lei 4.886/65 — inclui representantes em grupo 45) | média-alta |
| 9 | MEC/Conselho de Educação (ensino regular 851–854) | alta |
| 8 | CREA/CAU (engenharia/arquitetura) | alta |
| 6 | Bacen/CVM/SUSEP (financeiro/seguros) | alta |
| 3 | CRECI (corretor imóveis) · 3 OAB/INPI · 3 CADASTUR · 3 Polícia Federal | alta |
| 1 | CRF · 1 CRMV · 1 CREF | alta/média |

## verificar-licenciamento (120) — perfil por divisão
Puxado por: **div 33** reparação de máquinas (25, tende médio) · **47** comércio varejo (14) · **43** obras/instalações (12, tende alto) · **77** aluguel (9, médio) · **96** serviços pessoais (9, misto: funerária alto, cabeleireiro médio) · **55/56** alojamento/comida (7, alto — Vigilância). Divisões pesadas (obra, comida, alojamento) puxam **alto**; reparação/aluguel puxam **médio**. Split exato = próxima fonte (BH).

## Caveats (anti-guru)
1. **Baixo-risco-A tem entradas condicionais** no Anexo I (ex: "desde que artesanal / área < X"). Não parseamos a condição — impacto baixo (condições são de indústria/comida, não de serviço puro). A revisitar se entrar comércio/indústria.
2. **Médio × alto não está resolvido** nos 120 — é municipal. **Próxima fonte = REDESIM-MG (Simulador de Grau de Risco)** — hoje bloqueado por período eleitoral — ou o decreto municipal de BH de classificação de risco.
3. **Conselho→CNAE é construção nossa** (não há tabela oficial única). Derivado de fonte legal, **não ratificado** por contador. Casos debatíveis (consultoria→CRA/CORECON) ficam como flag, **não bloqueiam**.
4. Correções aplicadas na revisão: +CORE nos 461x (era falso-liso) · −CRF em cosméticos 4772-5 (era falso-tato) · 6911-7/03 = INPI, não OAB.

## Arquivos
- **`cnae-complexidade-abertura.json`** — 387 com risco_cgsim, orgaos_conselho/setorial, veredito, motivos, confiança, fonte.
- **`cnae-complexidade-abertura.csv`** — achatado (Base/dev).
- **`cgsim-res51-baixo-risco.pdf`** — fonte primária do eixo A.

## Ligações
[[cnae-atendidos-hub]] · [[contabilizei-cnae-completo-relatorio]] · [[fila-validacao-humana]] · [[legalize-cnae-fiscalmente-otimo]] · [[fiscal-simples-bh-2026]]
