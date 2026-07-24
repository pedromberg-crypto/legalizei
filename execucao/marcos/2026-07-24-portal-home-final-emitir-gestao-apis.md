---
tipo: marco
status: vivo
data: 2026-07-24
assunto: portal-home-final-emitir-gestao-apis
tags: [portal, home, emitir, gestao, apis, marco]
---

# 🏁 Marco 2026-07-24 — o portal virou app: home final + Perfil + Emitir + gestão + APIs

> 15º flow (23–24/07). Sessão longa: o portal interno saiu do papel (home montada, Perfil, Emitir), a gestão do app foi definida, e as APIs de órgãos foram validadas e viraram autoridade.

## 1. Home final (Campeã) montada peça a peça
Visualizador novo `/mockup-home` (top-level, phone-frames): **6 versões A–F** (3 tons × 2 levas) + a **★ Campeã** montada com o Pedro validando trecho a trecho (prints). Composição final: Cabeçalho (saudação + **pill CNPJ copiável** + **avatar→link Perfil**) → Próximo compromisso → Atalhos rápidos (grid) → Notas recentes (design das Movimentações) → Aprenda com a gente (**cards de gradiente escuro + imagem mock**) → Quem cuida. Vigília fiscal reworkada (gauge cortado → cards de alíquota/Fator R + **alerta preditivo**). Cabeçalhos padronizados ("Ver tudo", sem seta). Híbridos em `components/lab/campea-blocks.tsx` + `vigilancia-blocks.tsx`.

## 2. Navbar flutuante de verdade
O "fundo fixo atrás da navbar" era **painel morto que eu mesmo criei** (padding no `.app-main`, fora do scroll). Corrigido: barra `absolute` sobre o conteúdo que rola atrás, respiro **dentro** do scroll (escopo `:has`, wizard intocado), **sombra pra cima** (a de baixo caía fora da tela). Aba ativa = **ícone+rótulo coral** (filete removido). CTA central = **"NF-e"** Sora bold, +10%.

## 3. Perfil (do avatar) `/perfil`
Um **currículo da empresa**, não config: track record (tempo de CNPJ · notas · faturado) + credenciais fiscais + abas **Empresa · Sócios · Documentos · Conta** (absorvem P12+P13+P14 da matriz) + **honestidade antes do toque** (o que só muda por alteração contratual paga) + CTA humano. Drill-down (sem navbar, back assume).

## 4. Emitir NF-e (P6) `/emitir` — ⏸️ em edição
1 tela: favorecido (bolhas por frequência de emissão, rótulo 2 linhas, "Consumidor final" B2C, "Novo cliente" com ficha + toggle salvar-na-base) + valor (prévia viva do imposto) + serviço **travado** (sem "Alterar" — decisão A). **Autofill por CNPJ** (a API pública puxa tudo, campos travados no ativo + aviso na baixada), máscaras CNPJ/CPF. **Fiscal validado (pesquisa):** B2C = "Consumidor final" · tomador de outro município/inativo emite normal · baixado/extinto = dúvida → **Larissa (pergunta H)**. **Paramos no meio.**

## 5. Gestão do app definida
- [[spec-kanban-leads]] — kanban de leads **por dono-da-pausa** (🟦 nossa · 🟨 externa · 🟧 usuário · 🔵 certificado) + **funil scoped do parceiro do certificado** (login externo escopado, só upload) + gate de validação automático.
- [[handoff-sistema-gestao-dev]] (dev-safe) — 3 setores (Operação/CRM · Métricas/Dashboard · Clientes) sobre **1 camada de dados**; RF-01 sustenta os dois; entidade LEAD/CLIENTE + stream de eventos.
- [[backlog-telas-portal]] — 19 telas do portal, por onda, derivadas da home.

## 6. APIs de órgãos (InfoSimples) validadas → autoridade
`pesquisa/integracoes-apis/` (hub + [[orgaos-e-cobertura-infosimples]] + [[infosimples-funcionalidades]]). Cruzei os órgãos que precisamos (BH) × o catálogo deles, li **cada API** (entrada/saída/auth). Achados: **CNPJ 🔓 puxa TUDO** (confirma o autofill) · **CPF só validar dígito** (decisão — nome exige data de nascimento) · **vigília forte é 🔐** (procuração/certificado; seguimos, o líder também faz) · **emitir NFS-e não é coberto** (RPA/Nacional) · buracos: JUCEMG (só SP) e NFS-e-BH-municipal. **Virou regra dura no [[indice-autoridade]] + memória:** antes de qualquer autofill/consulta, checar essa pasta → corta erro de formulário e **tira validação da Larissa**.

## 7. Certificado + branches (commitado antes na sessão)
Modelo de **parceiro terceirizado + operador externo escopado** travado na [[matriz-portal-interno]] (commit `e32644f`). `debate` + `dash-adm` **mescladas na main**; branches/worktrees/`.bat` removidos → a reorg pendente do 14º flow **está RESOLVIDA**.

## Decisões travadas (para o ADR/fila)
- Serviço na emissão = **travado no CNAE do cadastro** (decisão A, sem editar — risco fiscal pro leigo).
- **CPF: só validar dígito**, não autofill.
- **Funcionários/folha/FGTS = futuro próximo** (líder gateia com "fale conosco").
- **Vigília 🔐 = seguimos** (procuração + assinatura).
- 🕓 Larissa **pergunta H**: campos obrigatórios do tomador na NFS-e BH + emitir pra CNPJ baixado bloqueia?

## Links
[[backlog-telas-portal]] · [[spec-kanban-leads]] · [[handoff-sistema-gestao-dev]] · [[infosimples-funcionalidades]] · [[cruzamento-portal-interno]] · [[matriz-portal-interno]] · [[perguntas-larissa-fiscal]] · [[HOME]]
