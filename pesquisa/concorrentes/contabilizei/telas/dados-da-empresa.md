---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Dados da Empresa — Contabilizei

> **CAI NA HOME (fato observado) — dado mora num dropdown, não numa tela.** O log confirma: URL `#/home`. **Não há rota/tela dedicada** de "Dados da Empresa". Os dados aparecem num **painel dropdown** ancorado ao link discreto **"Dados da empresa e banco"** no canto superior direito, sobreposto à Home. **Correção honesta vs. leitura anterior:** o painel mostra MAIS do que se supunha — CNPJ, Regime tributário, Inscrição Municipal, dados bancários com "Copiar dados", Certificado Digital com status/validade, e abas "Dados de acesso / Contrato Contabilizei / Área de Documentos". Então o dado **não está enterrado**, está num dropdown de canto. A dor de fundo persiste: **não é cidadão de 1ª classe** (fora do menu, num popover apertado), e faltam campos-chave (CNAE, nome fantasia, IE, data de abertura). Por isso a nota sobe de 4.8 → 6.0, mas ainda longe do ideal.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 6 | O painel surface CNPJ (64.037.271/0001-02), Regime (Simples), Inscrição Municipal e Certificado Digital de forma legível. Mas o nome da empresa aparece truncado num campo, e falta CNAE/nome fantasia/IE/data de abertura. |
| Eficiência | 5 | Melhor que se pensava: 1 clique no link de canto abre o painel com o essencial. Porém está **fora do menu principal** (tem que saber que o link existe) e "Copiar dados" copia só o **bloco bancário**, não campo a campo (CNPJ não tem copiar próprio). |
| Feedback | 7 | **Certificado Digital "Ativo" + "Validade: 22/12/2026"** é feedback proativo excelente — o cliente sabe na hora se o certificado está OK. Ótimo padrão. |
| Linguagem | 6 | "Dados de acesso", "Contrato Contabilizei", "Área de Documentos", "Regime tributário: Simples" são claros. O problema é hierarquia (dropdown), não a palavra. |
| Confiança | 7 | Reunir CNPJ + regime + banco (com copiar) + certificado digital + área de documentos num painel único transmite controle. Bom para confiança — apesar do acesso escondido. |
| Mobile | 5 | O painel renderiza empilhado no topo, sobreposto à Home, e só é alcançável pelo link minúsculo do topo — ainda mais difícil de achar no mobile. |
| **Média** | **6.0** | Conteúdo decente (CNPJ, regime, cert digital, docs) num **dropdown de canto**, não numa tela. Presente, porém sem status de 1ª classe e faltando campos-chave. |

## O que vi (fatos)
- URL da captura: `#/home` (confirmado no `recaptura_log.json`) — sem rota dedicada.
- Painel dropdown aberto pelo link "Dados da empresa e banco" (canto superior direito), sobre a Home. Conteúdo:
  - Campo com o **nome da empresa** (truncado): "PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA …".
  - **CNPJ:** 64.037.271/0001-02 · **Regime tributário:** Simples · **Inscrição Municipal:** 17240640017.
  - Abas: **"Dados de acesso" | "Contrato Contabilizei" | "Área de Documentos"**.
  - **Contabilizei.bank**: Banco 301 / Agência 0001 / Conta 311101883 + botão **"Copiar dados"** (bloco inteiro).
  - "Acesse sua conta" com QR + badges App Store/Google Play.
  - **Certificado Digital** [Ativo] — Validade: 22/12/2026 | Visualizar.
  - **Benefícios Contabilizei** — "0 ponto | Indique e acumule pontos".
- **Não vi**: CNAE, nome fantasia, data de abertura, Inscrição Estadual; nem download direto de contrato social/cartão CNPJ (ficam atrás da aba "Área de Documentos", não confirmado como download imediato).
- Mesmo painel aparece no mobile, empilhado no topo sobre a Home.

## 👍 Forças (o que copiar)
- **Certificado Digital com status "Ativo" + validade visível** — proatividade real: o cliente vê o vencimento sem procurar. Copiar isso.
- **"Copiar dados" bancários** num clique — o dado que mais se copia no dia a dia.
- **Agrupar cadastro + banco + certificado + documentos** num só painel é boa ideia de "central da empresa" (a colocação é que falha).
- **Abas "Contrato Contabilizei" / "Área de Documentos"** sinalizam que os documentos têm casa (mesmo que o acesso não seja de 1ª classe).

## 👎 Fraquezas (nossa oportunidade)
- **Não é tela, é dropdown de canto**: cadastro da empresa não está no menu — depende de descobrir um link secundário no topo. Dado que se consulta com frequência merece 1ª classe.
- **Faltam campos que o dono mais cola**: CNAE, nome fantasia, IE, data de abertura — nenhum à mão.
- **Copiar só o bloco**: não dá pra copiar CNPJ isolado (o caso de uso nº1) — só o pacote bancário tem botão.
- **Documentos atrás de aba**: contrato social / cartão CNPJ não têm download óbvio de 1 clique na superfície.

## 🎯 Contraproposta Legalizei
- **"Minha Empresa" como item fixo do menu principal** (não link de canto). Abre num **cartão-resumo copiável campo a campo**: CNPJ, razão social, nome fantasia, CNAE, regime, IE, Inscrição Municipal, data de abertura — cada um com "copiar" (herdando o que a Contabilizei já faz bem no banco).
- **Manter e ampliar o status do Certificado Digital** (Ativo + validade + alerta proativo "vence em 30 dias") — eles acertam aqui; a gente melhora com aviso antecipado.
- **Documentos em 1 clique, sem "Área de Documentos" escondida**: contrato social, cartão CNPJ, certificado e comprovantes pra download imediato, sempre atualizados.
- **Busca global** ("digite: CNPJ") que leva ao dado em 1 passo. Onde a líder faz caçar no canto, a Legalizei entrega no menu, copiável. Diferencial barato, óbvio e demonstrável.

## Links
- [[contabilizei]] · [[_relatorio-auditoria]] · [[HOME]]
