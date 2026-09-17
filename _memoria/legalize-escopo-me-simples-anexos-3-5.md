---
name: legalize-escopo-me-simples-anexos-3-5
description: "12/09 travado - ME do Simples, Anexos III e V, com ou sem Fator R; virou dado + script que derruba os geradores."
metadata: 
  node_type: memory
  type: project
  originSessionId: cbb7b89d-050e-4561-afd5-8e64e076beca
  modified: 2026-09-12T21:44:04.348Z
---

🔒 **O ESCOPO, travado em 12/09 a pedido do Pedro:** *"trave de alguma forma que
não passe batido que estamos lidando apenas com os enquadramentos que eu te
disse."*

**DENTRO:** ME optante do **Simples Nacional** (`opSimpNac = 3` no leiaute da
NFS-e), **Anexos III ou V**, com ou sem Fator R, serviço, ISS, BH, NFS-e.

🔴 **FORA, e não é "depois":** Anexo I (comércio — emite NF-e modelo 55 pela
SEFAZ, outro sistema inteiro) · atividades regulamentadas · Lucro Presumido e
Real · MEI (tem caminho próprio no app).

🔑 **O enquadramento NÃO é etiqueta, ele MUDA A REGRA.** No mesmo dia eu
desenhei *"valor errado → substitui nota"* e a regra **E0061** do leiaute
nacional proíbe exatamente isso para optante do Simples ME/EPP: a substituição
**não pode alterar tomador, competência nem valor**. Para não optante vale outra
regra (E0060). O escopo estava escrito e eu não apliquei.

**Por isso virou dado + script, não comentário:**
- `produto/me/viver/processos/_escopo.mjs` — a fonte
- `produto/me/viver/processos/verificar-escopo.mjs` — roda dentro dos **3 geradores** e
  derruba a rodada se vocabulário de fora (ICMS, CFOP, NCM, SEFAZ, DANFE,
  Lucro Presumido…) aparecer sem a marca `FORA DO ESCOPO` na mesma linha
- linha no `CLAUDE.md` e selo visível na barra do `/processos`

⚠️ **Onde não chega:** pega **vocabulário, não raciocínio** — o erro da E0061
ela não teria pego. E "Anexo I" e "MEI" ficaram fora da lista por ambiguidade
real no vault (o Anexo I do nosso contrato, o ANEXO_I do leiaute, o ramo MEI).

Ver [[legalize-modo-cru-varredura-categoria]].
