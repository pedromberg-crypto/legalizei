# -*- coding: utf-8 -*-
"""
Valida um PDF gerado. NAO E' OPCIONAL: rode sempre antes de commitar/enviar.

Motivo (achado do 32o flow, 12/08): o print headless pode "suceder" com exit
code 0 e ainda assim gravar 1 pagina contendo a tela de erro do navegador
("ERR_FILE_NOT_FOUND"). Exit code nao prova nada; paginas e texto provam.

Uso:
    python _sistema/pdf/validar-pdf.py <arquivo.pdf> [--min-paginas 5]
        [--esperar "trecho que tem que aparecer"] [--png 1,7,29]
"""
import argparse
import pathlib
import sys

from pypdf import PdfReader

ap = argparse.ArgumentParser()
ap.add_argument("pdf")
ap.add_argument("--min-paginas", type=int, default=2)
ap.add_argument("--esperar", default=None, help="texto que precisa existir no PDF")
ap.add_argument("--png", default=None, help="paginas pra renderizar, ex: 1,7,29")
args = ap.parse_args()

alvo = pathlib.Path(args.pdf).resolve()
if not alvo.exists():
    sys.exit(f"FALHOU: PDF nao existe -> {alvo}")

r = PdfReader(str(alvo))
n = len(r.pages)
kb = round(alvo.stat().st_size / 1024)
textos = [(p.extract_text() or "").strip() for p in r.pages]
inteiro = "\n".join(textos)

erros = []
if n < args.min_paginas:
    erros.append(f"so {n} pagina(s), esperado >= {args.min_paginas}")
for marca in ("ERR_FILE_NOT_FOUND", "Não foi possível acessar", "ERR_ACCESS_DENIED"):
    if marca in inteiro:
        erros.append(f"tela de erro impressa dentro do PDF: {marca!r}")
vazias = [i for i, t in enumerate(textos, 1) if not t]
if vazias:
    erros.append(f"paginas sem texto extraivel: {vazias}")
# sem case: `text-transform: uppercase` do CSS chega ate o glifo do PDF, entao
# "Pergunta de validação" sai "PERGUNTA DE VALIDAÇÃO" no texto extraido.
if args.esperar and args.esperar.casefold() not in inteiro.casefold():
    erros.append(f"texto esperado nao encontrado: {args.esperar!r}")

print(f"{alvo.name}: {n} paginas, {kb} KB")
if args.png:
    import fitz  # pymupdf

    doc = fitz.open(str(alvo))
    build = pathlib.Path(__file__).resolve().parent / ".build"
    build.mkdir(exist_ok=True)  # PNG de conferencia e' descartavel, nao vai pro vault
    for p in [int(x) for x in args.png.split(",")]:
        destino = build / f"{alvo.stem}-p{p:02d}.png"
        doc[p - 1].get_pixmap(dpi=110).save(str(destino))
        print("  render:", destino.name)

if erros:
    print("FALHOU:")
    for e in erros:
        print("  -", e)
    sys.exit(1)
print("OK: PDF integro.")
