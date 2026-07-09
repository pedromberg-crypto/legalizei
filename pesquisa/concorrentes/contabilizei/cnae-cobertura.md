---
tipo: artefato
data: 2026-07-09
concorrente: Contabilizei
fonte: site
gatilho: cnae
tags: [concorrente, insight]
---

# 🗂️ Cobertura de CNAE da Contabilizei — SEO × filtro real (cruzamento)

> Dois dados cruzados: (1) a **tabela pública "Lista de CNAE completa"** (imagem que o Pedro salvou 23/06 + página ao vivo) = camada de **SEO/aquisição**; (2) o **filtro real** das páginas de suporte = quem eles de fato atendem/recusam. Aprofunda [[PESQUISA-MERCADO]] §J.

## 1. A tabela SEO (aquisição) — "marca quase tudo Atende"
- **Fonte:** `contabilizei.com.br/contabilidade-online/cnae/` (autor Charles Gularte, CRC). Imagem capturada 23/06/2026 (Downloads) + página ao vivo.
- **Largura:** grid com **~369 CNAEs** (OCR da imagem — códigos degradados, contagem aproximada) / a página ao vivo diz "centenas de CNAEs". Cobre comércio + serviços amplos.
- ⚠️ Códigos individuais NÃO extraíveis com precisão (imagem = OCR degradado; página ao vivo = JS-travada). Raw do OCR: `cnae-tabela-seo-ocr-raw.txt`. **Isso não é filtro de elegibilidade — é SEO** (marca quase tudo "Atende" pra ranquear no Google).

### Alíquotas por anexo (limpo, da página ao vivo)
| Anexo | Tipo | Alíquota |
|---|---|---|
| I | Comércio | 4% – 19% |
| II | Indústria | 4,5% – 30% |
| III | Serviços gerais | 6% – 33% |
| IV | Serviços específicos | 4,5% – 33% |
| V | Serviços profissionais | 15,5% – 30,5% |

## 2. O filtro REAL (suporte) — quem eles de fato NÃO atendem
> `suporte.contabilizei.com.br/.../204678699-Atividades-não-atendidas`. **17 categorias recusadas:**

1. Administração condominial (administradora de condomínios)
2. Agricultura
3. Cartórios
4. Cooperativas
5. **Construção e reformas** (obras, instalações, pintura, marcenaria, elétrica, pavimentação)
6. **Manufatura / fábricas e indústrias** em geral
7. Farmácias
8. **Gráficas** (impressão de material)
9. **Instituições financeiras** (factoring, consignado, fundos, holdings financeiras, recuperadora de crédito)
10. **ONGs / sem fins lucrativos** (igrejas, caridade, associações, centros de pesquisa)
11. Locação de meios de transporte (automóveis, embarcações, aeronaves)
12. Lojas de material de construção
13. Montagem de móveis
14. **Terceirização de mão de obra** (seleção, agenciamento)
15. **Hospedagem** (hotéis, pousadas, hostel)
16. Segurança (transporte de valores, monitoramento)
17. **Transportes** (motoboy, táxi, cargas e pessoas em geral)

## 3. Atendem COM condição (regulamentadas)
> `.../360000231650-Atividades-Regulamentadas`. **7 grupos, todos exigem responsável técnico (RT) + conselho:**

| Grupo | Condição / conselho |
|---|---|
| Saúde (médico, vet, lab, fisio, fono) | RT pessoa física + CRM/CRMV/CREFITO/CREFON + endereço comercial |
| Odontologia | RT obrigatório + CRO/CFO + endereço comercial |
| Administração/consultoria | RT recomendado (CRA); pode ser autuada pela inclusão do CNAE |
| Representação comercial | registro no CORE (sem RT) |
| Corretagem (imóveis/seguros) | RT + CRECI/SUSEP (às vezes RT precisa ser sócio) |
| Engenharia/arquitetura/civil | RT + CREA/CAU (às vezes sócio) |
| Advocacia | OAB; restrição a incluir outras atividades |

## 🔑 O cruzamento (o insight que importa)
- **SEO diz "sim" pra quase tudo; a operação diz "não" pra 17 blocos inteiros.** A diferença = a §J provada com dado: o recorte de CNAE deles é a **fronteira da automação + proteção de margem**.
- **O que eles cortam tem um padrão claro:** o que quebra a automação ou some com a margem — mercadoria pesada/ICMS-ST (material de construção, farmácia, indústria), folha/risco trabalhista (terceirização, Anexo IV), ICMS de transporte, e complexidade regulatória sem escala (cartório, cooperativa, ONG, financeira).
- **O sweet spot deles (= nosso nicho):** serviço + comércio leve no Simples, Anexos I/III/V, apuração quase determinística, folha mínima. Profissional liberal (médico/advogado) = alto LTV, mas exige RT/conselho (fase posterior pra nós).
- **Oportunidade Legalizei:** (a) espelhar o recorte deles no MVP (não reinventar o filtro — 13 anos validaram); (b) a lista de 17 recusadas é o **mapa do que NÃO construir no V1** (economiza esforço); (c) transparência: mostrar upfront "atendemos X, não atendemos Y" (eles escondem no suporte) = confiança + qualificação de lead.

## 📌 Distinção de fontes (de onde veio cada dado)
Todos os dados desta nota são da **própria Contabilizei**, em 2 superfícies diferentes:
- **Site de marketing** (`www.contabilizei.com.br`) — camada SEO/aquisição: tabela CNAE (`/contabilidade-online/cnae/`, = a imagem salva pelo Pedro em 23/06) + tabela Simples completa (`/contabilidade-online/tabela-simples-nacional-completa/`). Marca quase tudo "Atende".
- **Subdomínio de suporte** (`suporte.contabilizei.com.br`) — camada operacional real: não-atendidas (art. 204678699) + regulamentadas (art. 360000231650). Filtro restrito.
- **Não usados:** a busca também trouxe tabelas de TERCEIROS (contabilidade.com, buscaempresa.net, razonet, contabilivre) — NENHUM entrou aqui; só fontes Contabilizei + a imagem do Pedro.
- **Fonte-verdade da lista CNAE em si** (não "o que a Contabilizei atende", mas o universo CNAE) = governo → ver [[cnae-matriz-governo]].

## Links
- [[cnae-matriz-governo]] · [[PESQUISA-MERCADO]] · [[contabilizei]] · [[_relatorio-auditoria]] · [[HOME]]
