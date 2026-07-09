# Fluxo de abertura de empresa (BH) — passo × portal/URL

> Mapeado com a Izabela (contadora) em 2026-07-09. ME serviço, Simples, sem funcionário, **Belo Horizonte**. Pra o Pedro Dev usar no mapeamento API×RPA. Regra de ouro: **processo sequencial — um passo destrava o outro.**

---

## Fase 0 — Coleta de dados (no app, sem portal)
| Passo | Onde resolve |
|---|---|
| Dados do sócio (nome, CPF, RG, estado civil + **regime se casado**, endereço, contato) | App (coleta) |
| Se +1 sócio: dados completos de todos | App |
| Atividade exercida (→ CNAE) | App |
| Endereço da empresa | App (guardar **índice cadastral do IPTU** — necessário p/ outros municípios) |

## Fase 1 — Definições (no app, sem portal)
| Passo | Onde resolve |
|---|---|
| CNAE principal + secundários | App — **filtro por regime** (escolheu Simples → só CNAE que pode Simples) |
| Natureza jurídica (EI / SLU / LTDA) | App |
| Razão social + nome fantasia | App |
| Regime (Simples) + Anexo + Fator R | App (confirmar tributação com fiscal) |
| Pró-labore + capital social (valor **real**) | App |

## Fase 2 — Viabilidade
| Passo | Portal | URL |
|---|---|---|
| **Viabilidade UNIFICADA** (nome + endereço + atividade; estadual + municipal juntas) | **JUCEMG** | https://jucemg.mg.gov.br |
| Grau de risco | (definido pela análise da prefeitura, dentro da viabilidade) | — |

> ⚠️ BH roda viabilidade **sem IPTU**; outros municípios exigem o índice cadastral. Serviço geralmente **dispensado de alvará de localização**.

## Fase 3 — Registro e CNPJ (mesclado: Redesim → JUCEMG → Receita)
| Passo | Portal | URL |
|---|---|---|
| 1. **DBE** (cadastro sincronizado que cria o CNPJ na Receita) | **Redesim** | https://www.gov.br/empresas-e-negocios/pt-br/redesim |
| 2. **Contrato social** (já vem PRONTO em MG) + assinatura | **JUCEMG** | https://jucemg.mg.gov.br |
| — Assinatura do sócio | **GOV.BR** nível Prata/Ouro | https://www.gov.br |
| 3. **Registro** + protocolo (taxa R$288 paga pelo cliente) | **JUCEMG** | https://jucemg.mg.gov.br |
| 4. **Liberação do CNPJ** (CRC assina/se responsabiliza aqui) | **Receita** (via Redesim) | https://www.gov.br/empresas-e-negocios/pt-br/redesim |

> ⚠️ **GARGALO CRÍTICO:** JUCEMG **não tem API** conhecida (InfoSimples faz junta de SP, não MG). Prioridade = esgotar busca por API; senão RPA/Playwright (não escala). Prazo BH serviço: **5 dias** (às vezes dia pro outro).

## Fase 4 — Municipal BH
| Passo | Portal | URL |
|---|---|---|
| Inscrição municipal (mobiliário) + licenciamento + dispensas (sanitária + bombeiros) | **JUCEMG** (integrado, itens 1,2,4) | https://jucemg.mg.gov.br |
| Alvará de localização e funcionamento (item 3) | **ALF — Atividades Econômicas PBH** | https://alf.pbh.gov.br |
| **Taxa de funcionamento/fiscalização** (gerada ~30 dias após, cliente paga) | **Guias PBH / SISDRAM** | https://sisdram.pbh.gov.br |

## Fase 5 — Fiscal e habilitação
| Passo | Portal | URL |
|---|---|---|
| **Certificado digital A1** (só APÓS o CNPJ; precisa do nº) | Certificadora **parceira externa** (comissionada) | (definir parceiro) |
| Opção pelo Simples | Já sai **automático** junto com a liberação do CNPJ (federal) | — |
| Inscrição estadual — **só COMÉRCIO** (serviço não tem) | **SIARE — SEF/MG** (emite a certidão) | https://www2.fazenda.mg.gov.br/sol |
| **Credenciamento p/ emissão de NFS-e** (busca "DES PBH") | **BHISS / DES-BH** | https://prefeitura.pbh.gov.br/fazenda/bhiss |

## Fase 6 — Operacional (rotina no app)
| Passo | Onde resolve |
|---|---|
| Conta bancária PJ | Parceiro |
| Emitir NFS-e | BHISS (municipal) / **Focus NFe** (integração) |
| Gerar/pagar DAS | Receita / **InfoSimples** (consultas) |
| Rotina fiscal + acessórias | App (front) + back-end Legalize (CRC) |

---

## Resumo — portais e URLs
| Portal | Nível | URL | Fase | API? |
|---|---|---|---|---|
| JUCEMG | Estadual MG | jucemg.mg.gov.br | 2, 3, 4 | 🔴 sem API (crítico) |
| Redesim | Federal | gov.br/empresas-e-negocios/pt-br/redesim | 3 | InfoSimples cobre parte da Receita |
| GOV.BR | Federal | gov.br | 3 (assinatura) | — |
| ALF PBH | Municipal BH | alf.pbh.gov.br | 4 | a mapear |
| SISDRAM | Municipal BH | sisdram.pbh.gov.br | 4 (taxas) | a mapear |
| BHISS / DES-BH | Municipal BH | prefeitura.pbh.gov.br/fazenda/bhiss | 5, 6 (NFS-e) | Focus NFe (parceiro) |
| SIARE SEF/MG | Estadual MG | www2.fazenda.mg.gov.br/sol | 5 (só comércio) | a mapear |

## Notas técnicas
- **2 matrizes de dados** movimentam tudo depois: **CNPJ** (abertura) + **certificado A1** → alimentam DAS, NF, consultas.
- **Federal** é aberto/consultável (InfoSimples resolve). **Estadual e municipal** são o complexo — por isso geo-niche BH.
- Custos do cliente: taxa JUCEMG **R$288** · certificado A1 **R$209–229/ano** · taxa fiscalização BH (anual).
