"""buscar_base — leitura parcial das notas do Léo, com procedência.

Por que este plugin existe, e não o toolset `file` do Hermes:
  O `skill_view` devolve o arquivo INTEIRO. Uma pergunta sobre teto abre o
  `09-ESCOPO` completo (6.048 chars) para usar ~450. O toolset `file` resolveria,
  mas traz junto `write_file` e `patch`, e o Hermes roda como root: seria dar
  escrita livre em disco a um agente que fala com cliente. Aqui expomos UMA
  ferramenta, somente leitura, com o caminho travado em `references/`.

Custo: 1 schema (~950 chars) no prompt de toda chamada, contra ~3.800 do `file`.

A procedência vai junto de cada trecho — `[assunto · §seção · momento]` — por dois
motivos: o modelo passa a poder citar de onde tirou, e a gente consegue auditar
depois qual nota respondeu o quê. Custa ~40 chars por trecho.

⚠️ Degrada de propósito: `assunto` e `momento` dependem de frontmatter que a
reescrita ainda está introduzindo. Enquanto uma nota não declarar, ela responde
só a `termo`, e a consulta diz isso em vez de devolver vazio em silêncio.
"""

import json
import logging
import os
import re
import unicodedata
from pathlib import Path

logger = logging.getLogger(__name__)

TETO_TRECHOS = 6        # acima disto vira despejo, que é o que viemos consertar
PADRAO_TRECHOS = 3      # medido: com 5, "teto do MEI" custava 6.632 ch, mais que a nota inteira
TETO_CHARS = 12000      # trava dura: a busca nunca pode custar mais que ler a nota inteira
CONTEXTO_MAX = 1800     # um `##` maior que isto volta cortado, com aviso

# 🔴 As 13 notas de hoje declaram todas o MESMO `assunto: agente-whatsapp-vault` — é o assunto
# do vault, não o da nota. Tratar isso como "declarado" faria a busca por assunto casar tudo
# ou nada, sem aviso. Até a reescrita trocar o frontmatter, estes valores contam como ausentes.
ASSUNTO_GENERICO = {"agente-whatsapp-vault", "agente", "leo", ""}


def _momentos() -> list:
    """Os momentos válidos saem de `_taxonomia.yaml`, que é a mesma fonte que o
    `verificar-frontmatter.py` lê. Escrevê-los aqui de novo seria a duplicação que a
    trava existe para pegar, dentro da ferramenta que veio matá-la.

    Se o arquivo faltar, o schema sai sem a lista em vez de sair com uma lista velha:
    uma lista errada faz o modelo filtrar por um momento que não existe e receber
    vazio; uma lista ausente só o faz preferir `termo`, que sempre funciona."""
    for cand in (Path(__file__).parent / "_taxonomia.yaml",
                 Path(__file__).parent.parent.parent / "_taxonomia.yaml"):
        if not cand.is_file():
            continue
        dentro, achados = False, []
        for linha in cand.read_text(encoding="utf-8").splitlines():
            if linha.startswith("momentos:"):
                dentro = True
                continue
            if dentro:
                if linha[:1] not in (" ", "	", ""):
                    break
                m = re.match(r"^  ([a-z][a-z0-9_-]*):", linha)
                if m:
                    achados.append(m.group(1))
        if achados:
            return achados
    logger.warning("leo-buscar-base: _taxonomia.yaml não encontrado; schema sem a lista de momentos")
    return []


_ALVO = ("skills", "legalizai", "base-legalizai", "references")


def _base() -> Path:
    """A pasta das notas, derivada do lugar do próprio plugin antes de qualquer env.

    🔴 Medido em 20/09: `HERMES_HOME` NÃO existe no ambiente do processo, e a versão
    que dependia dele resolvia `~/.hermes/skills/...` — uma pasta que não existe. As
    notas moram sob o PERFIL (`~/.hermes/profiles/leo/skills/...`), e o plugin mora em
    `<perfil>/plugins/leo-buscar-base/`, então subir dois níveis daqui chega no perfil
    sempre, com env ou sem. O env vira o segundo palpite, não o primeiro.
    """
    candidatos = [Path(__file__).resolve().parent.parent.parent.joinpath(*_ALVO)]
    home = os.environ.get("HERMES_HOME")
    if home:
        candidatos.append(Path(home).joinpath(*_ALVO))
    candidatos.append(Path.home() / ".hermes" / Path(*_ALVO))
    for c in candidatos:
        if c.is_dir():
            return c
    return candidatos[0]  # para o erro dizer onde se procurou primeiro


def _sem_acento(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s or "")
                   if unicodedata.category(c) != "Mn").lower()


def _frontmatter(texto: str):
    """(dict, corpo). Aceita nota sem frontmatter: devolve ({}, texto)."""
    if not texto.startswith("---"):
        return {}, texto
    fim = texto.find("\n---", 3)
    if fim == -1:
        return {}, texto
    bruto, corpo = texto[3:fim], texto[fim + 4:]
    meta = {}
    for linha in bruto.splitlines():
        if ":" not in linha or linha.strip().startswith("#"):
            continue
        chave, _, valor = linha.partition(":")
        valor = valor.strip().strip('"').strip("'")
        if valor.startswith("[") and valor.endswith("]"):
            meta[chave.strip()] = [v.strip() for v in valor[1:-1].split(",") if v.strip()]
        else:
            meta[chave.strip()] = valor
    return meta, corpo


def _secoes(arquivo: Path):
    """Uma nota vira uma lista de seções `##`. O texto antes do primeiro `##` é o preâmbulo."""
    try:
        texto = arquivo.read_text(encoding="utf-8")
    except OSError:
        return []
    meta, corpo = _frontmatter(texto)
    partes, titulo, buffer = [], "preâmbulo", []
    for linha in corpo.splitlines():
        if re.match(r"^##\s+", linha):
            if any(l.strip() for l in buffer):
                partes.append((titulo, "\n".join(buffer).strip()))
            titulo, buffer = re.sub(r"^##\s+", "", linha).strip(), []
        else:
            buffer.append(linha)
    if any(l.strip() for l in buffer):
        partes.append((titulo, "\n".join(buffer).strip()))
    return [{"arquivo": arquivo.name, "meta": meta, "secao": t, "texto": x} for t, x in partes]


def _assunto_de(meta) -> str:
    """O assunto declarado, ou "" enquanto a nota ainda usa o valor genérico do vault."""
    a = str(meta.get("assunto", "")).strip()
    return "" if a.lower() in ASSUNTO_GENERICO else a


def _procedencia(s) -> str:
    meta = s["meta"]
    # o arquivo vem primeiro porque é o que identifica a nota hoje; o assunto entra
    # quando a reescrita o declarar, e o `papel` cobre o intervalo entre os dois
    partes = [s["arquivo"].replace(".md", ""), "§ " + s["secao"][:50]]
    rotulo = _assunto_de(meta) or str(meta.get("papel", ""))
    if rotulo:
        partes.append(rotulo[:60])
    mom = meta.get("momento")
    if mom:
        partes.append("momento: " + (",".join(mom) if isinstance(mom, list) else str(mom)))
    conf = meta.get("confianca")
    if conf:
        partes.append("confiança: " + str(conf))
    return "[" + " · ".join(partes) + "]"


def buscar_base(termo: str = None, assunto: str = None, momento: str = None,
                limite: int = PADRAO_TRECHOS, **_):
    base = _base()
    if not base.is_dir():
        return json.dumps({"success": False,
                           "error": f"pasta de notas não encontrada em {base}"}, ensure_ascii=False)
    if not (termo or assunto or momento):
        return json.dumps({"success": False,
                           "error": "informe termo, assunto ou momento"}, ensure_ascii=False)

    todas = [s for f in sorted(base.glob("*.md")) for s in _secoes(f)]
    sem_taxonomia = sorted({s["arquivo"] for s in todas if not _assunto_de(s["meta"])})

    alvo = todas
    if assunto:
        a = _sem_acento(assunto)
        alvo = [s for s in alvo if _sem_acento(_assunto_de(s["meta"])) == a]
    if momento:
        m = _sem_acento(momento)
        alvo = [s for s in alvo
                if any(_sem_acento(x) == m for x in (s["meta"].get("momento") or []))]
    if termo:
        t = _sem_acento(termo)
        alvo = [s for s in alvo
                if t in _sem_acento(s["texto"]) or t in _sem_acento(s["secao"])]

    limite = max(1, min(int(limite or PADRAO_TRECHOS), TETO_TRECHOS))

    # Uma nota que declara só `[recusar]` é mais daquele momento que uma que declara
    # quatro e o inclui de passagem. Sem isto, `momento=recusar` deixava `recusa.md` de
    # fora por ordem alfabética, que é a nota que manda no assunto.
    def especificidade(s):
        return (len(s["meta"].get("momento") or []) or 99, s["arquivo"])

    alvo = sorted(alvo, key=especificidade)

    # 🔴 Sem `termo`, o pedido é por NOTA, não por parágrafo — então devolve a nota
    # inteira, e não a primeira seção dela.
    #
    # Medido em 20/09, e custou 2 pontos na suíte: `momento=recusar` devolvia a
    # primeira seção de cada uma das 3 notas, e a primeira seção é sempre o PREÂMBULO
    # — título e frase de abertura. O Léo recebia "# GATE DE SAÍDA (COMO DIZER NÃO)" e
    # escrevia a recusa com isso. Eu tinha acabado de mandar o SOUL preferir a
    # ferramenta, então a instrução nova apontava para lixo, e `comercio-gate-saida`
    # quebrou depois de passar duas rodadas seguidas.
    #
    # O erro era de conceito: `momento` responde "de quais notas eu preciso", e
    # `assunto` responde "qual é a nota". Nenhum dos dois é uma pergunta sobre
    # parágrafo. Fatiar só faz sentido quando existe um `termo` para casar.
    por_nota = {}
    for s in alvo:
        por_nota.setdefault(s["arquivo"], []).append(s)

    trechos, gastos = [], 0
    if not termo:
        for arquivo, secoes in list(por_nota.items())[:limite]:
            corpo = "\n\n## ".join([secoes[0]["texto"]] +
                                   [s["secao"] + "\n" + s["texto"] for s in secoes[1:]])
            if trechos and gastos + len(corpo) > TETO_CHARS:
                break
            gastos += len(corpo)
            trechos.append({"fonte": _procedencia(secoes[0]), "arquivo": arquivo,
                            "texto": corpo})
        if len(por_nota) > len(trechos):
            saida_extra = sorted(set(por_nota) - {t["arquivo"] for t in trechos})
        else:
            saida_extra = []
    else:
        saida_extra = []
        for s in alvo[:limite]:
            corpo = s["texto"]
            if len(corpo) > CONTEXTO_MAX:
                corpo = corpo[:CONTEXTO_MAX] + "\n[…seção truncada. Para o texto completo: " \
                        f'skill_view("base-legalizai", "references/{s["arquivo"]}")]'
            if gastos + len(corpo) > TETO_CHARS:
                break
            gastos += len(corpo)
            trechos.append({"fonte": _procedencia(s), "arquivo": s["arquivo"], "texto": corpo})

    saida = {"success": True,
             "consulta": {k: v for k, v in
                          (("termo", termo), ("assunto", assunto), ("momento", momento)) if v},
             "encontrados": len(alvo), "devolvidos": len(trechos), "trechos": trechos}
    # 🔴 O aviso de taxonomia vem ANTES do "nada casou": sem ele, filtrar por um assunto que
    # nenhuma nota declarou ainda devolveria vazio limpo, e o modelo concluiria que o dado não
    # existe no vault. Silêncio aqui é pior que erro.
    if (assunto or momento) and sem_taxonomia:
        saida["aviso_taxonomia"] = (
            f"{len(sem_taxonomia)} notas ainda NÃO declaram assunto/momento e ficaram fora "
            "deste filtro — vazio aqui não quer dizer que o dado não existe. Busque por "
            "`termo`, ou leia a nota. Fora do filtro: " + ", ".join(sem_taxonomia))
    if saida_extra:
        saida["outras_notas_deste_filtro"] = saida_extra
    if not trechos:
        saida["aviso"] = ("nada casou. Refine o termo, ou leia a nota inteira com "
                          'skill_view("base-legalizai", "references/<NOTA>.md")')
    return json.dumps(saida, ensure_ascii=False)


_MOMENTOS = _momentos()
_LISTA = " | ".join(_MOMENTOS) if _MOMENTOS else ""

SCHEMA = {
    "name": "buscar_base",
    "description": (
        "Lê as notas oficiais da Legalizai, com a procedência de cada uma. "
        "`termo` devolve só os TRECHOS que casam, e é bem mais barato que abrir a nota. "
        "`momento` devolve INTEIRAS as notas que servem àquele ponto da conversa"
        + (f" ({_LISTA})" if _LISTA else "")
        + ", numa ida só, e é o certo quando a resposta depende de mais de uma nota. "
        "`assunto` devolve aquela nota inteira."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "termo": {"type": "string",
                      "description": "texto a procurar, sem diferenciar acento ou maiúscula"},
            "assunto": {"type": "string",
                        "description": "o dono do assunto, ex.: mei-elegibilidade, precos, contrato"},
            "momento": {"type": "string",
                        "description": _LISTA or "momento da conversa, quando a nota o declarar"},
            "limite": {"type": "integer",
                       "description": "máximo de trechos (padrão 3, teto 6)"},
        },
        "required": [],
    },
}


def register(ctx):
    r = ctx.register_tool(name="buscar_base", toolset="buscar_base", schema=SCHEMA,
                          handler=buscar_base, emoji="🔎",
                          description="leitura parcial das notas, com procedência")
    if r is None:
        logger.warning("leo-buscar-base: registro recusado; a ferramenta não vai aparecer")
    else:
        logger.info("leo-buscar-base: buscar_base registrada, lendo de %s", _base())
