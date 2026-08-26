---
tipo: historico
status: vivo
data: 2026-08-19
fonte: Plaud (1 transcrição + 1 summary, "Leonan 19_08_2026")
deriva_de: [../execucao/flow/flow-data.mjs, ../app/src/app/apresentacao/page.tsx]
tags: [reuniao, produto, fiscal, ux, flow, decisao]
---

# 🤝 Realinhamento com o Leonan — flow de Constituição e Migração (19/08/2026)

> Pedro passou o flow inteiro (`/apresentacao`) tela a tela com o Leonan (contador, ex-Contabilizei), simulando abertura e migração de um cliente Simples/BH. Cruzamento abaixo compara cada achado da reunião contra o estado real do flow em `execucao/flow/flow-data.mjs` (24/08).

## ✅ Atualização 24/08 (2ª rodada) — implementado + achado tardio grave

Depois da tabela abaixo ter sido escrita, todos os itens **CRIA/AJUSTA** relevantes a este documento foram implementados em código (rotas reais + `/apresentacao`, `flow-data.mjs` atualizado até v24). Destaques:

- **Itens 14/15/17 (código GOV 2FA, procuração+assinatura concentrados, status Procuração→Certificado→Ativa):** feito. `CodigoGovView` novo em `wizard-cauda.tsx` (10min, 3 tentativas, escala atendente), reusado também na migração via prop `soProcuracao`.
- **Item 18 (dossiê completo na migração):** feito, mas com **correção de posição séria**. Na 1ª tentativa, os dados base (CPF/RG/estado civil) foram colocados ANTES do pagamento — errado. Relendo a reunião com atenção (achado do Pedro, 24/08 2ª rodada), a ORDEM correta que Leonan e Pedro travaram é: **contador atual → dados base + sociedade → GOV.BR/procuração → transferência**, tudo DEPOIS do pagamento (mesmo grupo de rota do dossiê C1-C7, não do wizard pré-pagamento). Corrigido: `/migrar/dados`, `/migrar/socios` (nova, reusa `SociosView` com `contexto="migrar"`) e `/migrar/gov` (nova) agora vivem em `(app)/migrar/*`, entre `/migrar/contador` e `/migrar/transferencia`.
- **🔴 Achado sério à parte, não vindo da reunião:** ao mover essas telas, descobri que `/migrar/contador`, `/migrar/transferencia` e `/migrar/ativa` **já existiam** como rota real (`(app)/migrar/*`, criadas 06/08/22/07) — meu 1º rascunho tinha duplicado essas 3 sob `(wizard)/migrar/*`, quebrando o build (rota conflitante). Ao corrigir, achei 2 bugs pré-existentes nessas páginas (não relacionados à reunião, mas descobertos no processo): `MigrarAtivaView` sem `onSeguir` ("Ir pro meu painel" não navegava) e `MigrarTransferenciaView` sem `onAcaoTravado` ("Falar com quem está cuidando" não navegava). Os dois corrigidos.
- **Certificado digital na migração (item 20):** já estava certo desde 06/08 — `MigrarDiagnosticoView` (`/migrar/diagnostico`) pergunta "tem certificado?" pré-pagamento, e `/mais/certificado?status=pendente` já tinha upload real (.pfx/.p12+senha) pra quem responde "sim". Não é gap, confirmado nesta rodada.

## 📋 Tabela — mantém × ajusta × cria

| # | Tópico (da reunião) | Nó(s) do flow | Classificação | Detalhe |
|---|---|---|---|---|
| 1 | CNAE secundário: até 15, fora do mesmo segmento, campo de busca restrito à lista atendida, alerta de desenquadramento troca "Continuar"→"Falar com atendente" | C5 | 🟡 **AJUSTA** | Hoje só sugere secundárias de mesmo-imposto (decisão 21/07); falta busca (Jéssica já pedia), reformular texto ("secundário não precisa ser do mesmo segmento") e o roteamento pro atendente quando desenquadra |
| 2 | Limite de sócios sobe de 2/3+ pra **até 4**; 5+ vai pra atendimento humano com aviso de complexidade de assinatura | E5T, E5_5, C3 | 🟡 **AJUSTA** | Hoje travado em 2 (`E5T`/`C3` dizem "limite 2 ok"); reunião muda o número E pede mensagem proativa avisando que 4 sócios = assinatura de todos lá na frente |
| 3 | Sócio mora fora do Brasil → atendimento interno explica opções (fica fora do Simples) | E5T, E5_4 | 🟢 **MANTÉM** | Já existe exatamente assim; reunião só confirma manter o caminho, com sugestão de reposicionar a pergunta pra mais cedo (junto do item 4) |
| 4 | Sócio via CPF ou CNPJ — se CNPJ, automaticamente sai do Simples (só presumido/real), plano muda de R$139→R$189, aviso explicando a troca | *nenhum* | 🔴 **CRIA** | Não existe hoje nenhuma pergunta "seu sócio será vinculado via CPF ou CNPJ" nem lógica de upgrade automático de plano. Novo — antes de tudo, junto do item 3 |
| 5 | Percentual de participação: incrementos de 0,05, bloquear 100% pro titular quando há outro sócio, card completo por sócio (endereço, estado civil, regime de casamento, documentos) | C3_1 | 🔴 **CRIA** (+ 🟡 ajusta trava) | Hoje C3_1 só pega nome completo + % (soma 100%, sem incremento fixo nem trava de 100% pro titular). O card completo de dados do 2º sócio (mesmos dados do titular) não existe — precisa ser criado |
| 6 | Endereço: 3 opções (próprio, coworking, endereço virtual); alerta de IPTU subir se residencial; travar duplicidade de endereço entre 2 sócios | C4 | 🟡 **AJUSTA** | Hoje só tem "endereço próprio ou fiscal Legalizai" (falta opção coworking) e IPTU já é obrigatório, mas sem o alerta de "pode subir se for residencial" nem trava explícita de duplicidade entre sócios |
| 7 | Capital social: sugerir valor simbólico inicial com texto explicativo, ajustável depois | C4 | 🟡 **AJUSTA** | Campo já existe (input livre); falta o texto explicativo + valor sugerido simbólico |
| 8 | Natureza jurídica: SLU pra individual (sem outra opção), LTDA senão, com explicação de proteção patrimonial | C6 | 🟢 **MANTÉM** (+ copy) | Lógica já bate 100% com o que o Leonan validou; só falta incorporar o racional jurídico (bens não se misturam) como texto explicativo na tela |
| 9 | Razão social: 3 opções editáveis por prioridade de tentativa, nome fantasia opcional | C7 | 🟢 **MANTÉM** | Já implementado exatamente assim (28/07) |
| 10 | Objeto social **travado** (read-only) — evita erro de grafia que gerava reclamação real no escritório antigo | C7 | 🔴 **AJUSTA (conflito)** | Doc atual do flow diz objeto social "editável" — reunião trava o oposto. É uma correção real a aplicar, não só refino |
| 11 | Revisão final (dossiê) mais completa: TODOS os dados dos sócios + endereço (próprio × fornecido) explícitos, não só dados básicos | A1 | 🟡 **AJUSTA** | A1 hoje é recap read-only "carry-forward"; falta garantir que sócios e origem do endereço apareçam explicitamente, não só resumo básico |
| 12 | Sugestão de enquadramento tributário (Simples/Anexo 3) com ressalvas de faturamento/Fator R/atividade | A1 | 🟢 **MANTÉM** | Já previsto (enquadramento e pró-labore sugeridos pelo sistema, 28/07) |
| 13 | Etapa GOV unificada: login + nível (bronze/prata) + upgrade orientado | A4, A4G | 🟢 **MANTÉM** parcial | A4G (nível bronze→upgrade) já existe inline no A4; falta só concentrar com os itens 14-15 abaixo |
| 14 | Código de validação (2FA) do GOV: janela de 10min, até 3 tentativas automatizadas, escalar pra atendimento humano se falhar | *nenhum* | 🔴 **CRIA** | Não existe hoje nenhum node/lógica pra isso — é o ponto mais técnico levantado (a única "trava" real no fluxo GOV) |
| 15 | Concentrar pedido de código pra procuração E assinatura no MESMO momento (só 1 rodada de espera, não 2) | A4 | 🔴 **CRIA/AJUSTA** | Decisão nova da reunião (antes a procuração viria antes; virou "joga tudo pra depois da Constituição", mesmo código serve pros dois). A4 hoje não modela procuração como etapa própria |
| 16 | Links de assinatura por e-mail/WhatsApp pros sócios (rastreável) | A4 | 🟡 **AJUSTA** | "Convite 2º sócio" já é pendência anotada no A4, mas não como link formal de assinatura com canal e rastreabilidade |
| 17 | Novos status dedicados: **Procuração → Validação do certificado digital → Empresa ativa**; ponto de anexar certificado, com oferta de compra no app | A4, A5 | 🔴 **CRIA** | Hoje A5 trata certificado como "item 2/3 da própria trilha", sem status/tela dedicada nem oferta de compra — a reunião pede tornar isso explícito em 3 estados |
| 18 | Migração: coletar TODOS os dados base de constituição (CPF, RG, sócios, estado civil...) — cartão CNPJ **não traz isso**, só o que a API cadastral cobre | E4_2 → C1-C7 | 🔴 **CRIA** | Achado importante da reunião: hoje o flow de migração (E4_2...E9) não redireciona explicitamente pro mesmo dossiê C1-C7 do caminho abrir. Falta a etapa "preenche dados base completos" no caminho migrar |
| 19 | Renomear status finais: abrir = "Sua empresa foi constituída"; migrar = "Iniciando o processo de transferência" + "Estamos entrando em contato para encerrar o vínculo com a contabilidade antiga" | E9_4 (migrar) | 🟡 **AJUSTA** | Labels atuais ("Migração concluída"/"Aguardando TTRT") não usam essa copy específica que o Leonan validou |
| 20 | Anexar certificado digital preferencialmente pelo CLIENTE (não depender do escritório anterior mandar por e-mail) | E4_3 | 🟡 **AJUSTA** | E4_3 já pergunta "tem certificado?" (sim/não); falta o STEP de upload/anexo de fato, não só a pergunta binária |
| 21 | **CRC do contador atual é OBRIGATÓRIO** (trava o Continuar se faltar) | E9_2 | 🔴 **AJUSTA (conflito)** | Doc atual diz CRC "opcional" — reunião trava o oposto explicitamente ("eu preciso do número do CRC de qualquer forma"). Correção real, não refino |
| 22 | Lucro Presumido fora do MVP; Anexo 4/regulamentados adiados (Advogado como 1ª frente futura, campo OAB) | E4_2B_1, waitlist | 🟢 **MANTÉM** | Já é a decisão vigente (04/08); reunião só reafirma e aponta Advogado como próxima fronteira **pós-MVP**, "vai levar até meses" — não é escopo imediato |
| 23 | IA/OCR pra ler documento (CNH/PDF) e autopreencher, com conferência obrigatória do usuário | E6, C1 | 🔴 **CRIA** | Hoje é preenchimento manual + mock de validação; a leitura por IA com conferência humana ("preenchemos pra você, mas confira") é proposta nova |
| 24 | Texto de vínculo INSS confuso, precisa reescrever pra clareza (CLT × pró-labore × Fator R) | C2 | 🟡 **AJUSTA** | Copy, não estrutura — o próprio Léo (Leonan) achou o texto atual "muito blocado" |

## 🔴 2 conflitos reais (doc do flow diz uma coisa, reunião trava o oposto)
- **Item 10 — Objeto social:** flow-data diz "editável", reunião trava "bloqueado/read-only".
- **Item 21 — CRC do contador (migração):** flow-data diz "opcional", reunião trava "obrigatório, sem ele não segue".

Esses 2 valem correção prioritária em `flow-data.mjs` antes de qualquer outra coisa — são afirmações contraditórias sobre o mesmo campo, não só refino de UX.

## Resumo por classificação
- 🟢 **Mantém:** 7 itens (3, 6[parcial], 8, 9, 12, 13[parcial], 22)
- 🟡 **Ajusta:** 11 itens (1, 2, 6, 7, 11, 16, 19, 20, 24 + os 2 conflitos)
- 🔴 **Cria:** 6 itens (4, 5[parcial], 14, 15, 17, 18, 23)

## Links
- [[../execucao/flow/flow-data.mjs]] · [[2026-07-13-alinhamento-pedro-dev-leonam]] · [[../HOME]]
