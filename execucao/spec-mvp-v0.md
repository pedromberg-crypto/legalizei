---
tipo: spec
data: 2026-07-09
status: rascunho
tags: [produto, spec]
---

# 🧩 Spec-cunha do MVP Legalizei (v0 — rascunho pré-imersão)

> Síntese de tudo que levantamos (auditoria UX, playbook CRM, matriz CNAE, base estratégica) em direção de produto. **Rascunho** — vira spec de verdade na S4 da imersão, com dado de campo. Norteia a pauta técnica com o Pedro Dev.

## 0. A cunha em uma frase
**Melhor que o plano R$195 da Contabilizei, pro ME de serviço no Simples de BH/MG — mobile-first de verdade, linguagem humana, proativo e sem venda empurrada.** UM job (rotina fiscal do CNPJ), UM segmento, executado melhor. Não nascer "a Contabilizei".

## 1. ICP (quem)
- ME prestador de serviço, Simples Nacional, sem funcionário, **geo BH/MG**.
- CNAE = serviço leve no Simples (Anexos III/V, Fator R) — espelhar o recorte validado do líder ([[cnae-matriz-governo]]). Evitar mercadoria pesada/indústria/folha/Lucro Real.
- (Profissional liberal médico/advogado = alto LTV mas exige RT/conselho → fase posterior.)

## 2. Núcleo do MVP (escopo — só o job)
> = o que o plano R$195 entrega, feito melhor. Ramifica pra cima depois.

| Módulo | O que o líder faz | 🎯 Como o Legalizei ganha (do ranking da auditoria) |
|---|---|---|
| **Onboarding/abertura** | ~23 dias, senha por "esqueci senha", atrito GOV.BR terceirizado ([[onboarding-jornada-completa]]) | Conta nativa no 1º acesso; back-end Legalize absorve GOV.BR/E-CNPJ com acompanhamento humano; progress bar honesta |
| **Emissão de NFS-e** | Auto-preenche NBS (bom), mas descrição manual, sem preview, **mobile quebra** ([[nf-emissao-2]]) | **Emissão em 1 toque** (repetir última nota); auto-gerar descrição; preview; mobile em foco sem nav flutuante por cima |
| **Guias/DAS + impostos** | Cadência D-3/D-1, "impostos disponíveis" ([[playbook-crm-contabilizei]]) | Superar: lembrete configurável ("me lembre em X dias") + recálculo automático + "me avise só quando precisar agir" |
| **Dashboard** | Denso, 7 iscas de cross-sell diluem o job ([[home]]) | Responde só: o que vence, quanto, e o que já cuidamos por você. Zero outdoor |
| **Dados da empresa** | Dropdown de canto, sem CNAE/nome fantasia/IE ([[dados-da-empresa]]) | "Minha Empresa" no topo do menu: CNPJ/CNAE/regime/contrato copiáveis e baixáveis em 1 clique |
| **Pró-labore** | Caixa-preta "cálculo inteligente" ([[socios-e-pro-labore]]) | Bruto E líquido lado a lado + simulador transparente do Fator R |
| **Atendimento** | Chat/WhatsApp; central de chamados com jargão de backoffice | Humano onde dói (validado: eles usam WhatsApp na assinatura), linguagem humana |

**Back-end:** compliance Legalize (contador CRC obrigatório p/ ME no Simples) — semi-manual no início ok. Front = app limpo.

## 3. Princípios de produto (os diferenciais, do que o líder erra)
1. **Mobile-first DE VERDADE** — o "mobile first" do líder é falso (tela de cobrança quebrada, nav flutuante sobre conteúdo até na emissão). Nossa maior vantagem demonstrável.
2. **Linguagem humana** — "Onde você prestou o serviço?" não "ISS retido na fonte?". Traduzir DARF/DEFIS/DRE/NBS.
3. **Proatividade > reatividade** — antecipar (lembrete + recálculo) em vez de mandar o problema pro cliente ("pagamento não identificado").
4. **Zero dark pattern** — nunca bloquear/assustar (o líder trava a emissão com "riscos de ficar sem contador" quando a fatura atrasa). Cobrança com dignidade.
5. **Transparência radical** — preço claro (vs âncora fake ~30% "off" + "R$210,90 na conta vs R$195 na vitrine"); mostrar upfront o que atende/não atende.
6. **Confiabilidade > velocidade de feature** — imposto tem prazo; a tela que o líder quebrou foi a de dinheiro.

## 4. Build-vs-buy (não construir do zero)
- **Comprar/integrar:** NFS-e (Focus NFe cobre BH, R$89,90–113,90/mês), certificado A1, gateway de assinatura, conta PJ (parceiro).
- **Construir só o diferenciado:** UX, dashboard, camada de proatividade, e a camada de confiança/relacionamento Legalize.
- ⚠️ NFS-e municipal = maior risco técnico; geo-niche BH/MG reduz. Spike no fim do V0.

## 5. O que NÃO fazer no V1 (escopo negativo)
- Nada das 17 categorias que o líder recusa ([[cnae-cobertura]]) — mapa do que economizar.
- Sem BPO financeiro, sem banco próprio, sem plano de saúde/benefícios de terceiros (o "benefício = venda" do líder).
- Sem folha pesada, sem Lucro Real, sem indústria.

## 6. Aberto — resolver na imersão (S1–S4)
- Preço (🟡 termômetro do mês 2 decide; R$99 é suposição, hipótese = faixa 139–195).
- Nicho fino: qual CNAE(s) de serviço abrir primeiro (com a matriz + carteira Legalize).
- Fork da emissão em 1 toque: viável no thin-slice ou fase 2?
- Overlay tributário (anexo/Fator R) dos CNAEs do nicho.

## Links
- [[_relatorio-auditoria]] · [[playbook-crm-contabilizei]] · [[cnae-matriz-governo]] · [[BASE-ESTRATEGICA]] · [[CHECKLIST-IMERSAO-30-DIAS]] · [[HOME]]
