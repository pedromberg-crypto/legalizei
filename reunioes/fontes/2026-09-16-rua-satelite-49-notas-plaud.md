# Rua Satélite 49

## Informações da Reunião
> Data: 16 de setembro de 2026
> Local: [Inserir Local]
> Participantes: [Pedro Maia] [Léo] [Speaker 3]
---
## Notas da Reunião
### 1. Taxa de Localização: Definição de Metragem Padrão
- Comparação de práticas: uso de 20 m², 5 m² e até 40 m² em diferentes escritórios.
- Metragem maior eleva a guia anual (ex.: 1.000 m² → ~R$70.000; 5 m² → ~R$150–700).
- Metragem muito baixa pode gerar processo administrativo na prefeitura.
- **Conclusão**: Adotar **10 m²** como valor padrão inicial (meio-termo entre risco e custo ao cliente).
---
### 2. Status do Desenvolvimento do Aplicativo
- Backend, frontend e telas construídos; 90 campos definidos (parte pelo usuário, parte pré-definida).
- Equipe iniciando validação pós-pagamento com RPA; avaliação de reaproveitamento de artefatos do Pedro.
- [Pedro Maia] filtrando funcionalidades internas básicas para evitar gargalos no avanço técnico.
---
### 3. Funcionalidades Core Validadas
- Home/navegação, notificações, impostos, dados do mês, download de guias.
- Notas fiscais, pró-labore e sócios, "Estar em dia" (vigia fiscal como diferencial), documentação e certificados.
- **Contrato social no app**: tendência de disponibilizar para download direto, evitando upsell e reduzindo fricção; discutido risco LGPD (certificado digital considerado mais sensível).
- **Folha de pagamento**: adicionada como funcionalidade; processo complexo, haverá parte manual inicialmente.
---
### 4. Escopo de Serviços (Simples Nacional)
- Três produtos: Constituição de ME (Simples Nacional, Anexos 3 e 5), abertura de MEI, migração de contabilidade.
- Prioridade: fechar esteira de Constituição de ME no Simples Nacional.
---
### 5. Motor de Cálculo Fiscal
- Calcula imposto, guias e ajusta pró-labore automaticamente para manutenção no Anexo 3.
- Testado com 16 empresas fictícias, 1–4 sócios, 12 meses, 156 competências no total.
- Solicitada validação das regras e cruzamentos legais utilizados.
---
### 6. Regras de IRRF sobre Pró-labore
- Até R$3.500: imposto zerado (sem necessidade de calcular redutor).
- De R$3.500 a R$5.000: aplica-se cálculo com redutor (Lei 15.270).
- Acima de R$5.000: cálculo normal, sem redutor; há IRRF.
- O limite de R$5.000 é **por CPF** (não pela soma da empresa).
- **Conclusão**: Para valores abaixo do teto de isenção, o sistema considerará o IRRF como zero diretamente.
---
### 7. Pró-labore: Regras Gerais e Estratégia
- Pró-labore não pode ser inferior a 1 salário mínimo (R$1.621).
- Contribuição típica ao INSS: 11% sobre o salário mínimo (~R$178); 97% dos clientes preferem o mínimo.
- Pró-labore não precisa ser proporcional à participação societária; sócios podem definir valores desiguais.
- Dividir "meia a meia" tende a ser ideal para evitar que um único CPF ultrapasse faixas de IR/INSS.
- **Conclusão**: Padrão igualitário entre sócios por default; alterações mediante solicitação específica.
#### Administrador vs. quem trabalha
- Para pró-labore/INSS, o que importa é quem efetivamente trabalha, não apenas quem administra formalmente.
- **Conclusão**: Manter campo de administrador para formalidades e incluir pergunta sobre quem efetivamente trabalha.
#### Contrato Social
- Recomendar cláusula que permita distribuição igualitária **ou** desproporcional, a critério dos administradores.
- **Conclusão**: Padronizar cláusula contratual prevendo ambas as formas de distribuição.
---
### 8. Impacto do Pró-labore no Fator R e Troca de Anexo
- A saída de sócio pode impactar o Fator R do remanescente; novo sócio afeta o cálculo a partir do mês de entrada.
- Caso real: cliente reduziu pró-labore sugerido (R$5.400) para o mínimo (R$1.621), caindo do Anexo 3 para o Anexo 5 (alíquota de 15,5%).
- Para reverter, é necessário aumentar significativamente o pró-labore em um único mês ("paulada") para compensar a média do Fator R.
- **Conclusão**: Sistema deve emitir avisos ao alterar pró-labore e oferecer funcionalidade de cálculo do valor necessário para retorno ao Anexo 3.
---
### 9. Geração de Pró-labore para Novos CNPJs
#### Obrigatoriedade por sócio
- Sócio que efetivamente trabalha: contribuinte obrigatório do INSS.
- Sócio apenas investidor: não obrigado a gerar pró-labore.
- **Conclusão**: Gerar pró-labore automaticamente para todos os **sócios-administradores**; sócios quotistas sem pró-labore inicial, com possibilidade de habilitação posterior.
#### Pró-labore simbólico na abertura
- Prática de gerar R$100 na abertura (para histórico de Fator R) considerada de difícil controle.
- **Conclusão**: Não implementar geração automática de pró-labore simbólico no momento da abertura.
#### Pró-labore retroativo
- Controlar geração retroativa com base na data de faturamento é complexo e inviável no sistema atual.
- **Conclusão**: Sistema não liberará emissão de notas fiscais retroativas.
#### Estratégia final para o app
- Inclinação para perguntar obrigatoriamente ao usuário, assim que entra no app, se deseja gerar o pró-labore.
- A pergunta incluiria texto explicativo sobre implicações para INSS e Fator R.
- Alternativa discutida: travar geração automática pelo salário mínimo com opção de desativação pelo usuário.
- Uma vez ativado, pró-labore deve ser gerado continuamente (mínimo) até cancelamento ativo.
- **Conclusão**: Responsabilidade pela decisão e consequências (incluindo impacto no Fator R) recai sobre o usuário após ser informado.
#### Redução do pró-labore com contratação de funcionário
- Com contratação de funcionário, o pró-labore do sócio pode ser reduzido, otimizando INSS e IR.
- Não reduzir pode gerar pagamento indevido de tributos.
---
### 10. Cálculo de INSS e IRRF para Múltiplos Sócios
- Erro identificado: sistema somava pró-labores e calculava como uma única pessoa → gerava cobrança a maior de IRRF e a menor de INSS.
- **Conclusão**: Cálculo correto é **individual por CPF**; guia final da empresa é a soma das obrigações individuais. Sistema corrigido.
#### Sócio com vínculo CLT
- Sócio com salário CLT acima do teto do INSS: base zerada, sem INSS adicional sobre o pró-labore.
- Sócio sem CLT: paga INSS normalmente sobre a base de R$1.621 (~R$178,81).
- Não impede abertura de CNPJ no Simples; ajustar teto do INSS conforme contribuições.
- Atenção: CNPJ ativo pode implicar perda do seguro-desemprego, salvo comprovação de ausência de movimentação.
---
### 11. DEFIS e PGDAS
- DEFIS atrasada bloqueia o envio do PGDAS a partir de março do ano seguinte.
- A partir de 2024, passou a gerar multa (estimativa ~R$60; confirmar fonte oficial).
- Resolução "190-2026": DEFIS extinta a partir de 01/2027; informações migram para o PGDAS.
- Para empresas novas, a declaração considera a data exata de abertura (não o ano completo).
- Em caso de extinção, a declaração deve ser enviada no mesmo ano da baixa (prazo: último dia útil do mês seguinte ao fechamento).
- **Conclusão**: Manter formato antigo para 2026; monitorar mudanças da Receita.
---
### 12. Obrigações Acessórias para Meses sem Faturamento
- PGDAS zerado deve ser enviado mensalmente (multa de R$50/mês a partir de 2026).
- DCTFWeb e eSocial seguem as mesmas regras independentemente do número de sócios.
- Declaração "sem movimento" do eSocial (S1299): enviada apenas no primeiro mês sem atividade.
- **Conclusão**: Obrigação de transmitir declarações persiste mesmo com faturamento zero.
---
### 13. Prazos e Rotinas de Guias (DAS, DARF, DAF, DEFIS)
- DARF/DAF (INSS): emissão até dia 15; vencimento dia 20.
- DAS: emissão até dia 16; vencimento dia 20.
- Cálculo e emissão iniciam a partir do dia 5/6 do mês.
- DEFIS (anual): prazo até 31/03; recomendável transmitir em fevereiro.
- **Finais de semana/feriados**: Simples Nacional prorroga para próximo dia útil; DARF antecipado para dia útil anterior.
- Guias estaduais não ajustam automaticamente; requerem atenção manual.
- E-Social + DCTF: data-limite dia 15; operar com antecedência (idealmente desde o dia 1).
#### Cálculo de multas e juros por atraso
- Multa: 0,33% ao dia (limitada a 20%) + juros da Selic acumulada + 1% no mês de pagamento.
---
### 14. Regras de Notas Fiscais (cancelamento, substituição, reabertura)
- Até dia 5 do mês seguinte: importar/alterar/cancelar notas sem custo.
- Após dia 5: cobrança por reabertura (ex.: R$21,90); cancelamentos podem ter custo operacional.
- Política sugerida: não permitir "alteração" de nota; cancelar e reemitir (ou usar "substituição" onde a prefeitura permitir, como BH).
- Janelas operacionais:
  - Até dia 5: livre.
  - Dia 6 a dia 10/12: alterações mediante pagamento.
  - Após esse prazo: travar para garantir entrega de obrigações até dia 15.
- Carta de correção (Simples): não pode alterar valores/impostos, apenas dados cadastrais.
- Prazo legal máximo para ajustes: 730 dias.
---
### 15. Classificação Societária: SLU vs. LTDA
- SLU: para um único sócio; LTDA: para múltiplos.
- Padronizar como LTDA facilita futura inclusão de sócio sem transformação societária.
- **Conclusão**: Travar cadastro como **LTDA** mesmo com um único sócio.
---
### 16. Restrições e Bloqueios na Abertura de CNPJ
#### CPF bloqueado na Junta Comercial
- CPFs com restrições ficam travados para abertura de novas empresas; regularização presencial na Junta.
- API para verificação prévia: incerta; ocorrência considerada rara.
- **Conclusão**: Processo fica pendente até regularização pelo cliente ou substituição do sócio.
#### Servidores públicos
- Podem ser sócios cotistas (código 22); proibidos de ser administradores (código 49).
#### Titulares de MEI
- MEI ativo teoricamente impede participação em outro CNPJ; abertura de ME causa desenquadramento automático do MEI.
- **Conclusão**: Plataforma deve exibir aviso claro sobre risco de desenquadramento.
#### Inadimplência de pró-labore declarado
- Declarar e não pagar mantém benefício do Fator R temporariamente, mas gera dívida ativa com juros e multas.
- **Conclusão**: Não alterar/excluir pró-labores passados; cliente deverá regularizar em março ou setembro para evitar exclusão do Simples.
---
### 17. Consulta de Elegibilidade ao Simples e Validação de CPF
- Não existe consulta prévia oficial por CPF para opção pelo Simples antes do CNPJ.
- Solução interna: API verifica regularidade do CPF via nome completo + data de nascimento no passo "Revisar final".
- CPF irregular inviabiliza deferimento na Junta; bloqueio ocorre antes da abertura.
---
### 18. Regras de Competência e Projeção de Receita (Art. 24)
- Competência do mês de abertura = mês completo (sem proporcional de dias).
- Primeiro mês com faturamento: projeta-se receita × 12.
- Faturamento em meses posteriores: média acumulada (receita ÷ meses de existência × 12).
- **Conclusão**: Abertura antecipada dilui a média e pode reduzir alíquota nos primeiros 12 meses.
---
### 19. Fluxo de Licenças e Inscrições (BH)
- Inscrição Municipal (CCM) em BH: gerada automaticamente ao sincronizar com a prefeitura.
- Alvará do Corpo de Bombeiros: requer preenchimento na prefeitura; pode ser obtido posteriormente.
- **Conclusão**: Faturamento pode começar após inscrição municipal, mesmo sem alvará de bombeiros.
---
### 20. Carta de Responsabilidade e Procuração Eletrônica
- Dúvida sobre norma correta (CFC 1.590/2020 citada; confirmar validade atual).
- Sugestão: obter procuração eletrônica desde o onboarding para agilizar representações.
- **Conclusão**: Antecipar coleta/assinatura de procuração e avaliar cobertura pela cláusula contratual.
---
### 21. Pejotização: Risco Jurídico
- Prestadores PJ com exclusividade de cliente, cumprimento de horário, etc.: risco trabalhista/tributário.
- **Conclusão**: Manter como alerta de compliance.
---
### 22. Domicílio Eletrônico (DTE) e Regularização Fiscal
- Clientes não são notificados sobre intimações governamentais (ex.: termos de exclusão do Simples).
- Prazos críticos de regularização: março e setembro.
- **Conclusão**: Implementar sistema de notificação proativa para pendências fiscais.
#### Estratégia de monitoramento e upsell
- API para monitorar caixas postais fiscais e identificar termos de exclusão.
- Oferta de serviço de regularização fiscal como upsell (ex.: R$299 fixo ou mensalidade × meses a regularizar).
- Automação via APIs para escalar o serviço a custo menor.
---
### 23. Dedução de Dependentes no IRRF
- Não relevante para o público-alvo (pró-labore de 1–3 salários mínimos).
- **Conclusão**: Sistema configurado sem opção de dependentes no cálculo do pró-labore.
---
### 24. Livro Caixa
- Típico para profissionais autônomos (PF); não é obrigação padrão para PJs no Simples.
- Regime caixa no Simples será descontinuado a partir de 2027.
- **Conclusão**: Não incluir Livro Caixa como obrigação para a persona PJ comum.
---
### 25. Certidões Negativas
- Emissão/obtenção é serviço à parte, requer informações extras e contato adicional com o cliente.
- **Conclusão**: Tratar como serviço complementar com coleta de dados específicos.
---
### 26. Falhas e Segurança em Plataforma Concorrente
- Relato de APIs e conexões de banco aparentemente expostos em varredura de telas.
- Percepção de erros sistêmicos e contradições nas regras exibidas ao cliente.
- **Conclusão**: Atenção a riscos de segurança e consistência de informação; avaliar notificação responsável à plataforma.
---
### 27. Problemas de Sincronização do Google Drive
- Sugerida utilização do "Revo Uninstaller" para resolver problema de sincronização: desinstalar completamente e reinstalar o Google Drive.
---
## Próximos Passos
- [ ] Definir e documentar oficialmente a metragem padrão de 10 m² para taxa de localização, com critérios para ajuste.
- [ ] Validar plataforma de RPA e reaproveitamento dos artefatos do Pedro.
- [ ] Finalizar e compartilhar documento de funcionalidades core e subfuncionalidades com a equipe.
- [ ] Definir política de disponibilização do contrato social no app (download direto vs. solicitação) e registrar posição quanto à LGPD.
- [ ] Revisar medidas de segurança do certificado digital no app (2FA, armazenamento seguro, logs de acesso).
- [ ] Mapear etapas manuais na constituição (assinaturas, certificado digital) e desenhar plano de automação futura.
- [ ] Revisar e validar regras do motor fiscal com base legal atualizada (INSS teto, pró-labore, anexos).
- [ ] Pesquisar e confirmar multa atual por atraso da DEFIS com fonte oficial.
- [ ] Monitorar regulamentação da Receita para 2026/2027 e confirmar impacto da Resolução 190-2026 sobre PGDAS.
- [ ] Ajustar app: padrão de pró-labore igualitário entre sócios; alteração mediante solicitação.
- [ ] Incluir no fluxo de constituição a pergunta "quem trabalha na empresa?" além de "quem administra".
- [ ] Revisar textos de ajuda explicando limites de R$3.500/R$5.000, redutor e regra "por CPF".
- [ ] Padronizar cláusula contratual: "distribuição igualitária ou desproporcional" a critério dos administradores.
- [ ] Validar cenários do Fator R no app quando pró-labore mínimo não atende à exigência.
- [ ] Implementar regra de geração automática de pró-labore apenas para sócios-administradores na constituição.
- [ ] Garantir que o sistema não permita emissão de notas fiscais retroativas.
- [ ] Não implementar geração de pró-labore simbólico (ex.: R$100) para empresas recém-constituídas.
- [ ] Implementar pergunta obrigatória no app para novos usuários sobre geração do pró-labore, com texto explicativo sobre INSS e Fator R.
- [ ] Implementar avisos quando ajuste do pró-labore resultar em pagamento de Imposto de Renda ou risco de mudança de anexo tributário.
- [ ] Desenvolver funcionalidade para calcular e sugerir valor do pró-labore necessário para regularizar Fator R e retornar ao Anexo 3.
- [ ] Implementar sugestões de divisão do pró-labore entre sócios para otimização tributária.
- [ ] Garantir que o sistema não calcule o redutor do IRRF para pró-labores abaixo do teto de isenção.
- [ ] Confirmar que a falta de informação do PIS no cadastro não gera pendências críticas.
- [ ] Definir política oficial de classificação societária: padronizar LTDA mesmo para um sócio.
- [ ] Implementar aviso na jornada de cadastro para clientes com MEI ativo sobre risco de desenquadramento.
- [ ] Confirmar regra de exceção do prazo da DEFIS para empresas extintas entre janeiro e abril.
- [ ] Finalizar integração da API de verificação de CPF no passo "Revisar final" (incluindo data de nascimento).
- [ ] Configurar rotinas de cálculo a partir do dia 5/6 e emissão conforme prazos (DAF até 15, DAS até 16; vencimentos no dia 20).
- [ ] Parametrizar alertas para DEFIS visando transmissão até fevereiro e prazo limite em 31/03.
- [ ] Documentar regra de prorrogação (Simples) e regra "T5/T6" para guias federais; definir procedimento manual para guias estaduais.
- [ ] Definir e publicar política interna de prazos de notas: livre até dia 5; ajustes pagos até dia 10 ou 12 (definir data única); travar após.
- [ ] Criar guia interno sobre cancelamento vs. substituição de notas para Simples, incluindo restrições de carta de correção.
- [ ] Validar com Isabela campos necessários e fluxo atualizado para alvará de bombeiros em BH.
- [ ] Configurar sincronização com prefeitura de BH para geração automática da inscrição municipal.
- [ ] Documentar regra de competência e projeção do Art. 24 no motor, com média acumulada nos meses sem faturamento.
- [ ] Validar norma atual da carta de responsabilidade (confirmar se CFC 1.590/2020 é referência correta).
- [ ] Instituir coleta de procuração eletrônica no onboarding (desde a constituição do CNPJ).
- [ ] Definir diretrizes de comunicação ao usuário sobre impactos em seguro-desemprego.
- [ ] Redigir nota de compliance sobre risco de pejotização.
- [ ] Investigar e implementar API para monitorar Domicílio Eletrônico e identificar pendências fiscais.
- [ ] Estruturar oferta de serviço de regularização fiscal como upsell, com modelo de precificação definido.
- [ ] Elaborar oferta de serviço para emissão de certidões negativas com checklist de informações.
- [ ] Atualizar materiais para clientes sobre descontinuação do regime caixa no Simples a partir de 2027.
- [ ] Avaliar e, se pertinente, reportar vulnerabilidades identificadas na plataforma concorrente.
- [ ] Confirmar internamente a fórmula de cálculo de juros e multas para pagamentos de guias em atraso.
---
## Sugestões da IA
> A IA identificou os seguintes pontos que não foram concluídos na reunião ou carecem de ações claras; atenção:
> 
> 1. **Metragem padrão (10 m²)**: Formalizar critérios para quando ajustar o valor caso a atividade exija área maior, incluindo evidências exigíveis.
> 2. **Contrato social no app**: Avaliar riscos de LGPD, estabelecer termo de uso e controles de acesso (2FA, logs) antes de liberar download contínuo.
> 3. **Certificado digital no app**: Revisar medidas de segurança (2FA obrigatório, armazenamento seguro, logs de acesso) dado o risco elevado.
> 4. **Pró-labore e INSS (sócio com CLT)**: Consolidar entendimento jurídico e parametrizar motor para cenários CLT + pró-labore sem conflito legal.
> 5. **Multa da DEFIS**: Obter referência legal atualizada (ano, valor, regra de cálculo) e ajustar o "vigia fiscal" para avisos e bloqueios corretos.
> 6. **Sócios-administradores com impedimentos** (ex.: bloqueio judicial): Definir fluxo no sistema para quando o administrador não deseja o pró-labore em seu nome.
> 7. **Alerta de pró-labore retroativo**: Definir como o sistema alertará o cliente sobre necessidade de gerar pró-labore retroativo (com juros e multa) ao emitir nota após o dia 20.
> 8. **Estratégia de pró-labore automático**: Decisão final entre pergunta obrigatória ao usuário vs. geração automática com opção de desativação — formalizar a regra de negócio escolhida e os próximos passos de implementação.
> 9. **Inadimplência de guia do INSS**: Definir como o sistema lidará com clientes que declaram o pró-labore mas não realizam o pagamento da guia correspondente.
> 10. **"Sócios laranja"**: Prática mencionada como tendência; definir ações para mitigar riscos legais/fiscais associados dentro da plataforma.
> 11. **Distribuição de lucro acima da presunção**: Definir tratamento ou aviso para empresas que declararem esse cenário sem plano de contabilidade completo contratado.
> 12. **Fator R e retorno ao Anexo 3**: Definir se o sistema oferecerá opções de parcelamento ("amortização") do ajuste ou apenas a sugestão do pagamento único ("paulada"); estabelecer limite máximo de pró-labore a sugerir (considerando teto do INSS e impacto de IR).
> 13. **Prazo de corte para alterações pagas**: Definir um único dia (10 ou 12) e comunicar claramente aos clientes.
> 14. **Inscrição municipal em BH**: Confirmar se a geração automática se aplica a todas as atividades após sincronização.
> 15. **Prefeituras não automatizadas** (ex.: Betim): Especificar políticas e incluir exceções no fluxo padrão.
> 16. **CPF bloqueado na Junta**: Definir tratativa visual no sistema (status de erro específico) para quando esse travamento ocorrer na prática.
> 17. **Prazo da DEFIS para extinção entre janeiro e abril**: Validar contabilmente o prazo correto (mencionado com incerteza).
> 18. **Regra "T5/T6"**: Especificar tecnicamente e documentar exceções por feriados municipais/estaduais, com fonte oficial e matriz de decisão.
> 19. **Procuração eletrônica**: Detalhar modelo, validade, quando coletar e fluxo completo no onboarding.
> 20. **Carta de responsabilidade**: Confirmar juridicamente a norma vigente e sua relação com cláusulas contratuais atuais.
> 21. **Pejotização**: Produzir orientação jurídica padronizada com limites operacionais e checklist de risco.
> 22. **Monitoramento DTE (API)**: Definir responsáveis, prazos e modelo de precificação exato para o serviço de regularização fiscal (upsell).
> 23. **Vulnerabilidades na plataforma concorrente**: Realizar análise técnica de segurança e definir plano de mitigação e comunicação responsável.
> 24. **"Gambiarra" de informação interna para Anexo 3** (sem envio ao eSocial): Definir explicitamente se essa lógica será considerada ou descartada no novo sistema.