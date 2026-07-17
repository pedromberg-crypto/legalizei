---
tipo: referencia
status: vivo
data: 2026-07-17
fonte: derivado de cnae-complexidade-abertura (CGSIM + conselhos/setorial) + filtro fiscal de serviço
confianca: liso-confirmado-por-nos (lista-base herdada, nao-ratificada por contador)
cobertura: 103
---
# CNAEs SERVIÇO-LISO — happy path do MVP (103)

> Os **103 CNAEs** que são **🟢 liso** (baixo risco A + sem conselho + sem setorial) **E serviço puro** (Anexo III/IV/V, sem Anexo I comércio nem II indústria).
> **Início conservador e deliberado das telas.** Abertura 100% automatizável, sem etapa humana, dentro do "MVP só serviço".
> Recorte de [[cnae-complexidade-abertura]] · [[cnae-atendidos-hub]].

**Flag de honestidade:** "liso" = confirmado **por nós** no eixo complexidade, sobre fonte oficial (CGSIM). A afirmação "atende" é **herdada da Contabilizei**, não ratificada por contador.

## 🔭 OBSERVAÇÃO — este número CRESCE (caminho de volta aos 387)
Começamos com 103 de propósito (afunilamento seguro). Dá pra **expandir por camadas até os 387 da Contabilizei** — cada camada é um estudo, e pode virar **feature de produto** ("abrimos mais CNAEs"):

| camada de expansão | +nº | acumulado | o que falta estudar |
|---|---|---|---|
| **serviço-liso (agora)** | 103 | **103** | nada — pronto |
| + comércio/indústria liso | +67 | 170 | reabrir "MVP só serviço" (Anexo I/II) |
| + verificar-licenciamento | +120 | 290 | split médio×alto (fonte setorial BH/Bombeiros/Vigilância) |
| + tato-registro | +97 | 387 | atendimento humano/RT (Mauro ou parceiro) por conselho |
| **total Contabilizei** | | **387** | |

> Ordem sugerida de crescimento: serviço-liso → verificar (quando tiver a fonte de risco BH) → comércio → tato-registro (quando o modelo comportar humano). **Nada aqui é descarte — é backlog priorizado.**

## Resumo por seção
| seção | nome | nº |
|---|---|---|
| C | Indústria de transformação | 12 |
| G | Comércio/reparação | 9 |
| I | Alojamento/alimentação | 2 |
| J | Informação/comunicação | 13 |
| M | Atividades profissionais/científicas/técnicas | 21 |
| N | Atividades administrativas/serviços | 16 |
| P | Educação | 9 |
| R | Artes/cultura/esporte/recreação | 10 |
| S | Outras atividades de serviços | 11 |

> Colunas: **Anexo** (III/IV/V) · **FR** = sujeito a Fator R · **MEI** = pode ser MEI.

### C — Indústria de transformação (12)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `3250-7/06` | SERVIÇOS DE PRÓTESE DENTÁRIA | III/V | ✔ |  |
| `3312-1/02` | MANUTENÇÃO E REPARAÇÃO DE APARELHOS E INSTRUMENTOS DE MEDIDA, TESTE E CONTROLE | III |  |  |
| `3312-1/04` | MANUTENÇÃO E REPARAÇÃO DE EQUIPAMENTOS E INSTRUMENTOS ÓPTICOS | III |  |  |
| `3313-9/02` | MANUTENÇÃO E REPARAÇÃO DE BATERIAS E ACUMULADORES ELÉTRICOS, EXCETO PARA VEÍCULOS | III |  | ✔ |
| `3314-7/01` | MANUTENÇÃO E REPARAÇÃO DE MÁQUINAS MOTRIZES NÃO ELÉTRICAS | III |  | ✔ |
| `3314-7/02` | MANUTENÇÃO E REPARAÇÃO DE EQUIPAMENTOS HIDRÁULICOS E PNEUMÁTICOS, EXCETO VÁLVULAS | III |  | ✔ |
| `3314-7/03` | MANUTENÇÃO E REPARAÇÃO DE VÁLVULAS INDUSTRIAIS | III |  |  |
| `3314-7/06` | MANUTENÇÃO E REPARAÇÃO DE MÁQUINAS, APARELHOS E EQUIPAMENTOS PARA INSTALAÇÕES TÉRMICAS | III |  | ✔ |
| `3314-7/07` | MANUTENÇÃO E REPARAÇÃO DE MÁQUINAS E APARELHOS DE REFRIGERAÇÃO E VENTILAÇÃO PARA USO INDUSTRIAL E COMERCIAL | III |  | ✔ |
| `3314-7/09` | MANUTENÇÃO E REPARAÇÃO DE MÁQUINAS DE ESCREVER, CALCULAR E DE OUTROS EQUIPAMENTOS NÃO ELETRÔNICOS PARA ESCRITÓRIO | III |  | ✔ |
| `3314-7/12` | MANUTENÇÃO E REPARAÇÃO DE TRATORES AGRÍCOLAS | III |  | ✔ |
| `3314-7/13` | MANUTENÇÃO E REPARAÇÃO DE MÁQUINAS FERRAMENTA | III |  |  |

### G — Comércio/reparação (9)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `4520-0/01` | SERVIÇOS DE MANUTENÇÃO E REPARAÇÃO MECÂNICA DE VEÍCULOS AUTOMOTORES | III |  | ✔ |
| `4520-0/02` | SERVIÇOS DE LANTERNAGEM OU FUNILARIA E PINTURA DE VEÍCULOS AUTOMOTORES | III |  | ✔ |
| `4520-0/03` | SERVIÇOS DE MANUTENÇÃO E REPARAÇÃO ELÉTRICA DE VEÍCULOS AUTOMOTORES | III |  | ✔ |
| `4520-0/04` | SERVIÇOS DE ALINHAMENTO E BALANCEAMENTO DE VEÍCULOS AUTOMOTORES | III |  |  |
| `4520-0/05` | SERVIÇOS DE LAVAGEM, LUBRIFICAÇÃO E POLIMENTO DE VEÍCULOS AUTOMOTORES | III/IV |  | ✔ |
| `4520-0/06` | SERVIÇOS DE BORRACHARIA PARA VEÍCULOS AUTOMOTORES | III |  | ✔ |
| `4520-0/07` | SERVIÇOS DE INSTALAÇÃO, MANUTENÇÃO E REPARAÇÃO DE ACESSÓRIOS PARA VEÍCULOS AUTOMOTORES | III |  | ✔ |
| `4520-0/08` | SERVIÇOS DE CAPOTARIA | III |  | ✔ |
| `4543-9/00` | MANUTENÇÃO E REPARAÇÃO DE MOTOCICLETAS E MOTONETAS | III |  | ✔ |

### I — Alojamento/alimentação (2)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `5590-6/01` | ALBERGUES, EXCETO ASSISTENCIAIS | III |  | ✔ |
| `5590-6/03` | PENSÕES(ALOJAMENTO) | III |  | ✔ |

### J — Informação/comunicação (13)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `5911-1/02` | PRODUÇÃO DE FILMES PARA PUBLICIDADE | III |  |  |
| `5912-0/01` | SERVIÇOS DE DUBLAGEM | III |  | ✔ |
| `5912-0/02` | SERVIÇOS DE MIXAGEM SONORA EM PRODUÇÃO AUDIOVISUAL | III |  |  |
| `5920-1/00` | ATIVIDADES DE GRAVAÇÃO DE SOM E DE EDIÇÃO DE MÚSICA | III |  |  |
| `6201-5/01` | DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA | III/V | ✔ |  |
| `6201-5/02` | WEB DESIGN | III/V | ✔ |  |
| `6202-3/00` | DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR CUSTOMIZÁVEIS | III/V | ✔ |  |
| `6203-1/00` | DESENVOLVIMENTO E LICENCIAMENTO DE PROGRAMAS DE COMPUTADOR NÃO CUSTOMIZÁVEIS | III/V | ✔ |  |
| `6204-0/00` | CONSULTORIA EM TECNOLOGIA DA INFORMAÇÃO | III/V | ✔ |  |
| `6209-1/00` | SUPORTE TÉCNICO, MANUTENÇÃO E OUTROS SERVIÇOS EM TECNOLOGIA DA INFORMAÇÃO | III/V | ✔ |  |
| `6311-9/00` | TRATAMENTO DE DADOS, PROVEDORES DE SERVIÇOS DE APLICAÇÃO E SERVIÇOS DE HOSPEDAGEM NA INTERNET | III/V | ✔ |  |
| `6319-4/00` | PORTAIS, PROVEDORES DE CONTEÚDO E OUTROS SERVIÇOS DE INFORMAÇÃO NA INTERNET | III/V | ✔ |  |
| `6391-7/00` | AGÊNCIAS DE NOTÍCIAS | III |  |  |

### M — Atividades profissionais/científicas/técnicas (21)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `7020-4/00` | ATIVIDADES DE CONSULTORIA EM GESTÃO EMPRESARIAL, EXCETO CONSULTORIA TÉCNICA ESPECÍFICA | III/V | ✔ |  |
| `7210-0/00` | PESQUISA E DESENVOLVIMENTO EXPERIMENTAL EM CIÊNCIAS FÍSICAS E NATURAIS | III/V | ✔ |  |
| `7220-7/00` | PESQUISA E DESENVOLVIMENTO EXPERIMENTAL EM CIÊNCIAS SOCIAIS E HUMANAS | III/V | ✔ |  |
| `7311-4/00` | AGÊNCIAS DE PUBLICIDADE | III/V | ✔ |  |
| `7312-2/00` | AGENCIAMENTO DE ESPAÇOS PARA PUBLICIDADE, EXCETO EM VEÍCULOS DE COMUNICAÇÃO | III/V | ✔ |  |
| `7319-0/02` | PROMOÇÃO DE VENDAS | III |  | ✔ |
| `7319-0/03` | MARKETING DIRETO | III |  |  |
| `7319-0/04` | CONSULTORIA EM PUBLICIDADE | III/V | ✔ |  |
| `7320-3/00` | PESQUISAS DE MERCADO E DE OPINIÃO PÚBLICA | III/V | ✔ |  |
| `7410-2/02` | DESIGN DE INTERIORES | III/IV/V | ✔ |  |
| `7410-2/03` | DESIGN DE PRODUTO | III/V | ✔ |  |
| `7410-2/99` | ATIVIDADES DE DESIGN NÃO ESPECIFICADAS ANTERIORMENTE | III/V | ✔ |  |
| `7420-0/01` | ATIVIDADES DE PRODUÇÃO DE FOTOGRAFIAS, EXCETO AÉREA E SUBMARINA | III |  | ✔ |
| `7420-0/03` | LABORATÓRIOS FOTOGRÁFICOS | III |  | ✔ |
| `7420-0/04` | FILMAGEM DE FESTAS E EVENTOS | III |  | ✔ |
| `7420-0/05` | SERVIÇOS DE MICROFILMAGEM | III |  |  |
| `7490-1/01` | SERVIÇOS DE TRADUÇÃO, INTERPRETAÇÃO E SIMILARES | III/V | ✔ |  |
| `7490-1/03` | SERVIÇOS DE AGRONOMIA E DE CONSULTORIA ÀS ATIVIDADES AGRÍCOLAS E PECUÁRIAS | III/V | ✔ |  |
| `7490-1/04` | ATIVIDADES DE INTERMEDIAÇÃO E AGENCIAMENTO DE SERVIÇOS E NEGÓCIOS EM GERAL, EXCETO IMOBILIÁRIOS | III/V | ✔ |  |
| `7490-1/05` | AGENCIAMENTO DE PROFISSIONAIS PARA ATIVIDADES ESPORTIVAS, CULTURAIS E ARTÍSTICAS | III/V | ✔ |  |
| `7490-1/99` | OUTRAS ATIVIDADES PROFISSIONAIS, CIENTÍFICAS E TÉCNICAS NÃO ESPECIFICADAS ANTERIORMENTE | III/V | ✔ |  |

### N — Atividades administrativas/serviços (16)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `7721-7/00` | ALUGUEL DE EQUIPAMENTOS RECREATIVOS E ESPORTIVOS | III |  | ✔ |
| `7722-5/00` | ALUGUEL DE FITAS DE VÍDEO, DVDS E SIMILARES | III |  | ✔ |
| `7723-3/00` | ALUGUEL DE OBJETOS DO VESTUÁRIO, JÓIAS E ACESSÓRIOS | III |  | ✔ |
| `7729-2/01` | ALUGUEL DE APARELHOS DE JOGOS ELETRÔNICOS | III |  | ✔ |
| `7729-2/02` | ALUGUEL DE MÓVEIS, UTENSÍLIOS E APARELHOS DE USO DOMÉSTICO E PESSOAL; INSTRUMENTOS MUSICAIS | III |  | ✔ |
| `7729-2/03` | ALUGUEL DE MATERIAL MÉDICO | III |  | ✔ |
| `7729-2/99` | ALUGUEL DE OUTROS OBJETOS PESSOAIS E DOMÉSTICOS NÃO ESPECIFICADOS ANTERIORMENTE | III |  | ✔ |
| `7733-1/00` | ALUGUEL DE MÁQUINAS E EQUIPAMENTOS PARA ESCRITÓRIOS | III |  | ✔ |
| `8211-3/00` | SERVIÇOS COMBINADOS DE ESCRITÓRIO E APOIO ADMINISTRATIVO | III |  |  |
| `8219-9/01` | FOTOCÓPIAS | III |  | ✔ |
| `8219-9/99` | PREPARAÇÃO DE DOCUMENTOS E SERVIÇOS ESPECIALIZADOS DE APOIO ADMINISTRATIVO NÃO ESPECIFICADOS ANTERIORMENTE | III |  | ✔ |
| `8220-2/00` | ATIVIDADES DE TELEATENDIMENTO | III |  |  |
| `8230-0/01` | SERVIÇOS DE ORGANIZAÇÃO DE FEIRAS, CONGRESSOS, EXPOSIÇÕES E FESTAS | III |  | ✔ |
| `8291-1/00` | ATIVIDADES DE COBRANÇAS E INFORMAÇÕES CADASTRAIS | III |  | ✔ |
| `8299-7/03` | SERVIÇOS DE GRAVAÇÃO DE CARIMBOS, EXCETO CONFECÇÃO | III |  | ✔ |
| `8299-7/07` | SALAS DE ACESSO À INTERNET | III |  | ✔ |

### P — Educação (9)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `8591-1/00` | ENSINO DE ESPORTES | III | ✔ |  |
| `8592-9/01` | ENSINO DE DANÇA | III/V | ✔ |  |
| `8592-9/02` | ENSINO DE ARTES CÊNICAS, EXCETO DANÇA | III |  | ✔ |
| `8592-9/03` | ENSINO DE MÚSICA | III |  | ✔ |
| `8592-9/99` | ENSINO DE ARTE E CULTURA NÃO ESPECIFICADO ANTERIORMENTE | III |  | ✔ |
| `8593-7/00` | ENSINO DE IDIOMAS | III |  | ✔ |
| `8599-6/03` | TREINAMENTO EM INFORMÁTICA | III |  | ✔ |
| `8599-6/04` | TREINAMENTO EM DESENVOLVIMENTO PROFISSIONAL E GERENCIAL | III |  | ✔ |
| `8599-6/05` | CURSOS PREPARATÓRIOS PARA CONCURSOS | III |  | ✔ |

### R — Artes/cultura/esporte/recreação (10)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `9001-9/01` | PRODUÇÃO TEATRAL | III |  | ✔ |
| `9001-9/02` | PRODUÇÃO MUSICAL | III |  | ✔ |
| `9001-9/03` | PRODUÇÃO DE ESPETÁCULOS DE DANÇA | III |  |  |
| `9001-9/04` | PRODUÇÃO DE ESPETÁCULOS CIRCENSES, DE MARIONETES E SIMILARES | III |  |  |
| `9002-7/01` | ATIVIDADES DE ARTISTAS PLÁSTICOS, JORNALISTAS INDEPENDENTES E ESCRITORES | III/V | ✔ |  |
| `9002-7/02` | RESTAURAÇÃO DE OBRAS DE ARTE | III |  | ✔ |
| `9102-3/02` | RESTAURAÇÃO E CONSERVAÇÃO DE LUGARES E PRÉDIOS HISTÓRICOS | III |  |  |
| `9319-1/01` | PRODUÇÃO E PROMOÇÃO DE EVENTOS ESPORTIVOS | III |  |  |
| `9329-8/03` | EXPLORAÇÃO DE JOGOS DE SINUCA, BILHAR E SIMILARES | III |  | ✔ |
| `9329-8/04` | EXPLORAÇÃO DE JOGOS ELETRÔNICOS RECREATIVOS | III |  | ✔ |

### S — Outras atividades de serviços (11)
| CNAE | Atividade | Anexo | FR | MEI |
|---|---|---|---|---|
| `9511-8/00` | REPARAÇÃO E MANUTENÇÃO DE COMPUTADORES E DE EQUIPAMENTOS PERIFÉRICOS | III |  | ✔ |
| `9512-6/00` | REPARAÇÃO E MANUTENÇÃO DE EQUIPAMENTOS DE COMUNICAÇÃO | III |  | ✔ |
| `9521-5/00` | REPARAÇÃO E MANUTENÇÃO DE EQUIPAMENTOS ELETROELETRÔNICOS DE USO PESSOAL E DOMÉSTICO | III |  | ✔ |
| `9529-1/01` | REPARAÇÃO DE CALÇADOS, DE BOLSAS E ARTIGOS DE VIAGEM | III |  | ✔ |
| `9529-1/02` | CHAVEIROS | III |  | ✔ |
| `9529-1/03` | REPARAÇÃO DE RELÓGIOS | III |  | ✔ |
| `9529-1/05` | REPARAÇÃO DE ARTIGOS DO MOBILIÁRIO | III |  | ✔ |
| `9529-1/06` | REPARAÇÃO DE JÓIAS | III |  | ✔ |
| `9529-1/99` | REPARAÇÃO E MANUTENÇÃO DE OUTROS OBJETOS E EQUIPAMENTOS PESSOAIS E DOMÉSTICOS NÃO ESPECIFICADOS ANTERIORMENTE | III |  | ✔ |
| `9602-5/01` | CABELEIREIROS, MANICURE E PEDICURE | III |  | ✔ |
| `9609-2/02` | AGÊNCIAS MATRIMONIAIS | III |  | ✔ |

## Ligações
[[cnae-complexidade-abertura]] · [[cnae-atendidos-hub]] · [[taxonomia-pills-n4]] · [[legalize-mvp-so-servico-cnae]] · [[fila-validacao-humana]]
