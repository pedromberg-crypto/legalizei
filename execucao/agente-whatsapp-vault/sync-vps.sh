#!/usr/bin/env bash
# Sincroniza o vault do Léo entre o repo (fonte-verdade) e o VPS.
#
# Regra de 19/09: a FONTE-VERDADE é este repo. O VPS é cópia.
# Antes de 19/09 existiam duas cópias divergindo e foi assim que dado errado
# sobreviveu semanas. Este script nunca sobrescreve sem mostrar o diff antes.
#
#   ./sync-vps.sh diff     mostra o que difere, nos dois sentidos. Não escreve nada
#   ./sync-vps.sh push     repo -> VPS   (pede confirmação, faz backup no VPS)
#   ./sync-vps.sh pull     VPS -> repo   (pede confirmação; use quando editaram lá)
#
# ⬆ sobem: 00-SOUL-personalidade.md e skills-legalizai/
# ⬇ ficam só no repo: _testes/, README.md, este script
#
# Depois de um push o gateway precisa reiniciar para reler o prompt.
# O script NÃO reinicia: diz o comando e sai. Reiniciar derruba conversa em curso.

set -euo pipefail

HOST="${LEO_VPS_HOST:-legalize-vps}"
REMOTO="/root/.hermes/profiles/leo"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# origem no repo -> destino no VPS
PARES=(
  "00-SOUL-personalidade.md:$REMOTO/SOUL.md"
  "skills-legalizai:$REMOTO/skills/legalizai"
  "_plugins/leo-buscar-base:$REMOTO/plugins/leo-buscar-base"
)

# ⚠️ `_arquivo/` NUNCA entra aqui: é o ponto de retorno congelado, não conteúdo vivo.
# ⚠️ O plugin sincroniza o CÓDIGO, não o `config.yaml`. Habilitar o plugin e declarar o
#    toolset em `platform_toolsets` continua sendo à mão, no VPS.

vermelho() { printf '\033[31m%s\033[0m\n' "$*"; }
verde()    { printf '\033[32m%s\033[0m\n' "$*"; }
amarelo()  { printf '\033[33m%s\033[0m\n' "$*"; }

checar_conexao() {
  ssh -o BatchMode=yes -o ConnectTimeout=10 "$HOST" true 2>/dev/null \
    || { vermelho "Sem conexão com $HOST. Confira ~/.ssh/config e a chave."; exit 1; }
}

mostrar_diff() {
  local achou=0
  for par in "${PARES[@]}"; do
    local origem="${par%%:*}" destino="${par#*:}"
    echo
    amarelo "──── $origem  ⇄  $destino"
    if [[ -d "$AQUI/$origem" ]]; then
      # diff recursivo: traz o remoto para um temporário e compara
      local tmp; tmp="$(mktemp -d)"
      scp -q -r "$HOST:$destino" "$tmp/remoto" 2>/dev/null || mkdir -p "$tmp/remoto"
      # -x __pycache__: o bytecode é gerado dos dois lados, em versões de Python
      # diferentes (3.11 local, 3.12 no VPS). Sem isto, todo diff acusa mudança falsa.
      if diff -ru -x __pycache__ --color=never "$tmp/remoto" "$AQUI/$origem" > "$tmp/d.txt" 2>&1; then
        verde "  idêntico"
      else
        achou=1
        sed 's/^/  /' "$tmp/d.txt" | head -200
        local n; n=$(wc -l < "$tmp/d.txt")
        [[ "$n" -gt 200 ]] && amarelo "  ... (+$((n - 200)) linhas de diff)"
      fi
      rm -rf "$tmp"
    else
      local tmp; tmp="$(mktemp)"
      scp -q "$HOST:$destino" "$tmp" 2>/dev/null || : > "$tmp"
      if diff -u "$tmp" "$AQUI/$origem" > "${tmp}.d" 2>&1; then
        verde "  idêntico"
      else
        achou=1
        sed 's/^/  /' "${tmp}.d" | head -200
      fi
      rm -f "$tmp" "${tmp}.d"
    fi
  done
  return $achou
}

confirmar() {
  local pergunta="$1"
  # LEO_SYNC_YES=1 pula a pergunta. Existe porque scp e ssh consomem o stdin do
  # script, então "echo SIM | sync-vps.sh push" não funciona: o read pega EOF.
  if [[ "${LEO_SYNC_YES:-}" == "1" ]]; then
    amarelo "$pergunta → confirmado por LEO_SYNC_YES=1"
    return 0
  fi
  # lê do terminal, não do stdin do script
  if [[ -r /dev/tty ]]; then
    read -r -p "$pergunta [digite SIM para confirmar]: " r < /dev/tty
  else
    vermelho "Sem terminal para confirmar. Use LEO_SYNC_YES=1 $0 $*"; exit 1
  fi
  [[ "$r" == "SIM" ]] || { amarelo "Cancelado."; exit 0; }
}

case "${1:-diff}" in
  diff)
    checar_conexao
    if mostrar_diff; then verde $'\nTudo sincronizado.'; else
      echo; amarelo "Há diferenças. Use 'push' (repo -> VPS) ou 'pull' (VPS -> repo)."
    fi
    ;;

  push)
    checar_conexao
    mostrar_diff || true
    echo
    vermelho "PUSH sobrescreve o VPS com o conteúdo deste repo."
    confirmar "Subir para $HOST?"

    CARIMBO="$(date +%Y%m%d-%H%M%S)"
    amarelo "Backup no VPS em $REMOTO/backups/sync-$CARIMBO"
    ssh "$HOST" "mkdir -p '$REMOTO/backups/sync-$CARIMBO' \
      && cp -a '$REMOTO/SOUL.md' '$REMOTO/backups/sync-$CARIMBO/' \
      && cp -a '$REMOTO/skills/legalizai' '$REMOTO/backups/sync-$CARIMBO/'"

    for par in "${PARES[@]}"; do
      origem="${par%%:*}"; destino="${par#*:}"
      if [[ -d "$AQUI/$origem" ]]; then
        # apaga o remoto primeiro: senão arquivo removido aqui sobrevive lá
        ssh "$HOST" "rm -rf '$destino'"
        scp -q -r "$AQUI/$origem" "$HOST:$destino"
        # bytecode da versão errada de Python trava o import no destino
        ssh "$HOST" "find '$destino' -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null" || :
      else
        scp -q "$AQUI/$origem" "$HOST:$destino"
      fi
      verde "  subiu: $origem"
    done

    echo
    verde "Push concluído. Conferindo…"
    mostrar_diff && verde $'\nRepo e VPS idênticos.' || vermelho $'\nAINDA HÁ DIFERENÇA — confira antes de rodar qualquer teste.'
    echo
    vermelho "O gateway ainda está com o prompt ANTIGO em memória."
    echo "Para recarregar (derruba conversa em curso, rode quando ninguém estiver falando com o Léo):"
    echo "  ssh $HOST 'hermes gateway restart --profile leo'"
    ;;

  pull)
    checar_conexao
    mostrar_diff || true
    echo
    vermelho "PULL sobrescreve este repo com o conteúdo do VPS."
    amarelo "Só faça isso se alguém editou direto lá. A fonte-verdade é o repo."
    confirmar "Trazer de $HOST para o repo?"
    for par in "${PARES[@]}"; do
      origem="${par%%:*}"; destino="${par#*:}"
      if [[ -d "$AQUI/$origem" ]]; then
        rm -rf "$AQUI/$origem"
        scp -q -r "$HOST:$destino" "$AQUI/$origem"
        find "$AQUI/$origem" -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null || :
      else
        scp -q "$HOST:$destino" "$AQUI/$origem"
      fi
      verde "  desceu: $origem"
    done
    echo
    amarelo "Revise com 'git diff' e commite antes de qualquer outra coisa."
    ;;

  *)
    echo "uso: $0 [diff|push|pull]"; exit 2 ;;
esac
