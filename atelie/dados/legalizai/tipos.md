# Contrato de dado — Peça (Legalizai)

> Espelha `lib/tipos.ts::Peca` do Ateliê. Campos idênticos ao PS mantêm o nome; campos NOVOS
> (persona/dial/mote/estágio funil) vêm do que o `legalizai-copywriter.md` já usava em prosa —
> não inventei, só dei tipo/enum a um campo que já existia como texto livre. Marcado `🆕` = não
> existe no `Peca` do Ateliê.

```
id            string   — slug único, ex: "mote-a1-por-quem-entende"
titulo        string   — nome interno da variação, ex: "A1 — por quem entende"
campanha      string   — ex: "primeira-campanha"
mote          "A"|"B"|"C"                      🆕 — agrupador da campanha (institucional/MEI/ME)
pilar         number (1-9)                     — igual ao Ateliê, mesma numeração (estrategia-organica.md)
personaAlvo   "A"|"B"|"C"|"geral"               🆕 — de metodologia-personas.md, ver ds/legalizai/personas.json
dialIronia    "zero"|"baixo"|"medio"|"alto"     🆕 — de personagem-leo.md §5
estagioFunil  "topo"|"meio"|"fundo"|"fundo-intencao"  🆕 — "fundo-intencao" = waitlist (produto não lançou)
formato       "estatico"|"carrossel"|"reels"|"legenda-avulsa"|"email"  — igual espírito do Formato do Ateliê, enum próprio
copy: {
  headline    string
  corpo       string   — equivale a "corpo"/"legenda" do Ateliê
  cta         string
}
templateIdTexto   string   — id de ds/legalizai/templates-texto.json (10 portados do PS, ver arquivo)
templateIdImagem  string | null   — id de ds/legalizai/templates-imagem.json — null se ainda não decidido
                                     (⚠️ ver AVISO_DE_COMPATIBILIDADE_REAL no arquivo — maioria pendente)
autoCheckDoModelo   string[]   🆕 — os itens ✅/⚠️ que o legalizai-copywriter já declarava (mantido,
                                    igual você pediu) — é AUTO-RELATO do modelo, não validação real
validacao: {                  — EQUIVALENTE ao lib/qa.ts do Ateliê, mas calculado por código, não pelo modelo
  travessao          "ok"|"alerta"
  concorrenteNomeado  "ok"|"alerta"|"nao-checavel"   (nao-checavel enquanto a lista em voz.json estiver vazia)
  qualificadorSimplesNacional  "ok"|"alerta"|"na"
  garantiaIncondicional        "ok"|"alerta"
  nomeAntigoMarca               "ok"|"alerta-revisar"
  alertas             string[]
}
guardian: {                   🆕 — o Ateliê não tem 2º agente separado, isto é específico do Legalizai
  veredito     "APROVADO"|"CORRIGIR"|"REJEITADO"|"pendente"
  notas        string
  data         string (ISO)
}
etapa         "ideia"|"aprovada"|"pronta"       — igual ao Etapa do Ateliê
status        "rascunho"|"aprovado"|"no-ar"     — igual ao Status do Ateliê
origem        string   — rastreio de onde a peça veio (ex: "migrado de mkt/campanhas/2026-08-primeira-campanha/copy.md")
```

## O que ainda falta (não inventado, listado)

- `templateIdImagem` — decisão de design, pendente por peça (ver `ds/legalizai/templates-imagem.json`).
- Nenhum `id` de mockup 3D específico (iPhone/card) estruturado — hoje só existe como script solto
  (`edicao_video/blender/iphone`, `card-3d.py`), não como catálogo consultável.
- Campo de imagem final (`imagem.arquivo` no Ateliê) — não existe ainda porque não há geração
  automatizada; as imagens da campanha real são `.psd`/`.jpg` manuais, fora deste schema por ora.
