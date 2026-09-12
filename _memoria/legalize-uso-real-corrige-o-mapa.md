---
name: legalize-uso-real-corrige-o-mapa
description: 12/09 - emitimos NF de verdade no lider e o uso real achou 3 erros conceituais que nenhuma leitura de documentacao pegaria.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cbb7b89d-050e-4561-afd5-8e64e076beca
  modified: 2026-09-12T21:43:50.847Z
---

🔑 **Varredura crua desenha o que PRECISA acontecer. Só o uso real mostra o que
ACONTECE.** As duas fases são necessárias, e a segunda **não é conferência: é
correção.**

Em 12/09 emitimos uma **NF real** na plataforma do líder (nº 6, R$ 9.895,00,
`PROCESSADO_SUCESSO`), com protocolo: eu preencho, colo a tela de revisão
literal, o Pedro confere e autoriza, só então clico. O mapa cru de Notas já
estava escrito e **fechado** — e mesmo assim tinha **três erros conceituais**:

1. **O ISS segue o LOCAL DA PRESTAÇÃO, não o endereço do cliente.** O mapa
   perguntava *"o cliente fica onde?"*. Os dois só coincidem nos códigos de
   operação em que o local é o domicílio do adquirente (o nosso `100301`).
2. **Retenção de ISS é LISTA FECHADA da lei municipal**, não escolha do cliente.
3. ***"O órgão aceitou"* não é binário.** São três status independentes —
   `situacaoNota`, `situacaoNFe`, `situacaoCnae` — e um deles marca **ressalva
   silenciosa de CNAE**: a nota vale e guarda risco fiscal.

E cinco buracos que mexem em imposto, sendo o maior a **competência**: a nota
saiu com `competencia: 12/09/2026` enquanto a descrição dizia *"referente ao mês
de agosto"*. **O texto é decorativo.**

**Por que nenhuma leitura pegaria:** os três erros são sobre como a regra se
aplica, não sobre o que a regra diz. Documentação descreve campos; o uso mostra
o encadeamento.

⚠️ **E a lição paralela:** eu reportei "5 ajudas", depois "6", e eram **10** —
as outras cinco só apareceram varrendo o DOM atrás de conteúdo oculto.
**Contar o que está na tela não é contar o que existe.**

Ver [[legalize-modo-cru-varredura-categoria]] e
[[legalize-metodo-teardown-funcionalidade]].
