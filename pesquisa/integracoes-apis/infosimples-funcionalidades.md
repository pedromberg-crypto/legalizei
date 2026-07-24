---
tipo: referencia
status: vivo
data: 2026-07-24
assunto: infosimples-funcionalidades-por-api
tags: [integracoes, apis, infosimples, funcionalidades, backend]
---

# 🔎 InfoSimples — funcionalidades API por API (leitura da doc)

> 2ª passada (24/07): entrei em cada API dos nossos órgãos e li **o que ela faz, o que recebe e o que retorna**. Fonte = a doc de cada consulta em infosimples.com. Complementa [[orgaos-e-cobertura-infosimples]] (que era só presença/ausência).
>
> **Auth (achado que muda o desenho):** 🔓 = precisa **só do documento** (CNPJ/CPF), chamável livremente. 🔐 = precisa **login gov.br / e-CAC / certificado / procuração** do cliente — só roda com acesso dele.

## Leitura por API

| API | O que faz | Entrada-chave | Saída (principais) | Auth |
|---|---|---|---|:--:|
| **Receita Federal / CNPJ** | dados cadastrais + situação (o cartão CNPJ) | `cnpj` | razão, fantasia, **endereço, telefone, e-mail**, situação, **CNAE principal+secundários**, natureza, porte, capital, **QSA (sócios)** | 🔓 |
| **Receita Federal / CPF** | dados + situação da PF | `cpf` **+ data nascimento** | **nome**, situação cadastral, data nasc./inscrição, óbito | 🔓* |
| **Receita / Simples Nacional** | situação no Simples/SIMEI + histórico de opção | `cnpj` | optante? · SIMEI? · períodos anteriores · agendamentos futuros | 🔓 |
| **Receita / Situação Fiscal** | situação + **pendências/débitos** + certidão | **login/cert** | cadastrais · pendências/débitos · Simples (inclusão/exclusão) · sócios · certidão | 🔐 |
| **Receita / PGFN (CND Federal)** | emite CND federal (RFB + Dívida Ativa) | `cnpj`/`cpf` | certidão · débitos RFB · débitos PGFN · validade · negativa? | 🔓 |
| **Receita / NFS-e** | **lê** uma NFS-e pela chave (não emite) | `chave` de acesso | emitente, tomador, valores, ISS/PIS/COFINS, serviço, retenções | 🔓 |
| **Receita / SICALC / Gerar DARF** | **gera** guia DARF | cpf/cnpj, cód. receita, período, valor | código de barras, DARF, vencimento, valor | 🔓 |
| **Receita / REDESIM / Acompanhamento** | status da consulta prévia de viabilidade | **login/cert** + `protocolo` | eventos, viabilidade, número | 🔐 |
| **Correios / CEP** | CEP → endereço | `cep` | logradouro, bairro, cidade, UF | 🔓 |
| **Prefeitura BH / CND** | emite CND municipal de BH | `cnpj`/`cpf` | certidão, validade, **pendências (tributo/exercício)** | 🔓 |
| **SEFAZ MG / CND** | emite CND estadual MG | cnpj/cpf/IE (**+login/cert p/ completa**) | certidão, endereço, situação | 🔐* |
| **SEFAZ / CCC (Cad. Centralizado)** | dados cadastrais + **IE** + regime ICMS | cnpj/cpf/IE + UF + creds | razão, endereço, IE, regime, situação, outras IEs | 🔐* |
| **Caixa / Regularidade FGTS** | emite CRF (regularidade FGTS) | `cnpj`/`cpf` | CRF, situação, validade | 🔓 |
| **MTE / Certidão Débitos Trabalhistas** | emite certidão trabalhista (CNDT-equiv.) | cnpj/cpf (**+login/cert**) | certidão, autenticidade, empregador, negativa? | 🔐* |
| **Receita / Simples (DAS de MEI)** | **emite DAS de MEI** | `cnpj`, período | cnpj, razão, períodos | 🔓 · 🔮 **futuro** |

*CPF precisa da data de nascimento (não é 100% aberto). SEFAZ-MG/CCC/MTE listam credenciais — a versão completa pode exigir login/cert.

## 🎯 O que dessas funcionalidades USAREMOS

| API | Usaremos? | Feature nossa | O que importa |
|---|:--:|---|---|
| Receita / CNPJ | ✅ **sim, core** | **autofill do tomador** (Emitir) · validar empresa · vigília | puxa TUDO só com o CNPJ (confirma nosso desenho) |
| Receita / CPF | ✅ sim | tomador PF (nome) · validar responsável | ⚠️ exige **data de nascimento** → o form PF precisa desse campo pra autofill do nome |
| Receita / Simples Nacional | ✅ sim | vigília (optante/enquadramento) · validar na abertura | optante? SIMEI? histórico |
| Receita / Situação Fiscal | ✅ sim, **F2** | **vigília de pendências** (o North Star) | 🔐 precisa **procuração/e-CAC** do cliente → amarra no certificado |
| Receita / PGFN (CND Federal) | ✅ sim | **CND** (trunfo) · vigília | emite negativa só com CNPJ |
| Receita / NFS-e | 🟡 talvez | ler/validar uma nota emitida | **não emite** — só lê por chave; não resolve o "emitir" |
| Receita / SICALC (DARF) | ✅ sim | gerar guia de **INSS/IRRF do pró-labore** | DARF com código de barras |
| Receita / REDESIM | ✅ sim | **acompanhar a abertura** (viabilidade) | 🔐 login do cliente |
| Correios / CEP | ✅ sim | autofill de **endereço** (PF, formulários) | logradouro/bairro/cidade/UF |
| Prefeitura BH / CND | ✅ sim | **CND municipal** (trunfo) · vigília ISS | pendências de ISS |
| SEFAZ MG / CND | ✅ sim | **CND estadual** (trunfo) | 🔐* |
| SEFAZ / CCC | 🟡 condicional | inscrição estadual (só se a atividade tiver IE — serviço raramente tem) | marginal p/ serviço |
| Caixa / FGTS | 🟡 condicional | CND (só com funcionário — fora do MVP solo) | CRF |
| MTE / CNDT | ✅ sim | **CND trabalhista** (trunfo) | 🔐* |
| Receita / DAS de MEI | 🔮 **futuro** | quando cobrirmos MEI (não é o ICP agora) | correção do Pedro 24/07 |

## 🔑 Achados que mudam o desenho
1. **CNPJ é rei (🔓):** um único parâmetro devolve razão + endereço + e-mail + telefone + CNAEs + sócios. Confirma o autofill PJ ~100%.
2. **CPF exige data de nascimento:** dá pra puxar o **nome** da PF (não só situação), mas o form precisa do campo **data de nascimento**. Refina o "Novo cliente PF".
3. **Split de auth 🔓×🔐 é a linha divisória do produto:** consultas **públicas** (CNPJ, CPF, Simples, todas as CNDs, CEP, DARF) rodam livres. As de **pendência/monitoramento fino** (Situação Fiscal, REDESIM, e as CNDs "completas") pedem **login/e-CAC/procuração** do cliente → **amarram no certificado digital**. A vigília forte depende disso.
4. **Emitir NFS-e continua descoberto:** a API de NFS-e **lê** (por chave), não emite. O "emitir" segue por outra via (RPA/emissor Nacional).

## ✅ Decisões do debate (24/07)
- **Vigília (as APIs 🔐):** **SEGUIMOS.** Teremos **procuração + assinatura digital** — e já validamos que a **Contabilizei também pede/faz** isso. Então Situação Fiscal · REDESIM · CNDs completas entram (dependem do certificado do cliente).
- **CPF:** **NÃO usar a consulta agora.** Só **validar o dígito** (o número é válido?). Não puxar nome — exige data de nascimento, não é funcional. No form PF, os dados são digitados.
- **Empresa com funcionários (FGTS/folha):** **futuro próximo**, fora do MLP. Padrão do líder: na tela de "adicionar funcionário" mandam **falar direto com eles** — a gente pode gatear igual (regra/restrição) quando entrar.
- **DAS de MEI:** 🔮 futuro (quando cobrirmos MEI).

## 🚨 Regra de uso (autoridade)
Este doc + [[orgaos-e-cobertura-infosimples]] são **autoridade** sobre "o que uma consulta/API entrega" ([[indice-autoridade]]). **Antes de criar qualquer campo de autofill, validação de documento ou consulta no app, consultar aqui.** Não assumir o que um número puxa — já erramos (CNPJ puxa tudo; CPF só puxa nome COM data de nascimento). Objetivo: parar de errar formulário e **tirar validação da Larissa**.

## Cruza com
[[orgaos-e-cobertura-infosimples]] · [[README]] · **flow/telas:** [[backlog-telas-portal]] · **usabilidade interna:** [[cruzamento-portal-interno]] · **gestão do app:** [[handoff-sistema-gestao-dev]] · [[cnae-fiscalmente-otimo]] (vigília) · decisão de **provider** do dev.
