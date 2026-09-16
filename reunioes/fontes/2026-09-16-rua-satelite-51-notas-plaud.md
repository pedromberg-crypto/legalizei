# Rua Satélite 51

[image]

Uma discussão aprofundada para validar e refinar as regras fiscais e a lógica de negócio de uma nova aplicação contábil, focando em cenários complexos como Fator R, pró-labore, enquadramento de empresas (ME e EPP) e tratamento de múltiplos sócios. O objetivo é garantir a conformidade legal, automatizar cálculos e otimizar a carga tributária para os clientes, resultando em decisões chave sobre a implementação de funcionalidades.
---
## Validação de Regras de Negócio e Casos de Uso Iniciais

Nesta seção, a discussão concentra-se na resolução de problemas operacionais iniciais e na definição de regras de negócio fundamentais para a aplicação. Um dos principais pontos levantados é a vulnerabilidade no sistema de boletos, que permite ao cliente editar e pagar um valor inferior ao devido. Diante do risco de que essa prática se torne um vício, com clientes pagando valores irrisórios apenas para manterem-se ativos, foi priorizada a busca por uma solução de bloqueio junto ao gateway de pagamento. Adicionalmente, foi estabelecida uma diretriz crucial para o cálculo do Fator R: o sistema adotará uma margem de 30%, em vez dos 28% estipulados por lei. Essa margem de segurança de 2% visa prevenir que pequenas variações no faturamento levem o cliente a um enquadramento fiscal desvantajoso (Anexo 5), evitando a necessidade de cobranças retroativas e complexas justificativas.

---
## Análise de Cenários de Clientes e Simulações de Cálculo

Os participantes realizaram uma análise detalhada de múltiplos perfis de clientes fictícios (personas) para validar a robustez da lógica do sistema em cenários variados. Foram discutidos casos como "Rafael" (CNAE de Anexo 3, onde o Fator R não se aplica), "Gustavo" (empresa com dois sócios, um deles já contribuindo com o teto do INSS via CLT), "Kleber" (quatro sócios com rateio igualitário de pró-labore) e "Vitor" (consultor de TI com CNAEs que podem migrar para o Anexo 5). Essas simulações confirmaram regras importantes: o cálculo de INSS e Imposto de Renda é individual por CPF; sócios que já contribuem pelo teto em outro vínculo são isentos de INSS no pró-labore; e a dedução para o IRRF considera o valor mais benéfico ao contribuinte. A discussão também levou à decisão de limitar o número de CNAEs secundários a cinco, a fim de mitigar a complexidade operacional.

---
## Definição de Regras para Enquadramento e Transição de Porte (ME para EPP)

Esta seção aborda como a aplicação lidará com clientes cujo faturamento se aproxima ou ultrapassa o limite do Microempreendedor Individual (ME), necessitando da transição para Empresa de Pequeno Porte (EPP). Foi esclarecido que, enquanto a empresa permanecer no regime do Simples Nacional (com faturamento de até R$ 4,8 milhões anuais), a mudança de porte para EPP não introduz grande complexidade nos cálculos de tributos. A principal alteração é formal, exigindo um processo na Junta Comercial para atualizar o porte da empresa. Decidiu-se que a plataforma continuará atendendo esses clientes, devendo implementar alertas automáticos para notificá-los sobre a necessidade de desenquadramento e, potencialmente, oferecer o serviço de alteração mediante cobrança de honorários adicionais.

---
## Refinamento da Lógica de Cálculo e Automação do Pró-Labore

A conversa aprofunda-se na automação e nas regras específicas para o cálculo do pró-labore, resultando em decisões cruciais para a experiência do usuário e a conformidade fiscal. Foi definido que, no onboarding, o cliente poderá escolher entre iniciar a geração do pró-labore imediatamente ou apenas a partir do seu primeiro faturamento, dando-lhe controle sobre o início da contribuição ao INSS. Uma vez iniciado, o cálculo será mantido de forma contínua, mesmo em meses sem receita, para garantir a regularidade e os benefícios associados ao Fator R. Além disso, a prática de lançar valores simbólicos (como R$ 100) foi abandonada. A lógica de cálculo também foi refinada, confirmando que tributos como INSS e IRRF devem ser calculados individualmente por sócio e que a base de cálculo do IRRF deve usar a dedução mais vantajosa (seja o valor do INSS ou o desconto simplificado).

---
## Estratégias de Recuperação e Sugestões para o Cliente (Anexo 3 vs. 5)

Esta seção detalha a estratégia do "piloto automático", projetado para manter os clientes no Anexo 3, que é fiscalmente mais vantajoso. Foi analisado o cenário em que um cliente, por escolha própria, desliga a automação e é enquadrado no Anexo 5. Nestes casos, o sistema deverá apresentar uma proposta de regularização ("paulada"), calculando o valor de pró-labore necessário para retornar ao Anexo 3. A plataforma demonstrará a economia financeira que essa regularização proporcionaria, comparando o custo do aporte com a economia de impostos na guia DAS. A discussão validou que, na maioria dos cenários, a regularização em uma única vez é mais benéfica do que permanecer pagando alíquotas maiores, reforçando o valor da inteligência do sistema como um diferencial competitivo. Se o cliente ignorar a sugestão, o alerta ficará registrado e a "dívida" fiscal continuará crescendo.

---
## Validação de Regras Acessórias e Limites do Sistema

A discussão final aborda regras acessórias e a delimitação do escopo do serviço para otimizar a operação e reduzir a complexidade. Foi decidido limitar a um máximo de cinco o número de CNAEs secundários que um cliente pode adicionar em seu cadastro, embora sugestões inteligentes baseadas na atividade principal sejam apresentadas. Também foi analisada a questão da retenção de Imposto Sobre Serviços (ISS). Concluiu-se que, para o nicho de prestadores de serviço alvo, a retenção pelo tomador é pouco frequente. Além disso, o novo padrão de nota fiscal nacional permite que a plataforma monitore automaticamente a emissão de notas via API, identificando eventuais retenções e gerando os alertas necessários sem a necessidade de uma interface complexa para declaração manual por parte do cliente.

---
## Action Items

**@Speaker 1**
- [ ] Verificar a capacidade do Gateway de pagamentos de bloquear a edição de valores em boletos (evitando pagamentos parciais) e comunicar o resultado - [TBD]

**@Pedro Maia**
- [ ] Implementar a trava de segurança no cálculo do Fator R, fixando a margem em 30% - [TBD]
- [ ] Disponibilizar a lista de 87 CNAEs (separando os 15 elegíveis ao Fator R) para validação técnica de Léo e Isabela - [TBD]
- [ ] Implementar o limite máximo de 5 atividades (CNAEs) secundárias na interface do aplicativo - [TBD]
- [ ] Atualizar o fluxo de onboarding para incluir uma pergunta sobre o início do pró-labore (imediato ou após o primeiro faturamento) - [TBD]
- [ ] Remover a lógica de geração de pró-labore com valores simbólicos (ex: R$ 100) em meses sem faturamento - [TBD]
- [ ] Criar simulações visuais (PDF de 5 páginas) com diferentes cenários de clientes para validação da diretoria - [TBD]
- [ ] Atualizar toda a documentação interna do sistema com as novas regras de negócio e lógicas de cálculo definidas - [TBD]
- [ ] Implementar funcionalidade no aplicativo para identificar quando o cliente atinge o teto do ME, disparar o aviso de desenquadramento para EPP e gerar as guias/cobrança de honorários para a alteração - [TBD]
- [ ] Atualizar o motor de cálculo para travar o valor do pró-labore, garantindo que nunca seja inferior ao salário mínimo vigente, com rotina de atualização anual - [TBD]

**@Léo**
- [ ] Verificar o histórico de mensagens em diferentes números de telefone e perfis para buscar evidências de comunicação com o cliente sobre o planejamento - [TBD]