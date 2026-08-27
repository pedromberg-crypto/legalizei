---
tipo: verdade
status: vivo
data: 2026-08-27
assunto: cnae-atendemos-com-certeza
deriva_de: [cnae-matriz-governo, lc123-art18-anexos-taxativo, profissoes-regulamentadas-conselhos, mei-risco-e-simplificacao-abertura, cnae-complexidade-abertura]
superado_por:
tags: [cnae, mei, simples-nacional, escopo, fonte-primaria]
---

# 🟢 CNAEs que atendemos com certeza (92 ME · 55 MEI)

> Substitui a v1 de 17/07 (103 CNAEs, herdada da Contabilizei, não ratificada). Esta versão é **fonte primária em toda a linha**: cada critério tem lei/resolução citada, nenhum dado vem de concorrente. Colunas `atende_me_certeza` e `atende_mei_certeza` já estão gravadas em `cnae-matriz.csv`/`.json` — este doc é a leitura humana da mesma verdade.

## Critério (6 filtros, todos com fonte)
```
641 CNAEs de serviço (IBGE, seções J/M/N/P/R/S predominantes)
→ 549 não vedados ao Simples Nacional (CGSN140 Anexo VI)
→ 532 não ambíguos (CGSN140 Anexo VII)
→ 122 baixo risco — dispensa vistoria/alvará (CGSIM Resolução 51/2019, Anexo I)
→  96 não exigem registro em conselho profissional (Lei 6.839/1980 + leis de cada conselho)
→  92 não exigem registro setorial federal (CADASTUR/Polícia Federal/Bacen-CVM-SUSEP — cruzado contra [[cnae-complexidade-abertura]])
```
Dos 92, **55 também permitem MEI** (Anexo XI CGSN140) — MEI segue o mesmo filtro de risco do ME (confirmado em [[mei-risco-e-simplificacao-abertura]], Art. 18-A §18 da LC123), não existe atalho.

## O que mudou vs a v1 (103, herdada)
- **80 confirmados** — os dois métodos concordam, núcleo sólido.
- **23 saíram na 1ª rodada** (5 critérios): 21 eram na verdade comércio/indústria pelo IBGE (violavam "MVP só serviço" — a curadoria de julho errou a seção); 2 eram regulamentados que passaram batido (`7020-4/00` consultoria em gestão/CRA, `7490-1/03` agronomia/CREA).
- **+4 saíram na 2ª rodada** (cruzamento com [[cnae-complexidade-abertura]], 27/08 — eixo de **registro setorial federal**, diferente de conselho profissional, que a pesquisa original do 5º dado não cobriu): `6621-5/02` auditoria/consultoria atuarial → Bacen/CVM/SUSEP; `7911-2/00` agências de viagens → CADASTUR; `7912-1/00` operadores turísticos → CADASTUR; `8011-1/02` adestramento de cães de guarda → Polícia Federal.
- **16 entraram**: batiam nos critérios e não estavam na lista velha.

⚠️ **O eixo de registro setorial só foi cruzado pra 387 dos 1332 CNAEs** (cobertura do arquivo antigo, que só mapeia o footprint da Contabilizei). Pra CNAEs fora desses 387, `exige_registro_setorial` fica `nao-verificado` na matriz — não é garantia de que não precisam, é lacuna de pesquisa ainda aberta.

## ⚠️ Casos deixados de fora por segurança (não classificados, não é "não atende")
`8660-7/00` apoio à gestão de saúde · `8030-7/00` investigação particular · `8020-0/01` monitoramento de segurança eletrônica — ver [[profissoes-regulamentadas-conselhos]] pelo motivo de cada um. E 62 CNAEs de serviço ficaram `requer-revisao` no Anexo/Fator R (ambíguo demais pra classificar sem humano) — nenhum deles entra aqui por definição.

---

## Lista completa (96), por seção

**Colunas:** CNAE · Descrição · Anexo/Fator R · MEI · ISS BH

### Alojamento e Alimentação (4)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 5590-6/01 | Albergues, exceto assistenciais | III-fixo | ✅ | 5% |
| 5590-6/03 | Pensões (alojamento) | III-fixo | ✅ | 5% |
| 5611-2/01 | Restaurantes e similares | III-fixo | ✅ | — |
| 5611-2/03 | Lanchonetes, casas de chá, de sucos e similares | III-fixo | ✅ | — |

### Artes, Cultura, Esporte e Recreação (10)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 9001-9/01 | Produção teatral | III-fixo | ✅ | 2%/5% |
| 9001-9/02 | Produção musical | III-fixo | ✅ | 2%/5% |
| 9001-9/03 | Produção de espetáculos de dança | III-fixo | — | 2%/5% |
| 9001-9/04 | Produção de espetáculos circenses, de marionetes e similares | III-fixo | — | 2%/5% |
| 9002-7/01 | Atividades de artistas plásticos, jornalistas independentes e escritores | III-fixo | — | 2%/5% |
| 9002-7/02 | Restauração de obras de arte | III-fixo | ✅ | 5% |
| 9102-3/02 | Restauração e conservação de lugares e prédios históricos | III-fixo | — | 2% |
| 9319-1/01 | Produção e promoção de eventos esportivos | III-fixo | — | 5% |
| 9329-8/03 | Exploração de jogos de sinuca, bilhar e similares | III-fixo | ✅ | 5% |
| 9329-8/04 | Exploração de jogos eletrônicos recreativos | Fator R dinâmico | ✅ | 5% |

### Atividades Administrativas e Serviços Complementares (17)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 7721-7/00 | Aluguel de equipamentos recreativos e esportivos | III-fixo | ✅ | — |
| 7722-5/00 | Aluguel de fitas de vídeo, DVDs e similares | III-fixo | ✅ | — |
| 7723-3/00 | Aluguel de objetos do vestuário, jóias e acessórios | III-fixo | ✅ | — |
| 7729-2/01 | Aluguel de aparelhos de jogos eletrônicos | Fator R dinâmico | ✅ | — |
| 7729-2/02 | Aluguel de móveis, utensílios e aparelhos de uso doméstico e pessoal; instrumentos musicais | III-fixo | ✅ | — |
| 7729-2/03 | Aluguel de material médico | III-fixo | ✅ | — |
| 7729-2/99 | Aluguel de outros objetos pessoais e domésticos NE | `requer-revisao` | ✅ | — |
| 7733-1/00 | Aluguel de máquinas e equipamentos para escritórios | III-fixo | ✅ | — |
| 8211-3/00 | Serviços combinados de escritório e apoio administrativo | `requer-revisao` | — | 5% |
| 8219-9/01 | Fotocópias | III-fixo | ✅ | 5% |
| 8219-9/99 | Preparação de documentos e serviços especializados de apoio administrativo NE | `requer-revisao` | ✅ | 5% |
| 8220-2/00 | Atividades de teleatendimento | III-fixo | — | 2%/5% |
| 8230-0/01 | Serviços de organização de feiras, congressos, exposições e festas | III-fixo | ✅ | 5% |
| 8291-1/00 | Atividades de cobranças e informações cadastrais | III-fixo | ✅ | 5% |
| 8292-0/00 | Envasamento e empacotamento sob contrato | III-fixo | ✅ | 5% |
| 8299-7/03 | Serviços de gravação de carimbos, exceto confecção | III-fixo | ✅ | 5% |
| 8299-7/07 | Salas de acesso à internet | III-fixo | ✅ | 5% |

### Atividades Profissionais, Científicas e Técnicas (19)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 7210-0/00 | Pesquisa e desenvolvimento experimental em ciências físicas e naturais | III-fixo | — | 5% |
| 7220-7/00 | Pesquisa e desenvolvimento experimental em ciências sociais e humanas | III-fixo | — | 5% |
| 7311-4/00 | Agências de publicidade | Fator R dinâmico | — | 2% |
| 7312-2/00 | Agenciamento de espaços para publicidade, exceto em veículos de comunicação | Fator R dinâmico | — | 2% |
| 7319-0/02 | Promoção de vendas | III-fixo | ✅ | 2% |
| 7319-0/03 | Marketing direto | III-fixo | — | 2% |
| 7319-0/04 | Consultoria em publicidade | Fator R dinâmico | — | 5% |
| 7320-3/00 | Pesquisas de mercado e de opinião pública | III-fixo | — | 2% |
| 7410-2/02 | Design de interiores | Fator R dinâmico | — | 2% |
| 7410-2/03 | Design de produto | Fator R dinâmico | — | — |
| 7410-2/99 | Atividades de design NE | `requer-revisao` | — | — |
| 7420-0/01 | Atividades de produção de fotografias, exceto aérea e submarina | III-fixo | ✅ | 5% |
| 7420-0/03 | Laboratórios fotográficos | III-fixo | ✅ | 5% |
| 7420-0/04 | Filmagem de festas e eventos | III-fixo | ✅ | 5% |
| 7420-0/05 | Serviços de microfilmagem | III-fixo | — | 5% |
| 7490-1/01 | Serviços de tradução, interpretação e similares | Fator R dinâmico | — | 5% |
| 7490-1/04 | Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários | Fator R dinâmico | — | 2% |
| 7490-1/05 | Agenciamento de profissionais para atividades esportivas, culturais e artísticas | Fator R dinâmico | — | 2% |
| 7490-1/99 | Outras atividades profissionais, científicas e técnicas NE | `requer-revisao` | — | 2%/5% |

### Educação (9)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 8591-1/00 | Ensino de esportes | III-fixo | — | 2% |
| 8592-9/01 | Ensino de dança | III-fixo | — | 2% |
| 8592-9/02 | Ensino de artes cênicas, exceto dança | III-fixo | ✅ | 2% |
| 8592-9/03 | Ensino de música | III-fixo | ✅ | 2% |
| 8592-9/99 | Ensino de arte e cultura NE | `requer-revisao` | ✅ | 2% |
| 8593-7/00 | Ensino de idiomas | III-fixo | ✅ | 2% |
| 8599-6/03 | Treinamento em informática | III-fixo | ✅ | 2% |
| 8599-6/04 | Treinamento em desenvolvimento profissional e gerencial | III-fixo | ✅ | 2% |
| 8599-6/05 | Cursos preparatórios para concursos | III-fixo | ✅ | 2% |

### Informação e Comunicação (18)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 5811-5/00 | Edição de livros | III-fixo | ✅ | 5% |
| 5812-3/01 | Edição de jornais diários | III-fixo | ✅ | 5% |
| 5812-3/02 | Edição de jornais não diários | III-fixo | ✅ | 5% |
| 5813-1/00 | Edição de revistas | III-fixo | ✅ | 5% |
| 5819-1/00 | Edição de cadastros, listas e de outros produtos gráficos | III-fixo | ✅ | 5% |
| 5911-1/02 | Produção de filmes para publicidade | `requer-revisao` | — | 2% |
| 5912-0/01 | Serviços de dublagem | III-fixo | ✅ | 5% |
| 5912-0/02 | Serviços de mixagem sonora em produção audiovisual | III-fixo | — | 5% |
| 5920-1/00 | Atividades de gravação de som e de edição de música | III-fixo | — | 5% |
| 6201-5/01 | Desenvolvimento de programas de computador sob encomenda | Fator R dinâmico | — | 2% |
| 6201-5/02 | Web design | Fator R dinâmico | — | 2% |
| 6202-3/00 | Desenvolvimento e licenciamento de programas de computador customizáveis | Fator R dinâmico | — | 2% |
| 6203-1/00 | Desenvolvimento e licenciamento de programas de computador não customizáveis | Fator R dinâmico | — | 2% |
| 6204-0/00 | Consultoria em tecnologia da informação | Fator R dinâmico | — | 2% |
| 6209-1/00 | Suporte técnico, manutenção e outros serviços em tecnologia da informação | III-fixo | — | 2% |
| 6311-9/00 | Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet | III-fixo | — | 2% |
| 6319-4/00 | Portais, provedores de conteúdo e outros serviços de informação na internet | III-fixo | — | 2% |
| 6391-7/00 | Agências de notícias | III-fixo | — | 5% |

### Outras Atividades de Serviços (12)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 9511-8/00 | Reparação e manutenção de computadores e de equipamentos periféricos | III-fixo | ✅ | 5% |
| 9512-6/00 | Reparação e manutenção de equipamentos de comunicação | III-fixo | ✅ | 5% |
| 9521-5/00 | Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico | III-fixo | ✅ | 5% |
| 9529-1/01 | Reparação de calçados, de bolsas e artigos de viagem | III-fixo | ✅ | 5% |
| 9529-1/02 | Chaveiros | III-fixo | ✅ | 5% |
| 9529-1/03 | Reparação de relógios | III-fixo | ✅ | 5% |
| 9529-1/04 | Reparação de bicicletas, triciclos e outros veículos não motorizados | III-fixo | ✅ | 5% |
| 9529-1/05 | Reparação de artigos do mobiliário | III-fixo | ✅ | 5% |
| 9529-1/06 | Reparação de jóias | III-fixo | ✅ | 5% |
| 9529-1/99 | Reparação e manutenção de outros objetos e equipamentos pessoais e domésticos NE | III-fixo | ✅ | 5% |
| 9602-5/01 | Cabeleireiros, manicure e pedicure | III-fixo | ✅ | 5% |
| 9609-2/02 | Agências matrimoniais | III-fixo | ✅ | 5% |

### Transporte, Armazenagem e Correio (1)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 5232-0/00 | Atividades de agenciamento marítimo | Fator R dinâmico | — | 2% |

### Água, Esgoto, Gestão de Resíduos e Descontaminação (2)
| CNAE | Descrição | Anexo/Fator R | MEI | ISS BH |
|---|---|---|---|---|
| 3831-9/99 | Recuperação de materiais metálicos, exceto alumínio | III-fixo | ✅ | — |
| 3832-7/00 | Recuperação de materiais plásticos | III-fixo | ✅ | — |

---

## Roadmap de expansão (backlog, não construído)
Dá pra crescer por camadas até paridade com o mercado (~387 CNAEs de serviço da Contabilizei). Cada camada é um estudo, pode virar feature ("abrimos mais CNAEs"):

| camada | o que falta estudar |
|---|---|
| **92 atual** | pronto |
| + risco médio (verificar-licenciamento) | fonte setorial BH/Bombeiros/Vigilância por atividade específica |
| + regulamentados com RT terceirizável | modelo de atendimento humano (Mauro/parceiro) por conselho |
| + comércio/indústria leve | reabrir decisão "MVP só serviço" |

---

## 📚 Contexto mais amplo — a complexidade de abertura nos 387 (fundiu com `cnae-complexidade-abertura.md`, 17/07)

> Esta seção veio de uma nota separada (`cnae-complexidade-abertura.md`) fundida aqui em 27/08 a pedido do Pedro — os 92 acima são o recorte "liso + serviço puro" do universo abaixo. Cobertura: **387 CNAEs** (footprint completo da Contabilizei, comércio+indústria+serviço), não só os 641 de serviço do IBGE.

Responde a pergunta original do Pedro (17/07): *"quais CNAEs de fato são simples e quais dependem de mais atenção até de atendimento humano?"* — o eixo é **ortogonal ao fiscal** (Anexo/Fator R): um CNAE pode ser Anexo III barato **e** precisar de vistoria.

### Veredito (387)
| balde | nº | % | o que é | roteamento de produto |
|---|---|---|---|---|
| 🟢 **liso** | 170 | 44% | baixo risco A (CGSIM) **e** sem conselho/setorial | abertura 100% automatizável (happy path MVP) |
| 🟡 **verificar-licenciamento** | 120 | 31% | fora do baixo-risco-A, sem conselho | precisa licença municipal — médio (provisório) OU alto (vistoria); nível é **municipal/BH** |
| 🔴 **tato-registro** | 97 | 25% | exige conselho de classe **ou** órgão setorial | quase sempre humano/RT → Mauro ou waitlist |

> Dos 170 liso, **103 eram serviço puro** na conta original de 17/07 — reduzido pra **92** depois do cruzamento fonte-primária de 27/08 (ver seção acima). Os outros 67 do 170 são comércio/indústria liso (Anexo I/II), fora do "MVP só serviço".

### Os 3 eixos (regra determinística, re-executável)
`veredito = tato-registro` se tem conselho/setorial · senão `verificar-licenciamento` se fora do baixo-risco-A · senão `liso`. Prioridade: **registro > licenciamento > liso**. Direção segura do erro travada: **falso-liso é o pecado** (cobra antes de barrar), **falso-tato é conservador** → só marca `liso` quem está na lista oficial; ausência nunca vira "presumido liso".

- **Eixo A — risco** (CGSIM Res 51/2019, Anexo I): 212/387 na lista de baixo risco A · 175 fora. "Fora da lista" ≠ alto risco — é médio **ou** alto, e o alto é definido por cada município.
- **Eixo B — profissão regulamentada** (conselho + RT): conjunto fechado de conselhos → classes CNAE. Ver versão fonte-primária mais recente em [[profissoes-regulamentadas-conselhos]] (27/08).
- **Eixo C — registro setorial** (órgão, sem conselho): CADASTUR, Polícia Federal, MEC/Conselho de Educação, Bacen/CVM/SUSEP, ANATEL, ANTT, IBAMA. **Este é o eixo que faltava na pesquisa do 5º dado** — foi cruzado em 27/08 e tirou 4 códigos dos 92 (ver acima). Prova de que os eixos são independentes: advogado e agência de viagem são baixo-risco no eixo A mas tato no B/C.

### tato-registro (97) por órgão
| nº | órgão | confiança |
|---|---|---|
| 44 | Conselhos de saúde (CRM/CRO/COREN/CRN/CRP/CREFITO/CRF) | alta |
| 15 | CORE (representação comercial, Lei 4.886/65) | média-alta |
| 9 | MEC/Conselho de Educação (ensino regular 851-854) | alta |
| 8 | CREA/CAU (engenharia/arquitetura) | alta |
| 6 | Bacen/CVM/SUSEP (financeiro/seguros) | alta |
| 3+3+3 | CRECI (corretor imóveis) · OAB/INPI · CADASTUR · Polícia Federal | alta |
| 1+1+1 | CRF · CRMV · CREF | alta/média |

### verificar-licenciamento (120) — perfil por divisão
Puxado por: divisão 33 reparação de máquinas (25, tende médio) · 47 comércio varejo (14) · 43 obras/instalações (12, tende alto) · 77 aluguel (9, médio) · 96 serviços pessoais (9, misto) · 55/56 alojamento/comida (7, alto — Vigilância). Divisões pesadas (obra, comida, alojamento) puxam alto; reparação/aluguel puxam médio. Split exato médio×alto = municipal, **deferido** (REDESIM-MG bloqueado por período eleitoral em 17/07; decreto de risco de BH é a próxima fonte).

### Caveats originais (17/07, ainda válidos)
1. Baixo-risco-A tem entradas condicionais no Anexo I (ex: "desde que artesanal / área < X") — não parseadas, impacto baixo pro nosso recorte de serviço puro.
2. Conselho→CNAE é construção nossa, sem tabela oficial única — mesma ressalva que [[profissoes-regulamentadas-conselhos]] já carrega.
3. Correções já aplicadas na revisão original: +CORE nos 461x (era falso-liso) · −CRF em cosméticos 4772-5 (era falso-tato) · 6911-7/03 = INPI, não OAB.

### Arquivos de dados (mantidos, não fundidos)
- `cnae-complexidade-abertura.json` / `.csv` — os 387 completos com risco_cgsim, orgaos_conselho/setorial, veredito, motivos, confiança.
- `cgsim-res51-baixo-risco.pdf` — fonte primária do eixo A (mesmo PDF usado na pesquisa de 27/08).

## Links
- [[cnae-matriz-governo]] · [[lc123-art18-anexos-taxativo]] · [[profissoes-regulamentadas-conselhos]] · [[mei-risco-e-simplificacao-abertura]] · [[cnae-atendidos-hub]] · [[contabilizei-cnae-completo-relatorio]] · [[fila-validacao-humana]]
