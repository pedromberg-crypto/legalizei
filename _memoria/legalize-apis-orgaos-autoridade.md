---
name: legalize-apis-orgaos-autoridade
description: "Antes de criar QUALQUER campo de autofill/consulta/validação de documento no app, consultar pesquisa/integracoes-apis/ — é autoridade sobre o que cada API de órgão entrega. Não chutar."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b1bfd352-3691-4d1c-801a-3bf71e0680a3
  modified: 2026-07-24T15:09:41.026Z
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
