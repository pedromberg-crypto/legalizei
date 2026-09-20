#!/usr/bin/env python3
"""Confere se as notas da base do Léo obedecem a `_taxonomia.yaml`.

Por que existe, e por que não é um lint de estilo:
  A base tinha 7 assuntos espalhados em 3 a 5 arquivos cada. O R$ 281,08 vivia em
  cinco lugares; a elegibilidade do MEI ainda vive em três, e a nota que o modelo
  abre é a que decide a resposta — foi o que causou as duas alucinações de 19/09.
  Consertar à mão não impede voltar: o `portal-data.mjs` ficou parado 03/08→11/09 e
  o vocabulário do vault ficou cego em 79% sem ninguém notar. Por isso é script.

O que ele NÃO faz, e é a mesma fronteira das outras travas do vault: ele garante que
o assunto tem dono, não que o texto ficou bom. Qualidade continua sendo olho humano.

    python verificar-frontmatter.py            # relatório + placar da migração
    python verificar-frontmatter.py --estrito  # sai 1 se houver QUALQUER pendência

Enquanto a migração não termina, a ausência de `assunto`/`momento` conta como
PENDÊNCIA, não como defeito: sem isso o script viraria um muro vermelho de 13 linhas
que ninguém lê. Defeito é o que está declarado e errado.
"""

import argparse
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SKILLS = AQUI / "skills-legalizai"
NOTAS = SKILLS / "base-legalizai" / "references"
TAXONOMIA = AQUI / "_taxonomia.yaml"
SOUL = AQUI / "00-SOUL-personalidade.md"

# 🔴 `_arquivo/` guarda o pacote v12 congelado, com uma cópia de cada nota. Varrê-lo
# acusaria 18 assuntos duplicados, com razão e sem utilidade. A exclusão é por
# construção — NOTAS aponta para a pasta viva — e esta linha existe para que quem
# mudar o caminho acima lembre do motivo.
IGNORAR_PASTAS = {"_arquivo", "__pycache__", ".obsidian"}

defeitos, pendencias = [], []


def defeito(arquivo, msg):
    defeitos.append((arquivo, msg))


def pendencia(arquivo, msg):
    pendencias.append((arquivo, msg))


# ─────────────────────────────────────────────────────────────── ler a taxonomia

def carregar_taxonomia():
    """PyYAML não está garantido no ambiente do vault, e a trava não pode depender de
    instalar nada. O subconjunto usado em `_taxonomia.yaml` é pequeno e fixo, então o
    leitor abaixo cobre exatamente ele: dois níveis, listas inline e escalares."""
    try:
        import yaml  # noqa
        return yaml.safe_load(TAXONOMIA.read_text(encoding="utf-8"))
    except ImportError:
        pass

    dados, secao, chave = {}, None, None
    for linha in TAXONOMIA.read_text(encoding="utf-8").splitlines():
        if not linha.strip() or linha.lstrip().startswith("#"):
            continue
        recuo = len(linha) - len(linha.lstrip())
        corpo = linha.strip()
        if ":" not in corpo:
            continue
        k, _, v = corpo.partition(":")
        k, v = k.strip().strip('"'), v.strip()
        if v.endswith("#") or " #" in v:
            v = v.split(" #")[0].strip()
        v = v.strip('"').strip("'")
        if recuo == 0:
            secao, chave = k, None
            dados[secao] = {} if not v else v
        elif recuo == 2 and isinstance(dados.get(secao), dict):
            chave = k
            dados[secao][chave] = {} if not v else v
        elif recuo >= 4 and isinstance(dados.get(secao, {}).get(chave), dict):
            if v.startswith("[") and v.endswith("]"):
                v = [x.strip().strip('"') for x in v[1:-1].split(",") if x.strip()]
            dados[secao][chave][k] = v
    return dados


# ─────────────────────────────────────────────────────────────── ler uma nota

def frontmatter(texto):
    if not texto.startswith("---"):
        return None, texto
    fim = texto.find("\n---", 3)
    if fim == -1:
        return None, texto
    meta = {}
    for linha in texto[3:fim].splitlines():
        if ":" not in linha or linha.strip().startswith("#"):
            continue
        k, _, v = linha.partition(":")
        v = v.strip().strip('"').strip("'")
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip().strip('"').strip("'") for x in v[1:-1].split(",") if x.strip()]
        meta[k.strip()] = v
    return meta, texto[fim + 4:]


def sem_acento(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "")
                   if unicodedata.category(c) != "Mn").lower()


# ─────────────────────────────────────────────────────────────── as verificações

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--estrito", action="store_true",
                    help="pendência também derruba (use quando a migração terminar)")
    args = ap.parse_args()

    if not NOTAS.is_dir():
        print(f"pasta de notas não encontrada: {NOTAS}")
        return 1

    tax = carregar_taxonomia()
    assuntos_validos = set(tax.get("assuntos", {}))
    momentos_validos = set(tax.get("momentos", {}))
    numeros = tax.get("numeros_com_dono", {})
    liberados = tax.get("numeros_liberados_em", {}) or {}

    if not assuntos_validos or not momentos_validos:
        print(f"🔴 `_taxonomia.yaml` não pôde ser lido (assuntos={len(assuntos_validos)}, "
              f"momentos={len(momentos_validos)}). A trava passaria verde sem verificar nada.")
        return 1

    arquivos = sorted(p for p in NOTAS.glob("*.md")
                      if not any(x in p.parts for x in IGNORAR_PASTAS))
    dono_de_assunto = defaultdict(list)
    nomes = {p.stem for p in arquivos}
    migradas = 0

    for p in arquivos:
        texto = p.read_text(encoding="utf-8")
        meta, corpo = frontmatter(texto)
        nome = p.name

        if meta is None:
            defeito(nome, "sem frontmatter. Nenhuma outra regra pode ser verificada nela")
            continue

        # 1. assunto — declarado, único, e da lista
        assunto = str(meta.get("assunto", "")).strip()
        if not assunto or assunto == "agente-whatsapp-vault":
            # o valor de hoje é o assunto do VAULT, não o da nota: conta como ausente
            pendencia(nome, "ainda não declara `assunto`")
        elif assunto not in assuntos_validos:
            defeito(nome, f"`assunto: {assunto}` não está em `_taxonomia.yaml`. "
                          f"Ou é erro de digitação, ou o assunto é novo e precisa ser declarado lá")
        else:
            migradas += 1
            dono_de_assunto[assunto].append(nome)

        # 2. momento — declarado, lista, e todos da lista
        mom = meta.get("momento")
        if not mom:
            pendencia(nome, "ainda não declara `momento`")
        else:
            if isinstance(mom, str):
                defeito(nome, f"`momento: {mom}` é texto solto. Use lista, mesmo com um só: [{mom}]")
                mom = [mom]
            fora = [m for m in mom if m not in momentos_validos]
            if fora:
                defeito(nome, f"momento(s) fora da lista: {', '.join(fora)}. "
                              f"Válidos: {', '.join(sorted(momentos_validos))}")

        # 3. links quebrados — [[nota]] que não existe
        for alvo in re.findall(r"\[\[([^\]|#]+)", corpo):
            if alvo.strip() not in nomes:
                defeito(nome, f"link [[{alvo.strip()}]] não aponta para nota nenhuma")

    # 3b. 🔴 Quem aponta pras notas, de fora delas: as skills e o SOUL.
    #
    # Nasceu na própria migração de 20/09, e nasceu de um susto: ao trocar as 13 notas
    # por 21, a trava deu ✅ 21/21 enquanto as skills apontavam para 30 caminhos que eu
    # tinha acabado de apagar. O Léo ficaria cego e o script diria que estava tudo certo
    # — verde vazio, que é o defeito que a trava existe para não ter. Só `references/`
    # era varrido; quem APONTA para lá, não era.
    apontadores = [q for q in sorted(SKILLS.rglob("*.md"))
                   if NOTAS not in q.parents and not any(x in q.parts for x in IGNORAR_PASTAS)]
    if SOUL.is_file():
        apontadores.append(SOUL)
    for q in apontadores:
        texto = q.read_text(encoding="utf-8")
        rel = q.relative_to(AQUI).as_posix()
        vistos = set()
        for alvo in re.findall(r"references/([A-Za-z0-9_-]+\.md)", texto):
            if alvo not in vistos and not (NOTAS / alvo).is_file():
                vistos.add(alvo)
                defeito(rel, f"🔴 manda ler `references/{alvo}`, que não existe. "
                             f"O Léo chamaria `skill_view` num caminho morto")
        for alvo in re.findall(r"\[\[([^\]|#]+)", texto):
            alvo = alvo.strip()
            if alvo not in vistos and alvo not in nomes:
                vistos.add(alvo)
                defeito(rel, f"link [[{alvo}]] não aponta para nota nenhuma")
        # Vestígio da nomenclatura antiga (`08-MAPA-DO-DOSSIE`), citada SEM o prefixo
        # `references/` e por isso invisível às duas regras acima. Uma sobrou na
        # migração de 20/09 e só apareceu numa leitura manual — que é exatamente o que
        # a trava existe para dispensar.
        for alvo in set(re.findall(r"`(\d\d-[A-Z][A-Z-]+)`", texto)):
            defeito(rel, f"cita `{alvo}`, nome do esquema numerado que foi aposentado "
                         f"em 20/09. O caminho hoje é `references/<assunto>.md`")

    # 4. 🔴 assunto com dois donos — a regra seca contra duplicação
    for assunto, arqs in sorted(dono_de_assunto.items()):
        if len(arqs) > 1:
            defeito(", ".join(arqs),
                    f"🔴 `{assunto}` tem {len(arqs)} donos. Um assunto mora em UMA nota; "
                    f"as outras citam com [[link]]")

    # 5. assunto declarado na taxonomia e sem nota — o "doc declarado e ausente"
    orfaos = sorted(assuntos_validos - set(dono_de_assunto))
    if orfaos and migradas:
        pendencia("_taxonomia.yaml",
                  f"{len(orfaos)} assuntos ainda sem nota: {', '.join(orfaos)}")

    # 6. 🔴 número com dono único
    for numero, dono in sorted(numeros.items()):
        escrevem = []
        for p in arquivos:
            corpo = frontmatter(p.read_text(encoding="utf-8"))[1]
            if numero in corpo:
                escrevem.append(p.name)
        if not escrevem:
            continue
        donos_do_assunto = dono_de_assunto.get(dono, [])
        permitidos = set(donos_do_assunto) | set(liberados.get(numero, []) or [])
        if not donos_do_assunto:
            # antes da migração não existe dono ainda: só reporta concentração
            if len(escrevem) > 1:
                pendencia(", ".join(escrevem),
                          f"o número {numero} está escrito em {len(escrevem)} notas. "
                          f"Dono previsto: `{dono}`")
            continue
        intrusos = [a for a in escrevem if a not in permitidos]
        if intrusos:
            defeito(", ".join(intrusos),
                    f"🔴 escrevem o número {numero}, que pertence a `{dono}` "
                    f"({', '.join(donos_do_assunto)}). Cite com [[link]], não copie")

    # ─────────────────────────────────────────────────────────── relatório
    total_assuntos = len(assuntos_validos)
    print(f"\n{len(arquivos)} notas · {total_assuntos} assuntos · "
          f"{len(momentos_validos)} momentos · "
          f"{len(apontadores)} arquivos que apontam pra elas")
    print(f"migração: {migradas} de {total_assuntos} assuntos com nota dona\n")

    if defeitos:
        print(f"🔴 {len(defeitos)} DEFEITO(S) — declarado e errado:")
        for arq, msg in defeitos:
            print(f"   {arq}\n      {msg}")
        print()
    if pendencias:
        print(f"⬜ {len(pendencias)} pendência(s) — ainda não declarado:")
        for arq, msg in pendencias:
            print(f"   {arq}: {msg}")
        print()
    if not defeitos and not pendencias:
        print("✅ nenhuma pendência e nenhum defeito.\n")

    if defeitos:
        return 1
    if pendencias and args.estrito:
        print("--estrito: pendência derruba a rodada.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
