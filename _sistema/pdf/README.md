---
tipo: ferramenta
status: vivo
data: 2026-08-13
tags: [sistema, pdf, identidade-visual]
---

# 🖨️ Pipeline nota → PDF de marca

Transforma qualquer nota `.md` do vault num PDF A4 com a **identidade visual da Legalizai**: tipo Sora, paleta de `app/src/app/globals.css`, cards com raio 16px, bolinhas de confiança 🟢🟡🔴 viram elemento de design.

Nasceu no 33º flow (13/08) gerando o PDF de [[2026-08-12-estrategia-mkt-para-validacao]]. Antes disso o HTML de cada PDF vivia só na pasta temporária da sessão e sumia depois, que é exatamente como o PDF do 31º flow quebrou.

## Os 3 passos (nenhum é opcional)

```bash
# 1. nota -> HTML de impressão
python _sistema/pdf/gerar-html.py \
  pesquisa/2026-08-12-estrategia-mkt-para-validacao.md \
  _sistema/pdf/.build/estrategia-validacao.html

# 2. HTML -> PDF (roda de dentro de app/, é lá que o playwright mora)
cd app && node ../_sistema/pdf/gerar-pdf.mjs \
  ../_sistema/pdf/.build/estrategia-validacao.html \
  ../pesquisa/2026-08-12-estrategia-mkt-para-validacao.pdf && cd ..

# 3. VALIDAR (o passo que o 32º flow não tinha)
python _sistema/pdf/validar-pdf.py \
  pesquisa/2026-08-12-estrategia-mkt-para-validacao.pdf \
  --min-paginas 10 --esperar "Pergunta de validação" --png 1,7,29
```

## ⚠️ A armadilha que motivou isto

`chrome --headless --print-to-pdf` **retorna sucesso e grava um PDF mesmo quando o HTML de entrada não existe**: ele imprime a própria tela de erro do navegador ("Não foi possível acessar seu arquivo · ERR_FILE_NOT_FOUND") em 1 página de ~24KB. O exit code não prova nada.

Duas defesas foram embutidas:
- `gerar-pdf.mjs` usa Playwright e **checa a existência da fonte antes**, morrendo com código ≠ 0 se faltar.
- `validar-pdf.py` confere contagem de páginas, texto extraível página a página e presença de marcas de tela de erro. Renderiza PNGs com `--png` pra conferência visual.

Segundo detalhe do mesmo dia: com o Chrome do Pedro já aberto, `--headless` sem `--user-data-dir` próprio nem sobe. O Playwright não tem esse problema (usa perfil próprio).

## O que o gerador faz com o markdown

| Elemento na nota | Vira no PDF |
|---|---|
| `## N. Título` | bloco novo, sempre em página nova, com número em coral |
| `> **❓ Pergunta de validação**` | caixa coral de fechamento do bloco |
| `> ⚠️ ...` | caixa de ressalva (barra amarela; o emoji sai, a barra já diz isso) |
| outros `>` | caixa de destaque com barra escura |
| 🟢 🟡 🔴 | bolinha de confiança (verde/âmbar/vermelho da paleta) |
| ✅ ❌ | marcador circular da paleta, não emoji do sistema |
| 🅰️ 🅱️ 🅲 | badge coral A/B/C |
| tabela com cabeçalho vazio | ficha chave-valor (a 1ª coluna vira rótulo) |
| tabela de 5+ colunas | corpo menor pra caber sem espremer |
| `[[link]]` do Obsidian | referência discreta (PDF não navega) |

Título de capa, subtítulo, data e destinatário são flags (`--titulo`, `--subtitulo`, `--data`, `--para`, `--papel`, `--eyebrow`). Os subtítulos de bloco do sumário são curadoria manual, guardados por nome de arquivo dentro do script.

## Dependências

- Python: `markdown`, `pypdf`, `pymupdf` (só pro `--png`)
- Node: `playwright` (já instalado em `app/node_modules`)
- Fontes: `fonts/*.woff2` (Sora, versionadas aqui) são embutidas em base64 no HTML. **Nada depende de rede na hora do print.**

`.build/` é descartável: o que importa versionar é a nota, o PDF e estes scripts.

Ver também: [[decisoes-marca]] · `marca/identidade-visual/design-system.html` · [[legalize-pdf-chrome-headless-armadilha]]
