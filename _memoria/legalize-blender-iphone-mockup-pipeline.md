---
name: legalize-blender-iphone-mockup-pipeline
description: "Como montar mockup 3D do iPhone com tela do app aplicada — asset, UVs, textura, render 2K transparente, Poly Haven"
metadata: 
  node_type: memory
  type: project
  originSessionId: 27fbcb75-9403-4784-be72-cd45c983f613
  modified: 2026-08-21T14:24:43.398Z
---

Pipeline pra aplicar telas do Legalizai num mockup 3D de iPhone 14 Pro Max e renderizar em 2K com fundo transparente.

**Asset**: `~/Downloads/iphone 3d/iphone-14-pro-max.blend` (Blender 5.2 LTS, addon blender-mcp conectado). 3 mesh objects, todos flat (planos) em local space: `iphone14promax` (corpo), `iphone14promaxdisplay` (vidro frontal — **é o visível de fato**, mesma bounding box do `screen` mas por cima), `iphone14promaxscreen` (fica atrás, oculto pelo display — não aplicar textura aqui).

**Por que a textura vinha distorcida/cortada**: UV original de ambos os meshes é um retalho pequeno dentro de um atlas compartilhado (ex: U 0.82-0.87, V 0.56-0.82), não 0-1. Fix: criar UV layer dedicado (`ArtUV`) projetando local x/z do mesh normalizado 0-1 (ambos meshes são planos, y quase constante). Sempre **flipar U** (`1.0 - u`) — esse asset vem espelhado.

**Resolução da textura**: export do Illustrator em 216dpi/3x é ok pra shots afastados, mas card com corner-radius pequeno "esmaece" reto em close-up (sub-amostragem da textura). Mínimo 432dpi/6x pra close-ups sobreviverem no render.

**Render 2K sem fundo**: a cena vem sem câmera nem luz (viewport screenshot usa shading fake, não serve de referência real pro render Cycles). Setup usado: câmera alinhada à view do viewport (`r3d.view_matrix.inverted()`), 2 area lights (key+fill), world com HDRI Poly Haven, `film_transparent=True`, `color_mode=RGBA`, resolução 1440x2560 (2K portrait). Output confirmado com alpha=0 no canto e alpha=1 no telefone.

**Poly Haven**: habilitado no painel BlenderMCP do Blender (N > aba BlenderMCP > "Use assets from Poly Haven"), 2026-08-21. HDRI usado: `brown_photostudio_02` (2k, exr) — clássico de product shot, dá luz+reflexo mesmo com `film_transparent` (o world não aparece no alpha, mas ainda ilumina/reflete).

**Gotcha de execução**: `bpy.ops.render.render(write_still=True)` chamado via MCP trava a thread única do Blender até o render terminar — pode estourar timeout do MCP e voltar erro tipo "No data received" mesmo com o render tendo terminado certo. Sempre conferir o arquivo de saída no disco antes de assumir falha ou travamento.

Ligado a: [[legalize-illustrator-vector-pipeline-doutrina]]
