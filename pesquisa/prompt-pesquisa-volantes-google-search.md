---
tipo: operacao
status: vivo
data: 2026-08-26
assunto: prompt-pesquisa-volantes
tags: [pesquisa, personas, prompt-gemini]
---

# 🔎 Prompt de pesquisa (Google Search / Gemini) — enriquecer as 18 volantes com dado real

> Rodar fora desta sessão (Gemini com Google Search ativo), colar o resultado de volta aqui. Mesmo padrão já usado pra pesquisa de mercado grande no vault (`legalize-pesquisa-grande-via-gemini`).

## Prompt (copiar tudo abaixo)

```
Preciso de uma pesquisa de mercado sobre 18 perfis profissionais brasileiros, todos
microempreendedores/autônomos de serviço (nunca comércio/varejo), foco na região Sudeste do
Brasil (BH/MG se houver dado regional, senão nacional). Use busca real, cite fonte quando
possível (Sebrae, IBGE, pesquisas setoriais, matérias, fóruns/grupos públicos), e marque
claramente quando for estimativa/inferência sem fonte direta.

Para CADA um dos 18 perfis abaixo, preciso dos seguintes dados, em tabela:

1. Idade média/predominante de quem exerce essa atividade como autônomo/pequeno negócio no Brasil
2. Gênero predominante (se houver viés real documentado, não achismo)
3. Faixa de renda/faturamento típica desse perfil como autônomo
4. Rede social ou canal de comunicação mais usado por esse público (Instagram, WhatsApp, TikTok, Google, indicação pessoal, etc.)
5. Como esse público costuma buscar/contratar serviço de contabilidade (se há dado disso) ou formalização de CNPJ
6. Principais reclamações/objeções reais documentadas sobre contabilidade, impostos ou burocracia
   pra esse público específico (buscar em fóruns, grupos de Facebook/WhatsApp públicos, Reclame Aqui,
   matérias sobre o setor)
7. Vocabulário/gírias/expressões típicas da profissão (termos que usariam entre si, não termos técnicos formais)
8. Ambiente de trabalho físico típico (pra referência de composição de imagem/vídeo)

Os 18 perfis (código CNAE brasileiro entre parênteses, pra você confirmar que é o mesmo perfil):

GRUPO A — serviço intelectual/criativo:
1. Desenvolvedor(a) freelancer recém-saído de CLT, primeiro contrato PJ (6201-5/01, 6202-3/00, 6204-0/00)
2. Consultor(a) sênior de gestão empresarial migrando de contador (7020-4/00)
3. Designer freelancer, web design ou design de produto (6201-5/02, 7410-2/03)
4. Fotógrafo(a)/filmmaker de eventos (casamento, festa, formatura) (7420-0/04)
5. Tradutor(a)/intérprete freelancer (7490-1/01)
6. Dublador(a)/locutor(a) freelancer (5912-0/01)
7. Professor(a) de idiomas 100% online (8593-7/00)

GRUPO B — serviço estético/manual em crescimento:
8. Cabeleireira/manicure com salão próprio (9602-5/01)
9. Esteticista com estúdio próprio (9602-5/02)
10. Personal trainer autônomo (9313-1/00)
11. Produtor(a) de eventos/feiras/festas (8230-0/01)
12. Professor(a) de dança com estúdio próprio (8592-9/01)

GRUPO C — ofício tradicional, baixa familiaridade digital:
13. Professor(a) particular autônomo(a), aposentado(a) ou 50+ (aulas particulares diversas)
14. Mecânico(a) de oficina de bairro (4520-0/01)
15. Técnico(a) de conserto de eletrônicos/celular (9521-5/00)

GRUPO D — MEI permanente, ticket baixo, ponto de rua/bairro:
16. Chaveiro(a) (9529-1/02)
17. Sapateiro(a)/reparo de calçados e bolsas (9529-1/01)
18. Teleatendente/atendimento remoto freelancer (8220-2/00)

Formato de saída: uma tabela por perfil (ou uma tabela grande com os 18 perfis nas linhas e os 8
critérios nas colunas, o que for mais prático), sempre indicando a fonte ou "estimativa sem fonte
direta" quando não achar dado real. Não invente número — se não achar dado específico pra um
critério, diga que não achou, não force um valor.
```

## O que fazer com o resultado

Cola o resultado de volta nesta conversa (ou substitui este arquivo/anexa como nova seção) — a partir daí eu cruzo com o que já documentamos em cada volante (gatilho, mensagem-âncora, CNAE) e decidimos juntos quais das 18 merecem virar tão completas quanto as dorsais (banco de calibragem, mapeamento de pilar, reação a crítica, voz própria, referência visual) e quais seguem só como delta enxuto.

## Links
- [[metodologia-personas]]
