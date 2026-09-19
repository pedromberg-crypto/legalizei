---
tipo: original
status: vivo
data: 2026-09-04
assunto: agente-whatsapp-vault
ordem: 3
papel: "Prefeitura, JUCEMG, Receita, e o filtro do MEI"
tags: [agente, leo, rag, orgaos, pbh, jucemg, receita, mei]
historico: "04/09 fundiu 03-DOMINIO-CONTABIL com 06-REGRAS-ORGAOS-PUBLICOS, que diziam a mesma coisa com palavras diferentes. O slot 06 foi reaproveitado em 17/09 para 06-CALCULO-FISCAL."
---

# REGRAS DOS ÓRGÃOS (PREFEITURA DE BH · JUCEMG · RECEITA FEDERAL)

O que trava e o que libera uma abertura. Use pra explicar o "porquê" de cada pergunta do app, que é o que transforma burocracia em confiança.

## 1. Prefeitura de Belo Horizonte: endereço, IPTU e a regra do apartamento

**A regra que mais indefere:** a PBH não libera empresa em **apartamento** quando nenhum sócio mora no endereço. Isso já foi visto ao vivo, num processo real, saindo de indeferido pra deferido só mudando essa resposta.

* Por isso o app pergunta **se é casa ou apartamento** e **se o titular mora no local**. Não é curiosidade, é o que decide o deferimento.
* **Índice cadastral do IPTU:** obrigatório. Sem ele a Prefeitura não localiza o imóvel, e o processo para. Fica na guia do IPTU, e o app mostra onde achar.
* Imóvel comercial: o IPTU precisa ter destinação compatível e o endereço não pode ter impedimento de zoneamento pra atividade.
* **Saída quando não dá:** endereço fiscal da Legalizai, R$ 49 por mês (ver [[01-PLANOS-E-OFERTAS]]). Resolve tanto quem mora fora de BH quanto quem tem apartamento sem poder cumprir a regra.

Como explicar sem assustar: "O que a Prefeitura analisa é o endereço, não você. Eu peço o IPTU exato pra ela conseguir localizar o imóvel e não indeferir o seu processo por um detalhe que dá pra resolver antes."

## 2. Junta Comercial de Minas (JUCEMG)

* **Taxa:** R$ 281,08 para constituição de ME. Cobre dois atos no mesmo processo, o contrato e o enquadramento de Microempresa. Vai pro Estado.
* **Registro automático:** a JUCEMG defere quase na hora quando o processo usa o **contrato padrão** gerado pelo sistema, sem anexo e sem cláusula extra.
* **🔴 Por que não usamos procuração:** anexar procuração (ou qualquer anexo, ou cláusula personalizada) **derruba a elegibilidade ao registro automático** e joga o processo pra análise humana, que demora muito mais. Por isso a Legalizai guia o próprio cliente a assinar com o gov.br dele. É escolha de velocidade, não de comodidade nossa.
* **Nome da empresa:** a Junta pode recusar por colidência com nome já existente. Por isso o app pede **3 opções de razão social, em ordem de prioridade**: se a primeira cai, tenta a segunda, depois a terceira. Se as três caírem, o app abre uma nova rodada de sugestões.
* **Administração:** por padrão, qualquer sócio administrador age e assina sozinho pela empresa no dia a dia. Assinatura de todos só é exigida em atos extraordinários (alienar bem da sociedade, por exemplo).

## 3. Receita Federal

* **Nome sujo não impede abrir CNPJ.** Restrição no SPC ou Serasa é problema de crédito, não de registro.
* O que trava de verdade: CPF **suspenso ou pendente de regularização** na Receita (por exemplo, quem deixou de entregar declaração obrigatória) e pendência na Justiça Eleitoral.
* Se o CPF está regular, o CNPJ sai.

## 4. Quem pode e quem não pode ser MEI
* MEI é filtro **jurídico**, não é "o Simples com teto menor". A lista de ocupações permitidas é própria e fechada (Anexo XI da resolução do Comitê Gestor).
* Atividade **intelectual, científica, técnica ou regulamentada** fica de fora do MEI por força do art. 966 do Código Civil, mesmo quando serve pro Simples como ME. Exemplos que costumam aparecer: desenvolvimento de software, medicina, engenharia, arquitetura, advocacia, contabilidade e consultoria.
* Pra orientar o cliente, use a régua de [[05-DICIONARIO-CNAE-TRIBUTARIO]] §4: fotógrafo pode ser MEI, as profissões listadas acima não podem, e ocupação que você não conhece é confirmada no app, sem travar a conversa. Dizer "você não pode ser MEI" pra quem pode custa uma venda, e o contrário custa um processo indeferido: na dúvida, diga que o app confirma.
* Quando a atividade não cabe no MEI, o caminho é ME no Simples Nacional, e isso é uma boa notícia a explicar com calma, não uma recusa.
