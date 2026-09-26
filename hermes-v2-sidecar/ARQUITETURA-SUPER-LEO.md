# 🚀 Arquitetura "Super Léo" (Decisões Finais & Diretrizes)
**Documento Matriz de Evolução e Escalabilidade da IA - Legalizai**

Este documento trava as decisões arquitetônicas finais aprovadas em 25/09/2026. Ele serve como o guia definitivo para a equipe e para os agentes (Claude/Gemini) na construção da nova versão do Léo.

---

## 🔒 1. DECISÕES DE ARQUITETURA TRAVADAS

### 1.1 Multi-Agentes via Tools (Proteção do Cache)
* **Problema evitado:** O modelo clássico de Multi-Agentes (vários prompts de sistema diferentes) quebra o *Context Caching* do Google, encarecendo a operação em 80%.
* **A Decisão:** Teremos apenas **UM Léo Supervisor (Orquestrador)**. O Prompt Mestre dele será estático e enorme (garantindo o cache barato). Os "Sub-agentes" especialistas (Comercial, Tributário, Suporte) serão transformados em **Ferramentas (Tools)** acionadas sob demanda. O Léo Supervisor chama a Tool, recebe a regra bruta e formula a resposta.

### 1.2 Manutenção da Busca Lexical Avançada para CNAEs + Desambiguação
* **Problema evitado:** A regressão para buscas puramente relacionais "burras" deixaria o bot engessado, mas a adoção de Vetores/Embeddings criaria falsos positivos perigosos (ex: aproximar serviço de comércio por semântica).
* **A Decisão:** A busca de CNAEs **continua sendo Lexical Avançada (trigrama + tsvector)**, que já provou precisão máxima (21/21 acertos). Ela aceita a linguagem torta do cliente no WhatsApp sem alucinar regras de negócio opostas.
* **Regra de Ouro da Ambiguidade:** Está implementada no conhecimento base (triagem). O Léo Supervisor é instruído a **NUNCA CHUTAR**. Diante de termos ambíguos (ex: a pessoa diz "clínica" ou "representante"), o Léo aplica a regra do verbo e devolve uma pergunta de múltipla escolha ou confirmação antes de cravar a resposta.

### 1.3 Pasta de Dossiê Expandida (Cérebro Ilimitado)
* **A Decisão:** Criaremos uma pasta dedicada exclusivamente para injeção de conhecimento robusto. Todo o repertório de objeções, regras de negócios e manuais viverão aqui para serem vetorizados. Como o RAG é escalável, não há limite de tamanho para essa base, **desde que não haja redundância**.

---

## 🚫 2. LEI ZERO: A DIRETRIZ ANTI-REDUNDÂNCIA
O maior causador de delírios em LLMs é a redundância documental (a mesma regra escrita de forma levemente diferente em dois arquivos).
* Todo dado, regra ou instrução deve ter **UMA ÚNICA FONTE DE VERDADE**. 
* Ao expandir o Dossiê, é expressamente proibido replicar uma regra de CNAE no arquivo de objeções, por exemplo. Se a regra já existe, apenas referencie-a ou deixe o orquestrador buscar no arquivo certo.

---

## 🛠️ 3. ESTRUTURA DOS CONSULTORES DE BASTIDOR (TOOLS)

1. **Leão de Chácara (Filtro Node.js):**
   - Proteger a porta, despachar profissões regulamentadas severas (se necessário na triagem) e executar o `[IGNORAR]` para contenção de spam.
2. **Consultor Comercial & Onboarding:**
   - ME vs MEI, limites de Teto (R$ 360 mil), preços e quebra de objeções.
3. **Consultor Tributário & Fiscal (RAG CNAE):**
   - Fator R, Anexos, leitura semântica de profissões.
4. **Consultor de Suporte (Fase 2):**
   - Rotina do App, notas fiscais, boletos.

## 4. O "Léo Auditor" e o Livro de Ouro
Para impedir que a manutenção diária do agente inche o prompt com regras comportamentais complexas (o que corrompe a estrutura base e alucina o RAG), nós aplicamos o **Método do Livro de Ouro (Few-Shot Dinâmico)**.

*   A personalidade (O "Suricato Sentinela", ágil e anti-burocracia) não é moldada por regras longas, mas por **3 a 5 exemplos perfeitos de diálogo** no final do `PERSONA.md`.
*   Sempre que um desvio comportamental for detectado, a correção **não é uma nova regra**. A correção é a reescrita de um dos diálogos de exemplo no `LIVRO-DE-OURO.md` e a substituição dele no prompt mestre. Isso "afina" o LLM instantaneamente sem aumentar o custo de tokenização (mantendo o Gemini Context Caching otimizado).
