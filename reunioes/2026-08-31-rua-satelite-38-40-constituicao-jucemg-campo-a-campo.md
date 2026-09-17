---
tipo: historico
status: vivo
data: 2026-08-31
fonte: "Rua Satélite 38/39/40 (vídeo+transcrição) + Tela 1/Tela 2 (áudio+transcrição, mesma reunião, 2ª captação) — Downloads/Transcrições Reunião/ (Pedro Maia, Isabela/especialista contábil, Thiago/dev, Natanael Dev)"
deriva_de: [dados-coletados-abertura-ate-viabilidade]
deriva_de_codigo: [produto/me/entrar/constituir/checklist-validacao-jucemg.html]
tags: [reuniao, produto, rpa, jucemg, dbe, fiscal, decisao, pendente-validacao]
---

# 🖥️ Rua Satélite 38-40 — constituição JUCEMG campo a campo, gravação de tela real (31/08/2026)

> Reunião de gravação de tela: Pedro + Isabela (contadora, 22 anos escritório) rodaram uma consulta de viabilidade REAL na JUCEMG, ponta a ponta, até o DAE/assinatura, com Thiago/Natanael (dev) anotando cada regra de negócio pro RPA. **Duas capturas da MESMA reunião** (vídeo: RS38→RS39→RS40; áudio: Tela 1→Tela 2) — cruzei as duas, são idênticas em conteúdo (só achei 2 detalhes a mais na captura de áudio: menção ao **ContaAzul** como concorrente a olhar, e confirmação verbal de que **"o CNPJ é gratuito"**, sem custo além do DAE).
>
> Esta é a fonte MAIS primária que já tive pro fluxo real da JUCEMG/Receita Federal — mais forte que o PDF oficial (que só descreve os passos, não os valores fixos de cada campo). Cruzei linha a linha contra `checklist-validacao-jucemg.html` (o artifact interativo já publicado) e `dados-coletados-abertura-ate-viabilidade.md`. **Nada foi alterado em código/checklist ainda** — Pedro pediu pra registrar aqui primeiro e debater depois.

## 📋 Tabela — mantém × ajusta × cria (contra o checklist já publicado)

| # | Campo/regra (da reunião) | Onde vive hoje | Classificação | Detalhe |
|---|---|---|---|---|
| 1 | Tipo de Unidade (JUCEMG) = **"Produtiva"** (não existe mais Sede/Filial pra empresa nova — toda constituição É matriz) | `int-tipo-unidade` (checklist) | 🔴 **AJUSTA** | Checklist hoje diz "Sede". Real: Sede/Filial nem aparecem como opção fixa relevante — o valor certo é Produtiva. Confirmado 2x (RS38 e Tela 1) |
| 2 | RG **não é mais obrigatório** — CPF é o identificador principal na Junta hoje | `c1-rg` (status "oficial") | 🔴 **AJUSTA** | Campo virou opcional na prática (RS39: "o campo deixou de ser obrigatório"). Rebaixar pra "pendente" ou reclassificar texto |
| 3 | Área utilizada = **20m² fixo** | não existia (`int-metragem` estava "não implementado") | 🟢 **CRIA/RESOLVE GAP** | Valor real e travado, confirmado 2x. Resolve o 🟡 que a nota `dados-coletados-abertura-ate-viabilidade.md` já sinalizava como pendente |
| 4 | Acesso ao endereço = **"Pedestre"** (sempre) | não existia | 🟢 **CRIA** | Campo novo, fixo, não mapeado antes |
| 5 | "Atividade exercida no local?" = **sempre Não** (principal e secundárias) → habilita automático "Escritório administrativo" | não existia | 🟢 **CRIA** | Lógica condicional nova — a Prefeitura só libera "escritório administrativo" se TODAS as atividades forem marcadas como não-exercidas-no-local |
| 6 | Apartamento + sócio não reside no local = **INDEFERIMENTO real** (visto ao vivo, refizeram a viabilidade) | `c4-residencia-socio` (descrito como "trava duplicidade") | 🔴 **AJUSTA — descrição errada** | Não é regra de duplicidade, é regra de DEFERIMENTO da Prefeitura de BH. Reescrever justificativa: "se apartamento, sócio TEM que residir lá, senão indefere" |
| 7 | Valor nominal de cotas = **R$1,00 fixo** | não existia | 🟢 **CRIA** | Campo novo, interno, sempre R$1,00 |
| 8 | Data de assinatura / início de atividade = **sempre o dia do preenchimento**, nunca retroativa | não existia | 🟢 **CRIA** | Regra pro RPA, campo interno |
| 9 | Capital social = **R$10.000 fixo** pra prestador de serviço | `c4-capital-social` (já existia como campo do cliente) | 🟡 **CONFIRMA + trava** | Já mapeado, mas a reunião fecha que é regra de negócio TRAVADA (não sugestão) — Izabela validou ao vivo |
| 10 | Profissão do **titular** = sempre **"empresário"** | só existia pro sócio extra (`socio-extra-profissao`) | 🟢 **CRIA (gap simétrico)** | Falta o campo espelho pro titular — mesma exigência, hoje só mapeada pro sócio extra |
| 11 | Qualificação do representante = sempre **"sócio-administrador"** | não existia | 🟢 **CRIA** | Campo novo, interno, DBE |
| 12 | E-mail/telefone de contato (DBE) = **sempre nosso**, nunca do cliente (evita BO/notificação vazar pro cliente) | parcialmente coberto (memória vault já cita e-mail contabilidade) | 🟡 **AJUSTA nuance** | Faltava o motivo exato (evitar BO chegar pro cliente por e-mail) — vale documentar como justificativa |
| 13 | Telefone sempre **sem o 9º dígito** (8 dígitos) | não é campo, é regra de formatação do RPA | 🟢 **ANOTAR (não é campo)** | Não vira item de checklist, mas o RPA precisa saber |
| 14 | Endereço do contabilista (Mauro, PF) = usa **endereço da Legalize** mesmo em campo de pessoa física | já era dúvida aberta (Sugestões da IA do Summary) | 🟡 **DÚVIDA JURÍDICA ABERTA** | Ninguém confirmou se é válido — Speaker 2 perguntou "não é impeditivo?" e Izabela disse que não, mas sem base legal citada |
| 15 | Enquadramento sempre **ME**, até R$30k/mês de faturamento (R$360k/ano) — acima disso vai pra atendimento interno/EPP. Taxa da Junta ME ≈ **R$282** | já mapeado em memória (`legalize-cnae-fiscalmente-otimo` etc) | 🟡 **CONFIRMA com número exato** | Fecha o valor exato da taxa (R$282) e o teto mensal (R$30k) numa frase só |
| 16 | 2 assinaturas GOV.BR separadas: **Junta Comercial** + **Receita Federal (DBE/CNPJ)**, intervalo de ~5min entre elas. Nível **Prata/Ouro** obrigatório + **2FA tem que estar ATIVA** (oposto da Contabilizei) | já corrigido no checklist (Passo 16 subpassos) | 🟢 **CONFIRMA** | Bate 100% com o que já ajustei — inclusive o detalhe do intervalo de minutos entre as 2 assinaturas, que eu não tinha |
| 17 | **Procurações ainda SEM decisão fechada** — procuração da Junta "não justifica" (mesmo trabalho de assinar 1x vs 2x); procuração e-CAC só dispensa **se cliente tiver certificado digital ativo na plataforma** (emitir certificado pra cliente também sem decisão, custo a validar) | checklist já tem sub-passo de procuração e-CAC no Passo 16 | 🔴 **CONTRADIZ o que constrí** | Essa reunião é MAIS RECENTE que a doutrina de julho (UX-31) que eu usei — ali ficou dito que procuração da Junta "não faz sentido pedir" (responsabilidade fica com a Legalizai, não com uma procuração formal). Precisa reabrir esse ponto com o Pedro antes de manter o sub-passo como está |
| 18 | Mecanismo real da "pilha pulmão" de DAE — Legalizai mantém guias pré-pagas em nome própria, cliente paga um boleto interno (PIX/cartão, nunca boleto pro DAE em si) que é "reembolso", robô associa a taxa pré-paga, SÓ libera assinatura depois do pagamento do cliente compensar | já documentado em `passo15-dae`/`passo16-protocolo` (versão resumida) | 🟡 **DETALHA implementação** | O checklist já tem a ideia certa; a reunião acrescenta o COMO (API ASAS, webhook reconhece boleto interno, trava a assinatura até compensar) — mais operacional que dado de checklist, mas vale nota separada de arquitetura |
| 19 | CNPJ **liberado gratuitamente** (sem taxa extra da Receita Federal além do DAE da Junta) | não estava explícito | 🟢 **CONFIRMA (achado da 2ª captação)** | Detalhe só na captura de áudio (Tela 2) |
| 20 | Concorrente **ContaAzul** citado (além de Contabilizei) como referência a estudar na etapa de assinatura | não mapeado | 🟡 **BACKLOG DE PESQUISA** | Vale um teardown rápido tipo o que já existe pra Contabilizei |

## 🗺️ Telas identificadas na gravação (pra achar no vídeo/áudio original)

Cronológico, arquivo → conteúdo:

**RS38 / Tela 1** — Nova Viabilidade (JUCEMG):
1. Tipo evento (101, inscrição 1º estabelecimento matriz) → tipo enquadramento (ME/EPP) → natureza jurídica (2062 sempre)
2. CEP + seleção de imóvel no mapa (IPTU) → índice cadastral
3. Tipo de unidade/forma de atuação (Produtiva / atividade fora do estabelecimento)
4. CNAE principal + secundário (73.19-0-04 + 70.20-4-00-99, exemplo usado)
5. "Atividade exercida no local?" (sempre Não) → "sócio reside no local?"
6. Nome empresarial (3 opções) → objeto social → protocolo final
7. **Tela de indeferimento real** (apartamento sem sócio residente) → "Cancelar viabilidade" → refeita com sucesso

**RS38/39 / Tela 1** — Rede SIM / DBE:
8. Consulta protocolo, campo verde + link azul "DBE documento básico" (liberação)

**RS39 / Tela 1** — Integrador (Novo FCN):
9. Natureza jurídica 2062, ato 090, eventos JUSEC (enquadramento microempresa)
10. Dados financeiros: valor nominal cotas (R$1), capital integralizado (R$10mil), datas
11. "Editar sócio" (ícone amarelo "Validação") — nascimento, identidade, nacionalidade

**RS40 / Tela 2** — Contrato/DAE/Assinatura:
12. Estado civil + regime de bens (condicional) + profissão (sempre "empresário")
13. "Contrato próprio ou padrão da Junta?" (sempre padrão)
14. Capa do processo (local assinatura=BH, capital integralizado=sim, pausas obrigatórias=15)
15. DAE — emitir guia (CPF do cliente), status "pagar guia"
16. Registro Digital — assinantes, protocolo
17. Assinatura GOV.BR (link, 2FA, nível conta) — demo de link em guia anônima
18. Rede SIM final — CNPJ nacional, declarações, libera CNPJ (gratuito)
19. Demo à parte: geração de guia avulsa em nome da Legalizai (pilha pulmão)

## Fora do escopo desta tabela

Discussão de arquitetura RPA (SPDD, Node/Python), papo pessoal/técnico de equipe, negociação de certificado digital com certificadoras — relevante pro produto mas não é campo de checklist.

## Links
- Artifact vivo: `produto/me/entrar/constituir/checklist-validacao-jucemg.html` (https://claude.ai/code/artifact/2be1bf3a-ce37-47d9-9489-903df7046db6)
- Fonte: `Downloads/Transcrições Reunião/Rua Satélite 38-transcript.txt`, `39`, `40` + `Tela 1-transcript.txt`, `Tela 2-transcript.txt` (e respectivos Summary.md)
- [[dados-coletados-abertura-ate-viabilidade]]
- [[2026-08-25-rua-satelite-36-fluxo-constituicao-telas-app]] (reunião anterior da mesma série, formato igual)
