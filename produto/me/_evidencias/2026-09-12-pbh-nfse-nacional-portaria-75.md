---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-12
fonte: Prefeitura de Belo Horizonte — FAQ oficial NFS-e Nacional v7.1
acesso: publico
assunto: portaria-smfa-75-e-nfse-nacional-em-bh
tags: [produto, evidencia, nfse, bh, portaria, fonte-primaria, cancelamento]
---

# 🔎 Evidência — a Portaria SMFA 075/2025 e a NFS-e Nacional em BH

> ✅ **FONTE PRIMÁRIA MUNICIPAL.** É o FAQ oficial da PBH (`NFS-e Nacional: orientações gerais e perguntas frequentes`, **versão 7.1, atualizado em 09/04/2026**), que **transcreve o art. 5º da Portaria SMFA nº 075/2025** e publica o cronograma de migração. Onde ele contradiz leitura nossa ou de terceiro sobre **BH**, ele manda.
>
> 📄 **22 páginas · 51.843 caracteres · lido 100%.** PDF e texto literal em `produto/me/_evidencias/fontes/pbh-nfse-2026-09-12/`.

---

## 1. 🔴 A resposta que a gente foi buscar: BH já migrou, e faz tempo

**O nosso cliente está obrigado ao Emissor Nacional desde 01/11/2025.** Cronograma da Portaria SMFA nº 075/2025 (de 19/09/2025), atualizado pela 088/2025:

| Data | Quem migrou |
|---|---|
| 01/09/2023 | MEI |
| 01/10/2025 | SPL optantes do Simples · ISSQN por Estimativa Total |
| **01/11/2025** | **Restante dos contribuintes optantes pelo Simples Nacional** ← o nosso ICP |
| 01/12/2025 | Demais contribuintes |
| 01/02/2026 | PROEMP |

> *"A partir da data de transição (…) a emissão de notas fiscais de serviços deverá ser feita **exclusivamente** por meio dos emissores nacionais, pois o atual emissor da prefeitura **será descontinuado**."*

🔴 **CORREÇÃO NO NOSSO P3.** O processo dizia que a Res. CGSN 191/2026 obriga a partir de **01/11/2026**, e a gente tratou isso como relógio correndo com folga. **Em BH o ME do Simples está obrigado desde 01/11/2025** — há dez meses. A regra nacional é o piso; BH chegou um ano antes. Não existe janela de transição para o nosso cliente: já é o regime vigente.

✅ E responde a dúvida aberta no **P6.9**: BH **é** conveniada e usa o padrão nacional. Não precisa mais chamar `GET /parametros_municipais/3106200/convenio` pra descobrir isso.

---

## 2. ✅ Art. 5º, transcrito — as condições de cancelar e substituir

> **§ 1º** — O cancelamento da NFS-e emitida pelo Emissor Nacional somente poderá ser realizado de forma automatizada (…) caso atendidas, **cumulativamente**:
> I – a emissão da NFS-e cancelada tenha ocorrido, no máximo, há **730 dias**;
> ~~II – o CPF ou CNPJ do tomador tenha sido informado~~ **(Revogado pela Portaria SMFA nº 88/2025, art. 3º)**
> II – a **ATM não tenha bloqueado** o cancelamento automatizado pelo contribuinte.
>
> **§ 2º** — A substituição (…) caso atendidas, cumulativamente:
> I – a emissão tenha ocorrido, no máximo, há **730 dias**;
> II – a NFS-e substituída **não tenha sido objeto de anterior cancelamento**;
> III – a **ATM não tenha bloqueado** a substituição.
>
> **§ 3º** — Nas situações em que as condições **não forem atendidas**, o cancelamento dependerá de **análise da ATM em processo administrativo específico**, que poderá solicitar mais informações ao requerente, **podendo indeferir o pedido, a seu critério**.

🔑 **Três coisas travadas de uma vez:**

1. ✅ **A sugestão S12 estava certa, e é o caminho oficial.** O FAQ mostra a tela: *"Se não cumprir as condições para cancelamento automático, será exibida a opção **Solicitar Análise Fiscal**, em vez de Cancelar NFS-e"*.
2. ✅ **Em BH, a exigência de tomador identificado para CANCELAR está REVOGADA.** A nossa matriz estava certa, e agora está com o texto na mão.
3. 🔑 **As condições de BH são MAIS SIMPLES que as do leiaute nacional.** Em BH são 2 para cancelar e 3 para substituir; o leiaute nacional lista mais recusas (valor acima do permitido, tributos já recolhidos). ⚠️ Não é contradição: o leiaute descreve o que o sistema PODE recusar, a portaria diz o que BH parametrizou. Mas quer dizer que **o nosso desenho deve seguir a portaria para BH**, não a lista completa.

### 🔴 E a resposta que ninguém queria: não há prazo

> *"Os prazos para cancelamento de NFS-e nacional, requeridos via processo administrativo, **ainda não foram estabelecidos** pelo Conselho Gestor do IBS."*

Isso resolve a dúvida do S12b (*quanto tempo a prefeitura leva*) com um fato, não com uma lacuna nossa: **não existe prazo definido**. O produto não pode prometer um — e precisa dizer isso em vez de calar.

---

## 3. 🔑 Empresa nova NÃO informa Inscrição Municipal

> *"Os contribuintes migrados em 01/12/2025, bem como aqueles **cuja atividade foi iniciada após esta data** ou que mudaram seu endereço para Belo Horizonte após esta data, devem emitir suas NFS-e **sem informar a IM**."*

🔴 **Isso desfaz um bloqueio que eu tinha marcado como crítico.** O handoff de dados listava a **inscrição municipal (CCM)** como 🟡 *"ninguém combinou quem entrega, e sem ela o P3 não emite nota"*. Para o nosso caso — empresa aberta agora, em BH — **a IM não entra na nota**.

⚠️ Continua valendo para quem migrou antes de 12/2025 (e lá o dígito verificador "X" virou "0" no cadastro). Mas isso não é cliente novo, que é o nosso.

---

## 4. ✅ Tomador sem identificação: confirmado, e com a régua certa

> *"Contudo isso ainda é possível, mesmo na NFS-e Nacional. **Somente em algumas situações a identificação do tomador é obrigatória**, como no caso de **serviços cujo ISS é devido no local do tomador**."*

🔑 É exatamente a leitura que eu tinha feito da regra **E0187** do leiaute — os 13 códigos de operação em que o imposto é devido no endereço do adquirente. Eu tinha marcado como *"ligação minha entre dois documentos, não citação"*. **Agora tem citação, e é da PBH.**

---

## 5. ⚠️ Conflito de datas sobre IBS/CBS — e a fonte mais nova ganha

Este FAQ (**09/04/2026**) diz que os campos de IBS/CBS estão **dispensados**:
- NT SE/CGNFS-e nº 004 **v2.0** (10/12/2025) desligou as regras de obrigatoriedade dos grupos "IBSCBS"
- Ato Conjunto RFB/CGIBS nº 1, de 22/12/2025, dispensou a informação *"até o primeiro dia do quarto mês subsequente ao da publicação da parte comum dos regulamentos do IBS e da CBS"*

Mas a página **RTC do gov.br (atualizada em 15/07/2026)**, na NT 009, diz: *"há previsão de obrigatoriedade, **a partir de 03/08/2026**, dos grupos IBS/CBS e suas respectivas regras de validações"*.

🔑 **A fonte nacional é 3 meses mais nova que o FAQ municipal, então ela ganha** — e o alerta que colocamos no ramo "emitir sem tomador" segue de pé. ⚠️ Mas registra-se o risco real: **a PBH não atualizou o FAQ dela depois disso**. Se BH estiver operando pela versão antiga, há um descompasso entre o que o sistema nacional valida e o que a Prefeitura orienta.

---

## 6. 🔴 Procuração NÃO existe na NFS-e Nacional

> *"**Não.** O controle de acesso do Sistema de emissão da NFS-e Nacional ainda não possui as funcionalidades para delegação/procuração, nos moldes da NFS-e de Belo Horizonte. Estas funções estão em desenvolvimento pelo SERPRO (…) **porém não há data** para publicação em produção."*

🔑 **Isso ratifica a arquitetura do produto e fecha uma porta.** A emissão só acontece com o **certificado digital do próprio cliente** — que é exatamente o que o handoff de dados diz ser o insumo de maior alcance (4 passos em 3 processos). Não há atalho por procuração, e não há data para haver.

---

## 7. O que BH exige além do leiaute nacional

- **`cTribMun` obrigatório** (3 dígitos, o desdobramento municipal análogo ao CTISS antigo), além do `cTribNac` de 6. ✅ Confirma a afirmação da pesquisa do Pedro — e mostra que a fonte é **a PBH**, não o leiaute nacional, onde o campo é opcional.
- **`cNBS`** já era exigido na exportação e **passou a ser exigido em todos os casos a partir de 01/01/2026**.
- **`regEspTrib` em BH aceita só 6 valores:** 1 Ato Cooperado · 2 Estimativa · 4 Notário/Registrador · 5 Profissional Autônomo · 6 SPL · 9 Outros (PROEMP). 🔑 **O nosso ME comum não é nenhum deles: vai "Nenhum" (0).**

## 8. Três coisas que tocam o desenho e não estavam em lugar nenhum

1. 🆕 **A numeração pode ter "pulos".** A Sefin Nacional atribui o `nNFSe`, e números reservados podem não virar nota. *"Os intervalos (…) não representam irregularidade fiscal, falha do contribuinte ou inconsistência cadastral."* → **o app não pode alarmar o cliente com isso.**
2. 🆕 **Serviços TOMADOS continuam sendo escriturados na DES** em BH. A nossa funcionalidade `3.8 · registrar notas recebidas` não é conveniência interna: encosta numa obrigação acessória municipal.
3. 🆕 **Uma nota emitida não se altera** (princípio da imutabilidade), *"ressalvadas as hipóteses de cancelamento ou substituição"*. → reforça o ⏳ do nó `N38`: **"corrigir" provavelmente não existe.**

---

## Links
- Nacional, o par desta: [[2026-09-12-nfse-nacional-eventos-cancelamento]]
- Desenho: [[NOTAS]] (varredura crua) · [[PROCESSOS]] (P3 e P6) · [[HANDOFF-DADOS]]
- Fonte salva: `produto/me/_evidencias/fontes/pbh-nfse-2026-09-12/`
