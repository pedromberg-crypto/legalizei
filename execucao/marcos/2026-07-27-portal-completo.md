---
tipo: marco
status: registro
data: 2026-07-27
assunto: portal-interno-construido
tags: [produto, ui, portal, notas, impostos, mais, billing]
---

# 🏁 2026-07-27 — Portal interno construído (16º flow)

> Sessão longa de UI. O portal (dia-2) virou app navegável ponta a ponta no `/mockup-home`. **Tudo mockup/farol** (sem backend, sem fiscal ratificado); `tsc`+`eslint` limpos em tudo. Review de UI = do Pedro (não abri navegador; só `tsc`/`eslint`).

## O que ficou construído
- **Emitir NF-e** (`/emitir`): revisar→emitir→enviada (bottom-sheet 2 fases + confete), "Ver todos" clientes (sheet busca), pills de valor por-cliente, repetir última nota, corrigir-e-reemitir. Número-guru por-nota removido (aponta pra Impostos).
- **Notas**: P5 lista-gestão (busca + filtro por status escopado ao mês + seletor de mês + ver mais + exportar + alerta recusadas + vazio); P7 visualizador status-aware + documento em tela cheia + enviar por canal + corrigir-e-reemitir. Card = componente único [[nota-linha]] (avatar iniciais + dot de status), home↔P5.
- **Impostos**: dashboard (carrossel DAS+INSS · vigília fiscal reusada · guias anteriores clicáveis · calendário) + `/impostos/guias` (estrutura da P5) + **pagar virou VER/BAIXAR guia** (não intermediamos pagamento) com **copiar código de barras**; status-aware por param.
- **Mais** (hub) + **Perfil** reorg (só a Conta; empresa/sócios/docs → Mais; lápis no avatar) + **Gerenciar plano** (`/mais/plano`: próxima fatura com avulsos adicionados, trocar pagamento c/ Pix + adicionar, faturas, cancelar) + **Loja de serviços avulsos** (`/mais/servicos`, conversão; recalcular guia → seletor de guia vencida).

## Decisões de produto (travadas nesta sessão)
- **Não intermediamos o pagamento de guia** (por ora): mostramos/baixamos a guia + copiar código de barras; a pessoa paga no banco/lotérica/Pix. Status atualiza por reconciliação.
- **Serviço avulso não cobra na hora** — entra na próxima fatura (modelo Contabilizei), removível antes de fechar.
- **Débito automático do DAS** = benefício do plano mensal (não é toggle solto na tela de impostos).
- **Recalcular guia** só em guia **vencida ≥1 dia**.
- **Perfil** = só a Conta; o "currículo da empresa" (dados/sócios/documentos) mora em **Mais**.
- **DS:** card = `rounded-2xl` (16px), nunca `rounded-xl` (24px) → [[legalize-card-radius-padrao]].

## Também nesta sessão (não-UI)
- [[pipeline-leads-por-etapa.md]] — reformulei o Board A do kanban de leads: dono-da-pausa (ping-pong) → **etapas ordenadas forward-only**, ancoradas nas 5 pausas do flow.

## Aberto / próximo
Lapidar detalhes · o FISCAL (Larissa: alíquota efetiva/Fator R, tomador baixado = pergunta H, DAS) · flow #2 (migrar) · reconciliar spec-portal × matriz P0–P14 · preço+baldes+parceiro-certificado com Mauro.

## Links
[[HOME]] · [[backlog-telas-portal]] · [[nota-linha]] · [[legalize-card-radius-padrao]] · [[pipeline-leads-por-etapa]]
