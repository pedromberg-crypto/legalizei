---
tipo: referencia
status: vivo
data: 2026-07-24
assunto: integracoes-apis-orgaos
tags: [integracoes, apis, orgaos, infosimples, consulta, backend]
---

# 🔌 Integrações & APIs de órgãos — hub

> Pasta da pesquisa de **integração com órgãos públicos via API** (consulta e emissão). Provider em avaliação: **InfoSimples** (doc aberta: [infosimples.com/consultas](https://infosimples.com/consultas/)). Objetivo: mapear **quais órgãos** a gente consulta pelas funcionalidades do produto, **o que cada API entrega**, e **o que de fato vamos usar**.

## Índice
- [[orgaos-e-cobertura-infosimples]] — os órgãos que precisamos (por funcionalidade + BH) × o que a InfoSimples cobre (✅/⚠️/❌).
- [[infosimples-funcionalidades]] — leitura API por API: o que cada uma retorna + a tabela "o que usaremos". *(criado na 2ª passada)*

## Princípios
- **BH-first:** a regionalização é Belo Horizonte/MG. Federal é fácil (todo provider cobre); o gargalo é **municipal (PBH) e estadual (SEF-MG/JUCEMG)**.
- **Consulta × operação:** InfoSimples é forte em **leitura** (situação, certidões, dados). **Escrita** (registrar na Junta, emitir NFS-e) provavelmente vai por RPA/integração oficial — não bloqueia a estratégia, muda o *como*.
- **Anti-guru:** cada afirmação vem da leitura direta da doc deles (fonte = as páginas de cada API).

## Cruza com
[[backlog-telas-portal]] · [[matriz-portal-interno]] · [[cnae-fiscalmente-otimo]] · [[fluxo-abertura-portais-pedro-dev]] · a decisão de **provider CPF/CNPJ** já aberta no handoff do dev.
