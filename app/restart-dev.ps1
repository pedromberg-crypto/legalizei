# restart-dev.ps1 — roda quando a porta 3000 estiver pesada/travada
# (mapa não abre, tela sumiu, HMR travado). Mata o que estiver na porta,
# limpa o cache do Turbopack (.next) e sobe o dev de novo, limpo.
#
# Uso: da pasta app/, roda `./restart-dev.ps1`

$ErrorActionPreference = "Stop"

Write-Host "Procurando processo na porta 3000..." -ForegroundColor Cyan
$conexao = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conexao) {
    $pids = $conexao.OwningProcess | Select-Object -Unique
    foreach ($procId in $pids) {
        Write-Host "Matando processo PID $procId..." -ForegroundColor Yellow
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "Nada rodando na porta 3000." -ForegroundColor Gray
}

$pastaNext = Join-Path $PSScriptRoot ".next"
if (Test-Path $pastaNext) {
    Write-Host "Limpando cache .next..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force $pastaNext
} else {
    Write-Host "Cache .next já estava limpo." -ForegroundColor Gray
}

Write-Host "Subindo o dev server de novo..." -ForegroundColor Green
Set-Location $PSScriptRoot
npm run dev
