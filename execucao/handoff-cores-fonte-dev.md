---
tipo: operacao
status: vivo
data: 2026-07-12
etapa: fases-0-1
tags: [dev, design, cor, tipografia, tokens]
---

# 🎨 Legalizai Story Book — Cores + Fonte (handoff pro protótipo)

> Pra iniciar as **fases 0 e 1** já no visual certo. São **tokens v1 de debate** — os valores finais entram no Design System, mas estes já servem pra prototipar. Logo/branding completo vem depois; aqui é só o que você pediu: **cor + fonte**.

---

## 🅰️ Fonte — **Sora** (todo o sistema)

**Uma fonte só: Sora.** Display, títulos, corpo, UI — tudo Sora. Decidido, não é provisório.

- Google Fonts: https://fonts.google.com/specimen/Sora
- Pesos: **400** (corpo), **500** (medium/labels), **600** (títulos/botões), **700** (display/headline).
- Sem fonte secundária. Não misturar com serifada nem com outra sans.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
```

> _Nota: outras fontes (Fraunces, Bricolage Grotesque, Space Grotesk, Schibsted Grotesk, Instrument Serif) foram sondadas mas **descartadas**. Não usar._

---

## 🎨 Cores

Sistema de **2 cores lidera: coral + ink.** Verde/vermelho/âmbar = só estado, não decoração.

### 🟠 Coral — marca / ação primária
| Stop | Hex | Uso |
|---|---|---|
| 50 | `#FEF3EE` | fundo tint (cards, destaques suaves) |
| 100 | `#FBDDD1` | tint, hover de superfície |
| 200 | `#F8C3B0` | bordas suaves, chips |
| 300 | `#F5A184` | ilustração, estados leves |
| 400 | `#F47F58` | acento claro |
| **500** | **`#F2643C`** | ★ cor de marca (identidade). **Não usar como fill de texto pequeno** |
| 600 | `#DD4E27` | **fill de botão** (bate AA com texto branco) + hover |
| 700 | `#B83D1C` | texto/ícone sobre tint coral claro |
| 800 | `#8C2F16` | texto sobre fundo coral |
| 900 | `#5C1F0F` | profundidade máxima |

### ⚫ Ink / neutros — texto, estrutura, base séria
| Stop | Hex | Uso |
|---|---|---|
| White | `#FFFFFF` | superfície de card |
| 50 | `#FAF8F5` | **fundo de página (papel quente — não branco puro)** |
| 100 | `#F1EEE9` | superfície alternada |
| 200 | `#E3DED7` | borda hairline |
| 300 | `#CBC5BC` | borda forte, divisor |
| 400 | `#A19B92` | texto muted / placeholder |
| 500 | `#736E67` | texto terciário |
| 600 | `#524E48` | texto secundário |
| 700 | `#34363C` | — |
| 800 | `#24262C` | superfície escura |
| **900** | **`#1B1E24`** | ★ ink — texto primário + CTA escuro |

### 🚦 Semânticos — estado do CNPJ (funcional)
| Papel | 50 (tint) | 500 (base) | 700 (texto) |
|---|---|---|---|
| **Em dia** (success) | `#E7F6EF` | `#17A06A` | `#0B5E40` |
| **Vence em breve** (warning) | `#FDF3E1` | `#F5A524` | `#98600A` |
| **Vencido** (danger) | `#FCEBEB` | `#E03E43` | `#971F25` |
| Dica (info — uso mínimo) | `#EBF2FC` | `#3B82E0` | `#2360B8` |

---

## ⚠️ 5 regras que evitam erro

1. **Coral nunca é erro.** Coral = marca + ação positiva. Erro = crimson `#E03E43`, **sempre com ícone + texto** (nunca cor sozinha — coral e vermelho são hues vizinhos).
2. **Botão fill = coral-600 (`#DD4E27`)** pra bater contraste AA com texto branco. Coral-500 é identidade, não fill de texto pequeno.
3. **Fundo = papel quente `#FAF8F5`**, não branco puro (reforça humano/acolhedor). Card = branco `#FFFFFF`.
4. **Azul banido como marca.** O info-blue é só funcional (dica/link de sistema), uso mínimo. Nunca vira acento.
5. **2 cores lideram: coral + ink.** Verde/vermelho/âmbar = estado do CNPJ, não decoração.

---

## 📦 Cola-e-usa

### CSS custom properties
```css
:root {
  /* Coral — marca / ação */
  --coral-50:  #FEF3EE;
  --coral-100: #FBDDD1;
  --coral-200: #F8C3B0;
  --coral-300: #F5A184;
  --coral-400: #F47F58;
  --coral-500: #F2643C; /* cor de marca */
  --coral-600: #DD4E27; /* fill de botão (AA) */
  --coral-700: #B83D1C;
  --coral-800: #8C2F16;
  --coral-900: #5C1F0F;

  /* Ink / neutros */
  --ink-white: #FFFFFF;
  --ink-50:  #FAF8F5; /* fundo de página */
  --ink-100: #F1EEE9;
  --ink-200: #E3DED7;
  --ink-300: #CBC5BC;
  --ink-400: #A19B92;
  --ink-500: #736E67;
  --ink-600: #524E48;
  --ink-700: #34363C;
  --ink-800: #24262C;
  --ink-900: #1B1E24; /* texto primário */

  /* Semânticos — estado do CNPJ */
  --success-50: #E7F6EF; --success-500: #17A06A; --success-700: #0B5E40;
  --warning-50: #FDF3E1; --warning-500: #F5A524; --warning-700: #98600A;
  --danger-50:  #FCEBEB; --danger-500:  #E03E43; --danger-700:  #971F25;
  --info-50:    #EBF2FC; --info-500:    #3B82E0; --info-700:    #2360B8;

  /* Fonte */
  --font-sans: 'Sora', system-ui, sans-serif;
}
```

### Tailwind (`theme.extend`)
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          50:'#FEF3EE',100:'#FBDDD1',200:'#F8C3B0',300:'#F5A184',400:'#F47F58',
          500:'#F2643C',600:'#DD4E27',700:'#B83D1C',800:'#8C2F16',900:'#5C1F0F',
        },
        ink: {
          50:'#FAF8F5',100:'#F1EEE9',200:'#E3DED7',300:'#CBC5BC',400:'#A19B92',
          500:'#736E67',600:'#524E48',700:'#34363C',800:'#24262C',900:'#1B1E24',
        },
        success: { 50:'#E7F6EF', 500:'#17A06A', 700:'#0B5E40' },
        warning: { 50:'#FDF3E1', 500:'#F5A524', 700:'#98600A' },
        danger:  { 50:'#FCEBEB', 500:'#E03E43', 700:'#971F25' },
        info:    { 50:'#EBF2FC', 500:'#3B82E0', 700:'#2360B8' },
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

**Dúvida de cor/uso? Chama o Pedro.** Valores viram tokens finais no Design System — se algum hex mudar, é ajuste de 1 linha aqui.
