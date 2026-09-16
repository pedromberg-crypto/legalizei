# Rua Satélite 50

## Informações da Reunião
> Data: 16 de setembro de 2026
> Local: [Inserir Local]
> Participantes: [Pedro Maia] [Léo]
## Notas da Reunião
### Revisão do Ciclo Fiscal e Prazos
- A competência fiscal encerra no último dia do mês. Notas fiscais emitidas nesse dia, mesmo que seja domingo, integram o mês corrente.
- A prefeitura de BH permite emissão de notas com competência retroativa, porém isso pode gerar inconsistências de tributação, juros e multas; a prática deve ser evitada.
- Propôs-se um período de 5 dias após o fechamento (até o dia 5) para cancelamento de notas pelo cliente, permitindo ajustes no cálculo.
- O robô de cálculo fiscal executaria apenas a partir do dia 6 do mês seguinte para incorporar essas alterações.
### Gestão Mensal do Fator R e Pró-labore
- O pró-labore será revisado mensalmente até o dia 15, em linha com a prática da Contabilizei, embora não seja exigência legal.
- Haverá monitoramento contínuo do Fator R, que permite a empresas do Anexo V usufruírem do benefício do Anexo III.
- O sistema calculará mensalmente o Fator R com base na média de faturamento dos últimos 12 meses, alertando o cliente quando estiver próximo de perder o benefício.
- Para empresas com menos de 12 meses, o cálculo será proporcional desde a data de constituição.
### Tributação Inicial para Novas Empresas e Fator R
- Empresa constituída e que fatura no mesmo mês será, inicialmente, tributada à alíquota de 15,5% (Anexo V).
- A redução para 6% (benefício do Fator R) só é possível a partir do mês seguinte, pois é necessário haver folha do mês anterior.
- Considerou-se retificar o eSocial para aplicar o benefício retroativamente, o que geraria guias complementares com juros e multa para o cliente.
- A economia potencial é relevante (ex.: de R$ 1.800 para R$ 720 sobre R$ 12.000 de faturamento), o que pode justificar o processo.
- Concluiu-se que faturar no mês da constituição é pouco comum para prestadores de serviço, que tendem a emitir a nota no mês subsequente ao serviço.
### Processos e Cronograma de Obrigações
- Até o dia 15: Transmissão da folha do sócio (eSocial).
- Até o dia 20: Emissão das guias DARF (INSS e IR).
- Até o dia 21: Apuração e transmissão do PGDAS e emissão da guia DAS.
- Até o vencimento: Pagamento das guias pelo cliente.
- Após o vencimento: Conferência interna do pagamento e oferta de recálculo em caso de atraso.
### Automação e Responsabilidade do Cliente
- O cálculo de pró-labore para manutenção do benefício do Fator R será automático por padrão.
- O cliente poderá desativar o cálculo automático e informar um pró-labore manual.
- Ao alterar o valor, o app exibirá aviso claro sobre impacto na alíquota (ex.: de 6% para 15,5%) e o custo adicional.
- A responsabilidade pela mudança de alíquota passa a ser do cliente, e o sistema registrará essa escolha. O app não aceitará pró-labore abaixo do salário mínimo.
## Próximos Passos
- [ ] Definir a implementação do período de 5 dias para cancelamento de notas após o fechamento do mês.
- [ ] Criar alerta no sistema para identificar clientes que faturam no mês de constituição da empresa.
- [ ] Desenvolver no app a funcionalidade de aviso sobre o impacto financeiro caso o cliente altere manualmente o pró-labore.
## Sugestões da IA
> **Sugestões da IA**
> A IA identificou os seguintes pontos não concluídos ou sem itens de ação claros; atenção:
> 1. A discussão sobre assumir o “risco” de enquadrar a empresa no Anexo III desde o início (sem base de cálculo anterior) para beneficiar o cliente não foi concluída. É necessário definir claramente a legalidade e as consequências dessa “gambiarra”.
> 2. Embora a retificação do eSocial para aplicar o benefício do Fator R retroativamente tenha sido considerada vantajosa, não foi definido um processo claro de comunicação e aprovação do usuário para evitar surpresas com guias de multa.