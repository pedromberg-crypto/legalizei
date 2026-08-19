#!/usr/bin/env python
"""Pinta o papel de creme, sangrando ate a borda de toda pagina.

POR QUE ISTO EXISTE (nao e' gambiarra, e' a unica porta):
o Chrome nunca pinta nada dentro da margem de impressao. A margem e' area de
LAYOUT, e o clip da pagina corta o que passar dela. Foram testados e falharam:
  - `position:fixed` com insets negativos maiores que a margem  -> clipado;
  - `headerTemplate`/`footerTemplate` com background full-bleed  -> nao pinta.
Resultado antigo: o creme ficava numa ilha com moldura branca de papel em volta.

Aqui o creme deixa de ser propriedade do CONTEUDO e vira propriedade do PAPEL:
desenha um retangulo do tamanho do MediaBox em cada pagina, na camada de BAIXO
(overlay=False), entao nenhum texto, tabela ou card e' encoberto.

Uso:  python _sistema/pdf/pintar-fundo.py <arquivo.pdf> [--cor "#FAF8F5"]

Roda in-place e e' repetivel: pintar de novo so empilha o mesmo creme embaixo.
"""
import argparse
import sys

import fitz  # pymupdf

CREME = "#FAF8F5"  # --ink-50, espelho de app/src/app/globals.css


def hex_para_rgb(h):
    h = h.lstrip("#")
    if len(h) != 6:
        raise ValueError(f"cor precisa ser #RRGGBB, veio {h!r}")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("--cor", default=CREME, help=f"padrao {CREME} (--ink-50)")
    args = ap.parse_args()

    cor = hex_para_rgb(args.cor)
    doc = fitz.open(args.pdf)
    for pagina in doc:
        # page.rect ja e' o MediaBox inteiro: sangra ate o corte por definicao.
        pagina.draw_rect(pagina.rect, color=None, fill=cor, overlay=False)

    paginas = doc.page_count
    if doc.can_save_incrementally():
        doc.saveIncr()
    else:
        doc.save(args.pdf, incremental=False, deflate=True)
    doc.close()
    print(f"fundo {args.cor} em {paginas} paginas: {args.pdf}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # falha barulhenta: PDF errado nao pode passar batido
        print(f"ERRO: {e}", file=sys.stderr)
        sys.exit(1)
