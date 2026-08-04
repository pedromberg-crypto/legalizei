---
name: legalize-apis-orgaos-autoridade
description: "Antes de criar QUALQUER campo de autofill/consulta/validação de documento no app, consultar pesquisa/integracoes-apis/ — é autoridade sobre o que cada API de órgão entrega. Não chutar."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b1bfd352-3691-4d1c-801a-3bf71e0680a3
  modified: 2026-08-04T19:50:16.450Z
---

**Regra dura (Pedro, 24/07):** antes de criar **qualquer campo de autofill, validação de documento ou consulta a órgão** no app (ou na gestão), **consultar `pesquisa/integracoes-apis/`** — `infosimples-funcionalidades.md` (o que cada API entrega + auth) + `orgaos-e-cobertura-infosimples.md` (quem cobre o quê). Registrado como autoridade em [[legalize-vault-organizado|indice-autoridade]].

**Por quê:** a gente já **errou supondo** o que um número puxa. O certo, validado na doc da InfoSimples (provider em avaliação):
- **CNPJ = 🔓 rei:** 1 parâmetro devolve razão, endereço, e-mail, telefone, CNAE principal+secundários, natureza, porte, capital, sócios. Autofill PJ ~100% (confirma a tela Emitir).
- **CPF:** só puxa **nome** se tiver **data de nascimento** → **decisão: só validar o dígito, não autofill** (não é funcional). PF é digitado.
- **Split 🔓 público × 🔐 login/procuração** é a linha divisória: CNPJ/CPF/Simples/CNDs/CEP/DARF são públicos; **Situação Fiscal, REDESIM e CNDs completas exigem procuração/e-CAC/certificado** do cliente → a **vigília forte amarra no certificado** (seguimos: teremos procuração + assinatura, o líder também faz).
- **Emitir NFS-e NÃO é coberto** pela InfoSimples (a API deles só LÊ nota por chave) → emitir vai por RPA/emissor Nacional.
- **Buracos:** JUCEMG (só SP) e NFS-e municipal de BH — ambos escrita/RPA.
- **Futuro:** DAS de MEI (tem) e folha/funcionário (líder gateia com "fale conosco") = 🔮 futuro próximo, fora do MLP.

**Como aplicar:** qualquer "puxar dados por CNPJ/CPF/CEP", consulta de situação/certidão, ou validação de documento → **checar a pasta primeiro**, não a memória nem o achismo. **Objetivo: parar de errar formulário e tirar dezenas de validações da Larissa.** Ligado ao flow ([[legalize-blocos-fluxo-abertura]]), à usabilidade interna (portal) e à gestão do app.

**🆕 04/08 — payload real mapeado, correção importante.** Vi 2 respostas reais da InfoSimples (`receita-federal/cnpj` R$0,20 e `receita-federal/simples` R$0,24) e cruzei campo a campo contra o M1 (`/migrar/cnpj`, "achamos sua empresa") e a Constituição (C1-C7):
- **"CNPJ = 🔓 rei" precisa de matiz:** o endpoint de CADASTRO (`receita-federal/cnpj`) devolve razão/endereço/CNAE/natureza/porte/capital/sócios (nome+cargo, **sem CPF nem %**) + `situacao_cadastral` + `certidao_baixa` — mas **NÃO diz se a empresa é optante do Simples Nacional nem se é MEI**. Isso é OUTRO endpoint (`receita-federal/simples`): `simples_nacional_situacao` + `simei_situacao` (+ históricos de desenquadramento passado/futuro). São 2 consultas pagas separadas, não 1.
- **Endereço estruturado** (`endereco_logradouro/numero/bairro/cep/municipio/uf`) pré-preenche C4 (`/dossie/empresa`) campo a campo — hoje é tudo digitado à mão na Migração.
- `atividade_economica_secundaria_lista` pré-preenche C5 (`/dossie/cnae-secundarios`) inteiro.
- **Decisão de produto (04/08):** rodar a API de Simples/SIMEI (R$0,24) **antes do pagamento** não compensa pra lead que não converteu. Criada `/migrar/tributario` (Simples×Presumido autodeclarado, mesma doutrina da E3.2 MEI×ME) pra não travar a esteira — a API 2 fica pra confirmar de verdade **depois** que a pessoa virar cliente (M4a/ativação fiscal).
- **Achado novo sem tela nenhuma cobrindo:** `simei_eventos_futuros`/`simples_nacional_eventos_futuros` — desenquadramento JÁ AGENDADO (efeito futuro). Nenhum guard-rail hoje.
