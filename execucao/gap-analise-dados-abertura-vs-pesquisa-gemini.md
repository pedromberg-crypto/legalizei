---
tipo: verdade
status: vivo — achados não ratificados em fonte primária
data: 2026-08-26
assunto: gap-dados-abertura
tags: [execucao, flow, dados, abertura, fiscal, pendencia]
---

# 🔍 Cruzamento — dados que coletamos × pesquisa Gemini (JUCEMG/Receita/PBH)

> **Anti-guru:** a pesquisa fonte é uma resposta do Gemini (arquivo `gemini-code-1787795440647.py`, Downloads, 26/08), **não** documentação oficial primária lida direto do portal da JUCEMG/Receita. Trato os achados abaixo como 🟡 **pendente de ratificação** (Larissa/pesquisa dedicada) antes de qualquer mudança de produto. Cruzamento contra [[dados-coletados-abertura-ate-viabilidade]] (nosso lado, esse sim direto do `flow-data.mjs`).

## Resultado — 5 campos que a pesquisa aponta como exigidos e não achei em nenhum componente do caminho Abrir

| # | Campo (pesquisa Gemini) | Onde deveria estar | Achado no código | Severidade |
|---|---|---|---|---|
| 1 | **Data de nascimento** | C1 · Seus dados | ✅ **Implementado 26/08** — campo novo em `SocioView` (`wizard-dossie.tsx`) | Alta — é campo padrão de DBE (Receita Federal) |
| 2 | **Nome da mãe** | C1 | 🗑️ **REVERTIDO 01/09** — implementado em 26/08, removido depois da auditoria contra os 141 prints: não existe campo de filiação em nenhum dos 3 sistemas (DBE tela 54, Integrador 102-104, contrato 117), e no MEI vem do gov.br. A "exigência de DBE" era inferida | ~~Alta~~ → **falso positivo desta pesquisa** |
| 3 | **Forma de atuação** — "Internet" / "atividades fora do estabelecimento" × "Estabelecimento Fixo" | C4 · Dados da empresa | 🔴→🟢 **CORRIGIDO 01/09** — a decisão de 26/08 fixou "Internet"; o valor real, visto 2x nos prints (tela 14 Viabilidade, tela 48 DBE), é **"Atividade Desenvolvida Fora do Estabelecimento"**, e "Internet" aparece na mesma lista NÃO marcada | Alta — a pesquisa acertou o campo e errou o valor |
| 4 | **Tipo de unidade** — "Sede" / "Unidade Administrativa" | C4 | 🔴→🟢 **CORRIGIDO 31/08** — a decisão de 26/08 fixou "Sede"; o valor real dos prints é **"Produtiva"** | Média — mesmo padrão do item 3 |
| 5 | **Metragem (m²)** — área total do imóvel + área da operação | C4 | 🟢 **RESOLVIDO 31/08** — o print da Viabilidade (tela 13) mostra Área Total e Área Utilizada sempre em **20,00**; virou valor fixo preenchido por nós. A pesquisa estava certa, faltava fonte | Alta — a exigência existia mesmo |

> 🔍 **Nota de método (01/09).** Três dos cinco itens desta pesquisa foram corrigidos ou revertidos pela gravação real. O padrão é o mesmo nos três: a pesquisa **acertou quais campos existem** e **errou os valores**, porque descrevia o formulário sem tê-lo visto preenchido. Serve de régua: pesquisa externa é boa pra descobrir que um campo existe, não pra decidir o que vai dentro dele.

## Explicação — itens 3, 4 e 5 (26/08)

⚠️ Tudo abaixo é raciocínio a partir da pesquisa do Gemini + conhecimento geral de abertura de empresa — **nenhum dos 3 foi ratificado contra o portal JUCEMG/DBE real**. Antes de implementar, vale confirmar com Larissa ou pesquisa dedicada (mesma régua do resto do vault).

**#3 — Forma de atuação.** Não é sobre o regime tributário (Simples Nacional é irrelevante aqui) — é uma classificação **municipal/de zoneamento**, sobre ONDE a atividade acontece fisicamente:
- *"Internet" / "fora do estabelecimento"* = declara que não há atendimento presencial de público naquele endereço (o trabalho é 100% remoto/digital). É isso que destrava usar o endereço RESIDENCIAL como fiscal sem disparar vistoria de Vigilância Sanitária/Bombeiros — a alma do "home office válido" que o produto vende.
- *"Estabelecimento Fixo"* = declara presença física de atendimento (loja, salão, escritório que recebe cliente) — dispara as exigências de inspeção que o MLP quer evitar.

**Depende, sim — mas não do regime, depende do CNAE/persona:** pra serviço 100% remoto (dev, marketing, design, consultoria por vídeo) é sempre "Internet/fora do estabelecimento". Mas olhando as próprias personas do vault (`pesquisa/personas/volantes/`) — cabeleireira, esteticista, personal trainer, professora de dança com estúdio — **essas genuinamente atendem cliente num espaço físico** (mesmo que não seja endereço próprio), então pra elas "Estabelecimento Fixo" pode ser a resposta CORRETA, não um erro. Ou seja: não dá pra fixar 1 valor só pra todo mundo — depende de que tipo de serviço a pessoa presta, não do regime fiscal escolhido.

**#4 — Tipo de unidade** (Sede × Unidade Administrativa). Toda empresa nova, com 1 endereço só, sendo aberta pela 1ª vez, é **sempre "Sede"** — não existe "Unidade Administrativa" (filial) numa abertura do zero, isso só existiria se a empresa JÁ tivesse uma sede e estivesse abrindo um 2º endereço. Pra 100% do público do MVP (abertura nova), a resposta é sempre a mesma — então provavelmente nem precisa virar pergunta pro cliente, dá pra fixar "Sede" no sistema sem perguntar (evita confundir quem não sabe o que a pergunta significa).

**#5 — Metragem (m²).** A lógica (segundo a pesquisa): declarar área total do imóvel + área usada pra atividade prova PROPORCIONALIDADE — que o uso comercial é uma fatia pequena de um espaço residencial, reforçando o mesmo argumento de baixo impacto de zoneamento do item 3. Pra serviço leve 100% remoto isso é plausível/comum na literatura de abertura MEI/ME em home office. **Mas** — diferente do item 3/4, que são categóricos (existe ou não existe a opção), este é o item onde tenho MENOS certeza de que existe de fato um campo NUMÉRICO de m² no sistema real da JUCEMG/BH (pode ser uma declaração mais simples tipo "atividade de baixo risco em ambiente domiciliar", sem pedir número). Esse é o que eu mais recomendaria confirmar antes de qualquer mudança de tela.

## O que a pesquisa cita que JÁ está coberto (sem gap)

| Item da pesquisa | Onde já cobrimos |
|---|---|
| Nome empresarial, mín. 2 opções | C7 pede **3** — folga acima do mínimo |
| CNAE principal + matriz de CNAEs (exemplos citados são ilustrativos, não framework field) | E5A (principal) + C5 (secundários, até 15) |
| Endereço fiscal: CEP/logradouro/via/número/complemento/bairro | C4 pede CEP+número+complemento manual; logradouro/bairro vêm de autofill por CEP — cobertura funcional igual, só via mecanismo diferente |
| Índice cadastral IPTU | C4, já obrigatório quando endereço próprio |
| Nome completo, CPF, estado civil (+ regime de bens) | C1 |
| Endereço residencial | E6 (front-load, autofill CEP) |
| Capital social (a pesquisa sugere faixa R$1.000-5.000 pra operação digital) | C4 já pede o campo — a faixa sugerida é orientação de conteúdo/copy, não campo novo |

## O que a pesquisa cita mas NÃO é gap — é etapa diferente ou não se aplica ao caminho Abrir

| Item da pesquisa | Por que não é gap aqui |
|---|---|
| CPF + senha GOV.BR (nível Prata/Ouro) do responsável | Viabilidade hoje é RPA da própria Legalizai (não usa GOV.BR do cliente) — GOV.BR do cliente só entra DEPOIS da viabilidade, na assinatura (A4, `CodigoGovView`), fora do escopo deste corte |
| Vínculo contábil (CPF/CNPJ do contador + CRC-MG) | É a Legalizai que assume a contabilidade — esse dado é preenchido internamente (o CRC é NOSSO), não coletado do cliente no caminho Abrir. Só existe pergunta de contador no caminho **Migrar** (`E9_2`, contador ANTERIOR do cliente) |
| Contatos públicos da PJ (e-mail/telefone que ficam no Cartão CNPJ) | Provavelmente reaproveita e-mail/telefone já captados no E6 — **não confirmado** se é reuso automático ou se falta uma tela de confirmação/edição desses contatos como "públicos". Fica como pergunta aberta, não gap fechado |

## Estado final (26/08) — SUPERADO, ver bloco de 01/09 abaixo

- **#1/#2** (nascimento, nome da mãe) — ✅ implementados em C1.
- **#3** (forma de atuação) — 🟡 travado como "Internet" fixo, sem pergunta ao cliente, **pendente de validação técnica**. Reabrir se o produto passar a atender CNAEs com atendimento físico.
- **#4** (tipo de unidade) — 🟢 travado como "Sede" fixo, sem pergunta ao cliente. Documentado que a equipe/sistema responde isso pelo usuário na viabilidade — sem pendência.
- **#5** (metragem) — 🟡 segue pendente, sem decisão. Nenhuma fonte além do IPTU já coletado. Não implementar até aparecer confirmação real.

## Estado final (01/09) — depois da gravação real

- **#1** (nascimento) — ✅ segue válido, confirmado nos prints.
- **#2** (nome da mãe) — 🗑️ **revertido**: campo removido do C1. Não existe em nenhum dos 3 sistemas; era inferência da pesquisa.
- **#3** (forma de atuação) — 🟢 **fechado com valor certo**: "Atividade Desenvolvida Fora do Estabelecimento", não "Internet".
- **#4** (tipo de unidade) — 🟢 **fechado com valor certo**: "Produtiva", não "Sede".
- **#5** (metragem) — 🟢 **fechado**: 20 m² fixos, vistos no print da Viabilidade.

Nenhum item desta pesquisa segue pendente. O que sobrou de aberto migrou pra auditoria 1-a-1 de 01/09 (ver `decisoes-marca.md`) e pra fila da especialista: "edificação nova" como suposição, e o endereço PF do contabilista.

Nenhum dos 3 (#3/#4/#5) virou pergunta na UI — são valores internos que a Legalizai preenche em nome do cliente na hora de submeter a viabilidade.
