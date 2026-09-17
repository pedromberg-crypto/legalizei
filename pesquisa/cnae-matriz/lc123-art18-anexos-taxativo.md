---
tipo: fato
status: vivo
data: 2026-08-27
assunto: lc123-art18-classificacao-anexos
tags: [pesquisa, cnae, fiscal, simples-nacional, fonte-primaria, lc123]
---

# ⚖️ LC 123/2006, Art. 18 — os 5 grupos taxativos (texto atual, redação LC 155/2016)

> Extraído direto de `planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm`. O HTML da lei mistura texto revogado (redação original 2006/2014) com texto vigente (redação dada pela LC 155/2016) na mesma página, sem marcação limpa — tive que separar manualmente cruzando cada `(Redação dada pela LC nº 155, de 2016)` / `(Revogado pela LC nº 155, de 2016)`. **Isto aqui é só a redação EM VIGOR.** Cruzado contra [[resultado-pesquisa-fundamentos-cnae-27-08]] (pesquisa Gemini anterior) — bate 100%, zero contradição.
>
> **Por que isto existe:** é a base pra classificar os 1332 CNAEs em Anexo III/IV/V + Fator R (dado que falta na matriz, item #3 da fila de 4). Não existe lista oficial CNAE→Anexo; existe ISTO (lista taxativa por atividade em texto de lei) que precisa ser cruzada contra a descrição de cada CNAE.

## Grupo 1 — SEMPRE Anexo III, sem Fator R (§ 5º-B, incisos I-XV + XVII)
| Inciso | Atividade |
|---|---|
| I | Creche, pré-escola, ensino fundamental/técnico/médio, idiomas, artes, pilotagem, preparatório pra concurso, gerencial, escolas livres (exceto as do Grupo 2/§5º-D II-III = academias) |
| II | Agência terceirizada de correios |
| III | Agência de viagem e turismo |
| IV | Centro de formação de condutores (autoescola) |
| V | Agência lotérica |
| IX | Instalação, reparos e manutenção em geral; usinagem, solda, tratamento e revestimento em metais |
| XIII | Transporte municipal de passageiros |
| XIV | Escritórios de serviços contábeis |
| XV | Produções cinematográficas, audiovisuais, artísticas e culturais (inclusive exibição/apresentação) |
| XVII | Corretagem de seguros |

## Grupo 2 — Anexo III por padrão, CAI pra V se Fator R <28% (§ 5º-B incisos XVI/XVIII/XIX/XX/XXI + TODO o § 5º-D)
Regra: § 5º-M, I e II.

**Do § 5º-B** (incluídos pela LC 155/2016):
| Inciso | Atividade |
|---|---|
| XVI | Fisioterapia |
| XVIII | Arquitetura e urbanismo |
| XIX | Medicina (inclusive laboratorial) e enfermagem |
| XX | Odontologia e prótese dentária |
| XXI | Psicologia, psicanálise, terapia ocupacional, acupuntura, podologia, fonoaudiologia, clínicas de nutrição e de vacinação, bancos de leite |

**Do § 5º-D** (todos os incisos, redação LC 155/2016):
| Inciso | Atividade |
|---|---|
| I | Administração e locação de imóveis de terceiros |
| II | Academias de dança, capoeira, ioga, artes marciais |
| III | Academias de atividades físicas, desportivas, natação, escolas de esportes |
| IV | Elaboração de programas de computador (inclusive jogos eletrônicos), **desde que desenvolvidos no estabelecimento do optante** |
| V | Licenciamento ou cessão de direito de uso de programas de computação (SaaS/software de prateleira) |
| VI | Páginas eletrônicas, **desde que realizadas no estabelecimento do optante** |
| IX | Montadoras de estandes para feiras |
| XII | Laboratórios de análises clínicas ou patologia clínica |
| XIII | Serviços de tomografia, diagnósticos médicos por imagem, registros gráficos, métodos óticos, ressonância magnética |
| XIV | Serviços de prótese em geral |

## Grupo 3 — Anexo V por padrão, SOBE pra III se Fator R ≥28% (§ 5º-I, redação LC 155/2016)
Regra: § 5º-J. **Este é o único grupo com esse sentido invertido** (parte de V, sobe pra III com Fator R alto — os outros partem de III e caem pra V).
| Inciso | Atividade |
|---|---|
| II | Medicina veterinária |
| V | Comissária, despachante, tradução, interpretação |
| VI | Arquitetura* (removida daqui em 2016, migrou pro Grupo 2/§5º-B XVIII), engenharia, medição, cartografia, topografia, geologia, geodésia, testes, suporte e análises técnicas/tecnológicas, pesquisa, design, desenho, agronomia |
| VII | Representação comercial e demais atividades de intermediação de negócios e serviços de terceiros |
| VIII | Perícia, leilão, avaliação |
| IX | Auditoria, economia, consultoria, gestão, organização, controle, administração |
| X | Jornalismo e publicidade |
| XI | Agenciamento, exceto de mão de obra |
| XII | **Residual intelectual:** outras atividades de prestação de serviços decorrentes de exercício de atividade intelectual, de natureza técnica, científica, desportiva, artística ou cultural, profissão regulamentada ou não, **desde que não sujeitas à tributação nos Anexos III ou IV** |

> Incisos I (medicina), III (odontologia), IV (psicologia etc.) foram **REVOGADOS** aqui em 2016 — migraram pro Grupo 2 (§5º-B). Não usar essas versões antigas.

## Grupo 4 — Anexo IV, CPP fora do DAS (§ 5º-C)
| Inciso | Atividade |
|---|---|
| I | Construção de imóveis e obras de engenharia em geral (inclusive subempreitada), execução de projetos, serviços de paisagismo, decoração de interiores |
| VI | Serviço de vigilância, limpeza ou conservação |
| VII | Serviços advocatícios |

## Grupo 5 — Residual, sempre Anexo III (§ 5º-F)
Qualquer serviço permitido no Simples (§2º art. 17) que **não tenha previsão expressa** em nenhum dos grupos 2, 3 ou 4 acima cai aqui — Anexo III fixo, sem Fator R. É o "resto" — cobre a maioria dos CNAEs de serviço que não são atividade intelectual/técnica regulamentada nem construção/limpeza/vigilância/advocacia.

## Mecânica do Fator R (lembrete, já ratificado em [[fundamentos-cnae]])
Fator R = folha de salários (12 meses, caixa) / receita bruta (12 meses, competência). ≥28% → III; <28% → V. Sem margem de segurança oficial.

## Como isso vira dado na matriz
Cruzar `descricao`/`atividades`/`subclasse_observacoes` (já na matriz, camada IBGE) de cada CNAE de serviço contra os 5 grupos acima. Onde bater um termo específico do grupo 2/3/4 (ex: "engenharia", "consultoria", "advocacia", "vigilância") → classifica com fonte (nº do inciso). Onde não bater nada → Grupo 5 (III residual) por eliminação. Ambíguo → marcar `requer-revisao`, não chutar.

## Links
- [[fundamentos-cnae]] · [[resultado-pesquisa-fundamentos-cnae-27-08]] · `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md`
