---
tipo: referencia
status: vivo
data: 2026-07-24
assunto: orgaos-cobertura-infosimples
tags: [integracoes, apis, orgaos, infosimples, cobertura, bh]
---

# 🏛️ Órgãos que precisamos × cobertura InfoSimples

> 1ª passada (24/07): quais **órgãos** a gente precisa consultar (pelas funcionalidades + regionalização BH) e **se a InfoSimples tem ou não** cada um. É só presença/ausência — o detalhe do que cada API entrega vem em [[infosimples-funcionalidades]].
> Fonte: leitura direta de [infosimples.com/consultas](https://infosimples.com/consultas/).

## 1. Órgãos que precisamos (por funcionalidade nossa)
🔍 consulta (leitura) · ✍️ operação (escrita/emissão)

| Órgão / fonte | Nível | O que consultamos | Alimenta | Tipo |
|---|---|---|---|:--:|
| Receita Federal — CNPJ | Federal | dados + situação (cartão CNPJ) | autofill do tomador · validar empresa · vigília | 🔍 |
| Receita Federal — CPF | Federal | situação cadastral | onboarding · tomador PF | 🔍 |
| Receita — Simples Nacional / DAS | Federal | optante? · situação · gerar DAS | pagar imposto · vigília | 🔍+✍️ |
| JUCEMG | MG | viabilidade nome · registro · NIRE | abertura | 🔍+✍️ |
| Prefeitura BH — SMFA/BHISS/NFS-e | BH | inscrição municipal · ISS · situação · emitir NFS-e | emitir nota · abertura · vigília | 🔍+✍️ |
| REDESIM | Federal | andamento da abertura | abertura | 🔍 |
| SEF-MG / SIARE | MG | inscrição estadual + situação | abertura (condicional) | 🔍 |
| Correios / CEP | — | CEP → endereço | autofill de endereço | 🔍 |
| Receita/PGFN — CND federal | Federal | tributos + dívida ativa | CND · vigília | 🔍 |
| SEF-MG — CND estadual | MG | débitos estaduais | CND | 🔍 |
| Prefeitura BH — CND municipal | BH | débitos de ISS | CND | 🔍 |
| Justiça do Trabalho — CNDT | Federal | débitos trabalhistas | CND | 🔍 |
| Caixa — CRF/FGTS | Federal | regularidade FGTS | CND (com funcionário) | 🔍 |
| Vig. Sanitária BH · Bombeiros MG | BH/MG | licenças/alvarás | abertura licenciada | 🔍+✍️ — **backlog** |

## 2. Cobertura InfoSimples (✅ tem · ⚠️ parcial/outra rota · ❌ não tem)

| Nosso órgão | Tem? | API deles (nome exato) |
|---|:--:|---|
| Receita — CNPJ | ✅ | `Receita Federal / CNPJ` |
| Receita — CPF | ✅ | `Receita Federal / CPF` |
| Receita — Simples Nacional (consulta) | ✅ | `Receita Federal / Simples Nacional` · `Situação Fiscal` |
| Receita — gerar DAS (ME não-MEI) | ⚠️ | só **MEI** explícito (`Simples / Emissão de DAS de MEI`); genérico via `SICALC / Gerar DARF` |
| **JUCEMG** | ❌ | **só `Junta Comercial / SP`** — MG não existe |
| **Prefeitura BH — NFS-e** | ❌/⚠️ | não há "BH / NFS-e"; `Receita Federal / NFS-e` (Nacional) ✅ cobre **se BH estiver no emissor Nacional** |
| REDESIM | ✅ | `Receita Federal / REDESIM / Acompanhamento de Protocolo` |
| SEF-MG (inscrição/situação) | ✅ | `SEFAZ / Cadastro Centralizado de Contribuinte (CCC)` |
| Correios / CEP | ✅ | `Correios / CEP` · `Completa CEP` |
| CND federal (PGFN) | ✅ | `Receita Federal / PGFN (CND Federal)` |
| CND estadual MG | ✅ | `SEFAZ / MG / Certidão Negativa de Débitos` |
| CND municipal BH | ✅ | `Prefeitura / MG / Belo Horizonte / Certidão Negativa de Débitos` |
| CNDT (trabalhista) | ✅ | `MTE / Certidão de Débitos Trabalhistas` *(TST talvez após o corte da lista)* |
| FGTS (CRF) | ✅ | `Caixa / Regularidade do Empregador (FGTS)` |
| Vig. Sanitária BH · Bombeiros MG | ❌ | ANVISA/IBAMA federal ✅; Bombeiros só RJ/SP; Vig.San. BH não |

## 3. Leitura
- **Cobre forte o que importa:** CNPJ, CPF, Simples, todas as CNDs (federal+MG+BH), FGTS, CNDT, REDESIM, SEF-MG, CEP.
- **2 buracos reais:** **JUCEMG** (só SP) e **NFS-e municipal de BH** (só via Nacional). Os dois são **escrita** → provavelmente RPA/integração oficial de qualquer jeito. Não bloqueiam.
- **Bônus úteis que eles têm:** `Receita Federal / NFS-e (Notas Emitidas/Recebidas)` (faturamento/vigília) · `Situação Fiscal` (pendências) · `Conselho Federal de Contabilidade` · `INPI / Marcas` · `ECAC / DCTFWeb`.

## 4. Correções / notas
- 🔧 **DAS de MEI (`Simples / Emissão de DAS de MEI`)** — a InfoSimples TEM, mas **não é MVP agora** (nosso ICP é ME serviço no Simples, não MEI). **Guardar: vamos precisar num futuro próximo** (quando cobrirmos MEI). — correção do Pedro 24/07.
- ⚠️ A lista da InfoSimples foi lida até "SINTEGRA" (cortou em ~30k chars); **Tribunais/TST** vêm depois e não foram confirmados aqui.
