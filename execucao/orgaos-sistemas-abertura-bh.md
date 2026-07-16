---
tipo: derivado
status: rascunho
data: 2026-07-09
assunto: portais-orgaos
deriva_de: [fluxo-abertura-portais-pedro-dev]
tags: [compliance, imersao, bh]
---

# 🏛️ Órgãos e sistemas da abertura — BH/MG (levantado com Izabela)

> Sistemas/portais que a Izabela apontou na reunião de 2026-07-09, cada um ligado a um passo do processo. **Coleta em andamento** (prints subindo de 5 em 5). Coluna "Passo (Izabela)" = preencher ao cruzar com a transcrição do Plaud. "Passo (inferido)" = minha leitura, validar.

## Sistemas coletados

| Sistema | URL | Órgão / nível | O que faz | Passo (inferido) | Passo (Izabela) |
|---|---|---|---|---|---|
| **REDESIM** | gov.br/empresas-e-negocios/pt-br/redesim | Governo Federal | Registro integrado; DBE (cadastro sincronizado que cria o CNPJ na Receita) | Fase 3 (DBE + liberação CNPJ) | ✅ **Fase 3: DBE aqui**, depois volta JUCEMG, depois volta Receita p/ liberar CNPJ |
| **JUCEMG** | jucemg.mg.gov.br | Junta Comercial MG (estadual) | Viabilidade (unificada estadual+municipal) · contrato social PADRÃO (vem pronto) · assinatura · registro · Integrador (REMP/FCN) | Fases 2, 3, 4 | ✅ **Fase 2 (viabilidade unificada, tudo aqui)** · Fase 3 (contrato+registro) · **Fase 4 itens 1,2,4** (inscrição/licenciamento/dispensas) |
| **ALF — Atividades Econômicas PBH** | alf.pbh.gov.br | Prefeitura BH (municipal) | Alvará de localização e funcionamento · viabilidade municipal | Fase 4 | ✅ **Fase 4 item 3** (alvará/licenciamento específico da prefeitura) |
| **SISDRAM / Guias PBH** | sisdram.pbh.gov.br | Prefeitura BH (municipal) | Emissão de **DRAM** (guia municipal): taxas, IPTU, débitos | Fase 4 | ✅ **Fase 4: Taxa de funcionamento/fiscalização** (gerada ~30 dias após, cliente paga) |
| **Portal PBH** | prefeitura.pbh.gov.br | Prefeitura BH | Portal-mãe / hub municipal | Transversal | hub — acesso aos sistemas municipais |
| **BHISS / DES-BH** | prefeitura.pbh.gov.br/fazenda/bhiss | Sec. Municipal de Fazenda BH | **Credenciamento e emissão de NFS-e** (municipal + NFS-e Nacional) · DES-BH. Reforma Tributária | Fase 5 + rotina | ✅ **Fase 5: credenciamento NFS-e (busca "DES PBH")** — depende do certificado + números anteriores |
| **SIARE — SEF/MG** | www2.fazenda.mg.gov.br/sol | Sec. Estado Fazenda MG (estadual) | Certidão de Inscrição Estadual (quando há) · ICMS | Fase 5 (só comércio) | ✅ **Só COMÉRCIO** — emitir certidão de inscrição estadual. **Serviço puro NÃO usa** (IE é opção, não obrigação) |

## Notas rápidas
- **DRAM** = a guia municipal de BH pra pagar taxas (funcionamento, fiscalização) — casa com a "Taxa de Funcionamento/Fiscalização BH" da Fase 4 do [[processo-abertura-empresa-bh]].
- **Viabilidade aparece em 2 níveis:** JUCEMG (estadual, nome+endereço) E ALF/PBH (municipal, zoneamento). Confirmar a ordem com a Izabela.
- **REMP/FCN** (no Integrador JUCEMG) = Requerimento Eletrônico + Ficha de Cadastro Nacional — parte do fluxo RedeSim.
- **BHISS** = onde a **NFS-e** de BH é emitida + a **DES-BH** (obrigação acessória municipal, ver matriz de responsabilidades) provavelmente vive. Cita **NFS-e Nacional** (Reforma Tributária) — nosso parceiro de integração (Focus NFe) precisa suportar o município.
- **3 níveis fiscais mapeados:** Federal (Receita/RedeSim) · Estadual MG (SIARE-SEF) · Municipal BH (BHISS/SISDRAM/ALF). Pro nosso ICP de serviço puro, o estadual (ICMS) tende a NÃO se aplicar — confirmar com Izabela por que ela apontou o SIARE.
- 🔐 **Credenciais vistas em prints NÃO são registradas** (CPF/senha de login) — política de segurança.

## ✅ Coleta encerrada + cruzada com a transcrição da Izabela (2026-07-09)
Cada sistema amarrado ao passo exato (coluna Passo/Izabela). Detalhe completo em [[2026-07-09-conversa-izabela]]. **Ordem real dos portais:** Fase 2 JUCEMG (viabilidade unificada) → Fase 3 Redesim (DBE) → JUCEMG (contrato+registro) → Receita (CNPJ) → Fase 4 JUCEMG + ALF PBH + Guias PBH → Fase 5 certificadora externa + SIARE (só comércio) + DES-BH/BHISS (credenciamento NFS-e).

## Links
- [[processo-abertura-empresa-bh]] · [[HOME]]
