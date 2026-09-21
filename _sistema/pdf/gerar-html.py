# -*- coding: utf-8 -*-
"""
Nota do vault (.md) -> HTML de impressao A4 com a identidade visual da marca.

Tokens espelhados de app/src/app/globals.css (fonte canonica), tipo Sora
embutido em base64 (nada depende de rede na hora do print).

Uso:
    python _sistema/pdf/gerar-html.py <entrada.md> <saida.html> [--titulo "..."]
        [--subtitulo "..."] [--data "12 de agosto de 2026"] [--para "Fulano"]

Depois:  node _sistema/pdf/gerar-pdf.mjs <saida.html> <saida.pdf>
Leia o README desta pasta: o print SEMPRE precisa ser validado depois.
"""
import argparse
import base64
import pathlib
import re
import sys

import markdown

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
LOGO = RAIZ / "marca" / "identidade-visual" / "legalizai-logo-horizontal.svg"

ap = argparse.ArgumentParser()
ap.add_argument("entrada")
ap.add_argument("saida")
ap.add_argument("--titulo", default="Estratégia de <em>marketing</em>, ponto a ponto.")
ap.add_argument(
    "--subtitulo",
    default=(
        "A leitura completa do que já está travado no vault, reordenada em linha "
        "lógica pra debater e validar: mercado, concorrência, posicionamento, tom "
        "de voz, personas, mensagem, conteúdo, economia, funil, canais, métricas "
        "e riscos."
    ),
)
ap.add_argument("--eyebrow", default="Documento de validação · uso interno")
ap.add_argument("--data", default="12 de agosto de 2026")
ap.add_argument("--para", default="Pedro Puntel")
ap.add_argument("--papel", default="par de validação")
# Doc de apresentacao nao fecha em pergunta nem carrega o semaforo do vault:
# os dois viraram flag em 21/09 pra nao carimbar promessa que o texto nao cumpre.
ap.add_argument("--fecho", default=None, help='o que fecha cada bloco na capa (ex: "tabela")')
ap.add_argument("--sem-legenda", action="store_true", help="esconde a legenda 🟢🟡🔴 da capa")
args = ap.parse_args()

MD = pathlib.Path(args.entrada).resolve()
SAIDA = pathlib.Path(args.saida).resolve()
if not MD.exists():
    sys.exit(f"ERRO: fonte nao existe -> {MD}")

# ── fontes embutidas (Sora = tipo unico do sistema, travado 12/07) ───────────
b64_latin = base64.b64encode((AQUI / "fonts" / "sora-latin.woff2").read_bytes()).decode()
b64_ext = base64.b64encode((AQUI / "fonts" / "sora-latin-ext.woff2").read_bytes()).decode()

# ── logo (SVG inline, paths oficiais) ────────────────────────────────────────
logo_svg = LOGO.read_text(encoding="utf-8")
logo_svg = re.sub(r"<\?xml[^>]*\?>", "", logo_svg).strip()
# escopo das classes do SVG pra nao vazar pro resto do documento
logo_svg = logo_svg.replace('id="Camada_1"', 'id="Camada_1" class="logo-svg"')
logo_svg = re.sub(r"\.cls-(\d)", r".logo-svg .cls-\1", logo_svg)

# ── leitura do markdown ──────────────────────────────────────────────────────
bruto = MD.read_text(encoding="utf-8")
corpo = re.sub(r"^---\n.*?\n---\n", "", bruto, flags=re.S)  # tira frontmatter

partes = [p.strip() for p in re.split(r"\n---\n", corpo) if p.strip()]

# sem `sane_lists`: no doc as listas colam direto no paragrafo anterior
# ("**NÃO é:**" + bullets), e sane_lists exigiria linha em branco pra
# reconhece-las, achatando tudo numa linha corrida com hifens.
MDX = ["tables", "fenced_code", "attr_list"]


def dots(html: str) -> str:
    """Bolinhas de confianca viram elemento de design, nao emoji do SO."""
    mapa = {
        "🟢": ("g", "travado"),
        "🟡": ("y", "estimativa"),
        "🔴": ("r", "pendente"),
    }
    for emoji, (cls, titulo) in mapa.items():
        html = html.replace(
            emoji, f'<span class="dot dot-{cls}" title="{titulo}"></span>'
        )
    return html


def limpa_links_wiki(html: str) -> str:
    """[[nota]] do Obsidian nao e clicavel em PDF: vira referencia discreta."""
    return re.sub(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]", r'<span class="ref">\1</span>', html)


# Caixas coral de fechamento de bloco. A chave e' o texto em negrito na 1a
# linha do blockquote; o rotulo e' o que aparece impresso na tampa da caixa.
# "Pergunta de validação" serve doc que vai pra terceiro validar; "Decisão a
# tomar" serve doc de decisao interna, onde o bloco fecha numa escolha.
FECHOS = {
    "Pergunta de validação": "Pergunta de validação",
    "Decisão a tomar": "Decisão a tomar",
}


def realca(html: str) -> str:
    """Classifica blockquotes e paragrafos de ressalva."""
    def _bq(m):
        interno = m.group(1)
        for chave, rotulo in FECHOS.items():
            if chave in interno:
                corpo_ = re.sub(
                    rf"<strong>[❓🎯]?\s*{re.escape(chave)}</strong>\s*(<br\s*/?>)?",
                    "",
                    interno,
                )
                return (
                    '<div class="pergunta">'
                    f'<div class="pergunta-tag">{rotulo}</div>'
                    f'<div class="pergunta-corpo">{corpo_}</div></div>'
                )
        if "⚠️" in interno:
            # o emoji sai AQUI: se sobrasse, a regra de paragrafo abaixo o
            # pegaria de novo e desenharia uma caixa amarela dentro da outra
            return f'<div class="ressalva">{tira_alerta(interno)}</div>'
        return f'<div class="destaque">{interno}</div>'

    html = re.sub(r"<blockquote>\s*(.*?)\s*</blockquote>", _bq, html, flags=re.S)
    # paragrafo solto comecando com ⚠️
    html = re.sub(
        r"<p>⚠️\s*(.*?)</p>",
        lambda m: '<div class="ressalva"><p>%s</p></div>' % tira_alerta(m.group(1)),
        html,
        flags=re.S,
    )
    return html


def tira_alerta(trecho: str) -> str:
    """A barra amarela da caixa ja comunica 'atencao': o ⚠️ dentro dela sobra."""
    return re.sub(r"⚠️\s*", "", trecho)


def simbolos(html: str) -> str:
    """Emoji do SO fora da paleta vira elemento tipografico da marca.

    A barra amarela do box .ressalva ja diz 'atencao': o ⚠️ dentro dele
    seria redundante, entao sai depois da classificacao.
    """
    # ⚠️ que sobrou (fora de caixa de ressalva) vira marcador da paleta
    html = re.sub(r"⚠️\s*", '<span class="alerta">!</span> ', html)
    html = html.replace("✅", '<span class="sim">✓</span>')
    html = html.replace("❌", '<span class="nao">✕</span>')
    html = html.replace("📌 ", "").replace("📌", "")
    for emoji, letra in (("🅰️", "A"), ("🅱️", "B"), ("🅲", "C")):
        html = html.replace(emoji + " ", f'<span class="badge-persona">{letra}</span>')
        html = html.replace(emoji, f'<span class="badge-persona">{letra}</span>')
    return html


def tabelas(html: str) -> str:
    """Ajustes estruturais de tabela.

    1. Tabela chave-valor (as fichas de persona) vem do markdown com um
       cabecalho VAZIO `| |  |`: sem isto, o PDF ganha uma faixa preta oca.
    2. Tabela de 5+ colunas aperta: recebe classe pra respirar em corpo menor.
    """
    def _fix(m):
        tbl = m.group(0)
        thead = re.search(r"<thead>.*?</thead>", tbl, flags=re.S)
        classes = []
        if thead and not re.sub(r"<[^>]+>|\s|&nbsp;", "", thead.group(0)):
            tbl = tbl.replace(thead.group(0), "")
            classes.append("kv")
        primeira = re.search(r"<tr>.*?</tr>", tbl, flags=re.S)
        if primeira and len(re.findall(r"<t[hd]", primeira.group(0))) >= 5:
            classes.append("larga")
        if classes:
            tbl = tbl.replace("<table>", '<table class="%s">' % " ".join(classes), 1)
        return tbl

    return re.sub(r"<table>.*?</table>", _fix, html, flags=re.S)


def solta_listas(md_txt: str) -> str:
    """Lista colada no paragrafo ('**NÃO é:**' + bullets) precisa de linha em
    branco antes, senao o Markdown a absorve como continuacao do paragrafo e
    ela sai como linha corrida cheia de hifens."""
    return re.sub(
        r"(?m)^(?![-*+] |\d+\.\s|\||>|#)(\S.*)\n(?=[-*+] )", r"\1\n\n", md_txt
    )


def nao_quebra(h: str) -> str:
    """Impede que codigo com hifen parta de linha numa coluna estreita.

    Pega CNAE (`5912-0/99`), CNPJ e CPF. Nao toca em data nem em numero de
    lei, que quebram sem prejuizo de leitura.
    """
    padroes = (
        r"\b\d{4}-\d/\d{2}\b",                          # CNAE 5912-0/99
        r"\b\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}\b",           # CNPJ
        r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b",                 # CPF
    )
    for pad in padroes:
        h = re.sub(pad, lambda m: f'<span class="nb">{m.group(0)}</span>', h)
    return h


def bloco_html(md_txt: str) -> str:
    h = markdown.markdown(solta_listas(md_txt), extensions=MDX)
    return nao_quebra(simbolos(dots(tabelas(limpa_links_wiki(realca(h))))))


# ── parte 0: cabecalho do doc (titulo + intro + ordem dos blocos) ────────────
cabeca = partes[0]
intro_md = re.sub(r"^#\s+.*\n", "", cabeca).strip()

# ── secoes numeradas 1..12 + fechamento ──────────────────────────────────────
secoes = []
extras = []
for p in partes[1:]:
    m = re.match(r"##\s+(\d+)\.\s+(.+)", p)
    if m:
        num, titulo = m.group(1), m.group(2).strip()
        conteudo = p.split("\n", 1)[1] if "\n" in p else ""
        secoes.append((num, titulo, conteudo))
    else:
        extras.append(p)

# Subtitulo de bloco e' curadoria manual por documento: so entra se o arquivo
# for o dono da chave, pra nao carimbar texto errado numa nota diferente.
SUBTITULOS_POR_DOC = {
    "2026-08-12-estrategia-mkt-para-validacao": {
    "1": "tamanho, recorte de BH e o que a penetração do líder diz",
    "2": "quem está no jogo e os 5 erros estruturais do setor",
    "3": "statement, categoria mental e os 5 diferenciais",
    "4": "arquétipo Aliado, traços e as regras duras de copy",
    "5": "as 3 dorsais, a matriz mestre e quem não é público",
    "6": "JTBD, promessa central e o que a marca se recusa a prometer",
    "7": "canal primário, os 9 pilares e a cadência honesta",
    "8": "preço travado, a correção do CAC e a pendência crítica",
    "9": "a jornada e o achado do momento decisivo",
    "10": "o mapa de canais e o porquê de cada corte",
    "11": "os 2 gates, o placar honesto e o que falta travar",
    "12": "os 8 riscos e a defesa atual de cada um",
    },
    "2026-09-21-apresentacao-trafego-organico": {
    "1": "um mês de veiculação em número fechado",
    "2": "a régua do nicho contábil e onde ficamos",
    "3": "o que mudou entre a 02 e a 04, e os dois testes",
    "4": "as seis campanhas, gasto a gasto",
    "5": "Lead Form nativo e LP própria, lado a lado",
    "6": "canal, verba, geo, oferta e régua de escala",
    "7": "canal, pilares, cadência e distribuição da pauta",
    "8": "do perfil criado ao fechamento do ciclo",
    "9": "o que já está no ar",
    },
    "2026-08-18-custos-margem-decisao": {
    "1": "onde cada player está e por que o preço anunciado não é a conta",
    "2": "as duas contas do vault somadas pela primeira vez",
    "3": "a régua travada: R$30–100, custo único, contra 12 meses",
    "4": "o CPC do Puntel virando CPL na nossa régua",
    "5": "o que fecha, o que não fecha e onde está o gargalo real",
    "6": "o cenário de lançamento a R$99 e o que ele custa",
    "7": "o que R$3.500/mês entrega de verdade contra a meta",
    "8": "as 5 escolhas que a aritmética já autoriza",
    "9": "os 3 números que ainda seguram tudo",
    },
}
SUBTITULOS = SUBTITULOS_POR_DOC.get(MD.stem, {})

# A capa anuncia como cada bloco fecha. Sai do proprio texto pra nao precisar
# de flag: doc de decisao fecha em decisao, doc de validacao fecha em pergunta.
fecho_capa = args.fecho or ("decisão" if "Decisão a tomar" in bruto else "pergunta")

sumario_itens = "\n".join(
    f'<li><span class="sum-num">{n}</span>'
    f'<span class="sum-txt"><b>{t}</b>'
    f'<span class="sum-sub">{SUBTITULOS.get(n, "")}</span></span></li>'
    for n, t, _ in secoes
)

secoes_html = []
for num, titulo, conteudo in secoes:
    secoes_html.append(
        f"""
<section class="bloco">
  <header class="bloco-cabeca">
    <div class="bloco-num">{num}</div>
    <div>
      <div class="bloco-kicker">Bloco {num} de {len(secoes)}</div>
      <h2>{titulo}</h2>
      <p class="bloco-sub">{SUBTITULOS.get(num, "")}</p>
    </div>
  </header>
  {bloco_html(conteudo)}
</section>"""
    )

extras_html = ""
if extras:
    extras_html = '<section class="bloco fechamento">' + "".join(
        bloco_html(e) for e in extras
    ) + "</section>"

intro_render = bloco_html(intro_md)

legenda_capa = "" if args.sem_legenda else """<div class="legenda">
      <span><span class="dot dot-g"></span> travado</span>
      <span><span class="dot dot-y"></span> estimativa / placeholder</span>
      <span><span class="dot dot-r"></span> pendente ou frágil</span>
    </div>"""

HTML = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Estratégia de marketing · leitura completa pra validação</title>
<style>
@font-face {{
  font-family: 'Sora';
  font-style: normal;
  font-weight: 100 800;
  font-display: block;
  src: url(data:font/woff2;base64,{b64_ext}) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF,
    U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
    U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}}
@font-face {{
  font-family: 'Sora';
  font-style: normal;
  font-weight: 100 800;
  font-display: block;
  src: url(data:font/woff2;base64,{b64_latin}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}}

/* ── PRIMITIVOS — espelho de app/src/app/globals.css ── */
:root {{
  --coral-50:#FEF3EE; --coral-100:#FBDDD1; --coral-200:#F8C3B0;
  --coral-400:#F47F58; --coral-500:#F2643C; --coral-600:#DD4E27; --coral-700:#B83D1C;
  --ink-50:#FAF8F5; --ink-100:#F1EEE9; --ink-200:#E3DED7; --ink-300:#CBC5BC;
  --ink-400:#A19B92; --ink-500:#736E67; --ink-600:#524E48; --ink-800:#24262C;
  --ink-900:#1B1E24; --white:#FFFFFF;
  --success-50:#E7F6EF; --success-500:#17A06A; --success-700:#0B5E40;
  --warning-50:#FDF3E1; --warning-500:#F5A524; --warning-700:#98600A;
  --danger-50:#FCEBEB;  --danger-500:#E03E43;  --danger-700:#971F25;
  --info-50:#EBF2FC;    --info-500:#3B82E0;    --info-700:#2360B8;
  --r-md:12px; --r-lg:16px; --r-xl:24px;
}}

@page {{ size: A4; margin: 14mm 13mm 16mm 13mm; }}
@page :first {{ margin: 0; }}

* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{
  margin:0; font-family:'Sora', system-ui, sans-serif;
  color:var(--ink-900); background:var(--ink-50);
  font-size:9.6pt; line-height:1.55; font-weight:400;
}}

/* O creme das paginas de conteudo NAO sai daqui: o Chrome nunca pinta
   dentro da margem de impressao (14/13/16/13mm), nem com position:fixed
   nem via header/footer template — testados os dois, ambos clipam.
   Quem pinta o papel inteiro e' `pintar-fundo.py`, depois do print. */

/* ── CAPA ── */
.capa {{
  height:297mm; padding:22mm 20mm 18mm; display:flex; flex-direction:column;
  background:var(--ink-50); position:relative; break-after:page;
}}
.capa::before {{
  content:''; position:absolute; top:0; left:0; right:0; height:6mm;
  background:linear-gradient(90deg,var(--coral-500) 0%,var(--coral-600) 55%,var(--ink-900) 100%);
}}
.logo-svg {{ width:54mm; height:auto; display:block; }}
.capa-meio {{ margin-top:auto; margin-bottom:16mm; }}
.eyebrow {{
  display:inline-block; font-size:8.2pt; font-weight:700; letter-spacing:.12em;
  text-transform:uppercase; color:var(--coral-700); background:var(--coral-50);
  border:1px solid var(--coral-200); border-radius:999px; padding:4px 12px;
}}
.capa h1 {{
  font-size:34pt; line-height:1.08; font-weight:800; letter-spacing:-.02em;
  margin:14mm 0 0; max-width:150mm;
}}
.capa h1 em {{ font-style:normal; color:var(--coral-600); }}
.capa-lead {{
  font-size:12pt; line-height:1.5; color:var(--ink-600); font-weight:400;
  margin:7mm 0 0; max-width:135mm;
}}
.capa-regra {{ height:2px; width:38mm; background:var(--ink-900); margin:10mm 0; }}
.capa-meta {{ display:grid; grid-template-columns:1.2fr 1.1fr 1fr 1fr; gap:7mm; margin:0; }}
.capa-meta dt {{
  font-size:7.6pt; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
  color:var(--ink-400); margin-bottom:3px;
}}
.capa-meta dd {{ margin:0; font-size:10pt; font-weight:600; }}
.capa-rodape {{
  border-top:1px solid var(--ink-200); padding-top:5mm; display:flex;
  justify-content:space-between; align-items:flex-end; gap:8mm;
  font-size:8pt; color:var(--ink-500);
}}
.legenda {{ display:flex; gap:7mm; flex-wrap:wrap; }}
.legenda span {{ display:inline-flex; align-items:center; gap:5px; }}

/* bolinhas de confianca */
.dot {{
  display:inline-block; width:8px; height:8px; border-radius:50%;
  vertical-align:baseline; position:relative; top:0px;
}}
.dot-g {{ background:var(--success-500); }}
.dot-y {{ background:var(--warning-500); }}
.dot-r {{ background:var(--danger-500); }}
td .dot, th .dot {{ top:1px; }}

/* ── SUMARIO ── */
.sumario {{ break-after:page; padding-top:4mm; }}
.sumario h2, .bloco-cabeca h2 {{ margin:0; }}
.sumario > h2 {{ font-size:20pt; font-weight:800; letter-spacing:-.01em; }}
.sumario-intro {{ color:var(--ink-600); margin:3mm 0 8mm; max-width:150mm; }}
.sumario ol {{ list-style:none; margin:0; padding:0; column-count:2; column-gap:10mm; }}
.sumario li {{
  break-inside:avoid; display:flex; gap:4mm; align-items:baseline;
  padding:3.2mm 0; border-bottom:1px solid var(--ink-200);
}}
.sum-num {{
  font-size:12pt; font-weight:800; color:var(--coral-500);
  min-width:8mm; font-variant-numeric:tabular-nums;
}}
.sum-txt {{ display:flex; flex-direction:column; }}
.sum-txt b {{ font-size:10pt; font-weight:700; }}
.sum-sub {{ font-size:8.2pt; color:var(--ink-500); line-height:1.35; }}

/* ── BLOCOS ── */
.bloco {{ break-before:page; }}
.bloco-cabeca {{
  display:flex; gap:6mm; align-items:flex-start;
  border-bottom:2px solid var(--ink-900); padding-bottom:4mm; margin-bottom:6mm;
}}
.bloco-num {{
  font-size:26pt; font-weight:800; line-height:1; color:var(--coral-500);
  font-variant-numeric:tabular-nums; min-width:14mm;
}}
.bloco-kicker {{
  font-size:7.6pt; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
  color:var(--ink-400);
}}
.bloco-cabeca h2 {{ font-size:19pt; font-weight:800; letter-spacing:-.01em; line-height:1.15; }}
.bloco-sub {{ margin:2mm 0 0; color:var(--ink-500); font-size:9pt; }}

h3 {{
  font-size:11.5pt; font-weight:700; margin:7mm 0 3mm; padding-left:4mm;
  border-left:3px solid var(--coral-500); break-after:avoid;
}}
h4 {{
  font-size:10.5pt; font-weight:700; margin:6mm 0 2mm; break-after:avoid;
  color:var(--ink-900);
}}
p {{ margin:0 0 3mm; }}
strong {{ font-weight:700; }}
ul, ol {{ margin:0 0 4mm; padding-left:5mm; }}
li {{ margin-bottom:1.6mm; }}
.ref {{
  font-size:8.4pt; color:var(--ink-500); background:var(--ink-100);
  border-radius:5px; padding:1px 5px; white-space:nowrap;
}}
code {{
  font-family:ui-monospace,'Cascadia Mono',Consolas,monospace; font-size:8.4pt;
  background:var(--ink-100); border-radius:5px; padding:1px 5px;
}}

/* ── TABELAS ── */
table {{
  width:100%; border-collapse:separate; border-spacing:0; margin:0 0 5mm;
  background:var(--white); border:1px solid var(--ink-200); border-radius:var(--r-lg);
  overflow:hidden; font-size:8.8pt; break-inside:avoid;
}}
thead {{ display:table-header-group; }}
th {{
  background:var(--ink-900); color:var(--white); text-align:left; font-weight:600;
  font-size:8.2pt; letter-spacing:.02em; padding:2.6mm 3mm; vertical-align:bottom;
}}
td {{ padding:2.4mm 3mm; border-top:1px solid var(--ink-200); vertical-align:top; }}
tbody tr:nth-child(even) td {{ background:var(--ink-50); }}
tr {{ break-inside:avoid; }}
td strong {{ color:var(--ink-900); }}
/* Codigo que nao pode partir no meio (CNAE, CNPJ, CPF). O navegador trata o
   hifen como ponto de quebra valido, e numa coluna estreita ele parte
   `5912-0/99` em duas linhas -- achado do Pedro em 18/09, no PDF de CNAE. */
.nb {{ white-space:nowrap; }}
table.larga {{ font-size:8.2pt; }}
table.larga td, table.larga th {{ padding:2.1mm 2.4mm; }}
/* ficha chave-valor (personas): sem cabecalho, 1a coluna e o rotulo */
table.kv tr:first-child td {{ border-top:none; }}
table.kv td:first-child {{
  width:32mm; font-weight:600; color:var(--ink-600); background:var(--ink-100);
  border-right:1px solid var(--ink-200);
}}
table.kv tbody tr:nth-child(even) td:first-child {{ background:var(--ink-100); }}

/* ── CAIXAS ── */
.destaque {{
  background:var(--white); border:1px solid var(--ink-200);
  border-left:4px solid var(--ink-900); border-radius:var(--r-md);
  padding:4mm 5mm; margin:0 0 5mm; break-inside:avoid;
  font-size:10pt; line-height:1.5;
}}
.destaque p:last-child, .ressalva p:last-child, .pergunta p:last-child {{ margin-bottom:0; }}
.ressalva {{
  background:var(--warning-50); border:1px solid #F3DFB6;
  border-left:4px solid var(--warning-500); border-radius:var(--r-md);
  padding:3.5mm 4.5mm; margin:0 0 5mm; break-inside:avoid; font-size:9.2pt;
}}
.pergunta {{
  background:var(--coral-50); border:1px solid var(--coral-200);
  border-radius:var(--r-lg); padding:4.5mm 5mm; margin:6mm 0 0;
  break-inside:avoid;
}}
.pergunta-tag {{
  font-size:7.6pt; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
  color:var(--coral-700); margin-bottom:2.5mm;
}}
.pergunta-corpo {{ font-size:10pt; line-height:1.5; color:var(--ink-900); }}

pre {{
  background:var(--ink-800); color:#F1EEE9; border-radius:var(--r-md);
  padding:4mm 5mm; margin:0 0 5mm; overflow:hidden; break-inside:avoid;
}}
pre code {{
  background:none; padding:0; color:inherit; font-size:8pt; line-height:1.6;
  white-space:pre-wrap;
}}

hr {{ border:none; border-top:1px solid var(--ink-200); margin:6mm 0; }}

/* ── MARCADORES (substituem emoji do SO, que sai fora da paleta) ── */
.sim, .nao {{
  display:inline-block; width:13px; height:13px; border-radius:50%;
  line-height:13px; text-align:center; font-size:7.5pt; font-weight:700;
  color:var(--white); vertical-align:baseline; position:relative; top:1px;
}}
.sim {{ background:var(--success-500); }}
.nao {{ background:var(--danger-500); }}
.alerta {{
  display:inline-block; width:13px; height:13px; border-radius:50%;
  line-height:13px; text-align:center; font-size:8pt; font-weight:800;
  background:var(--warning-500); color:var(--ink-900);
  vertical-align:baseline; position:relative; top:1px;
}}
.badge-persona {{
  display:inline-block; min-width:15px; height:15px; line-height:15px;
  padding:0 4px; border-radius:5px; background:var(--coral-600); color:var(--white);
  font-size:8pt; font-weight:700; text-align:center; margin-right:5px;
  vertical-align:baseline; position:relative; top:-1px;
}}

/* ── FECHAMENTO ── */
.fechamento h2 {{
  font-size:17pt; font-weight:800; margin:0 0 5mm; padding-bottom:3mm;
  border-bottom:2px solid var(--ink-900);
}}
</style>
</head>
<body>

<div class="capa">
  {logo_svg}
  <div class="capa-meio">
    <span class="eyebrow">{args.eyebrow}</span>
    <h1>{args.titulo}</h1>
    <p class="capa-lead">{args.subtitulo}</p>
    <div class="capa-regra"></div>
    <dl class="capa-meta">
      <div><dt>Data</dt><dd>{args.data}</dd></div>
      <div><dt>Blocos</dt><dd>{len(secoes)}, cada um com {fecho_capa}</dd></div>
      <div><dt>Leitura com</dt><dd>{args.para}</dd></div>
      <div><dt>Papel dele</dt><dd>{args.papel}</dd></div>
    </dl>
  </div>
  <div class="capa-rodape">
    {legenda_capa}
    <div>Legalizai · Legalize Digital<br>número sem fonte não entra</div>
  </div>
</div>

<section class="sumario">
  <h2>Como ler este documento</h2>
  <div class="sumario-intro">{intro_render}</div>
  <ol>{sumario_itens}</ol>
</section>

{''.join(secoes_html)}
{extras_html}

</body>
</html>
"""

SAIDA.write_text(HTML, encoding="utf-8")
print("HTML:", SAIDA, len(HTML), "bytes")
print("secoes:", len(secoes), "| extras:", len(extras))
