---
tipo: derivado
status: vivo
data: 2026-07-21
assunto: auditoria-copy-flow
deriva_de: [mapa-flow-mermaid, compilado-ux-flow]
deriva_de_codigo: [produto/_flow/flow-data.mjs]
tags: [produto, ux, copy, flow, auditoria, redundancia, negativa]
---

# 🔎 Auditoria de copy do flow — âncora de adaptação

> **Nota-âncora.** É daqui que a gente adapta a copy do flow de abertura (N1 → empresa ativa). Cada achado tem **ID estável** (R#/M#/F#) e **status** que a gente vira conforme aplica. O **Índice de telas** é GERADO do `flow-data.mjs` (links de código + rota que não apodrecem); os **achados** são curadoria à mão.
>
> Varredura-base: 2026-07-21 (26 telas + 8 componentes lidos integralmente). Companheira do [[mapa-flow-mermaid]] (que é ESTRUTURA); esta é COPY.

## 🧭 Como usar
1. **Adaptar uma tela?** Acha ela no **Índice** → abre o código pelo link → confere no `/mockup` pela rota.
2. **Fechar um achado?** Vira o status na tabela (§ Achados) e, se virou decisão, registra no ADR `marca/decisoes-marca.md`.
3. **Regenerar o índice** (mudou/renomeou tela): `node produto/_flow/gerar-indice-telas.mjs`. **NÃO editar o bloco entre `<!-- INDICE -->` à mão** — o gerador sobrescreve.
4. **Links de código** usam `<...>` por causa dos parênteses dos route-groups (`(app)`/`(wizard)`), senão o markdown quebra.
5. **Rodar uma varredura nova?** Segue a rubrica viva em [[metodo-varredura-flow]] (as 11 dimensões D1–D11, mecânica + crítica numa passada só).

## 📊 Legenda de status
🔲 aberto · 🔄 em debate · ✅ aplicado · ⏸️ deixado de propósito

---

## 🧱 Índice de telas (GERADO — não editar à mão)

<!-- INDICE:INI -->
| # | Tela | Shell | Código | Rota viva |
|---|---|:--:|:--:|---|
| E1 | E1 · Splash | wizard | [código](<app/src/app/(wizard)/splash/page.tsx>) | [/splash](http://localhost:3000/splash) |
| E2_1 | E2.1 · Welcome · (1/3 · Léo vigia, contador é gente) | ? | ⚠️ sem page.tsx | [/welcome?slide=0](http://localhost:3000/welcome?slide=0) |
| E2_2 | E2.2 · Welcome · (2/3 · Aquece o fork) | ? | ⚠️ sem page.tsx | [/welcome?slide=1](http://localhost:3000/welcome?slide=1) |
| E2_3 | E2.3 · Welcome · (3/3 · Sem susto no boleto) | ? | ⚠️ sem page.tsx | [/welcome?slide=2](http://localhost:3000/welcome?slide=2) |
| E3 | E3 · Fork · 4 rotas | wizard | [código](<app/src/app/(wizard)/entrada/page.tsx>) | [/entrada](http://localhost:3000/entrada) |
| E3_1 | E3.1 · Login / portal | wizard | [código](<app/src/app/(wizard)/login/page.tsx>) | [/login](http://localhost:3000/login) |
| E3_3 | E3.3 · Seus dados · (nome · e-mail · telefone) | wizard | [código](<app/src/app/(wizard)/dados/page.tsx>) | [/dados](http://localhost:3000/dados) |
| E3_2 | E3.2 · MEI × ME · (variante Abrir) | ? | ⚠️ sem page.tsx | [/entrada?intencao=abrir](http://localhost:3000/entrada?intencao=abrir) |
| E3_2_M | E3.2 · MEI × ME · (variante Migrar) | ? | ⚠️ sem page.tsx | [/entrada?intencao=migrar](http://localhost:3000/entrada?intencao=migrar) |
| E3_4 | E3.4 · Endereço + categoria · (os 2 gates) | wizard | [código](<app/src/app/(wizard)/endereco/page.tsx>) | [/endereco](http://localhost:3000/endereco) |
| E3_4_1 | E3.4.1 · CEP fora de BH · (gate resolvido inline) | ? | ⚠️ sem page.tsx | [/endereco?simular=fora-bh](http://localhost:3000/endereco?simular=fora-bh) |
| E4_2 | E4.2 · Lê o cartão CNPJ | wizard | [código](<app/src/app/(wizard)/migrar/cnpj/page.tsx>) | [/migrar/cnpj](http://localhost:3000/migrar/cnpj) |
| E4_2_1 | Saída · CNPJ inapto · ou suspenso | wizard | [código](<app/src/app/(wizard)/saida/cnpj-inapto/page.tsx>) | [/saida/cnpj-inapto](http://localhost:3000/saida/cnpj-inapto) |
| E4_2B_1 | Saída · Presumido · fora de escopo | wizard | [código](<app/src/app/(wizard)/saida/regime-nao-suportado/page.tsx>) | [/saida/regime-nao-suportado](http://localhost:3000/saida/regime-nao-suportado) |
| E4_3 | E4.3 · Diagnóstico · ("tem certificado?") | wizard | [código](<app/src/app/(wizard)/migrar/diagnostico/page.tsx>) | [/migrar/diagnostico](http://localhost:3000/migrar/diagnostico) |
| E4_4 | E4.4 · Plano | wizard | [código](<app/src/app/(wizard)/migrar/plano/page.tsx>) | [/migrar/plano](http://localhost:3000/migrar/plano) |
| E4_5 | E4.5 · Contrato · + promessa de devolução | wizard | [código](<app/src/app/(wizard)/migrar/contrato/page.tsx>) | [/migrar/contrato](http://localhost:3000/migrar/contrato) |
| E9_2 | E9.2 · Seu contador atual | app | [código](<app/src/app/(app)/migrar/contador/page.tsx>) | [/migrar/contador](http://localhost:3000/migrar/contador) |
| E9_2A | E9.2b · Dados que o · cartão CNPJ não traz | app | [código](<app/src/app/(app)/migrar/dados/page.tsx>) | [/migrar/dados](http://localhost:3000/migrar/dados) |
| E9_2B | E9.2c · Dados dos sócios | app | [código](<app/src/app/(app)/migrar/socios/page.tsx>) | [/migrar/socios](http://localhost:3000/migrar/socios) |
| E9_2C | E9.2d · GOV.BR + procuração | app | [código](<app/src/app/(app)/migrar/gov/page.tsx>) | [/migrar/gov](http://localhost:3000/migrar/gov) |
| E9_3 | E9.3 · Iniciando transferência | app | [código](<app/src/app/(app)/migrar/transferencia/page.tsx>) | [/migrar/transferencia](http://localhost:3000/migrar/transferencia) |
| E9_4 | ✅ E9.4 · Migração concluída | app | [código](<app/src/app/(app)/migrar/ativa/page.tsx>) | [/migrar/ativa](http://localhost:3000/migrar/ativa) |
| E5T | Triagem · quantos sócios? | ? | ⚠️ sem page.tsx | [/gate?etapa=triagem](http://localhost:3000/gate?etapa=triagem) |
| E5T_1 | E5T.1 · Sócio não se encaixa · (gate de saída inline) | ? | ⚠️ sem page.tsx | [/gate?etapa=triagem&simular=socio-nao-encaixa](http://localhost:3000/gate?etapa=triagem&simular=socio-nao-encaixa) |
| E5F | Faixa de faturamento | ? | ⚠️ sem page.tsx | [/gate?etapa=faixa](http://localhost:3000/gate?etapa=faixa) |
| E5F_S | E5F.1 · Splash · 'conseguimos te atender' | wizard | [código](<app/src/app/(wizard)/splash-atendido/page.tsx>) | [/splash-atendido](http://localhost:3000/splash-atendido) |
| E6 | E6 · Criar conta | wizard | [código](<app/src/app/(wizard)/conta/page.tsx>) | [/conta](http://localhost:3000/conta) |
| E6_1 | E6.1 · Confirmar código | ? | ⚠️ sem page.tsx | [/conta?etapa=codigo](http://localhost:3000/conta?etapa=codigo) |
| E6_2 | E6.2 · CPF não confere · (nome divergente) | ? | ⚠️ sem page.tsx | [/conta?cpf=nome](http://localhost:3000/conta?cpf=nome) |
| E7 | E7 · A conta da abertura | wizard | [código](<app/src/app/(wizard)/plano/page.tsx>) | [/plano](http://localhost:3000/plano) |
| E7_1 | E7.1 · A conta da abertura · (variante endereço fiscal) | ? | ⚠️ sem page.tsx | [/plano?endereco=fiscal](http://localhost:3000/plano?endereco=fiscal) |
| E9 | E9 · Pagamento + contrato · (variante Abrir) | wizard | [código](<app/src/app/(wizard)/pagamento/page.tsx>) | [/pagamento](http://localhost:3000/pagamento) |
| E9_M | E9 · Pagamento · (variante Migrar) | ? | ⚠️ sem page.tsx | [/pagamento?fluxo=migrar](http://localhost:3000/pagamento?fluxo=migrar) |
| E9_S | E9.S · Splash · 'pagamento confirmado' | app | [código](<app/src/app/(app)/splash-pagamento/page.tsx>) | [/splash-pagamento](http://localhost:3000/splash-pagamento) |
| E9_SB | E9.SB · Splash · 'boleto gerado' | app | [código](<app/src/app/(app)/splash-boleto/page.tsx>) | [/splash-boleto](http://localhost:3000/splash-boleto) |
| E9_SR | E9.SR · Splash · pagamento recusado | ? | ⚠️ sem page.tsx | [/splash-recusado?next=/pagamento%3Fretry%3D1](http://localhost:3000/splash-recusado?next=/pagamento%3Fretry%3D1) |
| E9_R | E9.R · Pagamento · (nova tentativa) | ? | ⚠️ sem page.tsx | [/pagamento?retry=1](http://localhost:3000/pagamento?retry=1) |
| E9_1 | E9.1 · Aguardando boleto · dossiê já liberado | app | [código](<app/src/app/(app)/aguardando/page.tsx>) | [/aguardando](http://localhost:3000/aguardando) |
| E9_1P | E9.1P · Status · (pago, via instantâneo) | ? | ⚠️ sem page.tsx | [/aguardando?pago=1](http://localhost:3000/aguardando?pago=1) |
| C0_0 | C0.0 · Sua atividade · (chegada, antes de descrever) | ? | ⚠️ sem page.tsx | [/dossie/atividade?vazia=1](http://localhost:3000/dossie/atividade?vazia=1) |
| C0 | C0 · Sua atividade · (descreve + pills) | app | [código](<app/src/app/(app)/dossie/atividade/page.tsx>) | [/dossie/atividade](http://localhost:3000/dossie/atividade) · [/veredito/atende](http://localhost:3000/veredito/atende) |
| C5 | C5 · CNAE secundários | app | [código](<app/src/app/(app)/dossie/cnae-secundarios/page.tsx>) | [/dossie/cnae-secundarios](http://localhost:3000/dossie/cnae-secundarios) |
| C5_S | C5.1 · Splash · 'já sabemos o que você faz' | app | [código](<app/src/app/(app)/splash-atividades/page.tsx>) | [/splash-atividades](http://localhost:3000/splash-atividades) |
| C1 | C1 · Seus dados | app | [código](<app/src/app/(app)/dossie/socio/page.tsx>) | [/dossie/socio](http://localhost:3000/dossie/socio) |
| C2 | C2 · Vínculo INSS | app | [código](<app/src/app/(app)/dossie/vinculo/page.tsx>) | [/dossie/vinculo](http://localhost:3000/dossie/vinculo) |
| C3 | C3 · Sócios? | app | [código](<app/src/app/(app)/dossie/socios/page.tsx>) | [/dossie/socios](http://localhost:3000/dossie/socios) |
| C3_1 | C3.1 · Sócios · (teto: 3 + você) | ? | ⚠️ sem page.tsx | [/dossie/socios?socios=4](http://localhost:3000/dossie/socios?socios=4) |
| C3_2 | C3.2 · Sócios · (só você) | ? | ⚠️ sem page.tsx | [/dossie/socios?socios=1](http://localhost:3000/dossie/socios?socios=1) |
| C3_3 | C3.3 · CPF de sócio · não confere | ? | ⚠️ sem page.tsx | [/dossie/socios?divergencia=1](http://localhost:3000/dossie/socios?divergencia=1) |
| C4 | C4 · Dados da empresa | app | [código](<app/src/app/(app)/dossie/empresa/page.tsx>) | [/dossie/empresa](http://localhost:3000/dossie/empresa) |
| C7 | C7 · Nome / razão social | app | [código](<app/src/app/(app)/dossie/nome/page.tsx>) | [/dossie/nome](http://localhost:3000/dossie/nome) |
| C0_1 | C0.1 · Retomar · (porta de CPF) | app | [código](<app/src/app/(app)/retomar/page.tsx>) | [/retomar](http://localhost:3000/retomar) |
| C0_3 | C0.3 · Confirmar código · (retomada) | ? | ⚠️ sem page.tsx | [/retomar?etapa=codigo](http://localhost:3000/retomar?etapa=codigo) |
| C7_2 | C7′ · Sugerir mais · 3 nomes (2ª rodada) | app | [código](<app/src/app/(app)/dossie/nome/rodada-2/page.tsx>) | [/dossie/nome/rodada-2](http://localhost:3000/dossie/nome/rodada-2) |
| C7_2S | C7.S · Splash · 'nomes enviados' | ? | ⚠️ sem page.tsx | [/splash-nomes?next=/aguardando%3Ffase%3Djunta%26viabilidade%3D1](http://localhost:3000/splash-nomes?next=/aguardando%3Ffase%3Djunta%26viabilidade%3D1) |
| A1 | A1 · Revisar + autorizar | app | [código](<app/src/app/(app)/revisar/page.tsx>) | [/revisar](http://localhost:3000/revisar) |
| A2 | A2 · Início da viabilidade · (a casa assume o processo) | app | [código](<app/src/app/(app)/iniciar-viabilidade/page.tsx>) | [/iniciar-viabilidade](http://localhost:3000/iniciar-viabilidade) |
| A3 | A3 · Status · (fase Junta) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta](http://localhost:3000/aguardando?fase=junta) |
| A3_GB | A3″ · Status · (guia no boleto, · aguardando compensar) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=boleto](http://localhost:3000/aguardando?fase=junta&guia=boleto) |
| M1 | M1 · Onde você trabalha · (área + endereço) | — | [código](<app/src/app/(mei)/mei/endereco/page.tsx>) | [/mei/endereco](http://localhost:3000/mei/endereco) |
| M2 | M2 · Impedimentos · (no lugar da triagem) | — | [código](<app/src/app/(mei)/mei/impedimentos/page.tsx>) | [/mei/impedimentos](http://localhost:3000/mei/impedimentos) |
| M2_1 | M2.1 · Já tem CNPJ · (bloqueio dentro da M2) | ? | ⚠️ sem page.tsx | [/mei/impedimentos?bloqueio=ja-tem-cnpj](http://localhost:3000/mei/impedimentos?bloqueio=ja-tem-cnpj) |
| M2_2 | M2.2 · Servidor federal · (bloqueio dentro da M2) | ? | ⚠️ sem page.tsx | [/mei/impedimentos?bloqueio=servidor](http://localhost:3000/mei/impedimentos?bloqueio=servidor) |
| M3 | M3 · Faturamento · (gate do teto R$81k) | — | [código](<app/src/app/(mei)/mei/faturamento/page.tsx>) | [/mei/faturamento](http://localhost:3000/mei/faturamento) |
| M4 | M4 · Criar conta | — | [código](<app/src/app/(mei)/mei/conta/page.tsx>) | [/mei/conta](http://localhost:3000/mei/conta) |
| M4_1 | M4.1 · Confirmar código | ? | ⚠️ sem page.tsx | [/mei/conta?etapa=codigo](http://localhost:3000/mei/conta?etapa=codigo) |
| M4_2 | M4.2 · CPF não confere | ? | ⚠️ sem page.tsx | [/mei/conta?etapa=cpf-divergente](http://localhost:3000/mei/conta?etapa=cpf-divergente) |
| M5 | M5 · Seu plano · (R$49/mês) | — | [código](<app/src/app/(mei)/mei/plano/page.tsx>) | [/mei/plano](http://localhost:3000/mei/plano) |
| M6 | M6 · Pagamento + contrato | — | [código](<app/src/app/(mei)/mei/pagamento/page.tsx>) | [/mei/pagamento](http://localhost:3000/mei/pagamento) |
| M6_S | M6.S · Splash 'pagamento confirmado' | — | [código](<app/src/app/(mei)/mei/splash-pagamento/page.tsx>) | [/mei/splash-pagamento](http://localhost:3000/mei/splash-pagamento) |
| M6_SB | M6.SB · Splash 'boleto gerado' | — | [código](<app/src/app/(mei)/mei/splash-boleto/page.tsx>) | [/mei/splash-boleto](http://localhost:3000/mei/splash-boleto) |
| M6_SR | M6.SR · Splash · pagamento recusado | ? | ⚠️ sem page.tsx | [/mei/splash-recusado?next=/mei/pagamento%3Fretry%3D1](http://localhost:3000/mei/splash-recusado?next=/mei/pagamento%3Fretry%3D1) |
| M6_R | M6.R · Pagamento · (nova tentativa) | ? | ⚠️ sem page.tsx | [/mei/pagamento?retry=1](http://localhost:3000/mei/pagamento?retry=1) |
| M6_1 | M6.1 · Aguardando boleto · cadastro já liberado | — | [código](<app/src/app/(mei)/mei/aguardando/page.tsx>) | [/mei/aguardando](http://localhost:3000/mei/aguardando) |
| M6_1P | M6.1P · Status · (pago, via instantâneo) | ? | ⚠️ sem page.tsx | [/mei/aguardando?pago=1](http://localhost:3000/mei/aguardando?pago=1) |
| M7_0 | M7.0 · Sua atividade · (chegada) | ? | ⚠️ sem page.tsx | [/mei/atividade?vazia=1](http://localhost:3000/mei/atividade?vazia=1) |
| M7 | M7 · Atividade principal · (Anexo XI + limite interno) | — | [código](<app/src/app/(mei)/mei/atividade/page.tsx>) | [/mei/atividade](http://localhost:3000/mei/atividade) |
| M7_S | M7.S · Atividades · secundárias (até 15) | — | [código](<app/src/app/(mei)/mei/atividade-secundarias/page.tsx>) | [/mei/atividade-secundarias](http://localhost:3000/mei/atividade-secundarias) |
| M7_1 | M7.1 · Splash · 'já sabemos o que você faz' | — | [código](<app/src/app/(mei)/mei/splash-atividades/page.tsx>) | [/mei/splash-atividades](http://localhost:3000/mei/splash-atividades) |
| M8 | M8 · Seus dados · (o titular) | — | [código](<app/src/app/(mei)/mei/titular/page.tsx>) | [/mei/titular](http://localhost:3000/mei/titular) |
| M9 | M9 · Sua empresa · (atuação + baixo risco) | — | [código](<app/src/app/(mei)/mei/empresa/page.tsx>) | [/mei/empresa](http://localhost:3000/mei/empresa) |
| M10 | M10 · Nome da empresa · (gerado por lei) | — | [código](<app/src/app/(mei)/mei/nome/page.tsx>) | [/mei/nome](http://localhost:3000/mei/nome) |
| M11 | M11 · Revisar e autorizar | — | [código](<app/src/app/(mei)/mei/revisar/page.tsx>) | [/mei/revisar](http://localhost:3000/mei/revisar) |
| M12 | M12 · Status · (pipeline concierge) | — | [código](<app/src/app/(mei)/mei/status/page.tsx>) | [/mei/status](http://localhost:3000/mei/status) |
| M13 | M13 · Próximos passos · (a "cola") | — | [código](<app/src/app/(mei)/mei/proximos-passos/page.tsx>) | [/mei/proximos-passos](http://localhost:3000/mei/proximos-passos) |
| M14 | M14 · Certificado · (gate: libera o app) | — | [código](<app/src/app/(mei)/mei/certificado/page.tsx>) | [/mei/certificado](http://localhost:3000/mei/certificado) |
| M14_P | M14.P · Pagar o · certificado digital | — | [código](<app/src/app/(mei)/mei/certificado/pagar/page.tsx>) | [/mei/certificado/pagar](http://localhost:3000/mei/certificado/pagar) |
| M14_SR | M14.SR · Splash · certificado recusado | ? | ⚠️ sem page.tsx | [/mei/splash-recusado?next=/mei/certificado/pagar%3Fretry%3D1](http://localhost:3000/mei/splash-recusado?next=/mei/certificado/pagar%3Fretry%3D1) |
| M14_R | M14.R · Certificado · (nova tentativa) | ? | ⚠️ sem page.tsx | [/mei/certificado/pagar?retry=1](http://localhost:3000/mei/certificado/pagar?retry=1) |
| M14_PS | M14.PS · Splash · certificado pago | ? | ⚠️ sem page.tsx | [/mei/splash-pagamento?next=/mei/status%3Ffase%3Dcertificado%26certificado%3Dpronto](http://localhost:3000/mei/splash-pagamento?next=/mei/status%3Ffase%3Dcertificado%26certificado%3Dpronto) |
| M14_PSB | M14.PSB · Splash · boleto do certificado | ? | ⚠️ sem page.tsx | [/mei/splash-boleto?next=/mei/status%3Ffase%3Dcertificado%26certificado%3Dboleto](http://localhost:3000/mei/splash-boleto?next=/mei/status%3Ffase%3Dcertificado%26certificado%3Dboleto) |
| M14_1 | M14‴ · Status · (travado no certificado) | ? | ⚠️ sem page.tsx | [/mei/status?fase=certificado&certificado=pendente](http://localhost:3000/mei/status?fase=certificado&certificado=pendente) |
| M14_1B | M14″ · Status · (boleto do certificado · compensando) | ? | ⚠️ sem page.tsx | [/mei/status?fase=certificado&certificado=boleto](http://localhost:3000/mei/status?fase=certificado&certificado=boleto) |
| M14_1P | M14′ · Status · (pago, aguardando · a videochamada) | ? | ⚠️ sem page.tsx | [/mei/status?fase=certificado&certificado=pronto](http://localhost:3000/mei/status?fase=certificado&certificado=pronto) |
| M14_1L | M14⁗ · Status · (certificado emitido, · app liberado) | ? | ⚠️ sem page.tsx | [/mei/status?fase=certificado&certificado=liberado](http://localhost:3000/mei/status?fase=certificado&certificado=liberado) |
| A3_1 | A3.1 · Órgão recusa · 'precisa de você' | app | [código](<app/src/app/(app)/painel/recusa/page.tsx>) | [/painel/recusa](http://localhost:3000/painel/recusa) |
| A3_2 | 'A3.2 · Certificado digital' 🗑️ REMOVIDO 01/09 · (segue só no MEI/migrar) | app | [código](<app/src/app/(app)/certificado/page.tsx>) | [/certificado](http://localhost:3000/certificado) |
| A3_P | A3.P · Pagar a guia · da Junta (DAE) | app | [código](<app/src/app/(app)/guia/page.tsx>) | [/guia](http://localhost:3000/guia) |
| A3_SR | A3.SR · Splash · guia recusada | ? | ⚠️ sem page.tsx | [/splash-recusado?next=/guia%3Fretry%3D1](http://localhost:3000/splash-recusado?next=/guia%3Fretry%3D1) |
| A3_R | A3.R · Guia · (nova tentativa) | ? | ⚠️ sem page.tsx | [/guia?retry=1](http://localhost:3000/guia?retry=1) |
| A3_PS | A3.PS · Splash · guia paga | ? | ⚠️ sem page.tsx | [/splash-pagamento?next=/aguardando%3Ffase%3Djunta%26guia%3Dpaga](http://localhost:3000/splash-pagamento?next=/aguardando%3Ffase%3Djunta%26guia%3Dpaga) |
| A3_PSB | A3.PSB · Splash · boleto da guia | ? | ⚠️ sem page.tsx | [/splash-boleto?next=/aguardando%3Ffase%3Djunta%26guia%3Dboleto](http://localhost:3000/splash-boleto?next=/aguardando%3Ffase%3Djunta%26guia%3Dboleto) |
| A3_V | A3‴ · Status · (analisando viabilidade, · 2ª rodada de nomes) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&viabilidade=1](http://localhost:3000/aguardando?fase=junta&viabilidade=1) |
| A3_GP | A3′ · Status · (guia paga) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga](http://localhost:3000/aguardando?fase=junta&guia=paga) |
| A4 | A4 · Assinatura dos sócios | app | [código](<app/src/app/(app)/assinatura/page.tsx>) | [/assinatura](http://localhost:3000/assinatura) |
| A4_1 | A4.1 · Código do GOV.BR | ? | ⚠️ sem page.tsx | [/assinatura?etapa=codigo](http://localhost:3000/assinatura?etapa=codigo) |
| A3_H | A3.H · Passagem · pro consultor | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&rota=assistida](http://localhost:3000/aguardando?fase=junta&guia=paga&rota=assistida) |
| A3_H1 | A3.H1 · Marcar horário · (1ª assinatura) | app | [código](<app/src/app/(app)/agendar/page.tsx>) | [/agendar](http://localhost:3000/agendar) |
| A3_H2 | A3.H2 · Status · (1ª marcada) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&rota=assistida&dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1](http://localhost:3000/aguardando?fase=junta&guia=paga&rota=assistida&dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1) |
| A3_HS | A3.H′ · Passagem · (com sócio) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&rota=assistida&socios=2](http://localhost:3000/aguardando?fase=junta&guia=paga&rota=assistida&socios=2) |
| A3_H1S | A3.H1′ · Marcar horário · (com sócio) | ? | ⚠️ sem page.tsx | [/agendar?socios=2](http://localhost:3000/agendar?socios=2) |
| A3_H2S | A3.H2′ · Status · (marcada, com sócio) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&rota=assistida&socios=2&dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1](http://localhost:3000/aguardando?fase=junta&guia=paga&rota=assistida&socios=2&dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1) |
| A3_H3 | A3.H3 · Passagem · (2ª assinatura) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&rota=assistida&assinatura=1](http://localhost:3000/aguardando?fase=junta&guia=paga&rota=assistida&assinatura=1) |
| A3_H4 | A3.H4 · Marcar horário · (2ª, contador junto) | ? | ⚠️ sem page.tsx | [/agendar?rodada=2](http://localhost:3000/agendar?rodada=2) |
| A3_H5 | A3.H5 · Status · (2ª marcada) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&rota=assistida&assinatura=1&dia=8&semana=Seg&mes=Set&hora=09%3A30](http://localhost:3000/aguardando?fase=junta&guia=paga&rota=assistida&assinatura=1&dia=8&semana=Seg&mes=Set&hora=09%3A30) |
| A3_A1 | A3⁗ · Status · (1ª assinatura feita) | ? | ⚠️ sem page.tsx | [/aguardando?fase=junta&guia=paga&assinatura=1](http://localhost:3000/aguardando?fase=junta&guia=paga&assinatura=1) |
| A4_2 | A4″ · 2ª assinatura · (gera o CNPJ, contador junto) | ? | ⚠️ sem page.tsx | [/assinatura?rodada=2](http://localhost:3000/assinatura?rodada=2) |
| CONF | 🛠️ Conferência do dev · (campos por origem) | app | [código](<app/src/app/(app)/conferencia/page.tsx>) | [/conferencia](http://localhost:3000/conferencia) |
| A5_H | ✅ A5.H · Home dia-1 · (rota assistida) | ? | ⚠️ sem page.tsx | [/home-dia1?rota=assistida](http://localhost:3000/home-dia1?rota=assistida) |
| A5 | ✅ A5 · Home dia-1 · (ativação) | app | [código](<app/src/app/(app)/(portal)/home-dia1/page.tsx>) | [/home-dia1](http://localhost:3000/home-dia1) |

⚠️ **nós sem arquivo:** E2_1 (/welcome?slide=0) · E2_2 (/welcome?slide=1) · E2_3 (/welcome?slide=2) · E3_2 (/entrada?intencao=abrir) · E3_2_M (/entrada?intencao=migrar) · E3_4_1 (/endereco?simular=fora-bh) · E5T (/gate?etapa=triagem) · E5T_1 (/gate?etapa=triagem&simular=socio-nao-encaixa) · E5F (/gate?etapa=faixa) · E6_1 (/conta?etapa=codigo) · E6_2 (/conta?cpf=nome) · E7_1 (/plano?endereco=fiscal) · E9_M (/pagamento?fluxo=migrar) · E9_SR (/splash-recusado?next=/pagamento%3Fretry%3D1) · E9_R (/pagamento?retry=1) · E9_1P (/aguardando?pago=1) · C0_0 (/dossie/atividade?vazia=1) · C3_1 (/dossie/socios?socios=4) · C3_2 (/dossie/socios?socios=1) · C3_3 (/dossie/socios?divergencia=1) · C0_3 (/retomar?etapa=codigo) · C7_2S (/splash-nomes?next=/aguardando%3Ffase%3Djunta%26viabilidade%3D1) · A3 (/aguardando?fase=junta) · A3_GB (/aguardando?fase=junta&guia=boleto) · M2_1 (/mei/impedimentos?bloqueio=ja-tem-cnpj) · M2_2 (/mei/impedimentos?bloqueio=servidor) · M4_1 (/mei/conta?etapa=codigo) · M4_2 (/mei/conta?etapa=cpf-divergente) · M6_SR (/mei/splash-recusado?next=/mei/pagamento%3Fretry%3D1) · M6_R (/mei/pagamento?retry=1) · M6_1P (/mei/aguardando?pago=1) · M7_0 (/mei/atividade?vazia=1) · M14_SR (/mei/splash-recusado?next=/mei/certificado/pagar%3Fretry%3D1) · M14_R (/mei/certificado/pagar?retry=1) · M14_PS (/mei/splash-pagamento?next=/mei/status%3Ffase%3Dcertificado%26certificado%3Dpronto) · M14_PSB (/mei/splash-boleto?next=/mei/status%3Ffase%3Dcertificado%26certificado%3Dboleto) · M14_1 (/mei/status?fase=certificado&certificado=pendente) · M14_1B (/mei/status?fase=certificado&certificado=boleto) · M14_1P (/mei/status?fase=certificado&certificado=pronto) · M14_1L (/mei/status?fase=certificado&certificado=liberado) · A3_SR (/splash-recusado?next=/guia%3Fretry%3D1) · A3_R (/guia?retry=1) · A3_PS (/splash-pagamento?next=/aguardando%3Ffase%3Djunta%26guia%3Dpaga) · A3_PSB (/splash-boleto?next=/aguardando%3Ffase%3Djunta%26guia%3Dboleto) · A3_V (/aguardando?fase=junta&viabilidade=1) · A3_GP (/aguardando?fase=junta&guia=paga) · A4_1 (/assinatura?etapa=codigo) · A3_H (/aguardando?fase=junta&guia=paga&rota=assistida) · A3_H2 (/aguardando?fase=junta&guia=paga&rota=assistida&dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1) · A3_HS (/aguardando?fase=junta&guia=paga&rota=assistida&socios=2) · A3_H1S (/agendar?socios=2) · A3_H2S (/aguardando?fase=junta&guia=paga&rota=assistida&socios=2&dia=5&semana=Sex&mes=Set&hora=15%3A00&hoje=1) · A3_H3 (/aguardando?fase=junta&guia=paga&rota=assistida&assinatura=1) · A3_H4 (/agendar?rodada=2) · A3_H5 (/aguardando?fase=junta&guia=paga&rota=assistida&assinatura=1&dia=8&semana=Seg&mes=Set&hora=09%3A30) · A3_A1 (/aguardando?fase=junta&guia=paga&assinatura=1) · A4_2 (/assinatura?rodada=2) · A5_H (/home-dia1?rota=assistida) · ⚠️ **rotas sem nó no mapa:** /avisos · /blog · /blog/post · /componentes · /emitir · /home-a · /home-b · /home-c · /home-campea · /home-d · /home-e · /home-f · /impostos/aliquotas · /impostos/guias · /impostos/pagar · /impostos · /impostos-v1 · /impostos-v2 · /inicio · /inicio-ref11 · /inicio-ref12 · /inicio-ref5 · /inicio-ref6 · /inicio-ref7 · /inicio-ref9 · /mais/certificado · /mais/colaborador · /mais/declaracoes · /mais/documentos · /mais/em-dia · /mais/empresa · /mais · /mais/plano · /mais/relatorios · /mais/servicos · /mais/socios · /mais-completa · /mais-v1 · /notas/detalhe · /notas · /obrigacoes · /perfil · /pro-labore · /splash-nomes · /splash-recusado · /mei/splash-recusado · /conta-v2 · /conta-v2-robusto · /gate · /plano-premium · /plano-v2 · /plano-v2-robusto · /veredito/descartado · /veredito/nao-atende · /veredito/waitlist · /welcome · /apresentacao · /mapa · /mockup-home · /mockup-inicio · /mockup-v2 · /processos · _121 telas navegáveis · gerado de `flow-data.mjs`._
<!-- INDICE:FIM -->

---

## 🔁 Achados — Redundância (mesma info em telas diferentes)

| ID | Status | Onde | O que se repete | Recomendação | Sev |
|---|:--:|---|---|---|:--:|
| R1 | ✅ | N9 · P2 · N21 · P1 | "não cobra / não abre duas vezes" (idempotência, quase igual) | forte no **N9**; meia-linha nas telas de espera. Boleto vê 3× na mesma jornada | 🔴 |
| R2 | ✅ | N7 · N8 · N19 · N20 | "a taxa é do governo, não é nossa / não volta" | N7 é o dono; N8 e N19 só mencionam de raspão. Ver **M1** (o pior é interno ao N20) | 🔴 |
| R3 | ✅ | N2 = N3 | "22 anos de escritório por trás do app" (**string idêntica**, telas coladas) | varia a redação numa das duas | 🟠 |
| R4 | ✅ | N5 · N17 · N18 · N19 | carimbo "Estimativa. A gente confirma com o contador..." (idêntico 4×) | obrigatório por regra; variar a forma pro olho não pular | 🟠 |
| R5 | ✅ | N5 · N17 | "Não é malandragem / é o que um bom contador faz" | N17 assume que já foi dito no N5 e vai ao número | 🟠 |
| R6 | ✅ | N4 = N10 | bloqueio exterior ("existe, mas fica fora do Simples") | N10 confirma seco, sem repetir o corpo | 🟡 |
| R7 | ✅ | N7 · N8 | sub "Sem letra miúda" | tira de uma | 🟡 |

**Menores (contexto exclusivo, provável não mexer):** "limite 2 sócios" N4/N12/saída · "a parte chata é com a gente" (refrão de marca, N2/N3/N21) · "você não repete nada" (veredito/saída, ramos que o mesmo user não vê).

**✅ Aplicado 2026-07-21 (R1–R7):**
- **R1** — N9 fica âncora (mantido). **P2** "Se você já pagou, não cobramos de novo" · **P1** "Seu pagamento está registrado. Nada é cobrado nem aberto duas vezes" · **N21** "A abertura roda uma vez só, sem cobrança dupla".
- **R2** — N8 bullet perdeu "e vão direto pro Estado" · N19 taxa virou **"Taxa da Junta (já paga) / Repasse ao governo, já incluído no que você pagou"**. (N20 fica pro **M1**.)
- **R3** — N3 selo → **"Um escritório de verdade, não um app sozinho."** (N2 mantém os 22 anos.)
- **R4** — carimbos variados: N5 "O número exato a gente fecha com o contador" · N17 "O contador confirma antes de trocar o código" · N19 "O contador confere tudo antes da gente registrar" · **N18 mantido canônico**.
- **R5** — N17 título → **"Por que a troca é legítima"** + corpo encurtado (assume o argumento do N5).
- **R6** — N10 exterior reescrito, não copia mais o N4.
- **R7** — N8 perdeu "Sem letra miúda" (N7 mantém).

## 📚 Achados — Informação massiva

| ID | Status | Onde | O peso | Recomendação | Sev |
|---|:--:|---|---|---|:--:|
| M1 | ✅ | N20 termo | Aviso + Item 2 + Camada 2 dizem a MESMA coisa ("taxa não volta") 3× na mesma tela | Camada 2 é o lugar canônico; Aviso vira 1 linha ou sai | 🔴 |
| M2 | ✅ | N17 CNAE ótimo | 2 avisos empilhados + pré-explica a alavanca do N18 (pró-labore) | menção de 1 linha, deixa o N18 explicar | 🟠 |
| M3 | ✅ | N8 contrato | card de credenciais (3 pontos) logo após 4 bullets | card vira 1-2 pontos | 🟠 |

**Menores:** N18 simulador é denso por natureza (farol "complexa", usa expander) · N11 pode empilhar 2 avisos.

**✅ Aplicado 2026-07-21 (M1–M3):**
- **M1** — N20: a "taxa não volta" foi de 3× pra 1×. **Camada 2** vira o dono do dinheiro (não-reembolsável); o **Aviso** passa a ser só a irreversibilidade da AÇÃO ("a abertura começa de verdade... o registro segue em frente"); o **checkbox** consente na irreversibilidade sem re-encodar a taxa. Item 2 fica (é repasse, faceta distinta). Sumiu o `import CUSTOS/brl`.
- **M2** — N17: o bloco "Existem dois caminhos" (que pré-explicava o pró-labore, assunto inteiro do N18) virou **1 linha**: "esse é o mais fácil dos dois; o outro a gente vê na próxima tela".
- **M3** — N8: card de credenciais **3 → 2 pontos**. Saiu "Nada acontece sem você" (a tranquilidade de "não travou" já vem do bullet "nada é irreversível hoje"); ficam as 2 provas de com quem se assina (22 anos + contador com nome). Removido o `IconeMao` órfão. ⚠️ **decisão a validar:** dropei "nada acontece sem você" e mantive "22 anos"; se preferir o inverso, é 1 troca.

## 🚫 Achados — Frase negativa (foco no caminho feliz)

| ID | Status | Onde | Trecho | Reenquadre proposto | Sev |
|---|:--:|---|---|---|:--:|
| F1 | ✅ | N24 ativa | "A gente **não some** depois de abrir" (na tela de celebração) | "A gente continua com você depois de abrir" | 🟠 |
| F2 | ✅ | N6 conta | "**Ainda não** estamos cobrando nada" | "Criar conta é de graça. Você só paga quando decidir abrir." | 🟠 |
| F3 | ✅ | N15 natureza | "**Não precisa** decorar sigla" | "A gente cuida da sigla" (heading); corpo passou "A gente cuida do resto" → "O resto do papel a gente resolve" pra não dobrar o "a gente cuida" | 🟠 |
| F4 | ✅ | N16 nome | "evitar que o nome seja **reprovado** no meio do caminho" | "pra o nome passar de primeira" | 🟡 |
| F5 | ✅ | N13 empresa | "**Sem** endereço comercial **deixa de ser problema**" | "Você fica com um endereço comercial pronto pra receber a empresa, mesmo sem ter um. Ele entra junto no seu plano, regularizado." | 🟡 |
| F6 | ✅ | N9 pagamento | "**nunca** cobra duas vezes" (dupla negação na fronteira do dinheiro) | "Pago uma vez, aberto uma vez" | 🟡 |

**Deixados de fora de propósito** (⏸️ negativo é honestidade estrutural, não mexer): N5 fator-r "começa em zero" · N18 "encostado no limite" · N20 "não dá pra desfazer" · todas as saídas/waitlist (rejeição = registro correto).

**Travessão:** ✅ limpo — nenhum `—` em copy visível (só em comentário de código).

**Priorização sugerida (aplicar primeiro):** R1 · R2+M1 (família da taxa) · R3 · F1 · F2.

---

## 🎯 Olhar crítico (K) — craft / flow / feel

> Além da auditoria mecânica: julgamento de design sobre as telas que a gente mexeu. Todos aplicados 2026-07-21.

| ID | Status | Tela | O que mudou | Por quê | Sev |
|---|:--:|---|---|---|:--:|
| K1 | ✅ | N21 painel | "cerca de 8 dias úteis" → qualitativo ("depende de cada órgão, a gente avisa a cada passo") | **Anti-guru:** número inventado na tela mais ansiosa. Prazo de abertura é o que o concorrente não divulga; furar destrói confiança. Volta como estimativa COM fonte quando o pipeline do dev der tempo real | 🔴 |
| K2 | ✅ | N3 entrada | selo → **"Um escritório de contabilidade de verdade, em BH."** | Meu fix do R3 tinha virado negativa ("não um app sozinho"). Positivo, mantém a credencial, sem o "não" | 🟠 |
| K3 | ✅ | N24 ativa | **entrada comemorativa** (card sobe + selo verde dá pop com overshoot) | Abrir empresa é vitória real; 1 beat sem tapar conteúdo. *(Revisado 21/07: o Confetti da marca resolvia num check coral PARADO no meio da tela cobrindo o texto, o Pedro pegou no mockup. Trocado por materialização.)* | 🟠 |
| K4 | ✅ | N8 + N20 | **checkbox unificado no DS** (`ui/form.tsx`) | Duas telas-irmãs de aceite, dois padrões (N8 nativo × N20 custom verde). Um só, coral (ação, não estado-sucesso). ⚠️ mudou o texto do aceite do N8 pra caption/secondary | 🟠 |
| K5 | ✅ | N19 revisar | "Ajustar" = **contrato de interação travado** (edit-and-return, nunca re-anda N14→N18) | Sem isso decidido, ou forçava re-walk (punitivo) ou quebrava. Decisão no código; dev implementa | 🟠 |
| K6 | ✅ | N21 painel | footer sticky → **link inline** | Tela de status não tem ação primária; botão sticky prometia ação inexistente. Rodapé fixo só volta na recusa (aí há ação) | 🟡 |
| K7 | ✅ | N22 assinatura | legenda da lista alinhada aos botões | "Você: sua vez de assinar" brigava com o CTA "convidar o Bruno". Agora a linha do dono espelha o ghost, a do sócio espelha o primário (consenso-first) | 🟡 |
| K8 | ✅ | N19 revisar | CTA "Está tudo certo, continuar" → **"Confirmar e seguir"** | Título já pergunta "Está tudo certo?"; CTA repetia na mesma tela | 🟡 |
| K9 | ✅ | N20 termo | 4 camadas: lista numerada → **bullets** | Número implicava sequência; são 4 fatos independentes, não passos | 🟡 |
| K10 | ✅ | N19 revisar | tira a **re-venda de economia** do review | No confirm final o trabalho é conferir FATO (pró-labore escolhido), não revender economia (4ª vez). *(Supera a instância N19 do R4: sem número estimado, sem carimbo.)* | 🟡 |

---

## 🔬 Varredura pesada (V) — rubrica inteira D1–D11 nas 3 telas do round M

> 2026-07-21. Duas câmeras (agente adversarial + camada crítica) sobre N20/N17/N8 no estado pós-M. **Achado-chave:** o método pegou um fix MEU incompleto (V6 — o R5 só arrumou o título do aviso do N17). D4/D6/D8 limpos.

| ID | Status | Tela | Dim | Achado → o que virou |
|---|:--:|---|:--:|---|
| V1 | ✅ | N20 | D5 | "a taxa da Junta que você já pagou" era 2× (Item 2 + Camada 2) → Camada 2 vira "A taxa da Junta não é reembolsável..." |
| V2 | ✅ | N20 | D5 | corpo do Aviso só recapitulava o intro+Item 1 → agora fala da consequência ("ponto sem volta") |
| V3 | ✅ | N20 | D7 | checks verdes (`state-success`) em ações futuras → coral (`action-primary`) |
| V4 | ✅🟡 | N20 | D11 | checkbox não nomeava a taxa não-reembolsável → agora nomeia. Reverte em parte a M1 de propósito (consentir ≠ divulgar). **Redação final = Larissa** |
| V5 | ✅ | N20 | D3 | "Você não paga nada de novo" (negativo) → "A taxa que você já pagou cobre esse registro" |
| V6 | ✅ | N17 | D1 | corpo do aviso "por que legítima" ecoava o N5 quase verbatim (R5 só arrumou o título) → só o mecanismo novo ("o que muda é a tabela") |
| V7 | ✅ | N17 | D9 | "Baixar PDF" tinha peso de CTA → virou link leve com ícone |
| V8 | ⏸️ | N17 | D2 | 2 avisos empilhados → **não mexido**: a spec obriga o tradeoff visível, fundir enterraria disclosure |
| V9 | ✅ | N8 | D5 | cluster "escritório"/"de verdade" 2-3× no card → textos dos 2 pontos enxutos |
| V10 | ✅ | N8 | D3 | "7 dias pra **desistir**" → "pra **mudar de ideia** e receber tudo de volta" (mantido "sem honorário", que é preciso vs N7) |
| V11 | ⏸️ | N8 | D1 | resumo de custo reafirma o N7 → **aceito** (função de contrato) |

### 2ª passada — nas 6 telas do round F (N24/N6/N15/N16/N13/N9)

> 2026-07-21, logo após aplicar F1–F6. Mesma máquina (agente mecânico D1–D6 + camada crítica D7–D11). **Achado-chave repetiu o padrão: V12 é um eco que o MEU próprio F1 criou** (positivar a negativa colidiu com o subtítulo da tela) — e a câmera mecânica não pegou, a crítica sim. Prova de que positivar sem reler a tela inteira planta redundância. D2/D4/D6/D8/D9/D10/D11 limpos.

| ID | Status | Tela | Dim | Achado → o que virou |
|---|:--:|---|:--:|---|
| V12 | ✅ | N24 ativa | D5 | **F1 criou eco:** o subtítulo já diz "a gente continua com você daqui pra frente"; meu F1 pôs "A gente continua com você depois de abrir" no card 40px abaixo → heading vira **"A gente fica de olho pra você pagar menos"** (o benefício do loop UX-41, não re-prometer presença). *Camada crítica pegou; mecânica não.* |
| V13 | ✅ | N13 empresa | D5 | **F5 duplicou o botão:** o botão do upsell já vende "endereço comercial pronto pra receber a empresa"; meu F5 fez o Aviso repetir quase igual → Aviso enxuto **"Fechado. Ele entra junto no seu plano."** (confirma + única info nova) |
| V14 | ✅ | N9 ↔ N21 | D1 | idempotência quase verbatim em 2 telas do caminho-cartão → **diferenciado por momento:** N9 (ato de pagar) fica dono da **cobrança** ("Você paga uma vez só, mesmo que o app feche na hora do pagamento") · N21 (espera assíncrona) fica dono do **processo** ("A abertura roda uma vez só. Pode fechar o app que o processo segue sozinho, de onde parou"). Zero overlap. Pedro autorizou tocar o N21 fora do escopo F |
| V15 | ✅ | N6 conta | D1 | "seu progresso fica salvo" ecoava N9/N21 → **DISSOLVIDO pelo V14:** ao tirar "progresso salvo" do N9 e do N21, o N6 vira o único dono da promessa de persistência. 1 fix curou 2 achados |
| V16 | ⏸️ | N15 natureza | D5 | card do SLU "patrimônio separado" × card final "os dois separam dinheiro" → **aceito como ADITIVO:** o card do LTDA não menciona separação, então o card final cobre quem escolhe LTDA. Pré-existente |
| V17 | ⏸️ | N9 pagamento | D5 | total no subtítulo × CTA "Pagar R$X" → **aceito:** doutrina "total colado no CTA" (confirmar o valor no clique), igual N7 |

**Inventário-prova (2ª passada):** D6 travessão = 0 em copy visível (6 telas + componentes) ✅ · D4 anti-guru = nenhum número externo sem carimbo (preços são placeholder-próprio deferido, DAS/dia-20 é fato legal) ✅ · D2 massa = N13 é form com disclosure progressivo, N24 é farol (exceções) ✅ · D3 negativa = os "não/sem" restantes vivem em erro/branch ou são honestidade estrutural ✅ · D7 = 🔎 **watch pré-existente** (chip "Sugerido" do N15 e Aviso `success` do N13 usam verde num papel semi-decorativo; não-F, não mexido) · D8/D9/D10/D11 limpos.

---

## 📋 Inventário por tela (a prova — compacto)

> A base que sustenta os achados acima. Só texto visível ao usuário. Pra o texto integral + linha, abre o código pelo Índice.

**N1 splash** — sem copy (só logo negativa).
**N2 welcome** — 3 slides: "Contador de verdade. Não robô." / "A parte chata é com a gente." / "Sem contabilês. Sem susto no boleto." · selo "22 anos de escritório por trás do app." · CTA "Começar"/"Próximo"/"Pular".
**N3 entrada** — "Como a gente pode te ajudar? A parte chata fica com a gente." · selo "22 anos..." (idêntico N2) · cards "Quero abrir minha empresa" / "Já tenho empresa" · link "Já é cliente? Entrar".
**N4 gate** — "O que você faz?" + 17 pills · triagem "Duas perguntas rápidas" (sócios / exterior) + bloqueios · faixa "Quanto você vai receber por mês?".
**N5 teaser** — 3 modos: swap ("Você economiza por mês" + "Não é malandragem"), fator-r ("R$ 0 a X" + "começa em zero"), serviço ("já entra na tabela mais barata"). Carimbo de estimativa.
**Veredito (VA/VW/VC)** — selo + card reconhecimento + recibo "Sua atividade na Receita / CNAE" · 🟢 expander "E se eu faço mais de uma coisa?" · 🟡/🔴 captura + "Você não vai repetir nada".
**N6 conta** — "Vamos criar seu acesso" · Google/Apple/e-mail · "É a primeira empresa que você abre?" · microcopy "Ainda não estamos cobrando nada."
**N7 plano** — "Quanto custa abrir": card Grátis · card R$195/mês · card taxa **R$281,08** "vai direto pro Estado" · rodapé "Você paga hoje" (soma taxa + mensalidade). 🔄 01/09: a taxa era R$268,51 (tabela de 19/07); o valor real da guia emitida no processo é R$281,08 (prints 125 e 127). Os cards leem `CUSTOS.DAE_JUCEMG`, então o número acompanha sozinho.
**N8 contrato** — "Está tudo combinado" · 4 bullets ("taxas do governo à parte", "permanência mínima", "7 dias pra desistir") · card "escritório de verdade" (22 anos + contador + "nada acontece sem você") · aceite.
**N9 pagamento** — "Falta só isso" (R$463,51 hoje) · CPF (cobrança+elegibilidade) · método (cartão/pix/boleto) · idempotência "nunca cobra duas vezes".
**N10 socio** — "Seus dados" · CPF/RG/civil/regime (cônjuge comunhão universal) · endereço · "mora fora do Brasil?" + bloqueio exterior.
**N11 vínculo** — "Você já contribui pro INSS por fora?" · aviso teto/folga · aviso "Como você se paga (pró-labore)" · privacidade.
**N12 sócios** — "Vai ter mais sócios?" · aviso "até 2 sócios, limite do produto" · 2º sócio + divisão 100%.
**N13 empresa** — "Onde a empresa fica?" · upsell endereço fiscal R$49/mês ("deixa de ser problema") · IPTU opcional · capital social + warning.
**N14 cnae-secundários** — "Sua empresa faz mais alguma coisa?" · principal travado · 4 sugestões "mesmo imposto".
**N15 natureza** — "O tipo da sua empresa" · SLU × LTDA · card "Não precisa decorar sigla".
**N16 nome** — "O nome da empresa" · razão social (disponível/em uso) · variações · aviso "confere antes... evitar reprovado".
**N17 cnae-ótimo** — "Achamos um jeito de pagar menos" · a troca (atual × ótimo) · "Não é malandragem" · "dois caminhos" (pré-explica N18) · warning "antes de trocar" · PDF.
**N18 simulador** — "Quanto você se paga?" · número + slider + sugestão · aviso borda · custo por sócio · expander "Ver a conta".
**N19 revisar** 🆕 — "Está tudo certo?" · blocos Você/Empresa/Atividades/Enquadramento + "Ajustar" · card taxa **R$281,08** (01/09, valor real da guia) · carimbo estimativa.
**N20 termo** 🆕 — "Pode começar a abrir?" · 3 itens · Aviso "não dá pra desfazer" · 4 camadas cancelamento · checkbox.
**N21 painel / REC** 🆕 — "Estamos abrindo sua empresa" · previsão ~8d · timeline 9 etapas · idempotência · REC "O nome não passou na Junta" + ação.
**N22 assinatura** 🆕 — "Hora de assinar" · nível GOV.BR (bronze→upgrade) · quem assina (consenso 2 sócios) · procuração e-CAC.
**N24 ativa** 🆕 — "Sua empresa existe" · CNPJ · 3 primeiros passos (nota/DAS/certificado) · "A gente não some depois de abrir" · WhatsApp.
**P1 retomar** — "Bem-vindo de volta" · lista de passos · idempotência "não cobra de novo".
**P2 aguardando** — "Seu boleto está a caminho" · lista de passos (travados) · boleto R$463,51/Pix · idempotência.
**Saídas (exterior/sócios)** — selo humano · explica + origem (LC 123 art.17 / limite do produto) · captura "não repete nada".
**Login** — "Bem-vindo de volta." · e-mail/senha · Google/Apple · "Criar conta".

---

## 🔗 Links
[[metodo-varredura-flow]] (a rubrica) · [[mapa-flow-mermaid]] · `produto/_flow/flow-data.mjs` · [[compilado-ux-flow]] · [[legalize-telas-padrao-layout]] · [[spec-telas-b3-b4-aterrissagem]] · [[spec-telas-entrada-b1-b2]] · [[HOME]]
