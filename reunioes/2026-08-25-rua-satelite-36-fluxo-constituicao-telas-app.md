---
tipo: historico
status: vivo
data: 2026-08-25
fonte: transcrição + summary, "Rua Satélite 36" (Downloads, Pedro Dev/Pedro Maia/Natanael Dev/Pedro Puntel/Speaker 2/Speaker 6)
deriva_de: [../execucao/flow/flow-data.mjs, ../app/src/app/apresentacao/page.tsx]
tags: [reuniao, produto, rpa, ux, flow, decisao, pendente-validacao]
---

# 🤝 Rua Satélite 36 — fluxo de Constituição (RPA) + dúvidas de telas do app (25/08/2026)

> Reunião essencialmente técnica/RPA (mapeamento do robô que opera JUSENG/Jucemg, certificado digital, procuração, CRM/Kanban). Cruzei os pontos que tocam **telas reais do app** contra o estado documentado em `execucao/flow/flow-data.mjs` — mesmo formato da nota `2026-08-19-realinhamento-leonan-flow-constituicao-migracao.md`. **Nada abaixo foi alterado no código ainda** — é levantamento pra o Pedro avaliar antes de mexer, como ele pediu.

## ✅ RESOLVIDO 26/08 — os 2 conflitos + item 2, decididos pelo Pedro e implementados

- **Timing de pagamento da DAE (item 6):** Pedro decidiu **cobrar depois, quando sair a viabilidade da empresa** — confirma o desenho da reunião, não o que `flow-data.mjs` (nó A3) documentava antes (pagar no checkout/E9, segurando o valor). Implementado: `components/painel.tsx` ganhou uma 4ª etapa visível ("Pague a guia da Junta (DAE)") com CTA coral inline (`acaoCliente`/`onPagarDae`), só aparece depois que a viabilidade defere. `/painel` (produção) já mostra esse estado.
- **Ordem certificado digital × assinatura (item 7):** Pedro decidiu **passar para antes** — certificado digital agora é validado ANTES da assinatura, não depois. Implementado: nó novo `A3_2` (`/certificado`, `CertificadoGateView` em `wizard-cauda.tsx`) entre `/painel` e `/assinatura`. A trilha pós-assinatura (`HomeAtivacaoView`) já reflete isso: "certificado" virou "feito" (não mais "agora"), "conferir os dados da empresa" é quem vira o passo ativo.
- **Endereço fiscal — pergunta mais cedo + valor somado no checkout (item 2):** Pedro esclareceu que já estava validado: a pergunta "endereço próprio × fiscal Legalizai" sai do C4 (dossiê, pós-pagamento) e vai pro fluxo ANTES do cadastro; o valor soma na mensalidade mostrada no checkout (E7/`/plano`), com explicação sucinta de que foi adicionado por causa da escolha. Implementado: pergunta realocada pra `FaixaView` (E5F, gate), trava o Continuar; `/plano` (`PlanoView`+`PlanoOferta`) mostra o valor somado com a explicação; C4 (`/dossie/empresa`) não pergunta mais, só confirma (card read-only). Mecânica de threading via `?endereco=fiscal` (`lib/endereco.ts`), mesmo padrão já usado por `lib/regime.ts` (MEI×ME).

**Não implementado desta rodada:** item 3 (cobranças adicionais recorrentes) foi descartado pelo próprio Pedro ("foi delírio, não faz sentido, ignora"); item 5 (calculador do Fator R) foi marcado "não precisa" — nenhum dos dois entrou em código.

Todos os 3 itens foram aplicados em 3 camadas: `execucao/flow/flow-data.mjs` (doc + diagrama regenerado via `gerar-mapa.mjs`, v26), `app/src/app/apresentacao/page.tsx` (changelog + carrossel), e o mockup real (`app/src/components/*`, `app/src/app/*`). Typecheck (`tsc --noEmit`) e lint rodados limpos. Dev server local rodando em `http://localhost:3000` pra conferência.

## 📋 Tabela — mantém × ajusta × cria (pontos que tocam telas do app)

| # | Tópico (da reunião) | Tela/nó do flow | Classificação | Detalhe |
|---|---|---|---|---|
| 1 | Card fixo do sócio principal (titular): nome imutável, % ajusta automático conforme os demais sócios são preenchidos; convite de assinatura pros outros sócios via link dinâmico de WhatsApp | C3_1 (`/dossie/socios`) | 🟡 **AJUSTA** | C3_1 hoje só coleta nome + % dos sócios EXTRAS (quantidade fixa, vinda da triagem). O card fixo do titular (ele sempre "sócio 1", dados pré-preenchidos, % dele diminuindo conforme os outros aumentam) foi cogitado no 19/08 ("talvez vale a pena", não travado) — esta reunião detalha e reforça a ideia, mas ainda não está implementada |
| 2 | Endereço fiscal cobrado no MESMO ato do pagamento inicial (não na fatura seguinte); se escolhido, a tela de "endereço pessoal" é pulada | E5F (`/gate`) → E7 (`/plano`) → C4 (`/dossie/empresa`) | ✅ **IMPLEMENTADO 26/08** | Pedro esclareceu: a pergunta sai do C4 e vai pro gate, ANTES do cadastro; o valor soma no `/plano` com explicação. Feito: `FaixaView` pergunta e trava o Continuar; `PlanoView`/`PlanoOferta` somam e explicam; `EmpresaView` (C4) só confirma, não pergunta mais. Threading via `?endereco=fiscal` (`lib/endereco.ts`) |
| 3 | Cobranças adicionais recorrentes (recálculo de guia R$15,90, certidão R$35) — tela de confirmação antes de ativar, mecânica de "carrinho" | nenhum nó encontrado | ❌ **DESCARTADO 26/08** | Pedro: "foi delírio, não faz sentido, ignora". Sem ação |
| 4 | CNAE secundário — regra confirmada: a alíquota MAIS ALTA sempre prevalece (nunca faz média) quando o secundário muda o enquadramento | C5 (`/dossie/cnae-secundarios`) | 🟡 **AJUSTA/CONFIRMAR** | C5 já avisa quando o secundário muda enquadramento (24/08, reunião Leonan). A regra matemática exata (sempre a maior, nunca média) foi confirmada nesta reunião mas ainda depende de validação formal com o Leonan — vale checar se o motor de cálculo já reflete isso |
| 5 | Calculador do Fator R dedicado (3-4 campos: prolabore, folha, faturamento) — regra ~28% de folha/prolabore entra no Anexo III | A1 (`/revisar`) ou node novo | ❌ **NÃO PRECISA (26/08)** | Pedro: "não precisa". Sem ação |
| 6 | Taxa da Junta (DAE): só é paga DEPOIS do deferimento da viabilidade, via link/CTA visível gerado pelo RPA (não na validação inicial) | A3 (`/painel`) | ✅ **IMPLEMENTADO 26/08** | Pedro decidiu: cobrar depois, quando sair a viabilidade. `painel.tsx` ganhou 4ª etapa com CTA coral (`acaoCliente`/`onPagarDae`) |
| 7 | Certificado digital movido pra ANTES da assinatura final; assinatura do contrato social + procuração feitas JUNTAS (mesmo certificado) | A3_2 novo (`/certificado`) → A4/A5 (`/assinatura`, `/home-dia1`) | ✅ **IMPLEMENTADO 26/08** | Pedro decidiu: passar pra antes. Nó novo `A3_2` (`CertificadoGateView`) entre painel e assinatura; trilha pós-assinatura atualizada (certificado "feito", não mais "agora") |
| 8 | Campo de senha do certificado digital (além do arquivo/código) — ideia de usar a MESMA senha do login do app | `/mais/certificado` (upload já existente) | 🟡 **AJUSTA/CONFIRMAR** | Segundo a nota de 19/08, o upload de certificado (.pfx/.p12 + senha) já existe. A "novidade" desta reunião é só a IDEIA de qual senha usar (mesma do app, ainda não decidido — "vamos ver"). Vale confirmar se o campo senha já está implementado (parece que sim) |
| 9 | Migração: pergunta "você possui certificado digital?" | `MigrarDiagnosticoView` (`/migrar/diagnostico`) | 🟢 **MANTÉM** | Já existe desde 06/08, confirmado na nota de 19/08 ("não é gap"). A reunião revisitou o ponto sem saber que já estava resolvido — nenhuma ação necessária |
| 10 | Migração: dados do contador atual (escritório, e-mail, telefone, CRC) — só CRC é obrigatório, resto opcional | `/migrar/contador` (rota já existente) | 🟡 **CONFIRMAR** | Rota já existe. Não confirmei no código se a regra "só CRC obrigatório" já está implementada assim — fica pendente de checagem, não presumir |
| 11 | Migração: % de participação societária vem TRAVADA (não editável), puxada do CNPJ real — zero alteração societária nesse fluxo | `/migrar/socios` (rota nova, criada após 19/08) | 🟡 **CONFIRMAR** | Rota nova, reusa `SociosView` com `contexto="migrar"`. Não confirmei se o campo de % já é read-only nesse contexto — pendente de checagem |
| 12 | São Paulo terá API única cobrindo constituição E migração (diferente de MG, que depende de RPA) | — | 🟢 informativo | Só relevante na expansão geográfica pra SP — sem ação de tela agora, registrar como nota de roadmap |

## Fora do escopo desta tabela (não são tela, não entram)

RPA em si (Node vs Python, plataforma Hermes), arquitetura de CRM/Kanban (7 pipelines), operação de certificado terceirizado (entrevista por vídeo), custos InfoSimples (R$0,18-0,22/requisição, créditos R$200-500), segurança de armazenamento de certificado (S3, criptografia Base64) — tudo relevante pro produto, mas não é "tela do app" e fica fora desta tabela por pedido do Pedro.

## Links
- Fonte: `Downloads/Rua Satélite 36-transcript.txt` + `Rua Satélite 36-Summary.md`
- [[2026-08-19-realinhamento-leonan-flow-constituicao-migracao]] (mesmo formato, meeting anterior da mesma série)
- `execucao/flow/flow-data.mjs`
