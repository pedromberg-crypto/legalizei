---
tipo: referencia
status: vivo
data: 2026-07-17
---
# Marco 2026-07-17 — extração completa da tabela CNAE da Contabilizei

## O que aconteceu
Extraímos, um a um, os **387 CNAEs** que a Contabilizei declara atender, com o dado fiscal estruturado que **faltava na nossa matriz** (anexo, Fator R, faixa de alíquota, MEI, hierarquia com códigos, descritores, relacionados, fontes). Fecha a pista quente de 16/07 (a tabela do líder tinha as colunas Anexo/Fator R/Alíquota que os nossos 1332 não tinham). Hub: [[cnae-atendidos-hub]] · método/cobertura: [[contabilizei-cnae-completo-relatorio]].

## Como (método reaproveitável)
- Site é **Nuxt/SSR**: dado completo embutido em `window.__NUXT__` na própria página (não é API, não é HTML renderizado, não é o `.md`/`llms-full.txt` — esse é só institucional).
- `curl --compressed` por CNAE → extrai `__NUXT__` → executa em sandbox `vm` isolado → objeto. **Toda leitura futura de página deles usa esse caminho** (rápido, headless, paralelo).
- Rajada a 8 conexões disparou anti-bot (147 falhas); recuperado 100% com throttle gentil (3 conexões + backoff). **Aprendizado: varrer o site deles sempre em ritmo gentil.**

## Validação
- **Fidelidade ALTA:** 387/387; a extração bateu **417/417** contra uma 2ª extração externa do Pedro; zeros à esquerda (3 CNAEs Seção A) confirmados no **IBGE** (descrição idêntica).
- **Veracidade NÃO-RATIFICADA:** é o que a Contabilizei afirma. Vai pra [[fila-validacao-humana]] (Larissa).

## Decisões travadas
- **Dataset-first** (JSON+CSV fonte de verdade + `.base`), **não** 387 notas; promover pra nota só o que quisermos. Reversível.
- **Origem etiquetada** em todo campo: lido / derivado (formatação + faixa por anexo) / fixo (fontes).
- **Limpeza:** 3 atacados removidos (página deles = não-atende); `8020-0/01` mantido apesar de `atende=false` (decisão Pedro); `6612-6/05` e `6911-7/02` sem anexo → Larissa (IBGE não traz anexo do Simples: classificação ≠ tributação).

## Aberto
- Larissa: anexo dos 2 sem-anexo + ratificar os 387.
- Cruzar os 387 contra os 260 de serviço e o consolidado fiscal (não feito ainda — próximo flow).
