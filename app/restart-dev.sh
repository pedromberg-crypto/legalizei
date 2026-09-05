#!/usr/bin/env bash
# restart-dev.sh — roda quando a porta 3000 estiver pesada/travada
# (mapa não abre, tela sumiu, HMR travado). Mata o que estiver na porta,
# limpa o cache do Turbopack (.next) e sobe o dev de novo, limpo.
#
# Uso: da pasta app/, `npm run dev:restart` (ou `./restart-dev.sh`).
# Versão Linux do antigo restart-dev.ps1 (Windows, mantido só como histórico).

set -euo pipefail
cd "$(dirname "$0")"

echo "Procurando processo na porta 3000..."
pids="$(ss -ltnp 2>/dev/null | awk '/:3000 /{print $NF}' | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u || true)"
if [ -n "$pids" ]; then
  for pid in $pids; do
    echo "Matando processo PID $pid..."
    kill "$pid" 2>/dev/null || true
  done
  sleep 1
  for pid in $pids; do kill -9 "$pid" 2>/dev/null || true; done
else
  echo "Nada rodando na porta 3000."
fi

if [ -d .next ]; then
  echo "Limpando cache .next ($(du -sh .next | cut -f1))..."
  rm -rf .next
else
  echo "Cache .next já estava limpo."
fi

echo "Subindo o dev server de novo..."
exec npm run dev
