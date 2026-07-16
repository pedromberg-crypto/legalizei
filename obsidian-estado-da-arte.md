---
tipo: derivado
status: vivo
data: 2026-07-07
assunto: stack-vault
tags: [meta]
---

# Obsidian — Estado da Arte (verificado contra doc oficial)

> **Última verificação: 2026-07-07** (fontes no fim). Check mensal agendado atualiza esta nota.

## Decisões de stack do vault Legalizei 🟢

| Camada | Decisão | Por quê (verificado) |
|---|---|---|
| Consultas/BD | **Bases (nativo)** — NÃO Dataview | Dataview dormante desde abr/2025 (última v0.5.70); Bases é core plugin oficial, muito mais rápido, views Table/List/Cards/Map, filtros + fórmulas, arquivos `.base` |
| Templates | **Templates nativo** (sintaxe `{{date}}`/`{{title}}`) | Suficiente pro nosso caso; Templater só se precisarmos de lógica (segue mantido) |
| Tarefas/quadro | **Tasks + Kanban** (community, ativos) | Checkbox com data + quadro de sprint |
| Automação | **Obsidian CLI oficial** (v1.12.4+, fev/2026, 100+ comandos) | Passa pelo runtime: `move` atualiza links, `create` aplica template, `properties:set` escreve YAML válido, `search` exporta JSON. **Claude pode operar o vault por aqui** |
| Backup | **git + GitHub privado (desktop)** | obsidian-git instável no MOBILE — celular usa outro sync |
| Mobile | Obsidian Sync (pago) OU app GitSync — decidir quando a rotina pedir | Git nativo não roda em iOS/Android |

## Regras de Properties (escala de milhares de notas)
- Tipos ficam em `.obsidian/types.json` — configurar quando o app criar a pasta
- **Nomes CURTOS** (`data`, não `data-de-captura`) · datas como tipo DATE real (filtros do Bases dependem disso)
- Na dúvida entre text e list → **list** (aceita crescer)
- Templates **componíveis** (nota pode receber 2 templates)
- Pastas MÍNIMAS; conexão vem de links e properties, não de hierarquia

## Novidades relevantes (changelog 2025→jul/2026)
- **v1.13 (mai/2026):** settings redesenhado com busca · URIs pedem confirmação · Bases com resize de coluna
- **v1.12.4+ (fev–mar/2026):** CLI oficial · limpeza automática de anexos órfãos
- Web Clipper (extensão de captura web→vault) · melhorias contínuas em Bases/Properties

## Padrão de properties do vault (taxonomia oficial nossa)
Toda nota: `tipo` + `data` + `tags`. Intel competitiva soma: `concorrente`, `fonte` (email/instagram/app/site), `gatilho` (upsell/onboarding/retencao/feature). Shadowing soma: `perfil`, `icp`.

## Fontes
- obsidian.md/changelog · obsidian.md/help/bases · obsidian.md/cli
- practicalpkm.com/moving-to-obsidian-bases-from-dataview · obsidian.rocks/dataview-vs-datacore-vs-obsidian-bases
- forum.obsidian.md/t/dataview-vs-bases · github.com/Vinzent03/obsidian-git (aviso mobile)
- stephango.com/vault (best practices do CEO do Obsidian: pastas mínimas, nomes curtos, types.json)
