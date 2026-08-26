---
name: legalize-illustrator-vector-pipeline-doutrina
description: "Onde está a doutrina de como levar telas do app Legalizai (código) até vetor no Illustrator — usar sempre esse pipeline, nunca editar/redesenhar no Illustrator direto"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 27fbcb75-9403-4784-be72-cd45c983f613
  modified: 2026-08-21T14:24:58.437Z
---

Autoridade completa do pipeline "app rodando → SVG nomeado → Illustrator → AE/Blender" vive em `pessoal/edicao_video/CLAUDE.md` (§3.4 "Como dirigir o Illustrator" + §⚙️ O MOTOR). Não redigitar essas regras aqui — consultar o arquivo quando precisar do detalhe.

**Pontos que já mordi e vale lembrar rápido**:
- Illustrator MCP (`mcp__illustrator__*`) **não cria geometria**: sem tool de criar shape/retângulo, sem setar corner-radius de path. Se um componente perdeu arredondamento no artboard, a correção não é escrever código pra "consertar" — é regenerar a partir do app real.
- Scripts prontos por tela em `edicao_video/ai/_src/tela-*-para-svg.mjs` (ex: `tela-campea-para-svg.mjs` → rota `/home-campea`, mesma máquina do `tela-para-svg.mjs`: CDP direto no Chrome headless, lê `getComputedStyle` de verdade incluindo `border-radius`, texto vira `<text>` de verdade com baseline medida). Rodar com `MSYS_NO_PATHCONV=1 node ai/_src/tela-<nome>-para-svg.mjs --rota=/xxx --nome=xxx`.
- `/mockup-home` no app é só uma GALERIA (3 versões lado a lado) — a rota isolada de cada tela pra capturar é outra (`/home-campea`, `/home-a`, etc.), confirmar em `app/src/app/(app)/(portal)/`.
- Illustrator ABRE `.svg` direto (`OpenDocument`) — nota antiga do CLAUDE.md dizendo que recusava estava errada, era caso específico de um arquivo.
- **Dois documentos abertos no Illustrator são duas ilhas**: MCP não move objeto entre eles. A ponte é sempre Ctrl+C/Ctrl+V do Pedro. Eu deleto o conteúdo velho via `DeleteObjects` (uuids confirmados no documento ativo), ele cola o novo, eu ajusto escala/posição via `GetArtboardStructure`/bounds se precisar.

Ligado a: [[legalize-blender-iphone-mockup-pipeline]]
