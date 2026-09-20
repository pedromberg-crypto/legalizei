---
tipo: arquivo-congelado
status: congelado
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [arquivo, backup, leo, v12, ponto-de-retorno]
---

# 🧊 Pacote v12 — congelado em 2026-09-20

**Este é o ponto de retorno.** É o estado exato do Léo no momento em que a reescrita por
assunto e momento começou.

🔴 **Nada aqui é lido em runtime. Nada aqui deve ser editado. Nunca.**

---

## Por que ele existe

A reescrita que começa agora redistribui **135.224 caracteres** em 15 assuntos novos, com
eixo duplo (assunto × momento). É mudança estrutural, não ajuste. Se der errado, este é o
lugar de onde se volta **sem perder nada**.

---

## Como ele está isolado

Três camadas de isolamento, e cada uma cobre uma forma diferente de estrago:

| risco | como está coberto |
|---|---|
| **o Hermes carregar isto como skill** | mora **fora** de `skills-legalizai/`. O loader só enxerga aquela pasta |
| **o `sync-vps.sh` subir isto pro VPS** | ele sincroniza só `00-SOUL-personalidade.md` e `skills-legalizai/`. Esta pasta não está nos pares |
| **um script de lint varrer e contar duplicata** | 🔴 **todo script novo precisa excluir `_arquivo/`.** Senão vai achar 15 assuntos duplicados aqui e derrubar a rodada com razão |

⚠️ **A terceira é a que vai morder.** A trava de "nenhum assunto em duas notas" encontraria
todas as notas duplicadas aqui dentro. **`_arquivo/` entra na lista de exclusão de qualquer
verificador, desde a primeira linha.**

---

## O que tem aqui

```
vault/       o pacote que o agente lia: SOUL + as 4 skills + as 13 notas
testes/      casos.yaml (60) · casos-conversados.yaml (3×12) · suites.yaml · o runner
runtime/     config.yaml do VPS (com segredo redigido) · o snapshot do prompt de skills
```

**Conferido byte a byte** contra produção no momento da cópia: `skills-legalizai` idêntico,
`SOUL` idêntico.

---

## Onde este pacote estava

| | |
|---|---|
| modelo em produção | `gemini-3.1-flash-lite` via API do Google |
| fallback | `gemini-3.5-flash-lite`, dispara em 429 |
| melhor placar da suíte curta | **18 de 20** |
| custo por rodada da curta | **US$ 0,082** |
| custo da conversada (3 × 12 turnos) | **US$ 0,082** |
| tokens por caso | ~13.400 |

**O que já funcionava:** índice morto (0 aberturas) · zero chutes de nome de arquivo ·
o `contabiles-frequencia`, que reprovava 11 de 11 pelo modelo, passando · a briga de
formato entre o SOUL e o trailer de produção resolvida.

**O que ainda não funcionava, e motivou a reescrita:**
* a regra de elegibilidade do MEI vive em **3 notas** (`03` §4, `05` §4C, `09`), e a que o
  modelo abre decide a resposta. Causou duas alucinações no mesmo dia.
* o dado e a regra de usá-lo moram em arquivos diferentes: a data `31/12/2026` está em
  `01-PLANOS`, a regra de citá-la está em `vendas` §8.2, e o `vendas` quase nunca abre.
* 7 assuntos duplicados em 3 a 5 lugares cada.

---

## Como voltar, se precisar

```bash
cd execucao/agente-whatsapp-vault
cp _arquivo/pacote-v12-2026-09-20/vault/00-SOUL-personalidade.md .
rm -rf skills-legalizai
cp -r _arquivo/pacote-v12-2026-09-20/vault/skills-legalizai .
./sync-vps.sh diff     # confira o que vai mudar antes
./sync-vps.sh push
ssh legalize-vps 'hermes gateway restart --profile leo'
```

E o git também guarda: **tag `pacote-v12`**, se ela tiver sido criada, ou o commit do dia
20/09/2026.

⚠️ **Voltar o vault não volta o `config.yaml` do VPS.** O `runtime/config.yaml` daqui é
referência de leitura: as chaves estão redigidas e ele não serve para copiar por cima.
Reveja `platform_hints`, `tool_use_enforcement` e `platform_toolsets` à mão.
