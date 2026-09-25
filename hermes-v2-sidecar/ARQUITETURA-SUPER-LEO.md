# 🚀 Arquitetura "Super Léo" (Decisões Finais & Diretrizes)
**Documento Matriz de Evolução e Escalabilidade da IA - Legalizai**

Este documento trava as decisões arquitetônicas finais aprovadas em 25/09/2026. Ele serve como o guia definitivo para a equipe e para os agentes (Claude/Gemini) na construção da nova versão do Léo.

---

## 🔒 1. DECISÕES DE ARQUITETURA TRAVADAS

### 1.1 Multi-Agentes via Tools (Proteção do Cache)
* **Problema evitado:** O modelo clássico de Multi-Agentes (vários prompts de sistema diferentes) quebra o *Context Caching* do Google, encarecendo a operação em 80%.
* **A Decisão:** Teremos apenas **UM Léo Supervisor (Orquestrador)**. O Prompt Mestre dele será estático e enorme (garantindo o cache barato). Os "Sub-agentes" especialistas (Comercial, Tributário, Suporte) serão transformados em **Ferramentas (Tools)** acionadas sob demanda. O Léo Supervisor chama a Tool, recebe a regra bruta e formula a resposta.

### 1.2 Manutenção do RAG (Vetores) para CNAEs + Desambiguação
* **Problema evitado:** A regressão para buscas puramente relacionais deixaria o bot engessado frente ao modo confuso como os clientes explicam suas profissões no WhatsApp.
* **A Decisão:** A busca semântica/vetorial continua para CNAEs. O risco de "abrir a empresa errada" é mitigado pela curadoria final no App. 
* **Regra de Ouro da Ambiguidade:** O Léo Supervisor será instruído a **NUNCA CHUTAR**. Se a busca vetorial trouxer ambiguidade (ex: a pessoa diz "clínica" e o vetor traz Médico e Estética), o Léo é obrigado a devolver uma pergunta de múltipla escolha ou confirmação antes de cravar a resposta.

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
