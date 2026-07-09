---
tipo: reuniao
data: 2026-07-09
participantes:
  - Pedro Maia
  - Izabela (contadora)
tags: [decisao, compliance, imersao]
---

# Reunião — Izabela (contadora): validação do fluxo de abertura BH

## Contexto
Pedro apresentou o [[processo-abertura-empresa-bh]] (PDF gerado) fase a fase; Izabela validou/corrigiu ao vivo com expertise de campo + navegou os portais mostrando qual sistema em cada passo. Foco: ME serviço Simples sem funcionário, geo BH. Fonte: transcrição exata + resumo Plaud (Downloads).

## 🟢 Confirmações e CORREÇÕES por fase

### Fase 0 — Coleta
- ✅ Dados do sócio ok. **Correção:** se casado, incluir o **regime de casamento** (obrigação do sistema) — não pede documento extra, só o regime.
- **+2 sócios → coletar dados completos de TODOS os sócios.**

### Fase 1 — Definições
- **🔑 Filtro de CNAE por regime (feature validada):** se a pessoa escolhe Simples, o sistema só mostra CNAEs que PODEM ser Simples (e vice-versa). Izabela confirmou como ótima implementação. Resolve a dor "escolhi anexo errado, paguei 2x".
- Natureza jurídica: **EI** (empresário individual) · **SLU** (soc. simples unipessoal, só ele) · **LTDA** (2+ sócios). Escolha da pessoa; serviço pode ser qualquer uma.
- **Anexos diferentes:** ao selecionar 2 atividades de anexos diferentes (uma com Fator R, outra não), tributa pela MAIOR. → **confirmar com FISCAL (Larissa).**
- **Capital social** = valor REAL investido pra abrir (não projeção futura) — no fechamento de balanço o recurso tem que existir na conta. Orientar valor real.

### Fase 2 — Viabilidade
- ✅ **Correção importante: viabilidade JUCEMG + municipal BH = UNIFICADA.** Um passo faz os dois, tudo dentro da JUCEMG (não são 2 passos).
- **BH roda viabilidade SEM IPTU; outros municípios exigem o índice cadastral do IPTU** → já pedir o índice na coleta do endereço (pra escalar depois).
- **BH = só BH** (não metropolitano). Contagem = outro município, outro prazo (~15 dias).
- Grau de risco = **análise da prefeitura**, não preenchido pela gente. Serviço = passa sempre (sem resíduo). MEI = dispensado de alvará de localização.

### Fase 3 — Registro e CNPJ
- **DBE** = cadastro sincronizado que alimenta a criação do CNPJ na Receita.
- **Contrato social em MG já é PADRÃO da JUCEMG** — não redige manual, vem pronto. Só assinatura (GOV.BR nível prata/ouro do sócio).
- **CRC assina/se responsabiliza SÓ na finalização do CNPJ** (campo do regime tributário) — não no DBE.
- **Sequência mesclada:** DBE no Redesim/GOV → volta JUCEMG (contrato + registro) → volta Receita (libera CNPJ).
- **Prazo BH serviço = 5 dias com segurança** (às vezes dia pro outro, deferimento automático). Contagem/outros ~15 dias.
- **Maiores gargalos (não automatizáveis):** (1) pagamento da taxa da junta pelo cliente · (2) análise de viabilidade da prefeitura. Resto flui.

### Fase 4 — Municipal BH
- Inscrição municipal = "**mobiliário**" (não imobiliário).
- **Certificado digital cobrado automaticamente APÓS liberação do CNPJ** (precisa do nº do CNPJ pra emitir — é subsequente, não durante).
- **Taxa de funcionamento/fiscalização BH:** prefeitura gera ~30 dias após constituir (NÃO automática em BH; no RJ é instantânea). Cliente paga.
- **Dispensas:** toda empresa BH gera dispensa sanitária + bombeiros. Restaurante → vira ALVARÁ sanitário; resíduo → licença ambiental. MEI dispensado. Empresa com ponto físico (mesmo apê) precisa do documento.

### Fase 5 — Fiscal e habilitação
- **Certificado A1 = R$209–229/ano**, empresa parceira externa **comissionada** (a certificadora paga comissão pra Legalize) → receita futura nossa.
- **Opção pelo Simples já sai junto com a liberação do CNPJ** (Receita sincroniza; deferimento automático). Nível nacional.
- **Inscrição estadual = só comércio** (serviço não tem; é opção). Quando tem, certidão emitida no **SIARE**.
- **Credenciamento NFS-e BH = via DES-BH** (busca "DES PBH"). Depende do certificado + números anteriores.

### Fase 6 — Operacional
- Conta PJ + rotina (o que o app faz). Modelo Contabilizei: aba "Minha rotina" + emissão de nota em 1 clique (tomador salvo). Pedro entra 2x/mês (nota + guias).

## 💰 Custos travados (Izabela) — os 3 pagamentos que desbloqueiam
- **Taxa de registro JUCEMG: R$288** (microempresa, única, altera anual, varia por porte).
- **Certificado digital A1: R$209–229/ano.**
- **Taxa de fiscalização/funcionamento BH: anual** (gerada ~30 dias após).
- (+ cadastral). Todos pagos pelo CLIENTE.

## 🔁 Retrabalho (raro)
- Só se cliente muda info: casou e não atualizou nome no CPF/Receita → **DBE dá erro** na finalização; ou desiste da razão social → refaz tudo. Cliente resolve.

## 🗺️ Sistema por passo (Izabela navegou os portais)
- **Fase 2 viabilidade:** tudo na **JUCEMG** (unificado).
- **Fase 3:** DBE → **Redesim** (GOV/Receita) · contrato+registro → **JUCEMG** · libera CNPJ → **Receita**.
- **Fase 4:** inscrição/licenciamento/dispensas → **JUCEMG** (itens 1,2,4) · alvará específico → **ALF PBH** (item 3) · taxa funcionamento → **Guias PBH / SISDRAM**.
- **Fase 5:** certificado → externo parceiro · inscrição estadual (certidão) → **SIARE** · credenciamento NFS-e → **DES-BH (BHISS)**.

## ✅ Encaminhamentos (quem responde o quê)
- [ ] **Carla (Depto Pessoal):** sócio pode ser CLT? · eSocial sem movimento/sem funcionário transmite?
- [ ] **Larissa (Depto Fiscal):** tributação por anexos diferentes (pela maior) · obrigações acessórias (DES-BH, DCTFWeb, DEFIS, EFD-Reinf, SPED) — quais se aplicam, prazos, risco de multa · acessória estadual MG p/ serviço
- [ ] **Leonão:** o que o software prepara × o que só o contador transmite/assina
- [ ] **Jessica:** abrir empresa do Mauro em 4 concorrentes (mapear onboarding — Pedro só tem o da Contabilizei)

## ⚠️ Dores mapeadas (viram requisitos)
- #dor Processo manual, fragmentado, sequencial ("um destrava o outro") — múltiplos portais que não conversam.
- #dor Cliente não entende termos (capital social, anexo, Fator R) → nossa transparência/onboarding explicativo é a cunha.
- #dor Custos/guias extras aparecem depois (surpresa) — nós mostramos tudo no início.
- #dor Variação brutal entre prefeituras → por isso geo-niche BH primeiro.

## Relatório bruto (Plaud)
> Arquivos: `Conversa Izabela - 09_07_2026-transcript.txt` (transcrição exata) + `-Summary.md` (notas Plaud), em Downloads. Resumo Plaud: mapear passo a passo abertura/regularização p/ digitalizar; piloto BH; dores = manual/fragmentado, falta de clareza, variação entre municípios, incerteza sobre acessórias.

## Links
- [[processo-abertura-empresa-bh]] · [[orgaos-sistemas-abertura-bh]] · [[spec-mvp-v0]] · [[HOME]]
