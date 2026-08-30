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
    E5T{"Triagem<br/>quantos sócios?"}
    E5F["Faixa de faturamento"]
    C0["C0 · Sua atividade<br/>(descreve + pills)"]
    C0_2{"C0.2 · CNAE encontrado"}
    DESAMB["Desambiguação<br/>mini-loop"]:::inline
    C0_3["🟢 CNAE confirmado"]
  end
  E1["E1 · Splash"]
  E2_1["E2.1 · Welcome<br/>(1/3 · Léo vigia, contador é gente)"]
  E2_2["E2.2 · Welcome<br/>(2/3 · Aquece o fork)"]
  E2_3["E2.3 · Welcome<br/>(3/3 · Sem susto no boleto)"]
  E3{"E3 · Fork<br/>3 rotas"}
  E3_1(["E3.1 · Login / portal"]):::feliz
  E3_3["E3.3 · Seus dados<br/>(nome · e-mail · telefone)"]
  E3_2{"E3.2 · MEI × ME<br/>(variante Abrir)"}
  E3_2_M{"E3.2 · MEI × ME<br/>(variante Migrar)"}
  E3_4{"E3.4 · Endereço + categoria<br/>(os 2 gates)"}
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
  E6["E6 · Criar conta"]
  E7["E7 · A conta da abertura"]
  E8["E8 · Aceite contrato<br/>reversível, CDC 49"]
  E9{"E9 · Pagamento<br/>(variante Abrir)"}
  E9_M{"E9 · Pagamento<br/>(variante Migrar)"}
  E9_1["E9.1 · Aguardando boleto<br/>dossiê já liberado"]:::espera
  C1["C1 · Seus dados"]
  C2["C2 · Vínculo INSS"]
  C3{"C3 · Sócios?"}
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
  M_T{"M-T · Impedimentos<br/>(no lugar da triagem)"}:::branch
  M_T_1["M-T.1 · 🔴 Já tem CNPJ"]:::saida
  M_T_2["M-T.2 · 🔴 Servidor federal"]:::saida
  M_O["M-O · Ocupação<br/>(Anexo XI + limite interno)"]:::branch
  M_CERT["A3.2' · Certificado<br/>(operar, não abrir)"]:::branch
  M_S["M-S · Próximos passos<br/>(a "cola")"]:::branch
  A5(["✅ A5 · Home dia-1<br/>(ativação)"]):::feliz

  E1 --> E2_1
  E2_1 --> E2_2
  E2_2 --> E2_3
  E2_3 --> E3
  E3 -->|"já sou cliente"| E3_1
  E3 -->|"quero abrir"| E3_3
  E3 -->|"já tenho empresa"| E3_3
  E3_3 -->|"abrir"| E3_2
  E3_3 -->|"migrar"| E3_2_M
  E3_2 -->|"ME, abrir"| E3_4
  E3_2 -.->|"MEI, abrir (sem gate de BH)"| E3_4
  E3_2_M -->|"ME, migrar"| E4_2
  E3_2_M -.->|"MEI, migrar"| E4_2
  E3_4 -->|"ME · endereço BH + categoria ok"| E5T
  E3_4 -.->|"MEI · categoria com ocupação"| M_T
  E4_2 -.-> E4_3
  E4_2 -.->|"CNPJ inapto/suspenso"| E4_2_1
  E4_2 -->|"🟡 regulada"| E5_1
  E4_2 -->|"🔴 Mauro atende"| E5_2
  E4_3 -.-> E4_4
  E4_4 --> E4_5
  E4_5 --> E9_M
  E9_M -.-> E9_2
  E9_2 --> E9_2A
  E9_2A --> E9_2B
  E9_2B --> E9_2C
  E9_2C --> E9_3
  E9_3 -.-> E9_4
  E9_4 -.-> A5
  E5T --> E5F
  E5F --> E6
  M_T -.->|"sem impedimento"| E5F
  M_T -->|"já tem outra empresa"| M_T_1
  M_T -->|"servidor federal"| M_T_2
  E6 --> E7
  E7 --> E8
  E8 --> E9
  E9 -->|"ME · cartão"| C0
  E9 -.->|"MEI · cartão"| M_O
  M_O -.->|"MEI reusa o C1"| C1
  E9 -->|"boleto"| E9_1
  E9_1 --> C0
  C0 --> C0_2
  C0_2 -->|"ambíguo"| DESAMB
  DESAMB --> C0
  C0_2 -->|"🟢 confirmado"| C0_3
  C0_3 --> C5
  C5 --> C1
  C1 --> C2
  C2 --> C3
  C3 --> C4
  C4 --> C6
  C6 --> C7
  C7 --> A1
  A1 -.-> A2
  A2 -.-> A3
  A3 -.-> A3_1
  A3_1 -.-> A3
  A3 -.->|"ME · DAE paga"| A3_2
  A3 -.->|"MEI · time conferiu"| M_S
  M_S -.->|"voltou com o CNPJ"| M_CERT
  M_CERT -->|"certificado resolvido"| A5
  A3_2 -.-> A4
  A4 -.-> A4G
  A4G -.-> A5
  C0_1 -.->|"volta ao passo pausado"| C0

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
> ⚠️ **Drift detectado:** rota /avisos existe mas não está no mapa · rota /blog existe mas não está no mapa · rota /blog/post existe mas não está no mapa · rota /componentes existe mas não está no mapa · rota /emitir existe mas não está no mapa · rota /home-a existe mas não está no mapa · rota /home-b existe mas não está no mapa · rota /home-c existe mas não está no mapa · rota /home-campea existe mas não está no mapa · rota /home-d existe mas não está no mapa · rota /home-e existe mas não está no mapa · rota /home-f existe mas não está no mapa · rota /impostos/aliquotas existe mas não está no mapa · rota /impostos/guias existe mas não está no mapa · rota /impostos/pagar existe mas não está no mapa · rota /impostos existe mas não está no mapa · rota /impostos-v1 existe mas não está no mapa · rota /impostos-v2 existe mas não está no mapa · rota /inicio existe mas não está no mapa · rota /inicio-ref11 existe mas não está no mapa · rota /inicio-ref12 existe mas não está no mapa · rota /inicio-ref5 existe mas não está no mapa · rota /inicio-ref6 existe mas não está no mapa · rota /inicio-ref7 existe mas não está no mapa · rota /inicio-ref9 existe mas não está no mapa · rota /mais/certificado existe mas não está no mapa · rota /mais/colaborador existe mas não está no mapa · rota /mais/declaracoes existe mas não está no mapa · rota /mais/documentos existe mas não está no mapa · rota /mais/em-dia existe mas não está no mapa · rota /mais/empresa existe mas não está no mapa · rota /mais existe mas não está no mapa · rota /mais/plano existe mas não está no mapa · rota /mais/relatorios existe mas não está no mapa · rota /mais/servicos existe mas não está no mapa · rota /mais/socios existe mas não está no mapa · rota /mais-completa existe mas não está no mapa · rota /mais-v1 existe mas não está no mapa · rota /notas/detalhe existe mas não está no mapa · rota /notas existe mas não está no mapa · rota /obrigacoes existe mas não está no mapa · rota /perfil existe mas não está no mapa · rota /pro-labore existe mas não está no mapa · rota /conta-v2 existe mas não está no mapa · rota /conta-v2-robusto existe mas não está no mapa · rota /plano-premium existe mas não está no mapa · rota /plano-v2 existe mas não está no mapa · rota /plano-v2-robusto existe mas não está no mapa · rota /apresentacao existe mas não está no mapa · rota /mapa existe mas não está no mapa · rota /mockup-home existe mas não está no mapa · rota /mockup-inicio existe mas não está no mapa · rota /mockup-v2 existe mas não está no mapa

| # | Tela | Dados coletados nesta etapa | Construída | Validado | Falta validar |
|---|---|---|:--:|:--:|---|
| 1 | E1 · Splash | — | ✅ | ⚪ | — |
| 2 | E2.1 · Welcome · (1/3 · Léo vigia, contador é gente) | — | ✅ | ⚪ | — |
| 3 | E2.2 · Welcome · (2/3 · Aquece o fork) | — | ✅ | ⚪ | — |
| 4 | E2.3 · Welcome · (3/3 · Sem susto no boleto) | — | ✅ | ⚪ | — |
| 5 | E3 · Fork · 3 rotas | — | ✅ | 🟢 | 3 rotas CONFIRMADAS 28/07 (reunião Rua Satélite 9): abrir · migrar · já sou cliente. |
| 6 | E3.1 · Login / portal | — | ✅ | ⚪ | Rota feliz |
| 7 | E3.3 · Seus dados · (nome · e-mail · telefone) | Nome completo · e-mail · telefone · consentimento de privacidade (implícito, ao continuar) | ✅ | 🟡 | 🆕 27/08 — captura de lead, logo depois do fork. NÃO cria conta (isso continua no E6): só identifica quem está do outro lado, porque antes disso o funil inteiro era anônimo até o E6. Cruzamento com o funil da Contabilizei (que pede os mesmos 3 campos na 1ª tela) motivou a mudança. 🟡 LGPD: carrega consentimento mínimo em 1 linha com link, sem checkbox — o aceite contratual segue no E8. 🔴 RF-01: os dados não viajam por querystring (dado pessoal em URL é vazamento), então o E6 hoje exibe o mock `CLIENTE`; quando existir estado real, vem de lá |
| 8 | E3.2 · MEI × ME · (variante Abrir) | Regime autodeclarado (MEI ou ME) | ✅ | 🟢 | 🔄 27/08: agora vem DEPOIS do E3.3 (dados) e ANTES do E3.4 (endereço + categoria). MEI não tem o limite geográfico do MLP, mas PASSA pelo E3.4 mesmo assim — o gate de BH não vale pra ele, o de CATEGORIA vale (é ele que autoriza o CNAE a ir pra pós-pagamento, então ninguém pula). 🔴 27/08: card ME · Lucro Presumido REMOVIDO (decisão do Pedro; captação de LP no abrir fica parqueada). 🔴 risco não resolvido: se disser MEI aqui mas depois aparecer 2+ sócios (incompatível com MEI), não há correção automática |
| 9 | E3.2 · MEI × ME · (variante Migrar) | Regime autodeclarado (MEI ou ME) | ✅ | 🟢 | Mesma tela (`MeiOuMeView`), `contexto="migrar"`: copy vira autodeclaração ("sua empresa hoje é MEI ou ME?"), não critério de escolha. MEI pula E4 inteiro, vai direto pro M1 (`/migrar/cnpj?cenario=mei`) |
| 10 | E3.4 · Endereço + categoria · (os 2 gates) | Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês) OU cidade pra fila de espera · categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza) OU atividade regulamentada (≤12 opções) pra quem não se encontrou | ✅ | 🟡 | 🆕 27/08 — reúne os DOIS gates do produto antes do dinheiro. (1) ENDEREÇO: substitui o E4 (gate de cidade, REMOVIDO), que perguntava 'é em BH?' e acreditava no clique — aqui o CEP valida de verdade (`ehCepBh`, faixa 30000-000 a 31999-999, 🟡 não ratificada em fonte primária). Herdou também a escolha 'próprio × fiscal' que morava no E5F. (2) CATEGORIA: assume o papel de gate de elegibilidade que era do veredito de CNAE — como a lista só oferece o que a gente atende, escolher já É passar pelo filtro, e é isso que autorizou o CNAE a ir pra depois do pagamento. MEI passa por aqui também (sem exigir BH): o gate geográfico não vale pra ele, mas o de categoria vale. 🔒 29/08 (decisão do Pedro) — os 2 gates deixaram de EXPULSAR: fora de BH e atividade fora da lista resolvem AGORA na própria tela (endereço fiscal ou fila da cidade/atividade, com CTA 'Me inscrever e garantir condição'). O handle 'fora' e as saídas E4.1/E5.1 dedicadas ao caminho abrir foram removidas — `/saida/fora-bh` foi deletada (zero uso restante); `/veredito/waitlist` (E5.1) segue viva só pelo Migrar |
| 11 | E4.2 · Lê o cartão CNPJ | CNPJ (consulta) · confirmação dos dados do cartão | ✅ | 🟢 | Autofill por CNPJ via InfoSimples (cadastro, R$0,20/consulta — API PAGA, não pública); sem entrevista de atividade — o CNAE já existe. 🔴 05/08: checagem de regime removida daqui (a API não confirma Simples×Presumido×MEI, ver infosimples-funcionalidades.md) — regime já vem autodeclarado da E3.2. Só confirma situação cadastral (ativa/inapta) |
| 12 | Saída · CNPJ inapto · ou suspenso | — (saída, fora do caminho até a migração) | ✅ | 🟢 | Situação cadastral ≠ ativa: aqui a Receita nem reconhece a empresa como ativa, regularização vem ANTES de qualquer migração. 🔴 06/08: diferente do que era 'auditoria de passivo' (E9.2, empresa ATIVA com dívida) — essa tela foi retirada do flow |
| 13 | Saída · Presumido · fora de escopo | — (saída, fora do caminho até a migração) | ✅ | 🟢 | Lucro Presumido segue fora do escopo (decisão explícita 04/08, sem pesquisa fiscal dedicada ainda). Autodeclarado na E3.2, não confirmado por API |
| 14 | E4.3 · Diagnóstico · ("tem certificado?") | Resposta sim/não (tem certificado digital) | ✅ | 🟡 | 🔴 04/08 (3ª rodada): o diagnóstico de Fator R pra ME foi CORTADO — a única API pré-pagamento é a cadastral, não traz faturamento/folha (só via procuração, pós-pagamento). 🔴 05/08: pergunta virou 'tem certificado?' (MEI: decide se roda TTRT). 🔴 06/08 (achado do Pedro): ME TAMBÉM passa aqui agora (antes ia do E4.2 direto pro E4.4) — certificado é independente da TTRT pra ME (as duas rodam em paralelo), mas não tinha pergunta nenhuma no caminho ME. 🟡 fila-Mauro: se sem-certificado-ME carrega custo/fidelidade extra é decisão de preço não tomada |
| 15 | E4.4 · Plano | — | ✅ | 🟡 | ME: mesma mensalidade do caminho abrir, sem taxa de governo (empresa já existe). 🆕 04/08: MEI tem plano PRÓPRIO — R$49,90/mês, fidelidade 12 meses, certificado incluso, escopo limitado (emitir NF + 1 colaborador) — não é o plano ME com desconto |
| 16 | E4.5 · Contrato · + promessa de devolução | Aceite do contrato (com a cláusula de devolução) | ✅ | 🟢 | 🔴 DECISÃO TRAVADA 30/07: cobra ANTES do TTRT, com contrapartida OBRIGATÓRIA no contrato ('se a transferência não sair por motivo fora do seu controle, devolve tudo'). Se essa linha sair do contrato, a decisão reabre (Mauro/Larissa redigem) |
| 17 | E9.2 · Seu contador atual | Nome do contador/escritório atual · e-mail · telefone (pré-preenchidos quando o cartão CNPJ trouxer, opcionais) · CRC (OBRIGATÓRIO) | ✅ | 🟢 | 🔒 24/08 (reunião Leonan 19/08, CONFLITO RESOLVIDO): CRC agora é OBRIGATÓRIO, trava o Continuar — 'eu preciso do número do CRC de qualquer forma' (Leonan). Antes o doc dizia 'opcional', estava errado/desatualizado. Nome/e-mail/telefone continuam opcionais — só o CRC não tem contorno |
| 18 | E9.2b · Dados que o · cartão CNPJ não traz | CPF · RG + órgão emissor · estado civil | ✅ | 🟢 | Reusa os mesmos campos do C1 (abertura) — CPF/RG/órgão/estado civil, digitação manual. 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui foi REMOVIDO do MVP (custo/velocidade) |
| 19 | E9.2c · Dados dos sócios | Nome completo + % de participação de cada sócio extra (CPF implícito, quantidade fixa) | ✅ | 🟢 | MESMA tela do C3 (`SociosView`), reusada com `contexto="migrar"` — só a copy muda. Não existe triagem prévia perguntando quantos sócios no caminho migrar (diferente do E5T no abrir), então a tela se sustenta sozinha |
| 20 | E9.2d · GOV.BR + procuração | Código de validação de 6 dígitos (janela 10min) | ✅ | 🟢 | Reusa `CodigoGovView` (mesmo componente do A4, caminho abrir) com `soProcuracao` — não existe protocolo de registro pra assinar (empresa já existe), só a procuração. Mesma janela de 10min/3 tentativas/escala pra atendente |
| 21 | E9.3 · Iniciando transferência | — | ✅ | 🟢 | 🔴 A PAUSA MAIS PERIGOSA DO PRODUTO: quem libera é o CONTADOR ANTIGO (valida no CRC-MG). 🆕 24/08 (reunião Leonan): copy do status trocou pra 'Iniciando o processo de transferência' + 'Estamos entrando em contato para encerrar o vínculo com a contabilidade antiga' — diferente do status de constituição ('empresa foi constituída'), antes os dois diziam a mesma coisa. Nº da resolução CFC / Evento 232 Redesim NÃO ratificados em fonte primária (🟡 pendência) |
| 22 | ✅ E9.4 · Migração concluída | — | ✅ | ⚪ | Segue pro mesmo handoff do caminho abrir → A5 (home dia-1), autoridade #2 (portal-data.mjs) |
| 23 | Triagem · quantos sócios? | Quantidade de sócios (1 / 2 / 3 / 4) · é a 1ª empresa que abre? (opcional) · sócio que não se encaixa no card informativo (opcional, texto livre via 'Falar com o time') | ✅ | 🟢 | 🔒 29/08 — só 1 pergunta de verdade agora (quantidade, até 4). CPF-only/domicílio Brasil/assinatura GOV.BR viraram card informativo com link de escape ('Falar com o time', resolve inline, sem navegar pra fora). 🆕 26/08: coorte ('é a 1ª empresa que você abre?') pousou aqui de vez — 3ª realocação (Veredito → Faixa → aqui), dado puro de log/marketing, opcional |
| 24 | Faixa de faturamento | Faixa de faturamento mensal (ou valor exato, se souber) | ✅ | ⚪ | Faixas sem âncora fiscal. 🔴 27/08: a escolha de endereço (próprio × fiscal Legalizai) SAIU daqui — morou nesta tela entre 26/08 e 27/08 e foi pro E3.4, junto do gate de cidade, que é a pergunta de que ela sempre foi parte (faturamento não decide onde a empresa fica). O valor continua somando no E7 pelo mesmo `?endereco=fiscal`. Fonte: `components/gate-telas.tsx` (`FaixaView`) |
| 25 | E5.1 · 🟡 Waitlist | Nome + contato · CNAE pretendido (✅ campo construído 28/07) | ✅ | 🟢 | ✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar). 🔒 29/08: no caminho ABRIR a E3.4 resolve inline agora (não navega mais pra cá) — esta tela segue viva só pelo Migrar (E4.2 → 🟡 regulada) |
| 26 | E5.2 · 🔴 Contato especial · (atendido pelo Mauro) | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | ✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Falta só o split real no mapear() do E5 (hoje é mock estático por página). |
| 27 | E5.3 · 🔴 Fora de escopo · (descarta) | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | mapear() do E5 ainda não decide entre E5.2/E5.3 de verdade (mock estático) — falta o split real na IA/lista de CNAEs |
| 28 | E6 · Criar conta | Nome · CPF · telefone · e-mail · senha · CEP · número · complemento · coorte (opcional) · código de verificação (mock) | ✅ | 🟢 | 🔄 28/08 (pedido do Pedro) — reverteu o encolhimento de 27/08: a tela volta a coletar o form INTEIRO aqui mesmo (nome/CPF/telefone/e-mail/senha/CEP/número/complemento), sem recap read-only, `leadJaCaptado` removido do código. Form começa em branco. Provider de validação CPF/situação real (Pedro). 🔴 RF-01: sem estado real entre telas, hoje é só estado local do componente. 🐛 29/08 — vazamento de layout no campo Complemento corrigido (`min-w-0` faltava no flex), placeholder simplificado pra só "Complemento". |
| 29 | E7 · A conta da abertura | — | ✅ | 🟡 | Preço ~R$195 FAKE (Mauro+custo); DAE R$268,51×R$288 em disputa; certificado A1 (Mauro). ✅ RESOLVIDO 26/08 (reunião Rua Satélite 36, item 2): a antiga 'pendência real de spec' ('conta total não é total', endereço fiscal só aparecia no C4 pós-pagamento) foi corrigida — a mensalidade mostrada aqui já soma o endereço fiscal quando escolhido lá no E5F, com 1 linha de explicação. 🆕 28/08 — REDESIGN 'premium' (pedido do Pedro, validado em preview isolado `/plano-premium` antes de aplicar): título bicolor, card-herói com profundidade real (raio+sombra), lista de inclusos como cartões-linha, CTA como barra flutuante escura. Nenhum conteúdo/ramo cortado (MEI×ME, colaboradores, citação legal, endereço fiscal seguem intactos) — só a casca mudou. `PlanoOferta` em `wizard-dinheiro.tsx` |
| 30 | E8 · Aceite contrato · reversível, CDC 49 | Aceite do contrato de serviço (checkbox) | ✅ | 🟡 | Redação jurídica do contrato (Mauro/Larissa); rachadura T18 |
| 31 | E9 · Pagamento · (variante Abrir) | CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto) | ✅ | 🟡 | Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro) |
| 32 | E9 · Pagamento · (variante Migrar) | CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto) | ✅ | 🟡 | Mesmo componente, `?fluxo=migrar`: total não soma taxa de governo, aviso fala de migração (não abertura). CPF/métodos/idempotência idênticos ao componente base |
| 33 | E9.1 · Aguardando boleto · dossiê já liberado | — | ✅ | ⚪ | Dunning revisado |
| 34 | C0 · Sua atividade · (descreve + pills) | Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine) · categoria já vem pré-selecionada do E3.4 | ✅ | 🟡 | 🔄 27/08 — era o E5A (`/gate`), antes do pagamento. Copy reenquadrada (`jaCliente`): não promete mais 'validar minha atividade' (a validação já aconteceu no E3.4), agora é 'achar meu CNAE'. Recebe a categoria pré-selecionada via `?cat=`. Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev |
| 35 | C0.2 · CNAE encontrado | — | ✅ | 🟡 | 🔄 27/08 — era o E5V. 🔴 A MUDANÇA ESTRUTURAL: aqui o veredito NÃO pode mais dar 🔴/🟡 no caminho abrir (a categoria do E3.4 já garantiu que a atividade é atendida). O split de 3 vias que estava pendente desde 28/07 deixa de ser necessário AQUI e passa a ser problema do E3.4 (lista de categorias) — o `mapear()` mock ainda tem os 4 desfechos porque o Migrar usa os mesmos |
| 36 | 🟢 CNAE confirmado | — | ✅ | 🟡 | 🔄 27/08 — era o E5VA. Depende da lista CNAE |
| 37 | C1 · Seus dados | CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta) · RG + órgão emissor (digitação manual) · data de nascimento · nome da mãe · estado civil (+ regime de bens se casado) · confirma se mora fora do Brasil | ✅ | 🟢 | ✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do E6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do E6); regime de bens (casado). 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui (reunião Leonan, mesmo dia) foi REMOVIDO do MVP (custo/velocidade de leitura de imagem). 🆕 26/08 (achado do cruzamento com pesquisa JUCEMG/DBE, ver `gap-analise-dados-abertura-vs-pesquisa-gemini.md`): data de nascimento e nome da mãe ganharam campo — eram exigência de DBE ausente do dossiê |
| 38 | C2 · Vínculo INSS | Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ) | ✅ | 🟢 | INSS 11% direto + teto folga = consolidado fiscal fechado |
| 39 | C3 · Sócios? | Confirma se terá mais sócios (sem reperguntar quantidade/tipo) · se houver, nome completo + % de participação de cada sócio extra (quantidade fixa, CPF implícito) | ✅ | 🟢 | Re-pergunta o E5T (carry-forward pendente); limite subiu de 2 pra 4 (24/08). 🔒 24/08 (pedido do Pedro): não pergunta MAIS nada — quantidade e tipo (CPF) já vêm travados da triagem (E5T). Quando TEM_SOCIO, a MESMA tela já mostra o formulário de completar os sócios extras (sem passo/rota separada) |
| 40 | C4 · Dados da empresa | CEP (autofill) + número + complemento · índice cadastral IPTU (obrigatório, só se próprio) · tipo de endereço · residência de sócio (trava duplicidade) · capital social | ✅ | 🟢 | ✅ 28/07: IPTU obrigatório travado. 🆕 24/08 (reunião Leonan): alerta de IPTU pode subir quando é residência de sócio; trava duplicidade (só 1 sócio por endereço); chips de capital social simbólico (R$1k/5k/10k). 🔄 26/08 (reunião Rua Satélite 36, item 2): a escolha 'próprio × fiscal Legalizai' e o aviso de cobrança recorrente SAÍRAM daqui — moraram no E5F desde 24/08 até virarem o gate oficial de decisão, e o valor já vem confirmado do E7. Esta tela agora só CONFIRMA a escolha (card read-only, mesma doutrina do C3) e coleta os detalhes de endereço (CEP/IPTU/tipo) quando for próprio |
| 41 | C5 · CNAE secundários | CNAEs secundários (seleção múltipla + busca, opcional, até 15) | ✅ | 🟡 | 🆕 24/08 (reunião Leonan): ganhou busca livre (restrita ao que a gente atende, pedido original da Jéssica 19/07) além das 4 sugestões curadas mesmo-imposto; até 15 no total; secundária que muda enquadramento mostra aviso e troca CTA por 'Falar com atendente' em vez de bloquear silenciosamente. 🔄 28/08 (pedido do Pedro) — MUDOU DE LUGAR: vinha depois de C4 (dados da empresa), agora vem logo depois de C0.3 (CNAE principal confirmado) — sequência mais natural de quem acabou de escolher o CNAE. `lib/passos.ts` reflete a ordem nova ('CNAE secundário' é o 4º passo, não mais o 5º) |
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
| 52 | M-T · Impedimentos · (no lugar da triagem) | Já tem outra empresa? (sim/não) · é servidor federal? (sim/não) · recebe benefício? (sim/não) + ciência explícita se sim | ✅ | 🟢 | 🆕 28/08 — substitui o E5T no ramo MEI (MEI é unipessoal por definição, art. 966 CC: as perguntas de sócio não existem pra ele). São 3 impedimentos que o PRÓPRIO GOVERNO checa e bloqueia: (1) ser sócio/titular/admin de outra PJ — a RFB cruza o CPF, LC 123 art. 18-A; (2) servidor público federal na ativa — Lei 8.112/90 art. 117; (3) receber aposentadoria por invalidez / salário-maternidade / seguro-desemprego — este NÃO bloqueia, mas a formalização cancela o benefício de forma irreversível, então vira escolha informada com confirmação explícita. Fica ANTES do pagamento pelo mesmo motivo da triagem do ME: não cobramos de quem já sabe que não pode. Componente: `components/mei-telas.tsx` (`ImpedimentoView`) |
| 53 | M-T.1 · 🔴 Já tem CNPJ | Nome + contato | ✅ | 🟢 | Saída de bloqueio do governo, não do produto. Oferece os 2 caminhos reais (baixar a antiga OU abrir como ME) em vez de waitlist — a Legalizai atende essa pessoa hoje, só não como MEI. Conteúdo em `lib/dados-saida.tsx` |
| 54 | M-T.2 · 🔴 Servidor federal | Nome + contato | ✅ | 🟢 | Vedação do art. 117 da Lei 8.112/90, só pra FEDERAL na ativa. A saída não fecha a porta pra estadual/municipal de propósito: lá a regra vem do estatuto de cada ente e em muitos casos é permitido. Conteúdo em `lib/dados-saida.tsx` |
| 55 | M-O · Ocupação · (Anexo XI + limite interno) | Ocupação principal (1 da lista do Anexo XI) · até 15 ocupações secundárias | ✅ | 🟢 | 🆕 28/08 — a C0 do ramo MEI, 1ª tela do dossiê. NÃO é o C0 adaptado: o Portal do Empreendedor não aceita CNAE livre, só OCUPAÇÃO de lista fechada (Anexo XI, Res. CGSN 140/2018), então não há 'descrever com suas palavras'. 🎯 Carrega o **limite interno** (Solução de Consulta Cosit nº 27/2021): a ocupação é mais estrita que o CNAE que ela mapeia — quem escolhe 'Reparador(a) de bicicleta' não pode consertar moto, e descobre numa fiscalização. É o erro que só contador pega, e é parte do que vendemos. Secundárias (até 15) também saem daqui, por isso o ramo pula o C5. Dados de `lib/mei.ts`, derivados dos 51 CNAEs certeza que aceitam MEI |
| 56 | A3.2' · Certificado · (operar, não abrir) | Certificado digital (upload .pfx/.p12 + senha) OU aceite de contato da certificadora parceira | ✅ | 🟢 | 🆕 28/08 (decisão do Pedro) — o MEI passa pelo MESMO gate de certificado do ME, com 2 diferenças: (1) o MOTIVO — no ME o certificado destrava a procuração da assinatura; no MEI não existe assinatura nem procuração de abertura (a abertura DISPENSA certificado, gov.br Prata/Ouro supre), então o que ele destrava é a OPERAÇÃO: puxar guia, FGTS Digital, agir sem pedir senha do cliente toda vez; (2) QUEM PAGA — no ME vem incluso (contrapartida da fidelidade, ADR 04/08); no MEI **não vem**, o cliente providencia. Fica ANTES da A5 a pedido do Pedro: 'tem que ser efetivado antes da pessoa cair pra dentro do app com as funcionalidades, da mesma forma do ME'. 🔴 Consequência aberta: a fidelidade de 12 meses do MEI perdeu a contrapartida escrita — precisa de justificativa nova antes de virar cláusula (Pedro/Mauro) |
| 57 | M-S · Próximos passos · (a "cola") | Confirmação de que a conta gov.br é Prata/Ouro · (devolve o CNPJ gerado) | ✅ | 🟢 | 🆕 28/08 — a tela que FECHA o ramo, e existe por razão jurídica, não de UX: como não dá pra registrar pelo cliente, a entrega é o passo a passo com os valores DELE prontos, na ordem dos campos do Portal. Inclui a checagem do nível da conta gov.br (Prata/Ouro obrigatório) e o link pro Portal. ✍️ REGRA DE COPY DURA: nunca dizer 'a gente abre pra você' neste ramo. 🔴 Falta: definir se o 'copiar tudo' vira PDF/WhatsApp; e o M-S é a tela mais cara de evoluir se um dia a automação for possível. Componente: `components/mei-telas.tsx` (`ProximosPassosView`) |
| 58 | ✅ A5 · Home dia-1 · (ativação) | — | ✅ | 🟢 | 🔓 SWAP validado 30/07 (confirmado no código: assinatura empurra direto pra cá). 🆕 24/08 (reunião Leonan): trilha agora mostra 3 status explícitos — Procuração (feito, instantâneo com o código) → Validação do certificado digital (agora, linka pra /mais/certificado upload+oferta) → Acesso completo. 🔄 26/08 (item 7): certificado deixou de ser 'agora' e virou 'feito' — já foi validado antes da assinatura (A3.2). Quem vira 'agora' é 'Conferir os dados da empresa' (`/mais/empresa`). `/mais/certificado` segue existindo, só que agora é pra RENOVAR/trocar, não pra validar a 1ª vez. Sem confete nem selo coral no hero. Handoff pro flow Portal (letra P) → autoridade portal-data.mjs |
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
- **v47** · 2026-08-29 · falta-validar em E6 · dados-coletados em E6
- **v46** · 2026-08-29 · renomeou E2_1 "E2.1 · Welcome (1/3 · Contador de verdade)"→"E2.1 · Welcome (1/3 · Léo vigia, contador é gente)"; E2_2 "E2.2 · Welcome (2/3 · Parte chata)"→"E2.2 · Welcome (2/3 · Aquece o fork)"
- **v45** · 2026-08-29 · -nós E4_1,E5_4,E5_5,E5_6 · renomeou E5T "Triagem sócios? CPF/CNPJ? exterior?"→"Triagem quantos sócios?" · falta-validar em E3_4,E5T,E5_1 · dados-coletados em E3_4,E5T · -conexões E3_4→E4_1,E3_4→E5_1,E5T→E5_4,E5T→E5_5,E5T→E5_6
- **v44** · 2026-08-28 · falta-validar em C5 · +conexões C0_3→C5,C5→C1,C4→C6 · -conexões C0_3→C1,C4→C5,C5→C6
- **v43** · 2026-08-28 · falta-validar em E7
- **v42** · 2026-08-28 · +nós M_CERT · +conexões M_S→M_CERT,M_CERT→A5 · -conexões M_S→A5
- **v41** · 2026-08-28 · +nós M_T,M_T_1,M_T_2,M_O,M_S · +conexões E3_4→M_T,M_T→E5F,M_T→M_T_1,M_T→M_T_2,E9→M_O,M_O→C1,A3→M_S,M_S→A5
- **v40** · 2026-08-28 · dados-coletados em E3_4
<!-- FLOW:VERSOES:FIM -->

## Links
[[mapa-ramificacoes-flow]] (lógica A/B/C) · [[mapa-telas-mobile]] (inventário) · [[design-system]] (arquétipos A1–A10) · [[legalize-telas-padrao-layout]] · [[fila-validacao-humana]] · [[HOME]]
