---
tipo: referencia
status: vivo
data: 2026-07-29
assunto: infosimples-apis-selecionadas
tags: [integracoes, apis, infosimples, resumo, backend]
---

# ✅ InfoSimples — resumo das APIs selecionadas pro app

> Recorte de leitura de [[infosimples-funcionalidades]] (autoridade sobre o que cada API entrega) — só a coluna "o que usaremos", consolidada num lugar só pra consulta rápida (dev/handoff). Mapeamento completo (todos os órgãos × cobertura) está em [[orgaos-e-cobertura-infosimples]].

## Tabela

| API | Usaremos? | Feature nossa | O que importa | Auth |
|---|:--:|---|---|:--:|
| Receita Federal / CNPJ | ✅ sim, core | Autofill do tomador (Emitir) · validar empresa · vigília | Puxa tudo só com o CNPJ (razão, endereço, e-mail, telefone, CNAEs, sócios) | 🔓 |
| Receita Federal / CPF | ✅ sim* | Tomador PF (nome) · validar responsável | ⚠️ Exige data de nascimento pra puxar nome. **Decisão 24/07: NÃO usar a consulta agora** — só validar o dígito; nome PF é digitado no form | 🔓* |
| Receita / Simples Nacional | ✅ sim | Vigília (optante/enquadramento) · validar na abertura | Optante? SIMEI? histórico de opção | 🔓 |
| Receita / Situação Fiscal | ✅ sim, F2 | Vigília de pendências (o North Star) | Precisa procuração/e-CAC do cliente → amarra no certificado digital | 🔐 |
| Receita / PGFN (CND Federal) | ✅ sim | CND (trunfo) · vigília | Emite negativa só com CNPJ | 🔓 |
| Receita / NFS-e | 🟡 talvez | Ler/validar uma nota emitida | Não emite — só lê por chave de acesso; não resolve o "emitir" | 🔓 |
| Receita / SICALC (Gerar DARF) | ✅ sim | Gerar guia de INSS/IRRF do pró-labore | DARF com código de barras | 🔓 |
| Receita / REDESIM | ✅ sim | Acompanhar a abertura (viabilidade) | Precisa login/cert do cliente + protocolo | 🔐 |
| Correios / CEP | ✅ sim | Autofill de endereço (PF, formulários) | Logradouro/bairro/cidade/UF | 🔓 |
| Prefeitura BH / CND | ✅ sim | CND municipal (trunfo) · vigília ISS | Pendências de ISS | 🔓 |
| SEFAZ MG / CND | ✅ sim | CND estadual (trunfo) | Versão completa pode exigir login/cert | 🔐* |
| SEFAZ / CCC (Cad. Centralizado) | 🟡 condicional | Inscrição estadual | Só se a atividade tiver IE — serviço raramente tem; marginal no MLP | 🔐* |
| Caixa / Regularidade FGTS | 🟡 condicional | CND de FGTS | Só relevante com funcionário — fora do MVP solo | 🔓 |
| MTE / Certidão Débitos Trabalhistas | ✅ sim | CND trabalhista (trunfo) | Versão completa pode exigir login/cert | 🔐* |
| Receita / Simples — Emissão DAS de MEI | 🔮 futuro | Emitir DAS quando cobrirmos MEI | Não é o ICP agora (ME serviço no Simples, não MEI) | 🔓 |

`*` CPF: dado exige data de nascimento (não é 100% aberto); SEFAZ-MG/CCC e MTE listam credenciais — a versão completa pode pedir login/certificado.

## Legenda
- **Auth 🔓** — só precisa do documento (CNPJ/CPF), chamável livremente.
- **Auth 🔐** — precisa login gov.br / e-CAC / certificado / procuração do cliente.
- **Usaremos:** ✅ sim · 🟡 condicional/talvez · 🔮 futuro (não no MLP).

## 3 achados que mandam
1. **CNPJ é rei (🔓):** um parâmetro só devolve razão, endereço, e-mail, telefone, CNAEs e sócios — confirma o autofill PJ ~100%.
2. **Split 🔓×🔐 é a linha divisória do produto:** consultas públicas (CNPJ, CPF-dígito, Simples, CNDs, CEP, DARF) rodam livres; as de pendência/monitoramento fino (Situação Fiscal, REDESIM, CNDs completas) exigem procuração/certificado do cliente — a vigília forte depende disso.
3. **Emitir NFS-e continua descoberto:** a API de NFS-e só lê por chave, não emite — "emitir" segue por outra via (RPA/emissor Nacional).

## Cruza com
[[infosimples-funcionalidades]] (fonte completa, autoridade) · [[orgaos-e-cobertura-infosimples]] (mapeamento órgão × cobertura) · [[README]] · [[indice-autoridade]]
