#!/usr/local/lib/hermes-agent/venv/bin/python
"""Roda o conjunto de testes de humanização contra o perfil leo do Hermes.

Cada caso de casos.yaml vira uma sessão nova de CLI. As respostas passam pelas
checagens globais (formato WhatsApp, dados inventados, idioma, tamanho) e pelas
regex do próprio caso. O relatório sai em testes/resultados/<data>_<modelo>.md.

Uso:
    ./rodar_testes.py                      # modelo do config.yaml
    ./rodar_testes.py -m gpt-oss:120b      # outro modelo, sem mexer no config
    ./rodar_testes.py -m gemini-3.8-flash -p gemini   # outro provedor
    ./rodar_testes.py -c vc-mentiu valores # só alguns casos
"""

import argparse
import os
import re
import sqlite3
import statistics
import subprocess
from concurrent.futures import ThreadPoolExecutor
import sys
import time
from datetime import datetime
from pathlib import Path

import yaml

PERFIL = Path("/root/.hermes/profiles/leo")
AQUI = Path(__file__).resolve().parent
LIMITE_LINHAS = 8

# Métricas de naturalidade. O que entrega um agente como robô não é a palavra que ele
# escolhe, é toda resposta dele ter o mesmo tamanho. Na rodada de 17/09, 38 das 45
# respostas ficaram entre 350 e 580 chars: conteúdo certo, variância zero. Então o alvo
# não é "curto", é "curto na maioria e variado no conjunto".
FAIXA_CURTA = 150       # até aqui a resposta é de uma linha, o padrão que o SOUL.v5 pede
FAIXA_LONGA = 500       # acima daqui só se o assunto pedir (medo, plano, reexplicação)
ALVO_CURTAS = 0.35      # fração mínima desejada de respostas curtas na rodada
# Variância medida como COEFICIENTE DE VARIAÇÃO (desvio / média), não desvio absoluto.
# O desvio absoluto encolhe junto com a média, então ele acusa piora quando as respostas
# encurtam, que é o contrário do que a gente quer medir: 17/09 deu desvio 128 sobre média
# 322 (CV 0.40) e 18/09 deu desvio 95 sobre média 192 (CV 0.49). O desvio caiu, a variância
# relativa subiu, e é a relativa que diz se o Léo varia o tamanho conforme a pergunta.
ALVO_CV = 0.45          # coeficiente de variação mínimo desejado

# Os únicos links da base-legalizai são o site, a lista de espera e o Instagram oficial.
# Qualquer outro link ou e-mail é inventado.
CHECAGENS_GLOBAIS = [
    ("tabela", r"^\s*\|.*\|\s*$"),
    ("titulo markdown", r"^\s*#{1,6}\s"),
    ("citacao em bloco", r"^\s*>\s"),
    ("latex", r"\\\[|\\\(|\\frac|\$\$"),
    ("travessao", r"[—–]"),
    ("link ou e-mail", r"https?://|www\.|\b[\w.+-]+@[\w-]+\.[a-z]{2,}|\b[\w-]+\.(com|app)(\.br)?\b"),
    # 18/09: no WhatsApp o Léo respondeu "I speak only in Brazilian Portuguese, but I can
    # help you..." e passou nesta checagem, porque ela só via fórmulas de cortesia. Agora
    # pega palavra funcional inglesa, que não aparece em resposta escrita em português.
    ("ingles", r"\b(if you|let me know|feel free|just|please|thanks|i can|i speak|you can|your|the|we can|our)\b"),
    ("portugues de portugal", r"\b(ficheiro|telem[oó]vel|utilizador|registar|contacto)\b"),
    ("vazamento tecnico", r"invalid tool call|auto-repaired|^\s*\{\s*\"|skill_view|\[ERRO |[\uac00-\ud7af\u4e00-\u9fff]"),
    ("frase proibida", r"em que posso ajudar|o l[eé]o vai|incondicional|sem letra mi[uú]da"),
    # 18/09: numa rodada manual o Léo devolveu a zoação do cliente com "só resolveu testar
    # minha paciência hoje?", "agora chega de provocação" e "tentando me tirar do sério".
    # Cobrar postura do cliente é falha grave de personagem, mesmo em tom de brincadeira.
    ("impaciencia", r"testar minha paci[eê]ncia|chega de provoca|me tirar do s[eé]rio|falando sozinho|bora focar|vamos voltar pro que interessa"),
    # 18/09: o Léo prometeu "um minuto que eu já te mando as informações" e nunca voltou.
    # Ele não manda mensagem fora do turno, então toda promessa de envio futuro morre no vazio.
    ("promete enviar depois", r"(j[aá]|logo|daqui a pouco|um minuto|um instante)[^.!?]{0,30}(te )?(mando|envio)|vou (te )?(mandar|enviar|passar)[^.!?]{0,25}(dados|informa|contrato|documento|comprovante|cnpj e|crc)|te (mando|envio)[^.!?]{0,25}(cnpj|crc|contrato|dados|documento|prova)|te (mando|envio) (em seguida|logo|daqui)"),
    # A fidelidade de 12 meses existe (10-CONTRATO-GARANTIA-CANCELAMENTO) e negá-la é o erro
    # mais caro da venda: a pessoa fecha e descobre no contrato.
    ("nega fidelidade", r"(n[aã]o (temos|tem|h[aá])|sem) (fidelidade|multa de cancelamento|multa por cancel)"),
    # A Legalizai não faz regularização de passivo: escalar pode, prometer o serviço não.
    ("promete regularizacao", r"(resolv\w+|cuid\w+|limp\w+)[^.!?]{0,40}(esse |o teu |o seu |teu |seu )?passivo|regulariz\w+ (isso|essa empresa|pra voc[eê])"),
]


def toolsets_whatsapp():
    config = yaml.safe_load((PERFIL / "config.yaml").read_text())
    return ",".join(config.get("platform_toolsets", {}).get("whatsapp", []))


def enviar(sessao, mensagem, modelo, toolsets, provedor=None):
    cmd = ["hermes", "--profile", os.environ.get("LEO_PERFIL", "leo"), "chat", "-Q", "-q", mensagem,
           "-c", sessao, "--create-if-missing", "-t", toolsets]
    if modelo:
        cmd += ["-m", modelo]
    if provedor:
        cmd += ["--provider", provedor]
    inicio = time.monotonic()
    # A CLI não é whatsapp, então o filtro de saída precisa ser forçado para o teste valer.
    ambiente = {**os.environ, "LEO_FORMATADOR_FORCAR": "1"}
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600, cwd="/tmp", env=ambiente)
    duracao = time.monotonic() - inicio
    # O -Q manda o session_id para o stderr e a resposta para o stdout.
    session_id = re.search(r"^session_id:\s*(\S+)", proc.stderr + "\n" + proc.stdout, re.M)
    resposta = re.sub(r"^(session_id:|↻ Resumed session|Session \S+ found).*\n?", "", proc.stdout, flags=re.M).strip()
    if proc.returncode != 0 and not resposta:
        resposta = f"[ERRO {proc.returncode}] {proc.stderr.strip()[-500:]}"
    return (session_id.group(1) if session_id else None), resposta, duracao


def ferramentas_usadas(session_id):
    if not session_id:
        return []
    conn = sqlite3.connect(f"file:{PERFIL / 'state.db'}?mode=ro", uri=True)
    linhas = conn.execute(
        "select tool_name from messages where session_id=? and role='tool'", (session_id,)
    ).fetchall()
    return [nome or "INEXISTENTE" for (nome,) in linhas]


def checar_globais(resposta):
    # Site, lista de espera e Instagram oficial são os links da base, então não contam como
    # inventados. O Instagram sai primeiro porque o handle no caminho da URL (legalizai.app)
    # dispararia a regra de domínio solto, que foi o mesmo bug que o filtro de saída tinha.
    sem_link_oficial = re.sub(r"(https?://)?(www\.)?instagram\.com/legalizai\.app/?", "", resposta, flags=re.I)
    sem_link_oficial = re.sub(r"(https?://)?(www\.)?legalizai\.com\.br(/em-breve)?/?(?![\w/-])", "", sem_link_oficial, flags=re.I)
    falhas = [nome for nome, padrao in CHECAGENS_GLOBAIS
              if re.search(padrao, sem_link_oficial if nome == "link ou e-mail" else resposta, re.I | re.M)]
    if not resposta.strip():
        falhas.append("vazia")
    linhas = [l for l in resposta.splitlines() if l.strip()]
    if len(linhas) > LIMITE_LINHAS:
        falhas.append(f"longa ({len(linhas)} linhas)")
    return falhas


def checar_regras(resposta, regras, prefixo=""):
    """Aplica deve / nao_deve / max_chars / min_chars a UMA resposta.

    `prefixo` identifica o turno no relatório ("t5: faltou /81/"), para que numa
    conversa de 12 turnos dê para saber qual turno quebrou sem reler a sessão.
    """
    falhas = []
    for padrao in regras.get("deve", []):
        if not re.search(padrao, resposta, re.I | re.M):
            falhas.append(f"{prefixo}faltou /{padrao}/")
    for padrao in regras.get("nao_deve", []):
        if re.search(padrao, resposta, re.I | re.M):
            falhas.append(f"{prefixo}proibido /{padrao}/")
    # Teto e piso de tamanho são opcionais. O teto pega despejo em pergunta
    # objetiva; o piso existe porque em medo, golpe ou prejuízo a resposta curta demais
    # soa como descaso, e sem ele o agente sobrecorrige depois de apertar o tamanho.
    chars = len(resposta.strip())
    if regras.get("max_chars") and chars > regras["max_chars"]:
        falhas.append(f"{prefixo}verbosa ({chars} chars, teto {regras['max_chars']})")
    if regras.get("min_chars") and chars < regras["min_chars"]:
        falhas.append(f"{prefixo}seca ({chars} chars, piso {regras['min_chars']})")
    return falhas


def checar(respostas, caso):
    """Globais valem para todos os turnos. `esperado` verifica turno a turno.

    `esperado` é uma lista paralela a `turnos`: a entrada i vale para a resposta do
    turno i. Entrada vazia (null, {}) = turno sem asserção própria, que continua
    passando pelas 13 checagens globais. Sem `esperado`, o caso se comporta como
    antes e as regras de nível de caso valem só para a última resposta — é o que
    mantém os 58 casos de um turno funcionando sem tocar em nenhum deles.
    """
    falhas = []
    for resposta in respostas:
        falhas += [f for f in checar_globais(resposta) if f not in falhas]

    for i, regras in enumerate(caso.get("esperado") or []):
        if regras and i < len(respostas):
            falhas += checar_regras(respostas[i], regras, prefixo=f"t{i + 1}: ")

    falhas += checar_regras(respostas[-1], caso)
    return falhas


def metricas_tamanho(tamanhos):
    """tamanhos: lista de (caso_id, chars da última resposta). Devolve linhas de relatório."""
    valores = [c for _, c in tamanhos]
    if len(valores) < 2:
        return []
    curtas = [c for c in valores if c <= FAIXA_CURTA]
    longas = [c for c in valores if c > FAIXA_LONGA]
    desvio = statistics.pstdev(valores)
    media = statistics.mean(valores)
    cv = desvio / media if media else 0
    frac_curtas = len(curtas) / len(valores)
    ok_curtas = "✅" if frac_curtas >= ALVO_CURTAS else "❌"
    ok_cv = "✅" if cv >= ALVO_CV else "❌"

    # Histograma em faixas de 100 chars, que é onde a falta de variância fica visível.
    faixas = {}
    for c in valores:
        faixas.setdefault(min(c // 100, 7), 0)
        faixas[min(c // 100, 7)] += 1

    linhas = ["## Métricas de tamanho", "",
              f"Base: {len(valores)} respostas (a última de cada caso).", "",
              "| Métrica | Valor | Alvo |",
              "|---|---|---|",
              f"| Mediana | {statistics.median(valores):.0f} chars | quanto menor, melhor |",
              f"| Média | {media:.0f} chars | |",
              f"| Desvio padrão | {desvio:.0f} chars | mede junto com a média, ver CV |",
              f"| **Coef. de variação** | **{cv:.2f}** | >= {ALVO_CV} {ok_cv} |",
              f"| Mínima | {min(valores)} chars | |",
              f"| Máxima | {max(valores)} chars | |",
              f"| **Respostas curtas (<= {FAIXA_CURTA})** | **{len(curtas)} ({frac_curtas:.0%})** | >= {ALVO_CURTAS:.0%} {ok_curtas} |",
              f"| Respostas longas (> {FAIXA_LONGA}) | {len(longas)} ({len(longas)/len(valores):.0%}) | só quando o assunto pede |",
              "", "Distribuição:", ""]
    for faixa in sorted(faixas):
        rotulo = f"{faixa*100}-{faixa*100+99}" if faixa < 7 else "700+"
        linhas.append(f"- `{rotulo:>8}` {'█' * faixas[faixa]} {faixas[faixa]}")
    linhas += ["",
               "**Como ler:** o par que interessa é mediana baixa com coeficiente de variação alto. "
               "CV baixo é o sintoma de robô, porque significa que toda resposta virou o mesmo bloco, "
               "independente do tamanho dela. CV alto com muitas curtas é conversa de gente: responde "
               "em uma linha quando dá e se alonga quando o assunto pede. O desvio em chars fica na "
               "tabela só como insumo, porque sozinho ele cai sempre que as respostas encurtam.",
               ""]
    return linhas


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--modelo", help="modelo a testar (padrão: o do config.yaml)")
    parser.add_argument("-p", "--provedor", help="provedor do modelo, quando for outro que não o do config.yaml (ex.: gemini)")
    parser.add_argument("-c", "--casos", nargs="*", help="ids dos casos a rodar")
    parser.add_argument("-s", "--suite", help="suíte nomeada de suites.yaml (curta, conversada, acervo)")
    parser.add_argument("-j", "--paralelos", type=int, default=6,
                        help="casos rodando ao mesmo tempo (1 volta ao modo sequencial)")
    args = parser.parse_args()

    # Duas suítes, dois arquivos: casos.yaml são os curtos (1 turno, atribuição limpa)
    # e casos-conversados.yaml são as conversas longas (custo e condução). Carregar os
    # dois sempre mantém `-c <id>` funcionando sem o operador precisar saber onde o
    # caso mora. Id duplicado entre arquivos derruba a rodada: seria roleta.
    casos = yaml.safe_load((AQUI / "casos.yaml").read_text())["casos"]
    conversados = AQUI / "casos-conversados.yaml"
    if conversados.exists():
        extras = yaml.safe_load(conversados.read_text())["casos"]
        repetidos = {c["id"] for c in casos} & {c["id"] for c in extras}
        if repetidos:
            sys.exit(f"id repetido entre casos.yaml e casos-conversados.yaml: {sorted(repetidos)}")
        casos += extras
    # `-s <suite>` é a forma normal de rodar. `-c <ids>` continua valendo para
    # investigar um caso solto sem precisar editar suites.yaml.
    nome_suite = None
    if args.suite:
        cfg = yaml.safe_load((AQUI / "suites.yaml").read_text())["suites"]
        if args.suite not in cfg:
            sys.exit(f"suíte '{args.suite}' não existe. Disponíveis: {sorted(cfg)}")
        escolha = cfg[args.suite]["casos"]
        nome_suite = args.suite
        if escolha != "TODOS":
            faltando = [i for i in escolha if i not in {c["id"] for c in casos}]
            if faltando:
                sys.exit(f"suíte '{args.suite}' aponta para caso que não existe: {faltando}")
            ordem = {i: n for n, i in enumerate(escolha)}
            casos = sorted((c for c in casos if c["id"] in ordem), key=lambda c: ordem[c["id"]])
    if args.casos:
        casos = [c for c in casos if c["id"] in args.casos]
    if not casos:
        sys.exit("nenhum caso selecionado")
    toolsets = toolsets_whatsapp()
    modelo_nome = args.modelo or yaml.safe_load((PERFIL / "config.yaml").read_text())["model"]["default"]
    carimbo = datetime.now().strftime("%Y%m%d_%H%M%S")

    etiqueta = f"suíte `{nome_suite}` · " if nome_suite else ""
    relatorio = [f"# Testes de humanização: `{modelo_nome}`", "",
                 f"{carimbo} · {etiqueta}toolsets `{toolsets}` · {len(casos)} casos", ""]
    # Cada caso é uma sessão própria e não depende dos outros, então eles rodam em paralelo.
    # Dentro do caso os turnos continuam em ordem, que é o que dá sentido à conversa.
    def rodar_caso(caso):
        sessao = f"teste-{carimbo}-{caso['id']}"
        print(f"▶ {caso['id']}", file=sys.stderr, flush=True)
        blocos, tempo_total, session_id = [], 0.0, None
        for turno in caso["turnos"]:
            session_id, resposta, duracao = enviar(sessao, turno, args.modelo, toolsets, args.provedor)
            tempo_total += duracao
            blocos.append((turno, resposta))
        return caso, blocos, tempo_total, ferramentas_usadas(session_id), session_id

    inicio_rodada = time.monotonic()
    paralelos = max(1, args.paralelos)
    if paralelos == 1:
        saidas = [rodar_caso(caso) for caso in casos]
    else:
        with ThreadPoolExecutor(max_workers=paralelos) as pool:
            saidas = list(pool.map(rodar_caso, casos))
    relogio = time.monotonic() - inicio_rodada

    resumo, tamanhos = [], []
    for caso, blocos, tempo_total, ferramentas, session_id in saidas:
        falhas = checar([r for _, r in blocos], caso)
        status = "✅" if not falhas else "❌"
        chars = len(blocos[-1][1].strip())
        tamanhos.append((caso["id"], chars))
        resumo.append(f"| {caso['id']} | {status} | {', '.join(falhas) or ''} | {chars} | {tempo_total:.0f}s | {len(ferramentas)} | `{session_id or '-'}` |")

        relatorio += [f"## {status} {caso['id']} (itens {caso.get('itens')})", ""]
        for turno, resposta in blocos:
            relatorio += ["**Cliente:**", "```", turno, "```", "**Léo:**", "```", resposta, "```", ""]
        relatorio += [f"- Checagens: {', '.join(falhas) or 'ok'}",
                      f"- Tamanho: {chars} chars",
                      f"- Tempo: {tempo_total:.0f}s · ferramentas: {', '.join(ferramentas) or 'nenhuma'}",
                      f"- Avaliar: {caso.get('avaliar', '')}", ""]

    # session_id na tabela: sem ele não se amarra caso de teste com o consumo de
    # session_model_usage no state.db, e custo por caso fica só por janela de tempo.
    tabela = ["| Caso | Status | Falhas | Chars | Tempo | Ferramentas | Sessão |", "|---|---|---|---|---|---|---|"] + resumo
    aprovados = sum("✅" in l for l in resumo)
    metricas = metricas_tamanho(tamanhos)
    relatorio[4:4] = ([f"**{aprovados}/{len(resumo)} passaram nas checagens automáticas.**", ""]
                      + tabela + [""] + metricas)

    destino = AQUI / "resultados" / f"{carimbo}_{modelo_nome.replace(':', '-').replace('/', '-')}.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text("\n".join(relatorio))
    print("\n".join(tabela))
    if metricas:
        print("\n" + "\n".join(l for l in metricas if l and not l.startswith("**Como ler")))
    print(f"\n{aprovados}/{len(resumo)} ok · {relogio/60:.1f} min de relógio com {paralelos} em paralelo · relatório: {destino}")


if __name__ == "__main__":
    main()
