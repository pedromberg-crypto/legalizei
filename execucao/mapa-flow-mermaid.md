---
tipo: derivado
status: vivo
data: 2026-07-28
assunto: telas-e-condicionais
deriva_de: [flow-data, mapa-ramificacoes-flow, reordenacao-flow-cobranca-cedo]
tags: [produto, ux, telas, fluxo, condicionais, mermaid, mapa, vivo, dados-jucemg]
---

# 🗺️ Mapa vivo do flow

> 🆕 **V2 — pós reunião "Rua Satélite 9" (28/07).** Todas as 12 decisões da reunião cruzadas e travadas no `flow-data.mjs` (`v8`): 3 rotas do N3 confirmadas · gate de cidade novo (BH-MG só) · CNAE mantido (não vira "KINAI") · veredito 🔴 virou 3 vias (Mauro atende / ninguém atende) · front-load de dados em N6 (N10 vira confirmação) · IPTU obrigatório · retry automático de nome (REC) · DAE: cliente paga como já é, sem tela nova (repasse é timing de backend). 3+sócios e sócio-exterior seguem **tentativos** (Pedro disse "estou pensando", não travado). Ver `falta` de cada nó marcado `🆕 28/07` pros detalhes.

> **Nota GERADA. Não editar à mão.** A fonte-única é `flow/flow-data.mjs`; o diagrama, a tabela de validação e o histórico abaixo são re-renderizados por `flow/gerar-mapa.mjs`. Editar aqui é perder o trabalho na próxima geração.
>
> **Como atualizar:** mude `flow/flow-data.mjs` → rode `node execucao/flow/gerar-mapa.mjs`. Ele redesenha tudo, confere o drift contra as rotas reais e, se mudou algo estrutural, grava um snapshot versionado em `flow/versoes/` + uma linha no histórico.
>
> **Legenda:** 🟢 validado/oficial · 🟡 espera gente · ⚪ só UX (revisado) · ✅ construída · 🚧 planejada. No diagrama: vermelho = saída terminal · verde = rota feliz · âmbar = espera · azul = desvio que volta · cinza tracejado = planejado · losango = decisão.
>
> **🆕 28/07 — coluna "Dados coletados nesta etapa"**: nasceu do cruzamento com os dados exigidos pra constituição na JUCEMG (empresa · sócio · endereço). Cada linha diz o que aquela tela pede do cliente **pela primeira vez** — campo repetido ou dado que o sistema já sabe (derivado, sugerido, herdado de tela anterior) não conta de novo. "—" = a tela não coleta nada (recap, decisão do sistema, aceite sem campo, espera, ou saída fora do caminho até a constituição). Verificado linha a linha no código real de cada tela, não inferido pelo nome.

## 🖼️ Diagrama

<!-- FLOW:MAPA:INI -->
```mermaid
flowchart TD
  subgraph GATE["E5 · Gate-CNAE — uma tela"]
    direction TB
    E5A["Descreve atividade + pills"]
    E5V{"Veredito CNAE"}
    DESAMB["Desambiguação<br/>mini-loop"]:::inline
    E5VA["🟢 Atende"]
    E5T{"Triagem<br/>sócios? CPF/CNPJ? exterior?"}
    E5F["Faixa de faturamento"]
  end
  E1["E1 · Splash"]
  E2["E2 · Welcome"]
  E3{"E3 · Fork<br/>3 rotas"}
  E3_1(["E3.1 · Login / portal"]):::feliz
  E3_2{"E3.2 · MEI × ME<br/>(autodeclarado)"}
  E4{"E4 · Gate cidade<br/>(BH-MG)"}
  E4_1(["E4.1 · Saída · fora de BH<br/>MLP só atende BH-MG"]):::saida
  E4_2["E4.2 · Lê o cartão CNPJ"]
  E4_2_1(["Saída · CNPJ inapto<br/>ou suspenso"]):::saida
  E4_2B_1(["Saída · Presumido<br/>fora de escopo"]):::saida
  E4_3["E4.3 · Diagnóstico<br/>("tem certificado?")"]
  E4_4["E4.4 · Plano"]
  E4_5["E4.5 · Contrato<br/>+ promessa de devolução"]
  E9_2["E9.2 · Seu contador atual"]
  E9_2A["E9.2b · Dados que o<br/>cartão CNPJ não traz"]
  E9_2B["E9.2c · Dados dos sócios"]
  E9_2C["E9.2d · GOV.BR + procuração"]
  E9_3["E9.3 · Iniciando transferência"]:::espera
  E9_4(["✅ E9.4 · Migração concluída"]):::feliz
  E5_1["E5.1 · 🟡 Waitlist"]:::saida
  E5_2["E5.2 · 🔴 Contato especial<br/>(atendido pelo Mauro)"]:::saida
  E5_3["E5.3 · 🔴 Fora de escopo<br/>(descarta)"]:::saida
  E5_4["E5.4 · Saída · exterior<br/>LC 123 art.17"]:::saida
  E5_5["E5.5 · Saída · 5+ sócios<br/>limite do produto"]:::saida
  E5_6["E5.6 · Saída · sócio PJ<br/>tira do Simples"]:::saida
  E6["E6 · Criar conta"]
  E7["E7 · A conta da abertura"]
  E8["E8 · Aceite contrato<br/>reversível, CDC 49"]
  E9{"E9 · Pagamento"}
  E9_1["E9.1 · Aguardando boleto<br/>dossiê já liberado"]:::espera
  C1["C1 · Seus dados"]
  C2["C2 · Vínculo INSS"]
  C3{"C3 · Sócios?"}
  C3_1["C3.1 · Preenche sócios extras"]:::branch
  C4["C4 · Dados da empresa"]
  C5["C5 · CNAE secundários"]
  C6["C6 · Natureza jurídica"]
  C7["C7 · Nome / razão social"]
  C0_1["C0.1 · Retomar de onde parou"]:::espera
  A1["A1 · Revisar dossiê"]
  A2["A2 · Termo irreversível"]
  A3["A3 · Painel<br/>4 status"]
  A3_1["A3.1 · Órgão recusa<br/>'precisa de você'"]
  A3_2["A3.2 · Certificado digital<br/>(antes de assinar)"]
  A4["A4 · Assinatura dos sócios"]
  A4G{"GOV.BR nível<br/>bronze→upgrade"}:::inline
  REMOVIDO_N24(["'Empresa ativa'<br/>🗑️ REMOVIDO 30/07"]):::todo
  A5(["✅ A5 · Home dia-1<br/>(ativação)"]):::feliz

  E1 --> E2
  E2 --> E3
  E3 -->|"já sou cliente"| E3_1
  E3 -->|"quero abrir / migrar"| E3_2
  E3_2 -->|"ME"| E4
  E3_2 -.->|"MEI, abrir (pula cidade)"| E5A
  E3_2 -.->|"MEI, migrar (pula cidade)"| E4_2
  E4 -->|"BH confirmado, abrir"| E5A
  E4 -->|"BH confirmado, migrar"| E4_2
  E4 -->|"fora de BH"| E4_1
  E4_2 -.-> E4_3
  E3_2 -->|"Lucro Presumido (CTA)"| E4_2B_1
  E4_2 -.->|"CNPJ inapto/suspenso"| E4_2_1
  E4_2 -->|"🟡 regulada"| E5_1
  E4_2 -->|"🔴 Mauro atende"| E5_2
  E4_3 -.-> E4_4
  E4_4 --> E4_5
  E4_5 -->|"fluxo migrar"| E9
  E9 -.->|"fluxo migrar"| E9_2
  E9_2 --> E9_2A
  E9_2A --> E9_2B
  E9_2B --> E9_2C
  E9_2C --> E9_3
  E9_3 -.-> E9_4
  E9_4 -.-> A5
  E5A --> E5V
  E5V -->|"ambíguo"| DESAMB
  DESAMB --> E5A
  E5V -->|"🟢 atende"| E5VA
  E5VA --> E5T
  E5V -->|"🟡 regulada"| E5_1
  E5V -->|"🔴 Mauro atende"| E5_2
  E5V -->|"🔴 ninguém atende"| E5_3
  E5T -->|"até 4 + CPF + Brasil"| E5F
  E5T -->|"sócio no exterior"| E5_4
  E5T -->|"5+ sócios"| E5_5
  E5T -->|"sócio via CNPJ"| E5_6
  E5F --> E6
  E6 --> E7
  E7 --> E8
  E8 --> E9
  E9 -->|"cartão"| C1
  E9 -->|"boleto"| E9_1
  E9_1 --> C1
  C1 --> C2
  C2 --> C3
  C3 -->|"2 sócios"| C3_1
  C3_1 --> C4
  C3 -->|"solo"| C4
  C4 --> C5
  C5 --> C6
  C6 --> C7
  C7 --> A1
  A1 -.-> A2
  A2 -.-> A3
  A3 -.-> A3_1
  A3_1 -.-> A3
  A3 -.->|"DAE paga"| A3_2
  A3_2 -.-> A4
  A4 -.-> A4G
  A4G -.-> A5
  C0_1 -.->|"volta ao passo pausado"| C1

  classDef saida fill:#fde8e4,stroke:#e0603f,color:#7a2d18;
  classDef feliz fill:#e6f4ea,stroke:#2f9e5a,color:#1c5e37;
  classDef espera fill:#fff4e0,stroke:#e0a03f,color:#7a5518;
  classDef branch fill:#eef1ff,stroke:#5b6cf0,color:#2a338a;
  classDef inline fill:#f1f1f3,stroke:#9aa0a6,color:#555;
  classDef todo fill:#f7f7f8,stroke:#bcbcc2,stroke-dasharray:5 4,color:#888;
```
<!-- FLOW:MAPA:FIM -->

## ✅ Validação tela por tela

<!-- FLOW:TABELA:INI -->
> ⚠️ **Drift detectado:** rota /avisos existe mas não está no mapa · rota /blog existe mas não está no mapa · rota /blog/post existe mas não está no mapa · rota /componentes existe mas não está no mapa · rota /emitir existe mas não está no mapa · rota /home-a existe mas não está no mapa · rota /home-b existe mas não está no mapa · rota /home-c existe mas não está no mapa · rota /home-campea existe mas não está no mapa · rota /home-d existe mas não está no mapa · rota /home-e existe mas não está no mapa · rota /home-f existe mas não está no mapa · rota /impostos/aliquotas existe mas não está no mapa · rota /impostos/guias existe mas não está no mapa · rota /impostos/pagar existe mas não está no mapa · rota /impostos existe mas não está no mapa · rota /impostos-v1 existe mas não está no mapa · rota /impostos-v2 existe mas não está no mapa · rota /inicio existe mas não está no mapa · rota /inicio-ref11 existe mas não está no mapa · rota /inicio-ref12 existe mas não está no mapa · rota /inicio-ref5 existe mas não está no mapa · rota /inicio-ref6 existe mas não está no mapa · rota /inicio-ref7 existe mas não está no mapa · rota /inicio-ref9 existe mas não está no mapa · rota /mais/certificado existe mas não está no mapa · rota /mais/colaborador existe mas não está no mapa · rota /mais/declaracoes existe mas não está no mapa · rota /mais/documentos existe mas não está no mapa · rota /mais/em-dia existe mas não está no mapa · rota /mais/empresa existe mas não está no mapa · rota /mais existe mas não está no mapa · rota /mais/plano existe mas não está no mapa · rota /mais/relatorios existe mas não está no mapa · rota /mais/servicos existe mas não está no mapa · rota /mais/socios existe mas não está no mapa · rota /mais-completa existe mas não está no mapa · rota /mais-v1 existe mas não está no mapa · rota /notas/detalhe existe mas não está no mapa · rota /notas existe mas não está no mapa · rota /obrigacoes existe mas não está no mapa · rota /perfil existe mas não está no mapa · rota /pro-labore existe mas não está no mapa · rota /conta-v2 existe mas não está no mapa · rota /conta-v2-robusto existe mas não está no mapa · rota /plano-v2 existe mas não está no mapa · rota /plano-v2-robusto existe mas não está no mapa · rota /apresentacao existe mas não está no mapa · rota /mockup-home existe mas não está no mapa · rota /mockup-inicio existe mas não está no mapa · rota /mockup-v2 existe mas não está no mapa

| # | Tela | Dados coletados nesta etapa | Construída | Validado | Falta validar |
|---|---|---|:--:|:--:|---|
| 1 | E1 · Splash | — | ✅ | ⚪ | — |
| 2 | E2 · Welcome | — | ✅ | ⚪ | — |
| 3 | E3 · Fork · 3 rotas | — | ✅ | 🟢 | 3 rotas CONFIRMADAS 28/07 (reunião Rua Satélite 9): abrir · migrar · já sou cliente. |
| 4 | E3.1 · Login / portal | — | ✅ | ⚪ | Rota feliz |
| 5 | E3.2 · MEI × ME · (autodeclarado) | Regime autodeclarado (MEI ou ME) | ✅ | 🟢 | MEI não tem o limite geográfico do MLP → pula o E4 inteiro (abrir vai direto pro E5A, migrar direto pro E4.2). ME cai no E4 como sempre. Autodeclarado — quem confirma de verdade é o E4.2/E4.2b puxando da Receita. 🔴 risco não resolvido: se disser MEI aqui mas depois aparecer 2+ sócios (incompatível com MEI), não há correção automática |
| 6 | E4 · Gate cidade · (BH-MG) | Confirma cidade de abertura = Belo Horizonte/MG (único município atendido no MLP) | ✅ | 🟢 | Construído 28/07 — 2º passo INLINE do E3, mesma rota (/entrada), sem rota própria. |
| 7 | E4.1 · Saída · fora de BH · MLP só atende BH-MG | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | — |
| 8 | E4.2 · Lê o cartão CNPJ | CNPJ (consulta) · confirmação dos dados do cartão | ✅ | 🟢 | Autofill por CNPJ via InfoSimples (cadastro, R$0,20/consulta — API PAGA, não pública); sem entrevista de atividade — o CNAE já existe. 🔴 05/08: checagem de regime removida daqui (a API não confirma Simples×Presumido×MEI, ver infosimples-funcionalidades.md) — regime já vem autodeclarado da E3.2. Só confirma situação cadastral (ativa/inapta) |
| 9 | Saída · CNPJ inapto · ou suspenso | — (saída, fora do caminho até a migração) | ✅ | 🟢 | Situação cadastral ≠ ativa: aqui a Receita nem reconhece a empresa como ativa, regularização vem ANTES de qualquer migração. 🔴 06/08: diferente do que era 'auditoria de passivo' (E9.2, empresa ATIVA com dívida) — essa tela foi retirada do flow |
| 10 | Saída · Presumido · fora de escopo | — (saída, fora do caminho até a migração) | ✅ | 🟢 | Lucro Presumido segue fora do escopo (decisão explícita 04/08, sem pesquisa fiscal dedicada ainda). Autodeclarado na E3.2, não confirmado por API |
| 11 | E4.3 · Diagnóstico · ("tem certificado?") | Resposta sim/não (tem certificado digital) | ✅ | 🟡 | 🔴 04/08 (3ª rodada): o diagnóstico de Fator R pra ME foi CORTADO — a única API pré-pagamento é a cadastral, não traz faturamento/folha (só via procuração, pós-pagamento). 🔴 05/08: pergunta virou 'tem certificado?' (MEI: decide se roda TTRT). 🔴 06/08 (achado do Pedro): ME TAMBÉM passa aqui agora (antes ia do E4.2 direto pro E4.4) — certificado é independente da TTRT pra ME (as duas rodam em paralelo), mas não tinha pergunta nenhuma no caminho ME. 🟡 fila-Mauro: se sem-certificado-ME carrega custo/fidelidade extra é decisão de preço não tomada |
| 12 | E4.4 · Plano | — | ✅ | 🟡 | ME: mesma mensalidade do caminho abrir, sem taxa de governo (empresa já existe). 🆕 04/08: MEI tem plano PRÓPRIO — R$49,90/mês, fidelidade 12 meses, certificado incluso, escopo limitado (emitir NF + 1 colaborador) — não é o plano ME com desconto |
| 13 | E4.5 · Contrato · + promessa de devolução | Aceite do contrato (com a cláusula de devolução) | ✅ | 🟢 | 🔴 DECISÃO TRAVADA 30/07: cobra ANTES do TTRT, com contrapartida OBRIGATÓRIA no contrato ('se a transferência não sair por motivo fora do seu controle, devolve tudo'). Se essa linha sair do contrato, a decisão reabre (Mauro/Larissa redigem) |
| 14 | E9.2 · Seu contador atual | Nome do contador/escritório atual · e-mail · telefone (pré-preenchidos quando o cartão CNPJ trouxer, opcionais) · CRC (OBRIGATÓRIO) | ✅ | 🟢 | 🔒 24/08 (reunião Leonan 19/08, CONFLITO RESOLVIDO): CRC agora é OBRIGATÓRIO, trava o Continuar — 'eu preciso do número do CRC de qualquer forma' (Leonan). Antes o doc dizia 'opcional', estava errado/desatualizado. Nome/e-mail/telefone continuam opcionais — só o CRC não tem contorno |
| 15 | E9.2b · Dados que o · cartão CNPJ não traz | CPF · RG + órgão emissor · estado civil | ✅ | 🟢 | Reusa os mesmos campos do C1 (abertura) — CPF/RG/órgão/estado civil, digitação manual. 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui foi REMOVIDO do MVP (custo/velocidade) |
| 16 | E9.2c · Dados dos sócios | Nome completo + % de participação de cada sócio extra (CPF implícito, quantidade fixa) | ✅ | 🟢 | MESMA tela do C3 (`SociosView`), reusada com `contexto="migrar"` — só a copy muda. Não existe triagem prévia perguntando quantos sócios no caminho migrar (diferente do E5T no abrir), então a tela se sustenta sozinha |
| 17 | E9.2d · GOV.BR + procuração | Código de validação de 6 dígitos (janela 10min) | ✅ | 🟢 | Reusa `CodigoGovView` (mesmo componente do A4, caminho abrir) com `soProcuracao` — não existe protocolo de registro pra assinar (empresa já existe), só a procuração. Mesma janela de 10min/3 tentativas/escala pra atendente |
| 18 | E9.3 · Iniciando transferência | — | ✅ | 🟢 | 🔴 A PAUSA MAIS PERIGOSA DO PRODUTO: quem libera é o CONTADOR ANTIGO (valida no CRC-MG). 🆕 24/08 (reunião Leonan): copy do status trocou pra 'Iniciando o processo de transferência' + 'Estamos entrando em contato para encerrar o vínculo com a contabilidade antiga' — diferente do status de constituição ('empresa foi constituída'), antes os dois diziam a mesma coisa. Nº da resolução CFC / Evento 232 Redesim NÃO ratificados em fonte primária (🟡 pendência) |
| 19 | ✅ E9.4 · Migração concluída | — | ✅ | ⚪ | Segue pro mesmo handoff do caminho abrir → A5 (home dia-1), autoridade #2 (portal-data.mjs) |
| 20 | Descreve atividade + pills | Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine) | ✅ | 🟡 | ✅ 28/07: CTA 'já sei o número do meu CNAE' construído (troca pra modo código, mesma engine). Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev |
| 21 | Veredito CNAE | — | ✅ | 🟢 | 🆕 28/07: veredito 🔴 virou 3 vias (travado na reunião), hoje o mock só faz 2 — falta implementar o split: regulamentado→waitlist (já existe) · atendido pelo Mauro (comércio etc)→contato especial · genuinamente ninguém atende→descarta (novo). Depende da lista CNAE; dev cnae-lookup responde 'atende' pra DEFESA. 🆕 31/07: veredito 🟢 ganhou cards clicáveis (UX-65) e travar o CNAE via ENCAIXE virou redundante — ENCAIXE removido, o veredito trava direto |
| 22 | 🟢 Atende | — | ✅ | 🟡 | Depende da lista CNAE |
| 23 | Triagem · sócios? CPF/CNPJ? exterior? | Quantidade de sócios (1 / 2 / 3 / 4 / 5+) · sócio via CPF ou CNPJ (quando há sócio) · mora fora do Brasil (sim/não) | ✅ | 🟢 | 🆕 24/08 (reunião Leonan 19/08): limite subiu de 2 pra 4 sócios; aviso proativo (não bloqueio) de assinatura múltipla nos 3-4; só 5+ bloqueia. 🆕 24/08 (pedido do Pedro): nova pergunta condicional — sócio CPF ou CNPJ? CNPJ bloqueia (regra fiscal: tira do Simples), rota /saida/socio-pj. Como o tipo já é decidido aqui, o C3 (dossiê) nem pergunta de novo. Exterior = LC 123 art.17 (oficial) |
| 24 | Faixa de faturamento | Faixa de faturamento mensal (ou valor exato, se souber) · é a 1ª empresa que abre? (opcional) · endereço próprio ou fiscal Legalizai (obrigatório) | ✅ | ⚪ | Faixas sem âncora fiscal. 🆕 24/08 (reunião Rua Satélite 35): ganhou a pergunta de coorte ('é a 1ª empresa que você abre?'), realocada do E6 — dado puro de log/marketing, opcional, não interfere no processo. 🆕 26/08 (reunião Rua Satélite 36, item 2): ganhou TAMBÉM a escolha de endereço (próprio × fiscal Legalizai), realocada do C4 (`/dossie/empresa`) — essa, diferente da coorte, TRAVA o Continuar (afeta o preço mostrado no E7 daqui a pouco). Fonte: `components/gate-telas.tsx` (`FaixaView`) + `lib/endereco.ts` |
| 25 | E5.1 · 🟡 Waitlist | Nome + contato · CNAE pretendido (✅ campo construído 28/07) | ✅ | 🟢 | ✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar) |
| 26 | E5.2 · 🔴 Contato especial · (atendido pelo Mauro) | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | ✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Falta só o split real no mapear() do E5 (hoje é mock estático por página). |
| 27 | E5.3 · 🔴 Fora de escopo · (descarta) | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | mapear() do E5 ainda não decide entre E5.2/E5.3 de verdade (mock estático) — falta o split real na IA/lista de CNAEs |
| 28 | E5.4 · Saída · exterior · LC 123 art.17 | — (saída, fora do caminho até a constituição) | ✅ | 🟡 | 🟡 28/07: Pedro cogitou 'de fato descartar' essa saída dedicada (juntar no genérico) — dito na MESMA frase tentativa do E5.5, NÃO travado. Tela já tem conteúdo jurídico revisado (LC123 art.17) — não apagar sem confirmação final. UX-42 Lucro Presumido (Mauro); debate de tom |
| 29 | E5.5 · Saída · 5+ sócios · limite do produto | — (saída, fora do caminho até a constituição) | ✅ | 🟡 | 🆕 24/08: limite subiu de 2 pra 4 sócios (reunião Leonan 19/08) — esta saída só dispara em 5+ agora, não mais 3+ |
| 30 | E5.6 · Saída · sócio PJ · tira do Simples | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | 🆕 24/08 (pedido do Pedro, em cima da reunião Leonan) — NOVO. Sócio pessoa jurídica tira a empresa do Simples no ato do contrato social (regra fiscal, não limite nosso — diferente de E5.5). Bloqueia na triagem, antes do dinheiro |
| 31 | E6 · Criar conta | E-mail · senha · nome completo · CPF · telefone · endereço (front-load 28/07) · código de verificação (mock) | ✅ | 🟢 | ✅ 28/07: FRONT-LOAD construído — nome/CPF/telefone/endereço (autofill CEP) + etapa de validação por código (mock). Provider de validação CPF/situação real (Pedro). 🔴 24/08 (reunião Rua Satélite 35): pergunta de coorte SAIU daqui, foi pra E5F (Faixa) — não precisa estar junto do cadastro |
| 32 | E7 · A conta da abertura | — | ✅ | 🟡 | Preço ~R$195 FAKE (Mauro+custo); DAE R$268,51×R$288 em disputa; certificado A1 (Mauro). ✅ RESOLVIDO 26/08 (reunião Rua Satélite 36, item 2): a antiga 'pendência real de spec' ('conta total não é total', endereço fiscal só aparecia no C4 pós-pagamento) foi corrigida — a mensalidade mostrada aqui já soma o endereço fiscal quando escolhido lá no E5F, com 1 linha de explicação |
| 33 | E8 · Aceite contrato · reversível, CDC 49 | Aceite do contrato de serviço (checkbox) | ✅ | 🟡 | Redação jurídica do contrato (Mauro/Larissa); rachadura T18 |
| 34 | E9 · Pagamento | CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto) | ✅ | 🟡 | Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro) |
| 35 | E9.1 · Aguardando boleto · dossiê já liberado | — | ✅ | ⚪ | Dunning revisado |
| 36 | C1 · Seus dados | CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta) · RG + órgão emissor (digitação manual) · estado civil (+ regime de bens se casado) · confirma se mora fora do Brasil | ✅ | 🟢 | ✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do E6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do E6); regime de bens (casado). 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui (reunião Leonan, mesmo dia) foi REMOVIDO do MVP (custo/velocidade de leitura de imagem) |
| 37 | C2 · Vínculo INSS | Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ) | ✅ | 🟢 | INSS 11% direto + teto folga = consolidado fiscal fechado |
| 38 | C3 · Sócios? | Confirma se terá mais sócios (sem reperguntar quantidade/tipo) | ✅ | 🟢 | Re-pergunta o E5T (carry-forward pendente); limite subiu de 2 pra 4 (24/08). 🔒 24/08 (pedido do Pedro): não pergunta MAIS nada — quantidade e tipo (CPF) já vêm travados da triagem (E5T) |
| 39 | C3.1 · Preenche sócios extras | Nome completo + % de participação de cada sócio extra (quantidade fixa, CPF implícito) | ✅ | 🟢 | 🔒 24/08 (pedido do Pedro, em cima da reunião Leonan): DOIS travamentos — (1) quantidade de slots FIXA, vinda do que a triagem (E5T) já decidiu, sem botão de adicionar/remover; (2) CPF travado, sem pergunta de tipo (CNPJ já foi bloqueado na E5T/E5.6). Só falta nome + % de cada sócio extra. Card completo por sócio (endereço/documentos) ainda não entrou — Pedro deixou como 'talvez vale a pena', não travado |
| 40 | C4 · Dados da empresa | CEP (autofill) + número + complemento · índice cadastral IPTU (obrigatório, só se próprio) · tipo de endereço · residência de sócio (trava duplicidade) · capital social | ✅ | 🟢 | ✅ 28/07: IPTU obrigatório travado. 🆕 24/08 (reunião Leonan): alerta de IPTU pode subir quando é residência de sócio; trava duplicidade (só 1 sócio por endereço); chips de capital social simbólico (R$1k/5k/10k). 🔄 26/08 (reunião Rua Satélite 36, item 2): a escolha 'próprio × fiscal Legalizai' e o aviso de cobrança recorrente SAÍRAM daqui — moraram no E5F desde 24/08 até virarem o gate oficial de decisão, e o valor já vem confirmado do E7. Esta tela agora só CONFIRMA a escolha (card read-only, mesma doutrina do C3) e coleta os detalhes de endereço (CEP/IPTU/tipo) quando for próprio |
| 41 | C5 · CNAE secundários | CNAEs secundários (seleção múltipla + busca, opcional, até 15) | ✅ | 🟡 | 🆕 24/08 (reunião Leonan): ganhou busca livre (restrita ao que a gente atende, pedido original da Jéssica 19/07) além das 4 sugestões curadas mesmo-imposto; até 15 no total; secundária que muda enquadramento mostra aviso e troca CTA por 'Falar com atendente' em vez de bloquear silenciosamente |
| 42 | C6 · Natureza jurídica | Escolha da natureza jurídica (SLU ou LTDA — sugerida, editável) | ✅ | 🟡 | SLU × LTDA confirmado pelo Leonan (24/08): SLU pra individual (proteção patrimonial — bens não se misturam), LTDA pra sociedade, sem outra opção nos dois casos |
| 43 | C7 · Nome / razão social | 3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA) · objeto social (gerado automaticamente, travado) · nome fantasia (opcional) | ✅ | 🟢 | Viabilidade JUCEMG (RPA, não API); 3 opções por prioridade (28/07). 🔒 24/08 (reunião Leonan, CONFLITO RESOLVIDO): objeto social virou TRAVADO/read-only — erro de grafia do cliente gerava reclamação real no escritório antigo dele. 🆕 24/08 (pedido do Pedro): cada sugestão ganhou lápis de edição inline (reescreve a sugestão da IA no lugar); campo separado 'Digite a sua' foi removido; seta de reordenar 1/2/3 mantida |
| 44 | C0.1 · Retomar de onde parou | — | ✅ | ⚪ | UX-23 fechado — mora em /pro-labore pós-constituição |
| 45 | A1 · Revisar dossiê | — (leitura + confirmação; enquadramento e pró-labore são SUGERIDOS pelo sistema, 28/07 — não digitados) | ✅ | ⚪ | Recap read-only; carry-forward dos passos = estado do wizard (dev) |
| 46 | A2 · Termo irreversível | Aceite do termo irreversível (checkbox) | ✅ | 🟡 | Redação jurídica do termo + 4 camadas de cancelamento (Mauro/Larissa); racha T18 |
| 47 | A3 · Painel · 4 status | — | ✅ | 🟢 | 🆕 30/07: reduzido de 9→3 status (2 passadas). 'Registrar a empresa'→'Analisando viabilidade'; novo 'Documentação completa preenchida' (check, acima) + 'Agora é só assinar' (cinza, depende do deferimento da Junta). 🔄 26/08 (reunião Rua Satélite 36, item 6): voltou a ter 4. O pagamento da DAE, que era timing de BACKEND desde 28/07 (cliente paga no E9 junto da mensalidade, a gente segura e repassa depois), virou etapa VISÍVEL e acionável aqui: 'Pague a guia da Junta (DAE)', com CTA coral inline, só depois que a viabilidade sai — 'Agora é só assinar' passa a depender dessa etapa, não só do deferimento. NÃO absorvemos a taxa (alinhado ao líder, contrato Contabilizei 4.3"h"). Timeline real depende do pipeline do dev; prazo ~8d é placeholder. Componente: `components/painel.tsx` (`acaoCliente`, `onPagarDae`) |
| 48 | A3.1 · Órgão recusa · 'precisa de você' | Retry automático pelas 3 opções priorizadas (C7) antes de pedir novas sugestões ao cliente | ✅ | 🟢 | ✅ 28/07: retry automático construído — tenta as 3 opções do C7 em sequência (mock sempre falha as 3, pra provar o pior caso); só aí pede novas sugestões. Testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos |
| 49 | A3.2 · Certificado digital · (antes de assinar) | Sim/não tem certificado próprio · se sim: arquivo (.pfx/.p12) + senha | ✅ | 🟡 | Componente `CertificadoGateView` (`components/wizard-cauda.tsx`). Pergunta 'já tem?' → upload arquivo+senha (sim) ou agenda entrevista com certificadora parceira (não). Mock: ambos caminhos avançam direto (sem espera assíncrona real) |
| 50 | A4 · Assinatura dos sócios | Assinatura via GOV.BR/e-CAC · código de validação de 6 dígitos (janela 10min) · canal do convite ao sócio (WhatsApp/e-mail) | ✅ | 🟡 | GOV.BR/e-CAC deep-link (dev). 🆕 24/08 (reunião Leonan): código 2FA único concentra procuração+assinatura (`CodigoGovView` — janela 10min, 3 tentativas, escala pra atendente se estourar); convite de sócio ganhou seletor de canal (WhatsApp/e-mail). 🆕 26/08 (item 7): certificado já vem validado da A3.2 — a procuração que sai junto desta assinatura agora tem o que precisa |
| 51 | 'Empresa ativa' · 🗑️ REMOVIDO 30/07 | — | 🚧 | 🟢 | Era órfão desde o swap A4→A5 (nenhuma rota navegava mais até aqui) — arquivo `/ativa` e a view apagados de vez 30/07, confirmado pelo Pedro. Fica só como marca histórica no mapa |
| 52 | ✅ A5 · Home dia-1 · (ativação) | — | ✅ | 🟢 | 🔓 SWAP validado 30/07 (confirmado no código: assinatura empurra direto pra cá). 🆕 24/08 (reunião Leonan): trilha agora mostra 3 status explícitos — Procuração (feito, instantâneo com o código) → Validação do certificado digital (agora, linka pra /mais/certificado upload+oferta) → Acesso completo. 🔄 26/08 (item 7): certificado deixou de ser 'agora' e virou 'feito' — já foi validado antes da assinatura (A3.2). Quem vira 'agora' é 'Conferir os dados da empresa' (`/mais/empresa`). `/mais/certificado` segue existindo, só que agora é pra RENOVAR/trocar, não pra validar a 1ª vez. Sem confete nem selo coral no hero. Handoff pro flow Portal (letra P) → autoridade portal-data.mjs |
<!-- FLOW:TABELA:FIM -->

## 🚪 Saídas terminais (7) — sai do flow, não volta
> 🆕 28/07 (reunião Rua Satélite 9): eram 5, agora são 7 — o veredito 🔴 virou 3 vias (era 2) e o gate de cidade criou uma saída nova.
1. **Login** (N3, "já sou cliente") — rota feliz.
2. **🆕 Saída · fora de BH** (N3G, gate de cidade) — MLP só atende Belo Horizonte/MG. Planejada, zero linha de código ainda.
3. **🟡 Waitlist** (N4 veredito, CNAE regulamentado) — capta nome+contato+**CNAE pretendido** (campo novo 28/07), não fecha porta.
4. **🔴 Contato especial** (N4 veredito, atendido pelo Mauro — ex: comércio) — renomeado 28/07, era "Comercial Mauro".
5. **🆕 🔴 Fora de escopo / descarta** (N4 veredito, ninguém atende — nem a gente, nem regulamentado, nem o Mauro) — 3ª via nova do veredito, decisão explícita de descartar, não omissão. Planejada.
6. **🟡 Sócio no exterior** (N4 triagem) — barra ANTES do dinheiro. Pedro cogitou descartar essa saída dedicada (28/07), **não travado**.
7. **🟡 3+ sócios** (N4 triagem) — barra ANTES do dinheiro. Pedro cogitou juntar com a Waitlist (28/07), **não travado**.

## 🔄 Desvios que voltam ao tronco
- **Desambiguação** (N4, CNAE ambíguo) → volta pro N4.
- **Boleto** (N9) → P2 aguardando → dossiê segue; a cauda (N17+) trava até compensar.
- **2 sócios** (N12) → coleta 2º + convite → volta ao tronco.
- **Retomar** (P1) → volta ao passo pausado (qualquer pausa).
- **Órgão recusa** (N21, planejado) → "precisa de você" → recupera. 🆕 28/07: retry AUTOMÁTICO pelas 3 opções de nome (N16) antes de pedir ajuda ao cliente.
- **GOV.BR bronze** (N23, planejado) → upgrade → segue.

## ⚠️ Notas de fidelidade
- O losango **N12 "Sócios?"** re-pergunta o que o **N4 triagem** já sabe (dívida `N12 re-pergunta o que o N4 já sabe`). O mapa desenha a realidade atual, não o fix. ⚠️ Continua valendo mesmo com o front-load do N6 (28/07) — são dívidas diferentes: N12 re-pergunta CONTAGEM de sócios (N4), N10 re-perguntava DADOS pessoais (N6, essa foi resolvida — N10 virou confirmação).
- **N19–N25 e o flow #2 não têm rota** — a ordem da cauda é a intenção de [[mapa-ramificacoes-flow]], pode mudar ao construir.
- Numerações antigas **T1–T23** aparecem em ~8 docs; a tradução T→N vive no [[indice-autoridade]].
- 🆕 **28/07 — DAE (taxa da Junta): decisão travada.** Cliente paga no N9 (junto com a mensalidade, como já é hoje) — **não muda**. A Legalizai segura esse valor e só repassa a JUCEMG depois que a viabilidade (N21) aprova — é timing de **backend**, invisível pro cliente, **sem tela nova**. O cenário alternativo ("empresa paga o DAE, cliente nunca vê essa cobrança") fica **documentado como opção pra depois**, não implementado: nesse cenário, N7 perde a linha de taxa, N9 cobra só mensalidade, o card de "Taxa da Junta" some do N19, e o argumento de irreversibilidade do N20 precisa trocar de base (hoje é "a taxa não volta"). Decisão de preço/margem, não de UX — aguarda Mauro.
- 🆕 **28/07 — front-load de dados pessoais (N6).** Nome/CPF/telefone/endereço migram pro N6 (criar conta), com validação obrigatória por e-mail/SMS. **N10 deixa de coletar do zero — vira tela de confirmação** do que já veio do N6, só pedindo o que faltou (RG, órgão emissor, estado civil, regime de bens). Nenhum dos dois foi reconstruído no código ainda — é decisão travada, implementação pendente.
- 🆕 **28/07 — veredito 🔴 tem 3 saídas, mock só implementa 2.** O `mapear()` mock (N4) hoje só distingue atende/regulamentado/comércio. Falta separar "atendido pelo Mauro" (VC) de "ninguém atende, descarta" (VD, nó novo) — mesma lista fixa de CNAEs atendidos decide os 2, só a consequência muda.

## 📜 Histórico de versões (commit interno)
> Cada linha = um estado estrutural do mapa. Snapshots completos em `flow/versoes/` (`.json` p/ diff + `.mmd` legível). Mais recente no topo.

<!-- FLOW:VERSOES:INI -->
- **v26** · 2026-08-26 · +nós A3_2 · renomeou C4 "C4 · Dados da empresa +upsell endereço"→"C4 · Dados da empresa"; A3 "A3 · Painel 3 status"→"A3 · Painel 4 status" · falta-validar em E5F,E7,C4,A3,A4,A5 · dados-coletados em E5F,C4 · +conexões A3→A3_2,A3_2→A4 · -conexões A3→A4
- **v25** · 2026-08-24 · falta-validar em E9_2A,E5F,E6,C1,C4 · dados-coletados em E9_2A,E5F,E6,C1,C4
- **v24** · 2026-08-24 · +nós E9_2A,E9_2B,E9_2C · -nós E4_2A · +conexões E4_2→E4_3,E9_2→E9_2A,E9_2A→E9_2B,E9_2B→E9_2C,E9_2C→E9_3 · -conexões E4_2→E4_2A,E4_2A→E4_3,E9_2→E9_3
- **v23** · 2026-08-24 · falta-validar em E4_2A · dados-coletados em E4_2A
- **v22** · 2026-08-24 · falta-validar em C7 · dados-coletados em C7
- **v21** · 2026-08-24 · +nós E5_6 · renomeou E5T "Triagem sócios? exterior?"→"Triagem sócios? CPF/CNPJ? exterior?"; C3_1 "C3.1 · Coleta sócios extras + convite"→"C3.1 · Preenche sócios extras" · validação C3 pendente→oficial; C3_1 pendente→oficial · falta-validar em E4_2A,E5T,C3,C3_1 · dados-coletados em E4_2A,E5T,C3,C3_1 · +conexões E5T→E5_6
- **v20** · 2026-08-24 · +nós E4_2A · renomeou E9_3 "E9.3 · Aguardando TTRT"→"E9.3 · Iniciando transferência"; E5_5 "E5.5 · Saída · 3+ sócios limite do produto"→"E5.5 · Saída · 5+ sócios limite do produto"; C3_1 "C3.1 · Coleta 2º sócio + convite"→"C3.1 · Coleta sócios extras + convite" · validação E9_2 pendente→oficial; C7 pendente→oficial · falta-validar em E9_2,E9_3,E5T,E5_5,C1,C3,C3_1,C4,C5,C6,C7,A4,A5 · dados-coletados preenchido em 9 nós · +conexões E4_2→E4_2A,E4_2A→E4_3 · -conexões E4_2→E4_3
- **v19** · 2026-08-07 · +nós E9_2 · +conexões E9→E9_2,E9_2→E9_3 · -conexões E9→E9_3
- **v18** · 2026-08-06 · renomeou E4_3 "E4.3 · Diagnóstico só MEI ("tem contador?")"→"E4.3 · Diagnóstico ("tem certificado?")" · validação E4_3 oficial→pendente · falta-validar em E4_3 · dados-coletados em E4_3 · -conexões E4_2→E4_4
- **v17** · 2026-08-06 · -nós E9_2 · falta-validar em E4_2_1 · +conexões E9→E9_3 · -conexões E9→E9_2,E9_2→E9_3
- **v16** · 2026-08-05 · -nós E4_2B · falta-validar em E4_2,E4_2B_1,E4_3 · +conexões E4_2→E4_4,E3_2→E4_2B_1 · -conexões E4_2→E4_2B,E4_2B→E4_4,E4_2B→E4_2B_1,E4_2→E4_2B_1
- **v15** · 2026-08-05 · +nós E4_2_1 · falta-validar em E4_2 · +conexões E4_2→E4_2B_1,E4_2→E4_2_1
- **v14** · 2026-08-05 · +nós E3_2,E4_2B,E4_2B_1 · renomeou E4_3 "E4.3 · Diagnóstico Fator R real (12m)"→"E4.3 · Diagnóstico só MEI ("tem contador?")" · falta-validar em E4_2,E4_3,E4_4 · dados-coletados em E4_3 · +conexões E3→E3_2,E3_2→E4,E3_2→E5A,E3_2→E4_2,E4_2→E4_2B,E4_2B→E4_4,E4_2B→E4_2B_1 · -conexões E3→E4
<!-- FLOW:VERSOES:FIM -->

## Links
[[mapa-ramificacoes-flow]] (lógica A/B/C) · [[mapa-telas-mobile]] (inventário) · [[design-system]] (arquétipos A1–A10) · [[legalize-telas-padrao-layout]] · [[fila-validacao-humana]] · [[HOME]]
