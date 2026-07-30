---
tipo: marco
status: vivo
data: 2026-07-30
assunto: flow-2-migrar · pente-fino-cnae · contrato-lider
tags: [flow2, migrar, cnae, concorrente, pricing, telas]
---

# 🏁 20º flow — o FLOW #2 existe, e o "atende" encolheu

## 1. FLOW #2 (migrar de contador) construído — 9 telas

Era o blind spot mais antigo: **"metade do mercado, zero testado"** desde 15/07. A lógica já estava modelada e testada no motor (`execucao/motor-testes/flow-migrar.js`, M0–M5, personas `migra-limpo` · `migra-passivo` · `migra-refem`); **faltavam as telas**.

`components/wizard-migrar.tsx` + 7 rotas + grupo no `/mockup` + espelho na `/apresentacao`.

**A porta que era beco.** O achado M0 do motor: o fork do N3 mandava quem escolhia "já tenho empresa" pra um card *"essa parte ainda não existe"*. Agora navega.

### As 4 diferenças estruturais em relação ao flow #1

| | Flow #1 (abrir) | Flow #2 (migrar) |
|---|---|---|
| Atividade | entrevista + IA + pills | **lê o cartão CNPJ** (o CNAE já existe) |
| Economia prometida | estimativa em cima de faixa | **número REAL dos 12 meses** (CGSN 140/18 art. 26) |
| Taxa de governo | DAE R$268,51 + TFLF | **nenhuma** (a empresa já existe) |
| Pausa mais dura | órgão neutro | 🔴 **o contador ANTIGO valida o TTRT** |

⚠️ Consequência da linha 2: a dívida `promessa-quebrada` **não se aplica ao flow #2**. O número é dele, não projeção.

⚠️ A linha 4 é a **pausa mais perigosa do produto inteiro**. Todas as pausas do flow #1 esperam um órgão (neutro) ou o próprio cliente. Esta espera **um concorrente que está perdendo o cliente pra nós**.

### ⚖️ Guarda-corpo de honestidade (M2)

Se o contador atual **já acertou** o enquadramento, a tela diz isso e vende **serviço**, não economia inventada. Vender economia pra quem não tem seria a promessa-quebrada do #2. Variante em `?cenario=ja-otimo`.

## 2. 💰 DECISÃO TRAVADA: cobra ANTES do TTRT

**Pedro, 30/07.** O pagamento (M3) acontece antes da transferência (M4), igual ao flow #1.

**Contrapartida obrigatória**, escrita no contrato do M3b:
> *"Se a transferência não for concluída por algum motivo fora do seu controle, você recebe tudo de volta."*

⚠️ **Não é copy de marketing.** É o que torna defensável cobrar por um resultado cujo destravamento depende de um terceiro hostil. **Se essa linha sair, a decisão inteira precisa ser reaberta.**

## 3. 🔥 Pente fino nos CNAEs — "atende" caiu de 124 → 111

Cruzamento dos 124 contra o dataset de complexidade de abertura (**CGSIM Res. 51/2019, Anexo I** — lista nacional oficial de baixo risco A).

| Resultado | Qtd |
|---|---|
| 🟢 Liso confirmado | **76** |
| 🟡 Precisa licença municipal | 30 |
| 🔴 Exige registro externo (3× CADASTUR + 1× CREF) | 4 |
| ⚫ **Sem dado nenhum** (nunca avaliados) | 14 |

**A intuição do Pedro acertou:** a seção "Água, esgoto e gestão de resíduos" precisa de licenciamento ambiental — e o agravante é que **aqueles 4 CNAEs nunca tinham sido avaliados**. Entraram nos 124 por "não foi refutado", não por checagem.

**Realocação aplicada (13 CNAEs):** 6 → não atendemos · 7 → em validação · 1 fica. **As seções E e H saíram inteiras.**

⚠️ **Sobra dentro dos 111:** 4 falso-lisos (CADASTUR/CREF — pela nossa própria regra, atividade com órgão setorial é waitlist) + 30 que precisam de licença municipal (decisão de produto: abre-e-avisa × não oferece).

## 4. 📄 Contrato + tabela real do líder

Lido o contrato do plano R$195 + a grade de faixas de dentro da conta de cliente → [[2026-07-30-tabela-real-faixas]].

| Achado | Cláusula | Impacto |
|---|---|---|
| **Cliente paga TODAS as taxas públicas** | 4.3"h", 2.4, 3.14 | O líder **não** absorve a Junta. Decisão: nós também não. |
| **Multa = 30% do SALDO**, não do total | 7.1"b" | Corrigiu nossa simulação |
| **Fidelidade conta do CNPJ emitido** | 2.1"b" | Protege o cliente contra demora de órgão. **Nosso marco segue indefinido.** |
| **Regime é 1 de 9 variáveis de preço** | 3.4 | Derruba a premissa de "plano do Simples × plano do Presumido" |
| **R$139 só até R$25 mil/mês** | tabela real | Nosso ICP no teto da ME (R$30 mil/mês) já paga **R$228** lá |

## 5. 🐛 8 bugs reais corrigidos

1. **`lib/passos` contava o N18 dissolvido** — 9 passos, um inexistente. O arquivo nasceu pra impedir exatamente isso.
2. **Capital social escapava no N13** — `||` em curto-circuito liberava o CTA com o campo vazio.
3. **A cadeia inteira do dossiê estava morta** — nenhuma das 7 telas navegava.
4. **Guard-rail do N15 nunca tinha rodado** — `TEM_SOCIO` era `const false` local.
5. **CPF pedido 2×** (N6 front-load + N9).
6. **Boleto nunca chegava na P2** — a aresta do mapa não estava implementada.
7. **Mocks contraditórios entre telas** → `dossie/mock.ts` como fonte única.
8. **Scrollspy do design-system** pintava o menu inteiro (limpava cor, nunca o fundo).

## 6. Outras mudanças em produção

- **N21 reduzido de 9 → 3 status** (2 passadas); "Registrar a empresa" → **"Analisando viabilidade"**.
- **N12 e N15 viraram condicionais** por nº de sócios (não re-perguntam o que o N4 já sabe).
- **"Você mora fora do Brasil?" removida do N10** — a triagem do N4 já pergunta e já barra.
- **🔓 SWAP: depois da assinatura vem o P0** (home de ativação dia-1), não o N24. Sem confete nem selo coral no hero.
- **Celebração do CTA removida** do veredito 🟢.
- **CTAs selecionados = coral sólido** (padrão do N4) em todo o dossiê.

## Links
[[HOME]] · [[HOME-reorganizacao]] · [[2026-07-30-tabela-real-faixas]] · [[limpeza-260-servico]] · [[cnae-complexidade-abertura]] · [[fiscal-simples-bh-2026]]
