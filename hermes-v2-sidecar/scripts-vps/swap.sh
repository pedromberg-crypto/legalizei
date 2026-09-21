#!/usr/bin/env bash
#
# ══════════════════════════════════════════════════════════════════════════
#  swap.sh  ·  a virada do motor do Leo
#
#  Roda NA VPS, como root. Desliga o motor Python, arquiva o legado inteiro,
#  emancipa a ponte e sobe o motor Node.
#
#  ⚠️ POR PADRAO ELE NAO FAZ NADA. Sem `--executar`, imprime cada passo e sai.
#     Script de virada que roda por engano e script que derruba producao por
#     engano.
#
#  🔴 ESTA VERSAO CUSTA UMA RECONEXAO DO WHATSAPP, E ISSO E INEVITAVEL AQUI.
#
#  Hoje o `bridge.js` e PROCESSO FILHO do gateway Python, e a unidade usa
#  `KillMode=mixed`: parar o azul mata a ponte junto. Como a ponte so vira
#  unidade propria depois, existe uma janela em que a sessao do WhatsApp cai e
#  sobe. Sao segundos, e a sessao e reaproveitada (a pasta nao e tocada), entao
#  NAO ha QR para escanear. Mas nao e zero.
#
#  🔑 Se a virada precisar ser realmente instantanea, a ponte tem que ser
#     emancipada ANTES, num dia separado. Aquela e a unica janela de queda, e
#     depois dela este script vira so "stop azul, start verde".
#     Ver `reports/plano-migracao-vps.md` §4.
#
#  Uso:
#      ./swap.sh              # ensaio: mostra o que faria
#      ./swap.sh --executar   # faz
#      ./swap.sh --voltar     # rollback para o motor Python
# ══════════════════════════════════════════════════════════════════════════

set -Eeuo pipefail

AZUL="hermes-gateway-leo"
PONTE="whatsapp-bridge"
VERDE="leo-sidecar"

PERFIL="/root/.hermes/profiles/leo"
SESSAO="$PERFIL/whatsapp/session"
DESTINO="/opt/hermes-v2-sidecar"
ARQUIVO="/root/backups-leo"
CARIMBO="$(date +%Y%m%d-%H%M%S)"

EXECUTAR=0
VOLTAR=0
for arg in "$@"; do
  case "$arg" in
    --executar) EXECUTAR=1 ;;
    --voltar)   VOLTAR=1 ;;
    *) echo "argumento desconhecido: $arg"; exit 2 ;;
  esac
done

uc() { systemctl --user "$@"; }

passo() { printf '\n\033[1m── %s\033[0m\n' "$*"; }
faz()   {
  if [ "$EXECUTAR" = 1 ]; then
    echo "   \$ $*"; "$@"
  else
    echo "   [ensaio] $*"
  fi
}

saude_da_ponte() {
  curl -s --max-time 5 http://127.0.0.1:3000/health 2>/dev/null || echo '{"status":"sem resposta"}'
}

# ══════════════════════════════════════════════════════════════════════════
#  ROLLBACK
# ══════════════════════════════════════════════════════════════════════════
if [ "$VOLTAR" = 1 ]; then
  passo "ROLLBACK: voltando para o motor Python"
  echo "   ⚠️ Conversa atendida pelo motor novo vive no Postgres e NAO existe"
  echo "      para o motor antigo, que usa o SQLite. Voltar depois de dias"
  echo "      significa historico sumindo do ponto de vista do cliente."
  faz uc stop "$VERDE" || true
  faz uc disable "$VERDE" || true
  faz uc stop "$PONTE" || true
  faz uc disable "$PONTE" || true
  faz uc enable --now "$AZUL"
  sleep 5
  echo "   saude: $(saude_da_ponte)"
  exit 0
fi

# ══════════════════════════════════════════════════════════════════════════
#  PRE-VOO  ·  aborta antes de tocar em qualquer coisa
# ══════════════════════════════════════════════════════════════════════════
passo "0. PRE-VOO"

[ "$(id -u)" -eq 0 ] || { echo "🔴 rode como root"; exit 1; }
[ -d "$SESSAO" ]     || { echo "🔴 pasta de sessao nao encontrada: $SESSAO"; exit 1; }
[ -f "$DESTINO/.build/server.js" ] || {
  echo "🔴 $DESTINO/.build/server.js nao existe."
  echo "   Rode antes:  cd $DESTINO && npm ci && npm run build"
  exit 1
}
[ -f "$DESTINO/.env" ] || { echo "🔴 falta $DESTINO/.env (DATABASE_URL e GEMINI_API_KEY)"; exit 1; }

for u in "$PONTE" "$VERDE"; do
  [ -f "$HOME/.config/systemd/user/$u.service" ] || {
    echo "🔴 unidade $u.service nao instalada em ~/.config/systemd/user/"
    exit 1
  }
done

# 🔴 O motor novo precisa falar com o Gemini e com o Postgres ANTES da virada.
#    Descobrir que a chave estourou com o azul ja desligado e o pior momento
#    possivel: foi exatamente o que aconteceu em 20/09, com a producao sem
#    credito e respondendo erro.
passo "0.1 O motor novo consegue falar com banco e provedor?"
if [ "$EXECUTAR" = 1 ]; then
  ( cd "$DESTINO" && node --env-file=.env -e '
      const { pool } = await import("./.build/db.js");
      const { verificarAcesso } = await import("./.build/llm/gemini.js");
      await pool.query("select 1"); console.log("   postgres ok");
      await verificarAcesso();      console.log("   gemini ok");
      await pool.end();
    ' --input-type=module ) || { echo "🔴 pre-voo falhou. NADA foi alterado."; exit 1; }
else
  echo "   [ensaio] testaria postgres + gemini"
fi

echo "   saude da ponte agora: $(saude_da_ponte)"

# ══════════════════════════════════════════════════════════════════════════
#  BACKUP  ·  antes de qualquer parada
# ══════════════════════════════════════════════════════════════════════════
passo "1. BACKUP DO LEGADO"

faz mkdir -p "$ARQUIVO"

# 🔴 A PASTA DE SESSAO E O ITEM MAIS CRITICO DESTE BACKUP.
#    Perde-la significa re-parear por QR, PRESENCIALMENTE, com o numero fora do
#    ar ate alguem escanear. Ela vai num tarball proprio, separado, porque e a
#    unica coisa aqui que dinheiro nenhum recupera.
faz tar czf "$ARQUIVO/sessao-whatsapp-$CARIMBO.tar.gz" -C "$PERFIL/whatsapp" session

# O perfil inteiro: state.db (47 MB), config.yaml, logs, plugins.
faz tar czf "$ARQUIVO/perfil-leo-$CARIMBO.tar.gz" -C "$(dirname "$PERFIL")" "$(basename "$PERFIL")"

# ⚠️ `state.db` e SQLite ABERTO por um processo vivo. Um `tar` dele pode sair
#    inconsistente. A copia consistente sai do proprio SQLite, e ela roda ANTES
#    da parada justamente porque depois o arquivo nao muda mais.
if command -v sqlite3 >/dev/null 2>&1; then
  faz sqlite3 "$PERFIL/state.db" ".backup '$ARQUIVO/state-$CARIMBO.db'"
else
  echo "   ⚠️ sqlite3 nao instalado: o state.db vai apenas dentro do tarball,"
  echo "      e pode sair inconsistente. \`apt install sqlite3\` resolve."
fi

faz cp -a "$HOME/.config/systemd/user/$AZUL.service" "$ARQUIVO/$AZUL.service.$CARIMBO"

if [ "$EXECUTAR" = 1 ]; then
  echo "   arquivos gerados:"
  ls -lh "$ARQUIVO" | tail -5
fi

# ══════════════════════════════════════════════════════════════════════════
#  A VIRADA
# ══════════════════════════════════════════════════════════════════════════
passo "2. PARANDO O MOTOR ANTIGO"
echo "   ⚠️ Isto derruba a ponte junto (KillMode=mixed). A partir daqui o"
echo "      WhatsApp fica fora do ar ate o passo 3 terminar."
faz uc stop "$AZUL"
faz uc disable "$AZUL"

passo "3. SUBINDO A PONTE EMANCIPADA"
faz uc daemon-reload
faz uc enable --now "$PONTE"

if [ "$EXECUTAR" = 1 ]; then
  echo -n "   aguardando reconexao"
  for _ in $(seq 1 30); do
    if curl -s --max-time 3 http://127.0.0.1:3000/health 2>/dev/null | grep -q '"connected"'; then
      echo " ok"; break
    fi
    echo -n "."; sleep 2
  done
  echo "   saude: $(saude_da_ponte)"
  if ! saude_da_ponte | grep -q '"connected"'; then
    echo "🔴 a ponte NAO reconectou. O verde NAO sera iniciado."
    echo "   Rollback:  $0 --voltar"
    exit 1
  fi
fi

passo "4. SUBINDO O MOTOR NOVO"
# 🔴 So agora. A fila da ponte e de leitura destrutiva: se o verde subisse com
#    o azul ainda vivo, os dois dividiriam as mensagens e cada cliente receberia
#    resposta de um cerebro diferente, alternando.
faz uc enable --now "$VERDE"

if [ "$EXECUTAR" = 1 ]; then
  sleep 5
  uc --no-pager status "$VERDE" | head -12 || true
  echo
  echo "   ultimas linhas do log:"
  journalctl --user -u "$VERDE" -n 10 --no-pager | cut -c1-140
fi

# ══════════════════════════════════════════════════════════════════════════
passo "5. O QUE FAZER AGORA, COM AS PROPRIAS MAOS"
cat <<'FIM'
   1. Mande uma mensagem de um numero interno e confira a resposta ponta a ponta.
   2. Confira a cadencia: resposta com duas batidas tem que chegar em DUAS
      mensagens, nao numa so. Se chegar numa, o `emBatidas` nao esta agindo.
   3. Acompanhe:  journalctl --user -u leo-sidecar -f
   4. Confira se gravou:  select count(*) from conversa.mensagem;

   🔴 O motor antigo ficou PARADO E DESABILITADO, nao removido, e os backups
      estao em /root/backups-leo. Nao apague nada por pelo menos uma semana.

   ⚠️ O rollback e rapido na infraestrutura e caro no dado: o verde grava em
      Postgres e o azul em SQLite. Quanto mais tempo o verde atender, mais
      historico o azul nao tera. Decida um prazo, e que ele seja curto.

   Rollback:  ./swap.sh --voltar
FIM

if [ "$EXECUTAR" != 1 ]; then
  printf '\n\033[1m[ENSAIO] Nada foi alterado. Rode com --executar para valer.\033[0m\n'
fi
