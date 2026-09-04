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
    C0_0["C0.0 · Sua atividade<br/>(chegada, antes de descrever)"]
    C0["C0 · Sua atividade<br/>(descreve + pills)"]
    C5_S["C5.1 · Splash<br/>'já sabemos o que você faz'"]
  end
  E1["E1 · Splash"]
  E2_1["E2.1 · Welcome<br/>(1/3 · Léo vigia, contador é gente)"]
  E2_2["E2.2 · Welcome<br/>(2/3 · Aquece o fork)"]
  E2_3["E2.3 · Welcome<br/>(3/3 · Sem susto no boleto)"]
  E3{"E3 · Fork<br/>4 rotas"}
  E3_1(["E3.1 · Login / portal"]):::feliz
  E3_3["E3.3 · Seus dados<br/>(nome · e-mail · telefone)"]
  E3_2{"E3.2 · MEI × ME<br/>(variante Abrir)"}
  E3_2_M{"E3.2 · MEI × ME<br/>(variante Migrar)"}
  E3_4{"E3.4 · Endereço + categoria<br/>(os 2 gates)"}
  E3_4_1{"E3.4.1 · CEP fora de BH<br/>(gate resolvido inline)"}:::branch
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
  E5T_1(["E5T.1 · Sócio não se encaixa<br/>(gate de saída inline)"]):::inline
  E5F_S["E5F.1 · Splash<br/>'conseguimos te atender'"]
  E5_1["E5.1 · 🟡 Waitlist"]:::saida
  E5_2["E5.2 · 🔴 Contato especial<br/>(atendido pelo Mauro)"]:::saida
  E5_3["E5.3 · 🔴 Fora de escopo<br/>(descarta)"]:::saida
  E6["E6 · Criar conta"]
  E6_1["E6.1 · Confirmar código"]
  E7["E7 · A conta da abertura"]
  E7_1["E7.1 · A conta da abertura<br/>(variante endereço fiscal)"]:::branch
  E9{"E9 · Pagamento + contrato<br/>(variante Abrir)"}
  E9_M{"E9 · Pagamento<br/>(variante Migrar)"}
  E9_S["E9.S · Splash<br/>'pagamento confirmado'"]
  E9_SB["E9.SB · Splash<br/>'boleto gerado'"]
  E9_SR["E9.SR · Splash<br/>pagamento recusado"]
  E9_R["E9.R · Pagamento<br/>(nova tentativa)"]
  E9_1["E9.1 · Aguardando boleto<br/>dossiê já liberado"]:::espera
  E9_1P["E9.1P · Status<br/>(pago, via instantâneo)"]:::espera
  C5["C5 · CNAE secundários"]
  C1["C1 · Seus dados"]
  C2["C2 · Vínculo INSS"]
  C3{"C3 · Sócios?"}
  C4["C4 · Dados da empresa"]
  C6(["'C6 · Natureza jurídica'<br/>🗑️ REMOVIDO 31/08"]):::todo
  C7["C7 · Nome / razão social"]
  C0_1["C0.1 · Retomar<br/>(porta de CPF)"]:::espera
  C0_3["C0.3 · Confirmar código<br/>(retomada)"]:::espera
  C7_2["C7′ · Sugerir mais<br/>3 nomes (2ª rodada)"]
  A1["A1 · Revisar + autorizar"]
  A2["A2 · Ponto sem volta<br/>(antes da viabilidade)"]
  A3["A3 · Status<br/>(fase Junta)"]
  A3_M["A3 · Status<br/>(variante MEI)"]:::branch
  A3_1["A3.1 · Órgão recusa<br/>'precisa de você'"]
  A3_2["'A3.2 · Certificado digital' 🗑️ REMOVIDO 01/09<br/>(segue só no MEI/migrar)"]:::todo
  A3_P["A3.P · Pagar a guia<br/>da Junta (DAE)"]
  A3_SR["A3.SR · Splash<br/>guia recusada"]
  A3_R["A3.R · Guia<br/>(nova tentativa)"]
  A3_PS["A3.PS · Splash<br/>guia paga"]
  A3_PSB["A3.PSB · Splash<br/>boleto da guia"]
  A3_GP["A3′ · Status<br/>(guia paga)"]
  A3_GB["A3″ · Status<br/>(guia no boleto,<br/>aguardando compensar)"]
  A3_V["A3‴ · Status<br/>(analisando viabilidade,<br/>2ª rodada de nomes)"]
  A4["A4 · Assinatura dos sócios"]
  A4G{"GOV.BR nível<br/>bronze→upgrade"}:::inline
  REMOVIDO_N24(["'Empresa ativa'<br/>🗑️ REMOVIDO 30/07"]):::todo
  M_T{"M-T · Impedimentos<br/>(no lugar da triagem)"}:::branch
  M_T_1["M-T.1 · 🔴 Já tem CNPJ"]:::saida
  M_T_2["M-T.2 · 🔴 Servidor federal"]:::saida
  M_O["M-O · Ocupação<br/>(Anexo XI + limite interno)"]:::branch
  M_CERT["A3.2' · Certificado<br/>(operar, não abrir)"]:::branch
  M_S["M-S · Próximos passos<br/>(a "cola")"]:::branch
  CONF["🛠️ Conferência do dev<br/>(campos por origem)"]:::inline
  A5(["✅ A5 · Home dia-1<br/>(ativação)"]):::feliz

  E1 --> E2_1
  E2_1 --> E2_2
  E2_2 --> E2_3
  E2_3 --> E3
  E3 -->|"já sou cliente"| E3_1
  E3 -->|"quero abrir"| E3_3
  E3 -->|"já tenho empresa"| E3_3
  E3 -.->|"voltar de onde parei"| C0_1
  E3_3 -->|"abrir"| E3_2
  E3_3 -->|"migrar"| E3_2_M
  E3_2 -->|"ME, abrir"| E3_4
  E3_2 -.->|"MEI, abrir (sem gate de BH)"| E3_4
  E3_2_M -->|"ME, migrar"| E4_2
  E3_2_M -.->|"MEI, migrar"| E4_2
  E3_4 -->|"ME · endereço BH + categoria ok"| E5T
  E3_4 -.->|"MEI · categoria com ocupação"| M_T
  E3_4 -.->|"CEP fora de BH"| E3_4_1
  E3_4_1 -.->|"resolvido (fiscal ou fila)"| E5T
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
  E5T -.->|"sócio não se encaixa"| E5T_1
  E5F --> E5F_S
  E5F_S -.-> E6
  M_T -.->|"sem impedimento"| E5F
  M_T -->|"já tem outra empresa"| M_T_1
  M_T -->|"servidor federal"| M_T_2
  E6 --> E6_1
  E6_1 --> E7
  E6_1 -.->|"escolheu endereço fiscal no E3.4"| E7_1
  E7 --> E9
  E7_1 -.-> E9
  E9 -->|"ME · cartão/Pix"| E9_S
  E9 -.->|"recusado"| E9_SR
  E9_SR -.-> E9_R
  E9_R -.->|"passou"| E9_S
  E9_S -.-> E9_1P
  E9_1P -->|"Continuar preenchendo"| C0_0
  E9 -.->|"MEI · cartão"| M_O
  M_O -.->|"MEI reusa o C1"| C1
  E9 -->|"ME · boleto"| E9_SB
  E9_SB -.-> E9_1
  E9_1 -->|"Continuar (após compensar)"| C0_0
  C0_0 -->|"descreveu o que faz"| C0
  C0 -->|"escolheu a atividade"| C5
  C5 --> C5_S
  C5_S --> C1
  C1 --> C2
  C2 --> C3
  C3 -->|"endereço próprio"| C4
  C3 -.->|"endereço fiscal (pula C4)"| C7
  C4 --> C7
  C7 --> A1
  A1 -.->|"ME"| A2
  A2 -->|"inicia viabilidade"| A3
  A1 -.-> CONF
  A1 -.->|"MEI"| A3_M
  A3 -.->|"nome recusado"| A3_1
  A3_1 -.->|"sugerir mais 3"| C7_2
  C7_2 -.->|"manda pra viabilidade"| A3_V
  A3_V -.->|"nome aprovado"| A3
  A3_V -.->|"recusou de novo"| A3_1
  A3_1 -.-> A3
  A3 -.->|"ME · pagar guia"| A3_P
  A3_P -.->|"recusado"| A3_SR
  A3_SR -.-> A3_R
  A3_R -.->|"passou"| A3_PS
  A3_P -.->|"cartão/Pix"| A3_PS
  A3_P -.->|"boleto"| A3_PSB
  A3_PS -.->|"guia paga"| A3_GP
  A3_PSB -.->|"aguardando compensar"| A3_GB
  A3_GB -.->|"banco confirmou"| A3_GP
  A3_GP -.->|"assinatura liberada"| A4
  A3 -.->|"ME · DAE paga"| A4
  A3_M -.->|"MEI · time conferiu"| M_S
  M_S -.->|"voltou com o CNPJ"| M_CERT
  M_CERT -->|"certificado resolvido"| A5
  A4 -.-> A4G
  A4G -.-> A5
  C0_1 -.->|"CPF confirmado"| C0_3
  C0_3 -.->|"código confirmado"| E9_1P

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
| 5 | E3 · Fork · 4 rotas | — | ✅ | 🟢 | 4 rotas: abrir · migrar · já sou cliente · voltar de onde parei (🆕 30/08, fecha o C0_1 órfão). |
| 6 | E3.1 · Login / portal | — | ✅ | ⚪ | Rota feliz |
| 7 | E3.3 · Seus dados · (nome · e-mail · telefone) | Nome completo · e-mail · telefone · consentimento de privacidade (implícito, ao continuar) | ✅ | 🟡 | 🆕 27/08 — captura de lead, logo depois do fork. NÃO cria conta (isso continua no E6): só identifica quem está do outro lado, porque antes disso o funil inteiro era anônimo até o E6. Cruzamento com o funil da Contabilizei (que pede os mesmos 3 campos na 1ª tela) motivou a mudança. 🟡 LGPD: carrega consentimento mínimo em 1 linha com link, sem checkbox — o aceite contratual segue no E8. 🔴 RF-01: os dados não viajam por querystring (dado pessoal em URL é vazamento), então o E6 hoje exibe o mock `CLIENTE`; quando existir estado real, vem de lá |
| 8 | E3.2 · MEI × ME · (variante Abrir) | Regime autodeclarado (MEI ou ME) | ✅ | 🟢 | 🔄 27/08: agora vem DEPOIS do E3.3 (dados) e ANTES do E3.4 (endereço + categoria). MEI não tem o limite geográfico do MLP, mas PASSA pelo E3.4 mesmo assim — o gate de BH não vale pra ele, o de CATEGORIA vale (é ele que autoriza o CNAE a ir pra pós-pagamento, então ninguém pula). 🔴 27/08: card ME · Lucro Presumido REMOVIDO (decisão do Pedro; captação de LP no abrir fica parqueada). 🔴 risco não resolvido: se disser MEI aqui mas depois aparecer 2+ sócios (incompatível com MEI), não há correção automática |
| 9 | E3.2 · MEI × ME · (variante Migrar) | Regime autodeclarado (MEI ou ME) | ✅ | 🟢 | Mesma tela (`MeiOuMeView`), `contexto="migrar"`: copy vira autodeclaração ("sua empresa hoje é MEI ou ME?"), não critério de escolha. MEI pula E4 inteiro, vai direto pro M1 (`/migrar/cnpj?cenario=mei`) |
| 10 | E3.4 · Endereço + categoria · (os 2 gates) | Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês) OU cidade pra fila de espera · categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza) OU atividade regulamentada (≤12 opções) pra quem não se encontrou | ✅ | 🟡 | 🆕 27/08 — reúne os DOIS gates do produto antes do dinheiro. (1) ENDEREÇO: substitui o E4 (gate de cidade, REMOVIDO), que perguntava 'é em BH?' e acreditava no clique — aqui o CEP valida de verdade (`ehCepBh`, faixa 30000-000 a 31999-999, 🟡 não ratificada em fonte primária). Herdou também a escolha 'próprio × fiscal' que morava no E5F. (2) CATEGORIA: assume o papel de gate de elegibilidade que era do veredito de CNAE — como a lista só oferece o que a gente atende, escolher já É passar pelo filtro, e é isso que autorizou o CNAE a ir pra depois do pagamento. MEI passa por aqui também (sem exigir BH): o gate geográfico não vale pra ele, mas o de categoria vale. 🔒 29/08 (decisão do Pedro) — os 2 gates deixaram de EXPULSAR: fora de BH e atividade fora da lista resolvem AGORA na própria tela (endereço fiscal ou fila da cidade/atividade, com CTA 'Me inscrever e garantir condição'). O handle 'fora' e as saídas E4.1/E5.1 dedicadas ao caminho abrir foram removidas — `/saida/fora-bh` foi deletada (zero uso restante); `/veredito/waitlist` (E5.1) segue viva só pelo Migrar. 🆕 30/08 — ver E3.4.1 pro detalhe do estado 'CEP fora de BH'. Ganhou atalho na `/apresentacao` ('📍 Simular CEP fora de BH', antes só descobria digitando um CEP específico à mão). |
| 11 | E3.4.1 · CEP fora de BH · (gate resolvido inline) | Confirma: usa endereço fiscal Legalizai OU entra na fila da própria cidade | ✅ | ⚪ | 🆕 31/08 — ganhou `rota` só pra prévia ao vivo do `/mapa` (`?simular=fora-bh` pré-preenche o estado, ver `endereco/page.tsx` + prop `simularFilaCidade`). NÃO é navegação real — é o MESMO estado do E3.4 (`/endereco`), resolvido inline. As 2 saídas (endereço fiscal · fila de espera) continuam no fluxo normal, nenhuma é dead-end. |
| 12 | E4.2 · Lê o cartão CNPJ | CNPJ (consulta) · confirmação dos dados do cartão | ✅ | 🟢 | Autofill por CNPJ via InfoSimples (cadastro, R$0,20/consulta — API PAGA, não pública); sem entrevista de atividade — o CNAE já existe. 🔴 05/08: checagem de regime removida daqui (a API não confirma Simples×Presumido×MEI, ver infosimples-funcionalidades.md) — regime já vem autodeclarado da E3.2. Só confirma situação cadastral (ativa/inapta) |
| 13 | Saída · CNPJ inapto · ou suspenso | — (saída, fora do caminho até a migração) | ✅ | 🟢 | Situação cadastral ≠ ativa: aqui a Receita nem reconhece a empresa como ativa, regularização vem ANTES de qualquer migração. 🔴 06/08: diferente do que era 'auditoria de passivo' (E9.2, empresa ATIVA com dívida) — essa tela foi retirada do flow |
| 14 | Saída · Presumido · fora de escopo | — (saída, fora do caminho até a migração) | ✅ | 🟢 | Lucro Presumido segue fora do escopo (decisão explícita 04/08, sem pesquisa fiscal dedicada ainda). Autodeclarado na E3.2, não confirmado por API |
| 15 | E4.3 · Diagnóstico · ("tem certificado?") | Resposta sim/não (tem certificado digital) | ✅ | 🟡 | 🔴 04/08 (3ª rodada): o diagnóstico de Fator R pra ME foi CORTADO — a única API pré-pagamento é a cadastral, não traz faturamento/folha (só via procuração, pós-pagamento). 🔴 05/08: pergunta virou 'tem certificado?' (MEI: decide se roda TTRT). 🔴 06/08 (achado do Pedro): ME TAMBÉM passa aqui agora (antes ia do E4.2 direto pro E4.4) — certificado é independente da TTRT pra ME (as duas rodam em paralelo), mas não tinha pergunta nenhuma no caminho ME. 🟡 fila-Mauro: se sem-certificado-ME carrega custo/fidelidade extra é decisão de preço não tomada |
| 16 | E4.4 · Plano | — | ✅ | 🟡 | ME: mesma mensalidade do caminho abrir, sem taxa de governo (empresa já existe). 🆕 04/08: MEI tem plano PRÓPRIO — R$49,90/mês, fidelidade 12 meses, certificado incluso, escopo limitado (emitir NF + 1 colaborador) — não é o plano ME com desconto |
| 17 | E4.5 · Contrato · + promessa de devolução | Aceite do contrato (com a cláusula de devolução) | ✅ | 🟢 | 🔴 DECISÃO TRAVADA 30/07: cobra ANTES do TTRT, com contrapartida OBRIGATÓRIA no contrato ('se a transferência não sair por motivo fora do seu controle, devolve tudo'). Se essa linha sair do contrato, a decisão reabre (Mauro/Larissa redigem) |
| 18 | E9.2 · Seu contador atual | Nome do contador/escritório atual · e-mail · telefone (pré-preenchidos quando o cartão CNPJ trouxer, opcionais) · CRC (OBRIGATÓRIO) | ✅ | 🟢 | 🔒 24/08 (reunião Leonan 19/08, CONFLITO RESOLVIDO): CRC agora é OBRIGATÓRIO, trava o Continuar — 'eu preciso do número do CRC de qualquer forma' (Leonan). Antes o doc dizia 'opcional', estava errado/desatualizado. Nome/e-mail/telefone continuam opcionais — só o CRC não tem contorno |
| 19 | E9.2b · Dados que o · cartão CNPJ não traz | CPF · RG + órgão emissor · estado civil | ✅ | 🟢 | Reusa os mesmos campos do C1 (abertura) — CPF/RG/órgão/estado civil, digitação manual. 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui foi REMOVIDO do MVP (custo/velocidade) |
| 20 | E9.2c · Dados dos sócios | Nome completo + % de participação de cada sócio extra (CPF implícito, quantidade fixa) | ✅ | 🟢 | MESMA tela do C3 (`SociosView`), reusada com `contexto="migrar"` — só a copy muda. Não existe triagem prévia perguntando quantos sócios no caminho migrar (diferente do E5T no abrir), então a tela se sustenta sozinha |
| 21 | E9.2d · GOV.BR + procuração | Código de validação de 6 dígitos (janela 10min) | ✅ | 🟢 | Reusa `CodigoGovView` (mesmo componente do A4, caminho abrir) com `soProcuracao` — não existe protocolo de registro pra assinar (empresa já existe), só a procuração. Mesma janela de 10min/3 tentativas/escala pra atendente |
| 22 | E9.3 · Iniciando transferência | — | ✅ | 🟢 | 🔴 A PAUSA MAIS PERIGOSA DO PRODUTO: quem libera é o CONTADOR ANTIGO (valida no CRC-MG). 🆕 24/08 (reunião Leonan): copy do status trocou pra 'Iniciando o processo de transferência' + 'Estamos entrando em contato para encerrar o vínculo com a contabilidade antiga' — diferente do status de constituição ('empresa foi constituída'), antes os dois diziam a mesma coisa. Nº da resolução CFC / Evento 232 Redesim NÃO ratificados em fonte primária (🟡 pendência) |
| 23 | ✅ E9.4 · Migração concluída | — | ✅ | ⚪ | Segue pro mesmo handoff do caminho abrir → A5 (home dia-1), autoridade #2 (portal-data.mjs) |
| 24 | Triagem · quantos sócios? | Quantidade de sócios (1 / 2 / 3 / 4) · quem administra a empresa (só o titular × titular + sócios) quando há sócio · é a 1ª empresa que abre? (opcional) · sócio que não se encaixa no card informativo (opcional, texto livre via 'Falar com o time') | ✅ | 🟢 | 🔒 29/08 — só 1 pergunta de verdade agora (quantidade, até 4). CPF-only/domicílio Brasil/assinatura GOV.BR viraram card informativo com link de escape ('Falar com o time', resolve inline, sem navegar pra fora). 🆕 26/08: coorte ('é a 1ª empresa que você abre?') pousou aqui de vez — 3ª realocação (Veredito → Faixa → aqui), dado puro de log/marketing, opcional. 🆕 30/08 — ver E5T.1 pro detalhe do gate de saída 'sócio não se encaixa', invisível no mapa até agora. |
| 25 | E5T.1 · Sócio não se encaixa · (gate de saída inline) | Texto livre (opcional) descrevendo o critério que não encaixa | ✅ | ⚪ | 🆕 31/08 — ganhou `rota` só pra prévia ao vivo do `/mapa` (`?simular=socio-nao-encaixa` pré-abre o escape hatch, ver `gate/page.tsx` + prop `simularSocioNaoAtende`). NÃO é navegação real — é o MESMO estado da E5T (`/gate?etapa=triagem`), resolvido inline pelo link 'Meu sócio não atende um dos critérios'. Resolve com 'Falar com o time', sem navegar. Dead-end de propósito: quem cai aqui não segue sozinho no produto. |
| 26 | Faixa de faturamento | Faixa de faturamento mensal (4 faixas até R$30 mil, o teto do ME) ou valor exato, se souber | ✅ | ⚪ | 🔒 01/09 — o campo 'valor exato por mês' deixou de ser livre: para em R$30.000 (teto do ME, LC 123 art. 3º II). Trava por clamp, não por rejeição — quem digita 50000 vê 30.000 e o aviso explicando que acima disso a empresa vira EPP; campo que ignora a tecla em silêncio parece travado. 🔄 01/09, 2ª rodada (pedido do Pedro) — o cartão 'Até R$ 5 mil' virou 'Não sei ainda'. Quem abre a 1ª empresa muitas vezes não tem estimativa, e forçar um número faz chutar — chute que vira base do pró-labore sugerido. A grade agora é: Não sei ainda · 5-10k · 10-20k · 20-30k. A opção desconhecida cobre 0-30k de propósito (o gate do MEI lê INCERTEZA, não segurança), é pulada no cálculo por valor exato, e vale 0 no FAIXA_MEDIA — o pró-labore cai no piso legal em vez de sair de um chute. 🔄 01/09 (pedido do Pedro) — GRADE REDESENHADA pro teto do ME: era `até 10k · 10-20k · 20-30k · +30k`, virou `até 5k · 5-10k · 10-20k · 20-30k`. A faixa +30k oferecia justamente o que não atendemos (acima de R$360k/ano é EPP) e a decisão de 01/09 foi NÃO barrar por faturamento — então a pergunta não podia ter uma resposta sem caminho. Quem fatura mais usa Sei o valor exato, que aceita qualquer número. O gate de teto do MEI passou a se calcular pelo `min`/`max` de cada faixa: o teto de R$6.750 cai dentro de 5-10k (avisa, não bloqueia) e faixas acima bloqueiam com saída pro ME. Faixas sem âncora fiscal. 🔴 27/08: a escolha de endereço (próprio × fiscal Legalizai) SAIU daqui — morou nesta tela entre 26/08 e 27/08 e foi pro E3.4, junto do gate de cidade, que é a pergunta de que ela sempre foi parte (faturamento não decide onde a empresa fica). O valor continua somando no E7 pelo mesmo `?endereco=fiscal`. Fonte: `components/gate-telas.tsx` (`FaixaView`) |
| 27 | E5F.1 · Splash · 'conseguimos te atender' | — | ✅ | ⚪ | 🟢 30/08 — CONSTRUÍDA (`SplashMensagemView`, `components/splash-mensagem.tsx`). Arte provisória, Pedro revisa. `page.tsx` lê `?next=` e auto-navega (`router.replace`) depois do timeout. |
| 28 | E5.1 · 🟡 Waitlist | Nome + contato · CNAE pretendido (✅ campo construído 28/07) | ✅ | 🟢 | ✅ 28/07: campo CNAE pretendido construído (read-only, junto do nome+contato). Tags de CRM ficam pra depois, não travam. Waitlist decidido 16/07; líder atende regulada (Mauro reavaliar). 🔒 29/08: no caminho ABRIR a E3.4 resolve inline agora (não navega mais pra cá) — esta tela segue viva só pelo Migrar (E4.2 → 🟡 regulada) |
| 29 | E5.2 · 🔴 Contato especial · (atendido pelo Mauro) | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | ✅ 28/07: relabel construído — é quem NÃO atendemos mas a Legalize Digital (Mauro) atende (ex: comércio). Falta só o split real no mapear() do E5 (hoje é mock estático por página). |
| 30 | E5.3 · 🔴 Fora de escopo · (descarta) | — (saída, fora do caminho até a constituição) | ✅ | 🟢 | mapear() do E5 ainda não decide entre E5.2/E5.3 de verdade (mock estático) — falta o split real na IA/lista de CNAEs |
| 31 | E6 · Criar conta | Nome · CPF · telefone · e-mail · senha · código de verificação de 8 dígitos (mock) | ✅ | 🟢 | 🔄 01/09 (pedido do Pedro) — **login social (Google/Apple) REMOVIDO**: não teremos por enquanto, e botão que promete caminho inexistente é a pior fricção. O código de verificação passou de **6 para 8 dígitos** (`DIGITOS_CODIGO` — o número aparece em 4 lugares e precisa bater nos 4). 🔄 28/08 (pedido do Pedro) — reverteu o encolhimento de 27/08: a tela volta a coletar o form INTEIRO aqui mesmo (nome/CPF/telefone/e-mail/senha/CEP/número/complemento), sem recap read-only, `leadJaCaptado` removido do código. Form começa em branco. Provider de validação CPF/situação real (Pedro). 🔴 RF-01: sem estado real entre telas, hoje é só estado local do componente. 🐛 29/08 — vazamento de layout no campo Complemento corrigido (`min-w-0` faltava no flex), placeholder simplificado pra só "Complemento". |
| 32 | E6.1 · Confirmar código | Código de verificação de 8 dígitos (`DIGITOS_CODIGO`), enviado pro e-mail e pro telefone digitados no E6 | ✅ | 🟢 | 🔴 Envio real de e-mail/SMS, janela de expiração e trava de tentativas são do dev: hoje é mock e qualquer 8 dígitos passam. Já existem reenvio com contador de 60s e escape pro WhatsApp (01/09). 🐛 04/09 — o `meta` do header diz "Confirme seu acesso", que é o nome DESTA tela; pela regra 6 do CLAUDE.md ele deveria nomear o destino do voltar, que é o formulário do E6. |
| 33 | E7 · A conta da abertura | — | ✅ | 🟡 | Preço ~R$195 FAKE (Mauro+custo); 🟢 01/09 DAE RESOLVIDO — R$281,08, valor da guia real emitida no processo (prints 125 e 127), substitui os R$268,51 da tabela de 19/07 (a conferência cobra 2 atos: Contrato + Enquadramento ME, e a diferença de R$12,57 bate com o 2º); certificado A1 (Mauro). ✅ RESOLVIDO 26/08 (reunião Rua Satélite 36, item 2): a antiga 'pendência real de spec' ('conta total não é total', endereço fiscal só aparecia no C4 pós-pagamento) foi corrigida — a mensalidade mostrada aqui já soma o endereço fiscal quando escolhido lá no E5F, com 1 linha de explicação. 🆕 28/08 — REDESIGN 'premium' (pedido do Pedro, validado em preview isolado `/plano-premium` antes de aplicar): título bicolor, card-herói com profundidade real (raio+sombra), lista de inclusos como cartões-linha, CTA como barra flutuante escura. Nenhum conteúdo/ramo cortado (MEI×ME, colaboradores, citação legal, endereço fiscal seguem intactos) — só a casca mudou. `PlanoOferta` em `wizard-dinheiro.tsx`. 🆕 30/08 — ver E7.1 pra variante 'escolheu endereço fiscal'. Fechado o gap real na `/apresentacao`: a escolha do E3.4 nunca atravessava até o E7 na demo, mesmo o componente já suportando a prop. |
| 34 | E7.1 · A conta da abertura · (variante endereço fiscal) | — | ✅ | 🟡 | Mesmo componente do E7, só a prop `enderecoFiscal` muda. Card 'O que você adicionou' com o ícone de GPS e o valor (+R$60/mês) explícito, construído 30/08. |
| 35 | E9 · Pagamento + contrato · (variante Abrir) | CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto) · aceite do contrato de serviço (checkbox) · cartão: número + nome impresso + validade + CVV · titular do cartão: nome + CPF + e-mail + telefone (pré-preenchidos, editáveis) · endereço da fatura: CEP + número + complemento (pré-preenchidos do E3.4, editáveis) | ✅ | 🟡 | Asaas travado; falta provider cartão CNPJ + chave de idempotência (Pedro); redação jurídica do contrato (Mauro/Larissa). 🟢 30/08 (pedido do Pedro) — REVOGADO E IMPLEMENTADO: cartão/Pix não pulam mais direto pra C0 (código real em `/pagamento/page.tsx`, função `destino()`). Todo mundo (cartão, Pix, boleto) passa por uma tela de status antes — ver E9.S/E9.1P/E9.1. Reforça 'dá pra sair e voltar, está tudo certo'. MEI segue com o comportamento antigo (fora do escopo desta rodada). |
| 36 | E9 · Pagamento · (variante Migrar) | CPF (cobrança + elegibilidade) · método de pagamento (cartão/Pix/boleto) | ✅ | 🟡 | Mesmo componente, `?fluxo=migrar`: total não soma taxa de governo, aviso fala de migração (não abertura). CPF/métodos/idempotência idênticos ao componente base |
| 37 | E9.S · Splash · 'pagamento confirmado' | — | ✅ | ⚪ | 🟢 30/08 — CONSTRUÍDA (`SplashMensagemView`, mesmo componente do E5F.1). Fica no shell APP (`(app)/splash-pagamento`), não WIZARD — o pagamento já caiu. Arte provisória, Pedro revisa. |
| 38 | E9.SB · Splash · 'boleto gerado' | — | ✅ | ⚪ | 🟢 31/08 — CONSTRUÍDA (`SplashMensagemView`, mesmo componente do E9.S/E5F.1). Transitória, sem CTA, auto-avança pro E9.1 (sem `?pago=1` — o boleto ainda não compensou). Arte provisória, Pedro revisa. |
| 39 | E9.SR · Splash · pagamento recusado | — | ✅ | 🟡 | Reusa `SplashMensagemView` com `variante="recusado"` (fundo escuro + gradiente coral, ícone x). Transitório e sem CTA: a decisão (outro cartão, trocar pra Pix) é da tela seguinte. Alcançável por `/pagamento?simular=recusa`. |
| 40 | E9.R · Pagamento · (nova tentativa) | Método de pagamento (nova tentativa) · CPF já confirmado | ✅ | 🟡 | MESMA tela do E9 com aviso no topo explicando a recusa e oferecendo outro cartão ou Pix. Não zera o que foi preenchido: quem teve o cartão recusado já está frustrado, refazer o formulário puniria duas vezes. |
| 41 | E9.1 · Aguardando boleto · dossiê já liberado | — | ✅ | ⚪ | Dunning revisado |
| 42 | E9.1P · Status · (pago, via instantâneo) | — | ✅ | ⚪ | 🟢 30/08 — CONSTRUÍDA. `AguardandoView` ganhou prop `pago` (`wizard-cauda.tsx`): mesma lista de passos, CTA 'Continuar preenchendo' idêntico, só o topo muda (check verde, não pill de espera). `page.tsx` lê `?pago=1`. |
| 43 | C0.0 · Sua atividade · (chegada, antes de descrever) | Descrição da atividade (texto livre) · categoria já vem preenchida do E3.4 | ✅ | 🟡 | 🆕 02/09 — estado 'pelado' da C0: categoria (vinda do E3.4) e campo de descrição, sem os cartões de CNAE nem o slot da atividade principal, porque ainda não há o que mostrar. Mesmo componente da C0 (`PerguntaView`, prop `semResultados`) — o que é comum continua comum. 🔒 02/09 (decisão do Pedro) — DESCREVER NÃO É OBRIGATÓRIO: o CTA ('Buscar atividade principal') libera só com a categoria, que já veio do E3.4. Quem apertar sem escrever recebe as **3 atividades mais usadas da categoria** na tela seguinte; a descrição é refinamento, não pedágio (travar num campo de texto livre alguém que já pagou é cobrar o trabalho que a gente vende). 🔴 O mock atual (`mapear()`) NÃO conhece categoria: devolve sempre o mesmo trio. O ranking real de 'mais usadas por categoria' é dado que ainda não existe. 🟡 Em lapidação pelo Pedro; falta decidir se a transição pro estado com resultados é automática (ao digitar) ou por ação. |
| 44 | C0 · Sua atividade · (descreve + pills) | Descrição da atividade (texto livre) → CNAE principal (derivado por IA) · OU o código já sabido (atalho 28/07, mesma engine) · categoria já vem pré-selecionada do E3.4 | ✅ | 🟡 | 🔄 27/08 — era o E5A (`/gate`), antes do pagamento. Copy reenquadrada (`jaCliente`): não promete mais 'validar minha atividade' (a validação já aconteceu no E3.4), agora é 'achar meu CNAE'. 🔄 02/09 (pedido do Pedro) — A GRADE DE 17 PILLS SAIU DA TELA: a categoria vem pré-selecionada do E3.4 (via `?cat=`) como chip confirmado, dentro de um **dropdown** (mesmo `Select` do E3.4), fechado, que é por onde ela troca se quiser. 🆕 02/09 — O VEREDITO COMEÇOU A SER FUNDIDO AQUI DENTRO: os 3 CNAEs mais compatíveis aparecem na própria tela (cartões reusados do C0.2), num SLOT vazio no topo ('Escolha seu CNAE principal, é só clicar', contorno tracejado): clicar num cartão sobe ele pro slot em coral, clicar em outro troca e o CTA nomeando o que acontece ('Continuar com esse CNAE'). Cada cartão tem 'Ver detalhes', que abre um bottom-sheet com o que aquele código cobre (`SheetCnae`) e permite trocar por lá. O painel cinza (`rounded-3xl bg-surface-alt`, de 28/07) SAIU junto: ele existia pra agrupar a grade de pills, e sem elas os 2 campos vão direto no fundo claro, no mesmo `Campo` do C1/C4/E3.4. Lista do dropdown = só as 17 validadas, SEM a opção 'não encontrei' (essa porta é do E3.4, antes do dinheiro; aqui a pessoa já pagou e cair na waitlist seria beco). Sem `?cat=` o dropdown aparece vazio. O campo de descrição herdou a sobra que era da lista. 🔒 02/09 — CTA ÚNICO com 3 trabalhos ('Buscar atividade principal' na chegada · 'Buscar de novo' se mexeu na descrição/categoria depois da última busca · 'Continuar com essa atividade' com resultado fresco e um cartão no slot). Os 3 cartões são da ÚLTIMA BUSCA, não do texto ao vivo. Buscar de novo ESVAZIA o slot da atividade principal e o CTA volta a ficar travado até a pessoa escolher entre os novos resultados. Lista CNAE furada na raiz: 124 não-refutados, 45 impossíveis, 91 duvidosos; IA real (hoje mock) — Larissa/Pedro/dev |
| 45 | C5 · CNAE secundários | CNAEs secundários (seleção múltipla + busca, opcional, até 15) | ✅ | 🟡 | 🆕 24/08 (reunião Leonan): ganhou busca livre (restrita ao que a gente atende, pedido original da Jéssica 19/07) além das 4 sugestões curadas mesmo-imposto; até 15 no total; secundária que muda enquadramento mostra aviso e troca CTA por 'Falar com atendente' em vez de bloquear silenciosamente. 🔄 28/08 (pedido do Pedro) — MUDOU DE LUGAR: vinha depois de C4 (dados da empresa), agora vem logo depois de C0.3 (CNAE principal confirmado) — sequência mais natural de quem acabou de escolher o CNAE. `lib/passos.ts` reflete a ordem nova ('CNAE secundário' é o 4º passo, não mais o 5º) |
| 46 | C5.1 · Splash · 'já sabemos o que você faz' | — | ✅ | ⚪ | Reusa `SplashMensagemView` (mesmo componente de /splash-atendido e /splash-pagamento), com `?next=` e auto-avanço. Arte/copy provisórias, Pedro revisa. |
| 47 | C1 · Seus dados | CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta) · RG + órgão emissor (digitação manual) · data de nascimento · nacionalidade (pré-preenchida "Brasileira") · estado civil (+ regime de bens se casado) | ✅ | 🟢 | ✅ 28/07: reconstruída como CONFIRMAÇÃO — card read-only do que veio do E6 (mock, sem estado real compartilhado ainda) + só pede o que faltou. CPF valida situação (provider do E6); regime de bens (casado). 🔴 24/08 (reunião Rua Satélite 35): upload/leitura de IA que tinha entrado aqui (reunião Leonan, mesmo dia) foi REMOVIDO do MVP (custo/velocidade de leitura de imagem). 🆕 26/08 (achado do cruzamento com pesquisa JUCEMG/DBE, ver `gap-analise-dados-abertura-vs-pesquisa-gemini.md`): data de nascimento e nome da mãe ganharam campo — eram exigência de DBE ausente do dossiê. 🗑️ 01/09 (auditoria 1-a-1 contra os 141 prints): **nome da mãe REMOVIDO**. A exigência de 26/08 era inferida, não vista: em 141 prints não há campo de filiação em lugar nenhum (DBE tela 54 puxa do CPF; Integrador telas 102-104; contrato tela 117). MEI também não precisa — `abertura-mei-processo.md` linha 98 diz que vem do gov.br, não editável. Era campo obrigatório na 1ª tela pós-pagamento sem consumidor conhecido; se a certificadora pedir, o lugar é a A3.2. 🆕 01/09 (2ª passada, contra a ata da Izabela): **nacionalidade do titular** ganhou campo — gap assimétrico (o sócio extra tinha desde 31/08, o titular não), e o contrato qualifica TODO sócio com nacionalidade (art. 997 CC, print 117). Nasce como "Brasileira", editável. 🐛 Também corrigido o `dados` desta linha, que prometia "confirma se mora fora do Brasil" — a pergunta saiu da tela em 29/07 (mesma leva do N10) e o doc nunca foi atualizado: era captura documentada que não existia |
| 48 | C2 · Vínculo INSS | Já contribui INSS por fora? (sim/não) · valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ) | ✅ | 🟢 | INSS 11% direto + teto folga = consolidado fiscal fechado |
| 49 | C3 · Sócios? | Confirma se terá mais sócios (sem reperguntar quantidade/tipo) · se houver, de cada sócio extra: nome completo + CPF + % de participação + data de nascimento + nacionalidade + RG + órgão emissor + estado civil (+ regime de bens se casado) + endereço (CEP com autofill + número + complemento) · quem administra a empresa: com 1 sócio é sim/não no singular ("Eu e o Carlos"), com 2+ vira LISTA de nomes com check por sócio (dá pra ter sócio administrador e sócio que é só sócio) | ✅ | 🟢 | 🗑️ 03/09 — o nó C3.1 ('3+ sócios') FOI REMOVIDO: ele existia só pra dar acesso ao estado com o teto de sócios, e a apresentação passou a ter botões de cenário (1 sócio × 3 sócios) na própria tela — alternar com um clique é melhor que uma pill que abre a mesma tela. O ESTADO continua existindo e importa: com 2+ sócios a pergunta 'quem administra' vira lista de nomes com check (decisão 01/09, reunião Rua Satélite 42), porque dá pra ter sócio que administra e sócio que só participa. Re-pergunta o E5T (carry-forward pendente); limite subiu de 2 pra 4 (24/08). 🔒 24/08 (pedido do Pedro): não pergunta MAIS nada além de nome/%; quantidade e tipo (CPF) já vêm travados da triagem (E5T). Quando TEM_SOCIO, a MESMA tela já mostra o formulário de completar os sócios extras (sem passo/rota separada). 🔴→🟢 31/08 (gap-analysis contra a gravação real JUCEMG): faltava TODA a qualificação do sócio extra — só tinha nome+%, mas a JUCEMG/DBE exige a MESMA qualificação do titular (art. 997 CC) pra qualquer sócio. Adicionado nascimento, nacionalidade, RG+órgão, estado civil+regime de bens. Profissão fica de fora — preenchida internamente como "Empresário" pra todo mundo (ver PREENCHIDOS_INTERNAMENTE). 🔴→🟢 01/09 (auditoria 1-a-1): faltavam ainda **CPF e endereço do sócio extra**. O CPF é a CHAVE do sócio nos 3 sistemas (Viabilidade tela 14, QSA do DBE telas 63-70, Integrador tela 102) — o "(CPF implícito)" que este campo dizia vinha da triagem E5T, que trava o TIPO (só pessoa física), nunca o número. O endereço entra na qualificação do contrato (art. 997 CC, preview real na tela 117) e tem ficha própria no DBE (telas 67-69): na gravação veio automático só porque a empresa era SOLO e o sócio era o representante (popup da tela 66), o que não se repete com 2 sócios |
| 50 | C4 · Dados da empresa | Índice cadastral do IPTU (único campo do cliente) · CEP + número + complemento + tipo de imóvel + residência aparecem TRAVADOS, vindos do E3.4 | ✅ | 🟢 | 🔒 01/09, 2ª rodada (pedido do Pedro) — a tela ficou com UM campo só. CEP, número e complemento aparecem TRAVADOS (vieram do E3.4 e não podem mais mudar aqui: já foram pra viabilidade); a pergunta 'Como é esse endereço?' foi REMOVIDA (o E3.4 já resolve endereço-dele × o nosso, e o tipo de imóvel responde o resto); e o aviso 'o IPTU desse endereço pode subir' saiu — chegava tarde, com a pessoa já tendo pago e já tendo mandado o endereço, então não mudava decisão nenhuma. Se voltar, o lugar é o E3.4, antes do dinheiro. Sobra o índice cadastral do IPTU. Sem `inicial` (deep-link, /mockup, prévia do /mapa) a tela cai no MOCK em vez de mostrar formulário vazio: formulário vazio é um estado que não existe no flow real. 🗑️ 01/09 (pedido do Pedro) — o **upsell de endereço fiscal saiu desta tela**. A regra virou binária: ou a pessoa escolheu o endereço fiscal no E3.4 (e a tela não existe pra ela), ou informou endereço próprio e aqui só TERMINA de preencher. O que veio do gate (CEP, número, complemento) aparece **travado**, com cadeado; o que falta (IPTU, tipo de endereço, imóvel) segue editável. Vender o endereço fiscal aqui seria oferecer, depois do pagamento, algo que muda a mensalidade. ✅ 28/07: IPTU obrigatório travado. 🔄 26/08 (reunião Rua Satélite 36, item 2): a escolha 'próprio × fiscal Legalizai' e o aviso de cobrança recorrente SAÍRAM daqui — moraram no E5F desde 24/08 até virarem o gate oficial de decisão, e o valor já vem confirmado do E7. Esta tela agora só CONFIRMA a escolha (card read-only, mesma doutrina do C3) e coleta os detalhes de endereço (CEP/IPTU/tipo) quando for próprio. 🔒 31/08 (gap-analysis + reunião Rua Satélite 38-40, tudo validado pelo Pedro): capital social deixou de ser pergunta — travado em R$10.000, nem aparece mais na tela (ver PREENCHIDOS_INTERNAMENTE). 'Endereço virtual' saiu do seletor 'tipo de endereço' — vira valor fixo só quando é o endereço fiscal da Legalizai (nunca opção de quem usa endereço próprio). 🐛→🔒 campo NOVO 'tipo de imóvel' (casa/apartamento/outro) — faltava por completo (zero ocorrência no código antes). A pergunta de residência, que só aparecia com 2+ sócios (bug: dono único nunca via essa pergunta, mesmo sendo a regra que decide deferimento/indeferimento na Prefeitura), agora vale sempre — e é SEMPRE sobre o titular (quem constitui), nunca sobre sócio extra. Se apartamento, resposta é automática 'sim' (travada); se o titular não reside ali, informa o endereço pessoal (com o mesmo tipo de imóvel). 🆕 01/09 (2 pedidos do Pedro, ambos construídos): **(1) a tela DEIXA DE EXISTIR pra quem usa o endereço fiscal da Legalizai** — antes ela abria só pra 'confirmar' uma escolha já feita no E3.4 e já somada no preço do E7, sem nada pra responder (endereço/IPTU/tipo de imóvel/residência são todos sobre um imóvel que não é dele). O C3 passa direto pro C7 e a rota redireciona sozinha em deep-link. ⚠️ **O MEI é exceção e continua vendo a tela**: lá existe 'Como você atende?' (forma de atuação), que é dele. O passo também some da lista de `lib/passos.ts` (`soEnderecoProprio`). **(2) carry-forward do endereço**: CEP, número e complemento respondidos no E3.4 chegam PREENCHIDOS aqui — a pessoa completa o que falta (IPTU, tipo de imóvel, residência) em vez de redigitar. Trafega por `sessionStorage` (`lib/rascunho.ts`), NÃO por querystring: endereço é dado pessoal, mesma regra do RF-01 que tirou nome/CPF/telefone da URL |
| 51 | 'C6 · Natureza jurídica' · 🗑️ REMOVIDO 31/08 | — | 🚧 | 🟢 | Era pergunta ao cliente (SLU × LTDA, Leonan 24/08). 31/08: virou decisão interna automática (SLU se sem sócio, LTDA se com sócio) — sem tela, sem pergunta. Rota `/dossie/natureza` apagada do app |
| 52 | C7 · Nome / razão social | 3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA) · objeto social (gerado automaticamente, travado) · nome fantasia (opcional) | ✅ | 🟢 | Viabilidade JUCEMG (RPA, não API); 3 opções por prioridade (28/07). 🔒 24/08 (reunião Leonan, CONFLITO RESOLVIDO): objeto social virou TRAVADO/read-only — erro de grafia do cliente gerava reclamação real no escritório antigo dele. 🆕 24/08 (pedido do Pedro): cada sugestão ganhou lápis de edição inline (reescreve a sugestão da IA no lugar); campo separado 'Digite a sua' foi removido; seta de reordenar 1/2/3 mantida |
| 53 | C0.1 · Retomar · (porta de CPF) | CPF (identifica quem está voltando; o status em si é da tela seguinte) | ✅ | ⚪ | UX-23 fechado — mora em /pro-labore pós-constituição. 🆕 30/08 — deixou de ser órfão: o E3 aponta pra cá, via porta de CPF (mock, RF-01). 🔒 31/08 (fusão A3+E9, pedido do Pedro: 'uma tela única de retorno, que é a E9') — ENCOLHEU pra só a porta de CPF: a tela de status própria que vinha depois (`RetomarView`, 'Bem-vindo de volta') foi RETIRADA do código. Agora, confirmado o CPF, SEMPRE cai no E9.1/E9.1P — é a mesma tela de status que já cobre boleto pendente, pago e fase Junta, então não fazia sentido ter uma 2ª versão só pra reentrada. |
| 54 | C0.3 · Confirmar código · (retomada) | Código de 8 dígitos, mandado pro e-mail e telefone da conta encontrada pelo CPF do C0.1 | ✅ | ⚪ | 🔴 Mesmo mock do E6.1: qualquer 8 dígitos passam, e o e-mail/telefone mostrados são do cadastro fake. No real, o backend acha a conta pelo CPF e manda o código pro contato dela (RF-01). Falta decidir o que acontece quando o CPF não tem conta nenhuma: hoje o mock nunca erra. |
| 55 | C7′ · Sugerir mais · 3 nomes (2ª rodada) | 3 novas opções de razão social, na ordem de prioridade | ✅ | 🟡 | Reusa `NomeView` com `novaRodada`: 3 campos vazios, 1º já em edição, reordenação e objeto social iguais. Volta pro STATUS (não pro dossiê, que já acabou) pra Junta testar os nomes novos. |
| 56 | A1 · Revisar + autorizar | Leitura + confirmação, sem coleta nova. ME: identidade e qualificação do titular (nome, CPF, nascimento, RG+órgão, nacionalidade, estado civil+regime, endereço residencial, e-mail, telefone) · sócios (quem administra + por sócio: nome, CPF, %, e no detalhe nascimento, RG+órgão, nacionalidade, estado civil+regime, endereço) · atividades (CNAE principal + secundárias + objeto social derivado) · empresa (3 opções de razão social na ordem, nome fantasia, endereço + tipo de imóvel + reside no local + índice cadastral do IPTU). MEI: recap curto + aceite do termo irreversível (checkbox) | ✅ | ⚪ | 🔄 01/09 (2ª rodada, pedido do Pedro) — saiu o card 'Taxa da Junta (já paga)', que mentia desde 26/08 (a DAE passou a ser paga DEPOIS, quando a viabilidade volta deferida), e saiu o ACEITE, que foi pra tela da guia (`/guia`) — é lá que a taxa de fato vira gasto irreversível. No ME a tela voltou a ser recap puro, com CTA 'Confirmar e seguir'. No MEI o aceite CONTINUA aqui: ele não paga guia nenhuma, então não existe tela depois desta pra carregá-lo. Recap read-only; carry-forward dos passos = estado do wizard (dev). 🆕 01/09 (decisão do Pedro): **absorveu o aceite da A2**, que foi eliminada. O checkbox irreversível é o último bloco da tela e trava o CTA ("Autorizo, pode abrir"); a explicação do não-reembolso virou LINK na própria frase, abrindo bottom-sheet (`SheetNaoReembolsavel`). Redação jurídica segue pendente (Mauro/Larissa). 🆕 03/09 (varredura pedida pelo Pedro) — o recap do ME era RASO (8 linhas) numa tela que é a última antes do irreversível: ficavam de fora dados digitados à mão que ninguém valida pela pessoa e que derrubam o processo quando saem errados. Passou a mostrar RG+órgão, nascimento, estado civil+regime, endereço residencial, a qualificação inteira de cada sócio (resumo + 'Ver detalhes'), % de cada um, quem administra, as 3 tentativas de razão social NA ORDEM (só a 1ª aparecia), objeto social como leitura, tipo do imóvel + 'você mora nele' e o índice do IPTU. Critério travado: entra o que a PESSOA informou e vai pro protocolo; NÃO entra o que preenchemos no backend (capital, quotas, natureza jurídica, metragem, profissão, qualificação 49/22) nem o que não vai pra Junta (vínculo INSS e o card de enquadramento/pró-labore, que SAIU). Nome/CPF/e-mail/telefone aparecem pra conferência mas não se ajustam aqui (bloco 1): a saída é link de WhatsApp no pé do cartão. Variante endereço fiscal: some imóvel/IPTU, entra a linha do endereço da Legalizai. 🔒 Guardado por regime: o MEI segue com o recap antigo (`RevisarMeiView`) |
| 57 | A2 · Ponto sem volta · (antes da viabilidade) | Aceite do ponto sem volta (o toque no CTA) | ✅ | 🟡 | Tela de aviso em coral cheio: depois de iniciar a viabilidade, mudar nome ou endereço exige CANCELAR e refazer o pedido na Junta (visto ao vivo na gravação de 31/08). O aceite já está no contrato do E9, mas contrato ninguém lê — uma tela inteira com CTA próprio transforma a cláusula em momento, e é o que a pessoa lembra se depois pedir pra mudar algo. 🔒 É ela que fecha o modo AJUSTE: antes daqui a tela de status deixa voltar a qualquer bloco; depois, o botão some |
| 58 | A3 · Status · (fase Junta) | — | ✅ | 🟢 | 🔄 01/09 (pedido do Pedro) — a etapa da vez agora GIRA (anel azul) mesmo quando a ação é do cliente: antes o CTA suprimia o anel e a etapa ficava cinza, igual às que nem começaram, sendo que é exatamente onde a jornada parou. O card com CTA embaixo do passo leva pra `/guia` (pagamento da taxa), não mais direto pra assinatura. 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — **FUNDIDA COM O E9.1**: era tela própria (`/painel`), virou a FASE 'junta' da MESMA tela de status. Motivo: 'quando as pessoas clicarem em retomar processo teremos uma tela única de retorno, que é a E9'. Efeitos: (1) `/painel` no caminho ME agora só redireciona pra cá — a rota segue viva só pro MEI (pipeline concierge próprio) e pro Migrar; (2) a lista é ÚNICA, 12 passos: os 9 do dossiê (`lib/passos.ts`) + as 3 da Junta; (3) 'Documentação completa preenchida' SAIU (era redundante com os 9 passos já concluídos logo acima) — de 4 etapas voltou a 3. 🆕 cada passo mostra sub-descrição (o que envolve + tempo estimado) quando é o passo da vez. Histórico: 30/07 reduziu de 9→3; 26/08 (Rua Satélite 36, item 6) voltou a 4 com a DAE virando etapa visível e acionável ('Pague a guia da Junta', CTA coral inline depois que a viabilidade sai). NÃO absorvemos a taxa (alinhado ao líder). Componentes: `components/painel.tsx` (motor de render, `ETAPAS_ABERTURA`) + `wizard-cauda.tsx` (`AguardandoView`, monta a lista combinada) |
| 59 | A3 · Status · (variante MEI) | — | ✅ | 🟢 | Pipeline PRÓPRIO (`ETAPAS_MEI` em `painel/page.tsx`): recebemos seus dados → time conferindo → próximos passos prontos (CTA) → empresa aberta. ✍️ REGRA DE COPY: nenhuma etapa pode dizer que a Legalizai registra o MEI (não há API nem procuração que permita — ver `abertura-mei-processo.md`). Ficou FORA da fusão A3+E9 de 31/08 de propósito: o MEI não tem dossiê de 9 passos nem etapa de Junta, então fundir as listas não faria sentido. |
| 60 | A3.1 · Órgão recusa · 'precisa de você' | Retry automático pelas 3 opções priorizadas (C7) antes de pedir novas sugestões ao cliente | ✅ | 🟢 | 🔄 01/09 (pedido do Pedro) — passou a ser A MESMA TELA do A3 (`AguardandoView` na fase junta), no estado de alerta: hero escuro + a jornada inteira, com a recusa inline na etapa que travou. Antes era um `PainelView` cru, só com as 3 etapas da cauda e sem hero — parecia outro app justo onde a confiança está mais frágil. O CTA de sugerir mais 3 nomes agora leva pro C7′. ✅ 28/07: retry automático construído — tenta as 3 opções do C7 em sequência (mock sempre falha as 3, pra provar o pior caso); só aí pede novas sugestões. Testado no motor (nome recusado); faltam DAE-volta e doc-pendência como casos |
| 61 | 'A3.2 · Certificado digital' 🗑️ REMOVIDO 01/09 · (segue só no MEI/migrar) | — | 🚧 | 🟢 | 🗑️ 01/09 — fora do caminho ME. O componente (`CertificadoGateView`) e a rota seguem existindo pro MEI (`M_CERT`) e pro migrar. Motivo da remoção: (1) o certificado é e-CNPJ e o CNPJ ainda não existe neste ponto, então a justificativa original ('a procuração exige certificado validado') é impossível; (2) certificado é incluso no plano ME e emitido pela Legalizai, não tarefa do cliente. A trilha da A5 passou a dizer isso ('por nossa conta'), em vez de 'você já resolveu antes de assinar' |
| 62 | A3.P · Pagar a guia · da Junta (DAE) | CPF (confirmado do cadastro) · método de pagamento (cartão/Pix/boleto) · aceite irreversível · cartão: número + nome impresso + validade + CVV · titular do cartão: nome + CPF + e-mail + telefone (pré-preenchidos, editáveis) · endereço da fatura: CEP + número + complemento (pré-preenchidos do E3.4, editáveis) | ✅ | 🟡 | Reusa `PagamentoView` com a prop `guia`. Carrega o ACEITE irreversível (veio do A1) porque é aqui que a taxa vira gasto. Mock: pagar volta pro status com `?guia=paga` e a etapa fecha; no app real quem fecha é o webhook do provedor. |
| 63 | A3.SR · Splash · guia recusada | — | ✅ | 🟡 | Mesmo componente do E9.SR, outro `next`. Alcançável por `/guia?simular=recusa`. |
| 64 | A3.R · Guia · (nova tentativa) | Método de pagamento (nova tentativa) · aceite irreversível | ✅ | 🟡 | MESMA tela da guia com o aviso da recusa no topo. O aceite irreversível continua obrigatório na retentativa. |
| 65 | A3.PS · Splash · guia paga | — | ✅ | 🟡 | Reusa `/splash-pagamento` (SplashMensagemView) com `?next` — transitório, sem CTA. Volta pro status com a etapa da guia concluída e a assinatura liberada. |
| 66 | A3.PSB · Splash · boleto da guia | — | ✅ | 🟡 | Reusa `/splash-boleto` com `?next`. Volta pro status com a etapa virando **Guia da Junta · aguardando compensação**: segue girando, e as ações passam a ser ver o boleto e adiantar por Pix (mesmo par do hero do E9.1). |
| 67 | A3′ · Status · (guia paga) | — | ✅ | 🟡 | Volta de quem pagou a guia por cartão/Pix: a etapa da DAE fecha (verde) e 'Agora é só assinar' vira a vez. Mock por query (`?guia=paga`); no app real quem fecha é o webhook do provedor. |
| 68 | A3″ · Status · (guia no boleto, · aguardando compensar) | — | ✅ | 🟡 | Volta de quem pagou a guia por BOLETO. A etapa vira 'Guia da Junta · aguardando compensação': segue girando (não volta a pedir pagamento — a pessoa já pagou) e as ações passam a ser ver o boleto e adiantar por Pix. Sai deste estado quando o banco confirma (mock: `?guia=paga`). |
| 69 | A3‴ · Status · (analisando viabilidade, · 2ª rodada de nomes) | — | ✅ | 🟡 | Mesma tela do A3 com a fase Junta recuada (`junta={concluidas:0, emAndamento:0}`). Daqui volta pro fluxo normal quando a Junta defere, ou pro A3.1 se recusar de novo. |
| 70 | A4 · Assinatura dos sócios | Assinatura via GOV.BR/e-CAC · código de validação de 6 dígitos (janela 10min) · canal do convite ao sócio (WhatsApp/e-mail) | ✅ | 🟡 | GOV.BR/e-CAC deep-link (dev). 🆕 24/08 (reunião Leonan): código 2FA único concentra procuração+assinatura (`CodigoGovView` — janela 10min, 3 tentativas, escala pra atendente se estourar); convite de sócio ganhou seletor de canal (WhatsApp/e-mail). 🆕 26/08 (item 7): certificado já vem validado da A3.2 — a procuração que sai junto desta assinatura agora tem o que precisa. 🗑️→🔴 01/09: **a A3.2 saiu do caminho ME**, então essa premissa caiu junto (o certificado é e-CNPJ, e o CNPJ ainda não existe aqui). Continua aberto o que fazer com a procuração e-CAC nesta tela: ela só pode ser assinada DEPOIS do CNPJ sair, e as 2 decisões de 01/09 (corrigir a cadeia toda + procuração sempre) ainda não foram construídas |
| 71 | 'Empresa ativa' · 🗑️ REMOVIDO 30/07 | — | 🚧 | 🟢 | Era órfão desde o swap A4→A5 (nenhuma rota navegava mais até aqui) — arquivo `/ativa` e a view apagados de vez 30/07, confirmado pelo Pedro. Fica só como marca histórica no mapa |
| 72 | M-T · Impedimentos · (no lugar da triagem) | Já tem outra empresa? (sim/não) · é servidor federal? (sim/não) · recebe benefício? (sim/não) + ciência explícita se sim | ✅ | 🟢 | 🆕 28/08 — substitui o E5T no ramo MEI (MEI é unipessoal por definição, art. 966 CC: as perguntas de sócio não existem pra ele). São 3 impedimentos que o PRÓPRIO GOVERNO checa e bloqueia: (1) ser sócio/titular/admin de outra PJ — a RFB cruza o CPF, LC 123 art. 18-A; (2) servidor público federal na ativa — Lei 8.112/90 art. 117; (3) receber aposentadoria por invalidez / salário-maternidade / seguro-desemprego — este NÃO bloqueia, mas a formalização cancela o benefício de forma irreversível, então vira escolha informada com confirmação explícita. Fica ANTES do pagamento pelo mesmo motivo da triagem do ME: não cobramos de quem já sabe que não pode. Componente: `components/mei-telas.tsx` (`ImpedimentoView`) |
| 73 | M-T.1 · 🔴 Já tem CNPJ | Nome + contato | ✅ | 🟢 | Saída de bloqueio do governo, não do produto. Oferece os 2 caminhos reais (baixar a antiga OU abrir como ME) em vez de waitlist — a Legalizai atende essa pessoa hoje, só não como MEI. Conteúdo em `lib/dados-saida.tsx` |
| 74 | M-T.2 · 🔴 Servidor federal | Nome + contato | ✅ | 🟢 | Vedação do art. 117 da Lei 8.112/90, só pra FEDERAL na ativa. A saída não fecha a porta pra estadual/municipal de propósito: lá a regra vem do estatuto de cada ente e em muitos casos é permitido. Conteúdo em `lib/dados-saida.tsx` |
| 75 | M-O · Ocupação · (Anexo XI + limite interno) | Ocupação principal (1 da lista do Anexo XI) · até 15 ocupações secundárias | ✅ | 🟢 | 🆕 28/08 — a C0 do ramo MEI, 1ª tela do dossiê. NÃO é o C0 adaptado: o Portal do Empreendedor não aceita CNAE livre, só OCUPAÇÃO de lista fechada (Anexo XI, Res. CGSN 140/2018), então não há 'descrever com suas palavras'. 🎯 Carrega o **limite interno** (Solução de Consulta Cosit nº 27/2021): a ocupação é mais estrita que o CNAE que ela mapeia — quem escolhe 'Reparador(a) de bicicleta' não pode consertar moto, e descobre numa fiscalização. É o erro que só contador pega, e é parte do que vendemos. Secundárias (até 15) também saem daqui, por isso o ramo pula o C5. Dados de `lib/mei.ts`, derivados dos 51 CNAEs certeza que aceitam MEI |
| 76 | A3.2' · Certificado · (operar, não abrir) | Certificado digital (upload .pfx/.p12 + senha) OU aceite de contato da certificadora parceira | ✅ | 🟢 | 🆕 28/08 (decisão do Pedro) — o MEI passa pelo MESMO gate de certificado do ME, com 2 diferenças: (1) o MOTIVO — no ME o certificado destrava a procuração da assinatura; no MEI não existe assinatura nem procuração de abertura (a abertura DISPENSA certificado, gov.br Prata/Ouro supre), então o que ele destrava é a OPERAÇÃO: puxar guia, FGTS Digital, agir sem pedir senha do cliente toda vez; (2) QUEM PAGA — no ME vem incluso (contrapartida da fidelidade, ADR 04/08); no MEI **não vem**, o cliente providencia. Fica ANTES da A5 a pedido do Pedro: 'tem que ser efetivado antes da pessoa cair pra dentro do app com as funcionalidades, da mesma forma do ME'. 🔴 Consequência aberta: a fidelidade de 12 meses do MEI perdeu a contrapartida escrita — precisa de justificativa nova antes de virar cláusula (Pedro/Mauro) |
| 77 | M-S · Próximos passos · (a "cola") | Confirmação de que a conta gov.br é Prata/Ouro · (devolve o CNPJ gerado) | ✅ | 🟢 | 🆕 28/08 — a tela que FECHA o ramo, e existe por razão jurídica, não de UX: como não dá pra registrar pelo cliente, a entrega é o passo a passo com os valores DELE prontos, na ordem dos campos do Portal. Inclui a checagem do nível da conta gov.br (Prata/Ouro obrigatório) e o link pro Portal. ✍️ REGRA DE COPY DURA: nunca dizer 'a gente abre pra você' neste ramo. 🔴 Falta: definir se o 'copiar tudo' vira PDF/WhatsApp; e o M-S é a tela mais cara de evoluir se um dia a automação for possível. Componente: `components/mei-telas.tsx` (`ProximosPassosView`) |
| 78 | ✅ A5 · Home dia-1 · (ativação) | — | ✅ | 🟢 | 🔓 SWAP validado 30/07 (confirmado no código: assinatura empurra direto pra cá). 🆕 24/08 (reunião Leonan): trilha agora mostra 3 status explícitos — Procuração (feito, instantâneo com o código) → Validação do certificado digital (agora, linka pra /mais/certificado upload+oferta) → Acesso completo. 🔄 26/08 (item 7): certificado deixou de ser 'agora' e virou 'feito' — já foi validado antes da assinatura (A3.2). Quem vira 'agora' é 'Conferir os dados da empresa' (`/mais/empresa`). 🔄 01/09 (decisão do Pedro, com a A3.2 fora do caminho ME): o passo do certificado continua 'feito', mas o texto mudou de 'você já resolveu antes de assinar' pra **'Certificado digital por nossa conta'** — é incluso no plano e emitido pela Legalizai quando for necessário, não tarefa do cliente. `/mais/certificado` segue existindo, só que agora é pra RENOVAR/trocar, não pra validar a 1ª vez. Sem confete nem selo coral no hero. Handoff pro flow Portal (letra P) → autoridade portal-data.mjs |
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
- **v92** · 2026-09-04 · +nós E6_1,C0_3 · +conexões E6→E6_1,E6_1→E7,E6_1→E7_1,C0_1→C0_3,C0_3→E9_1P · -conexões E6→E7,E6→E7_1,C0_1→E9_1P
- **v91** · 2026-09-04 · falta-validar em A1 · dados-coletados em A1
- **v90** · 2026-09-03 · -nós C3_1 · falta-validar em C3 · -conexões C3→C3_1
- **v89** · 2026-09-02 · ajuste sem efeito estrutural
- **v88** · 2026-09-02 · +nós C5_S · -nós C0_2,DESAMB,C0_3 · +conexões C0→C5,C5→C5_S,C5_S→C1 · -conexões C0→C0_2,C0_2→DESAMB,DESAMB→C0,C0_2→C0_3,C0_3→C5,C5→C1
- **v87** · 2026-09-02 · falta-validar em C0
- **v86** · 2026-09-02 · falta-validar em C0
- **v85** · 2026-09-02 · falta-validar em C0_0
- **v84** · 2026-09-02 · renomeou C0_0 "C0 · Sua atividade (chegada, antes de descrever)"→"C0.0 · Sua atividade (chegada, antes de descrever)"
- **v83** · 2026-09-02 · +nós C0_0 · falta-validar em C0 · +conexões E9_1P→C0_0,E9_1→C0_0,C0_0→C0 · -conexões E9_1P→C0,E9_1→C0
- **v82** · 2026-09-02 · ajuste sem efeito estrutural
- **v81** · 2026-09-02 · renomeou A2 "'A2 · Termo irreversível' 🗑️ REMOVIDO 01/09 (aceite absorvido pelo A1)"→"A2 · Ponto sem volta (antes da viabilidade)" · status A2 planejada→construida · validação A2 oficial→pendente · falta-validar em A2 · dados-coletados em A2 · +conexões A1→A2,A2→A3 · -conexões A1→A3
- **v80** · 2026-09-02 · dados-coletados em E5T
- **v79** · 2026-09-01 · +nós C3_1 · dados-coletados em C3 · +conexões C3→C3_1
- **v78** · 2026-09-01 · dados-coletados em C3
- **v77** · 2026-09-01 · dados-coletados em E9,A3_P
- **v76** · 2026-09-01 · +nós CONF · +conexões A1→CONF
- **v75** · 2026-09-01 · falta-validar em E5F
- **v74** · 2026-09-01 · falta-validar em E5F
- **v73** · 2026-09-01 · falta-validar em C4 · dados-coletados em C4
- **v72** · 2026-09-01 · +conexões E9→E9_SR,E9_SR→E9_R,E9_R→E9_S
- **v71** · 2026-09-01 · +nós E9_SR,E9_R,A3_SR,A3_R · +conexões A3_P→A3_SR,A3_SR→A3_R,A3_R→A3_PS
- **v70** · 2026-09-01 · +nós A3_V · +conexões C7_2→A3_V,A3_V→A3,A3_V→A3_1 · -conexões C7_2→A3
- **v69** · 2026-09-01 · +nós C7_2 · falta-validar em A3_1 · +conexões A3_1→C7_2,C7_2→A3
- **v68** · 2026-09-01 · +nós A3_GP,A3_GB · +conexões A3_PS→A3_GP,A3_PSB→A3_GB,A3_GB→A3_GP,A3_GP→A4 · -conexões A3_PS→A3,A3_PSB→A3
- **v67** · 2026-09-01 · +nós A3_PS,A3_PSB · +conexões A3_P→A3_PS,A3_P→A3_PSB,A3_PS→A3,A3_PSB→A3 · -conexões A3_P→A3
- **v66** · 2026-09-01 · +nós A3_P · falta-validar em A1,A3 · +conexões A3→A3_P,A3_P→A3
- **v65** · 2026-09-01 · falta-validar em E5F,E6,C4
- **v64** · 2026-09-01 · dados-coletados em E5F,E6
- **v63** · 2026-09-01 · renomeou A1 "A1 · Revisar dossiê"→"A1 · Revisar + autorizar"; A2 "A2 · Termo irreversível"→"'A2 · Termo irreversível' 🗑️ REMOVIDO 01/09 (aceite absorvido pelo A1)" · status A2 construida→planejada · validação A2 pendente→oficial · falta-validar em A1,A2 · dados-coletados em A1,A2 · +conexões A1→A3,A1→A3_M · -conexões A1→A2,A2→A3,A2→A3_M
- **v62** · 2026-09-01 · renomeou A3_2 "A3.2 · Certificado digital (antes de assinar)"→"'A3.2 · Certificado digital' 🗑️ REMOVIDO 01/09 (segue só no MEI/migrar)" · status A3_2 construida→planejada · validação A3_2 pendente→oficial · falta-validar em A3_2,A4,A5 · dados-coletados em A3_2 · +conexões A3→A4 · -conexões A3→A3_2,A3_2→A4
- **v61** · 2026-09-01 · falta-validar em C4 · dados-coletados em C4 · +conexões C3→C7
- **v60** · 2026-09-01 · falta-validar em E7,C1 · dados-coletados em C1
- **v59** · 2026-09-01 · falta-validar em C1,C3 · dados-coletados em C1,C3
- **v58** · 2026-09-01 · +nós A3_M · +conexões A2→A3_M,A3_M→M_S · -conexões A3→M_S
- **v57** · 2026-09-01 · renomeou C0_1 "C0.1 · Retomar de onde parou"→"C0.1 · Retomar (porta de CPF)"; A3 "A3 · Painel 4 status"→"A3 · Status (fase Junta)" · falta-validar em C0_1,A3 · dados-coletados em C0_1 · +conexões C0_1→E9_1P · -conexões C0_1→C0
- **v56** · 2026-09-01 · +nós E9_SB · +conexões E9→E9_SB,E9_SB→E9_1 · -conexões E9→E9_1
- **v55** · 2026-08-31 · falta-validar em E5T_1
- **v54** · 2026-08-31 · renomeou C6 "C6 · Natureza jurídica"→"'C6 · Natureza jurídica' 🗑️ REMOVIDO 31/08" · status C6 construida→planejada · validação C6 pendente→oficial · falta-validar em C4,C6 · dados-coletados em C4,C6 · +conexões C4→C7 · -conexões C4→C6,C6→C7
- **v53** · 2026-08-31 · falta-validar em C3,C4 · dados-coletados em C3,C4
- **v52** · 2026-08-31 · falta-validar em E3_4_1
- **v51** · 2026-08-30 · status E5F_S planejada→construida; E9_S planejada→construida; E9_1P planejada→construida · validação E5F_S pendente→ux; E9_S pendente→ux; E9_1P pendente→ux · falta-validar em E3_4,E5F_S,E7,E9,E9_S,E9_1P
- **v50** · 2026-08-30 · +nós E3_4_1,E5T_1,E5F_S,E7_1,E9_S,E9_1P · falta-validar em E3_4,E5T,E7,E9,C0_1 · +conexões E3_4→E3_4_1,E3_4_1→E5T,E5T→E5T_1,E5F→E5F_S,E5F_S→E6,E6→E7_1,E7_1→E9,E9→E9_S,E9_S→E9_1P,E9_1P→C0 · -conexões E5F→E6,E9→C0
- **v49** · 2026-08-30 · renomeou E3 "E3 · Fork 3 rotas"→"E3 · Fork 4 rotas" · falta-validar em E3,C0_1 · dados-coletados em C0_1 · +conexões E3→C0_1
- **v48** · 2026-08-30 · -nós E8 · renomeou E9 "E9 · Pagamento (variante Abrir)"→"E9 · Pagamento + contrato (variante Abrir)" · falta-validar em E9 · dados-coletados em E9 · +conexões E7→E9 · -conexões E7→E8,E8→E9
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
